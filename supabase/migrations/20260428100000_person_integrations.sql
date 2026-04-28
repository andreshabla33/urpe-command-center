-- Integraciones externas por persona (Gmail, Calendar, etc).
-- El refresh_token NUNCA se guarda en plain text en la tabla:
-- vive en Supabase Vault y aquí guardamos solo el secret id (uuid).

create table if not exists public.dim_person_integration (
  email             text not null references public.dim_person(email) on delete cascade,
  provider          text not null check (provider in ('gmail','calendar','github')),
  vault_secret_id   uuid not null,
  scopes            text[] not null default '{}',
  watch_history_id  text,
  watch_expires_at  timestamptz,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (email, provider)
);

create index if not exists idx_integration_provider on public.dim_person_integration(provider);

alter table public.dim_person_integration enable row level security;

drop policy if exists "integration_select_own_or_admin" on public.dim_person_integration;
create policy "integration_select_own_or_admin" on public.dim_person_integration
  for select to authenticated
  using (public.is_admin() or email = auth.email());
