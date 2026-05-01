-- Public API v1: Personal Access Tokens (PATs) para que los usuarios
-- automaticen el dashboard desde scripts/agentes/bots.
--
-- Diseño:
-- - Cada usuario emite tokens propios desde /settings/tokens
-- - El token actúa AS el usuario (mismo email en fact_event.actor_email)
-- - audit metadata.via_token = nombre del token
-- - Hash en DB (SHA-256), nunca el plaintext
-- - Scopes pre-acotados por role
-- - Idempotency-Key obligatorio en POSTs para retries seguros

-- ============================================================
-- dim_user_token
-- ============================================================

create table if not exists public.dim_user_token (
  token_hash text primary key,                              -- sha256(plaintext) hex
  owner_email text not null references public.dim_person(email) on delete cascade,
  name text not null,                                       -- "Rocky bot", "N18 sync", etc.
  scopes text[] not null,                                   -- ['tasks.read','tasks.create',...]
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  expires_at timestamptz,                                   -- NULL = no expira
  revoked_at timestamptz
);

create index if not exists idx_user_token_owner_active
  on public.dim_user_token(owner_email)
  where revoked_at is null;

create index if not exists idx_user_token_last_used
  on public.dim_user_token(last_used_at)
  where revoked_at is null;

-- ============================================================
-- request_idempotency
-- ============================================================
-- Para que un agente que reintenta por timeout no duplique acciones.
-- TTL 24h. Cleanup vía pg_cron daily.

create table if not exists public.request_idempotency (
  key text primary key,                                     -- Idempotency-Key header del cliente
  owner_email text not null,                                -- usuario dueño del token
  request_hash text not null,                               -- sha256 del body normalizado (detecta replay con misma key + body distinto)
  response_status int not null,
  response_body jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index if not exists idx_idempotency_expires
  on public.request_idempotency(expires_at);

-- ============================================================
-- api_rate_limit_window (sliding window por minuto)
-- ============================================================

create table if not exists public.api_rate_limit_window (
  token_hash text not null references public.dim_user_token(token_hash) on delete cascade,
  bucket_minute timestamptz not null,                       -- date_trunc('minute', now())
  request_count int not null default 0,
  primary key (token_hash, bucket_minute)
);

create index if not exists idx_rate_limit_bucket
  on public.api_rate_limit_window(bucket_minute);

-- Atomic increment para rate-limiting. Devuelve el count nuevo después del bump.
create or replace function public.increment_rate_limit_count(
  p_token_hash text,
  p_bucket timestamptz
)
returns table(request_count int)
language plpgsql
security definer
as $func$
begin
  return query
  insert into public.api_rate_limit_window (token_hash, bucket_minute, request_count)
  values (p_token_hash, p_bucket, 1)
  on conflict (token_hash, bucket_minute) do update
    set request_count = api_rate_limit_window.request_count + 1
  returning api_rate_limit_window.request_count;
end;
$func$;

-- Cleanup function (llamada por cron cada hora)
create or replace function public.cleanup_api_ephemeral()
returns void
language plpgsql
security definer
as $func$
begin
  delete from public.request_idempotency where expires_at < now();
  delete from public.api_rate_limit_window where bucket_minute < now() - interval '5 minutes';
end;
$func$;

-- Schedule cleanup via pg_cron (cada hora)
select cron.unschedule('cleanup-api-ephemeral')
  where exists (select 1 from cron.job where jobname = 'cleanup-api-ephemeral');

select cron.schedule(
  'cleanup-api-ephemeral',
  '7 * * * *',                                              -- minute 7 of each hour
  $$select public.cleanup_api_ephemeral()$$
);
