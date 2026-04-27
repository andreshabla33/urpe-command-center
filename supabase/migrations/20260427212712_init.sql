-- =============================================================================
-- 0001_init.sql — URPE Command Center base schema
-- Idempotent: usa `if not exists` y `create or replace` donde aplica.
-- Patrón: event-sourced sobre Postgres. fact_event es append-only,
-- la MV mv_task_current_state es el read model.
-- RLS bloquea writes salvo service_role; los SELECT respetan owner/admin.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- -----------------------------------------------------------------------------
-- Schema namespace
-- -----------------------------------------------------------------------------
-- Coexistimos con tablas existentes del proyecto (wp_team_humano de Mónica, etc.)
-- en el schema `public`. No movemos a schema separado para mantener compatibilidad
-- con auth.email() y supabase-js sin overrides.

-- =============================================================================
-- DIMENSIONS
-- =============================================================================

create table if not exists public.dim_project (
  id          text primary key,
  name        text not null,
  parent_id   text references public.dim_project(id),
  color       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.dim_person (
  email           text primary key,
  full_name       text,
  role            text not null
                    check (role in ('admin','asesor','supervisor','administrativo','agent')),
  team_humano_id  int,
  agent_id        text,
  bridge_url      text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists idx_person_role on public.dim_person(role) where is_active;

create table if not exists public.dim_task (
  id            text primary key,
  title         text not null,
  description   text,
  project_id    text references public.dim_project(id),
  owner_email   text references public.dim_person(email),
  created_by    text references public.dim_person(email),
  created_at    timestamptz not null default now(),
  due_date      timestamptz,
  status        text not null default 'backlog'
                  check (status in ('backlog','in_progress','blocked',
                                    'escalated','responded','done','cancelled')),
  priority      text not null default 'p2'
                  check (priority in ('p0','p1','p2','p3')),
  metadata      jsonb not null default '{}'::jsonb
);

create index if not exists idx_task_owner_status on public.dim_task(owner_email, status);
create index if not exists idx_task_project       on public.dim_task(project_id);
create index if not exists idx_task_status_age    on public.dim_task(status, created_at desc);
create index if not exists idx_task_metadata      on public.dim_task using gin (metadata);

-- =============================================================================
-- FACTS
-- =============================================================================

create table if not exists public.fact_event (
  id           bigserial primary key,
  event_id     uuid not null default gen_random_uuid() unique,
  task_id      text references public.dim_task(id),
  event_type   text not null
                 check (event_type in ('created','assigned','email_sent','email_received',
                                       'comment','escalated','status_changed','closed',
                                       'n1_sent','n2_sent','n3_sent','ping','corrected')),
  actor_email  text,
  timestamp    timestamptz not null default now(),
  metadata     jsonb not null default '{}'::jsonb
);

create index if not exists idx_event_task_timestamp on public.fact_event(task_id, timestamp desc);
create index if not exists idx_event_type_timestamp on public.fact_event(event_type, timestamp desc);
create index if not exists idx_event_actor          on public.fact_event(actor_email, timestamp desc);

-- Append-only enforcement
create or replace function public.prevent_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'fact_event is append-only; emit a compensating event (event_type=corrected) instead of UPDATE/DELETE'
    using errcode = '23P01';
end;
$$;

drop trigger if exists fact_event_no_update on public.fact_event;
create trigger fact_event_no_update
  before update on public.fact_event
  for each row execute function public.prevent_event_mutation();

drop trigger if exists fact_event_no_delete on public.fact_event;
create trigger fact_event_no_delete
  before delete on public.fact_event
  for each row execute function public.prevent_event_mutation();

create table if not exists public.fact_email (
  message_id   text primary key,
  thread_id    text,
  task_id      text references public.dim_task(id),
  account      text not null
                 check (account in ('dau@urpeailab.com','dau@urpeintegralservices.co')),
  direction    text not null check (direction in ('outbound','inbound')),
  from_email   text,
  to_email     text,
  subject      text,
  snippet      text,
  sent_at      timestamptz not null
);

create index if not exists idx_email_thread        on public.fact_email(thread_id);
create index if not exists idx_email_task_sent     on public.fact_email(task_id, sent_at desc);
create index if not exists idx_email_direction     on public.fact_email(direction, sent_at desc);

-- =============================================================================
-- EMBEDDINGS (pgvector)
-- =============================================================================

create table if not exists public.dim_embedding (
  task_id        text primary key references public.dim_task(id) on delete cascade,
  content_hash   text not null,
  embedding      halfvec(3072) not null,
  updated_at     timestamptz not null default now()
);

-- pgvector >= 0.7: halfvec(3072) + HNSW soporta hasta 4000 dims.
-- Half-precision (16 bits/dim) ≈ misma calidad de cosine similarity con la mitad de storage.
create index if not exists idx_embedding_cosine
  on public.dim_embedding using hnsw (embedding halfvec_cosine_ops);

-- =============================================================================
-- READ MODEL: Materialized View
-- =============================================================================

drop materialized view if exists public.mv_task_current_state;
create materialized view public.mv_task_current_state as
select
  t.id,
  t.title,
  t.description,
  t.project_id,
  t.owner_email,
  t.created_by,
  t.created_at,
  t.due_date,
  t.status,
  t.priority,
  t.metadata,
  e_agg.last_event_at,
  e_agg.event_count,
  e_agg.escalation_count,
  m_agg.last_inbound_at,
  m_agg.last_outbound_at,
  -- age in days, computed at refresh time
  extract(epoch from (now() - t.created_at)) / 86400.0 as age_days
from public.dim_task t
left join lateral (
  select
    max(e."timestamp") as last_event_at,
    count(*)          as event_count,
    count(*) filter (where e.event_type = 'escalated') as escalation_count
  from public.fact_event e
  where e.task_id = t.id
) e_agg on true
left join lateral (
  select
    max(m.sent_at) filter (where m.direction = 'inbound')  as last_inbound_at,
    max(m.sent_at) filter (where m.direction = 'outbound') as last_outbound_at
  from public.fact_email m
  where m.task_id = t.id
) m_agg on true;

create unique index if not exists mv_task_current_state_pk on public.mv_task_current_state(id);
create index if not exists mv_task_status_owner   on public.mv_task_current_state(status, owner_email);
create index if not exists mv_task_status_age     on public.mv_task_current_state(status, age_days desc);
create index if not exists mv_task_project_status on public.mv_task_current_state(project_id, status);

create or replace function public.refresh_mv_task_current_state()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view concurrently public.mv_task_current_state;
end;
$$;

-- =============================================================================
-- RLS HELPERS
-- =============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin'
       from public.dim_person
      where email = auth.email()
        and is_active),
    false
  );
$$;

create or replace function public.current_user_email()
returns text
language sql
stable
security definer
as $$
  select auth.email();
$$;

-- =============================================================================
-- RLS POLICIES
-- Pattern: SELECT cubierto por RLS. Mutaciones bloqueadas a anon/authenticated;
-- las Server Actions usan service_role (que bypassa RLS) para escribir.
-- =============================================================================

alter table public.dim_task       enable row level security;
alter table public.dim_person     enable row level security;
alter table public.dim_project    enable row level security;
alter table public.fact_event     enable row level security;
alter table public.fact_email     enable row level security;
alter table public.dim_embedding  enable row level security;

-- dim_task: admin ve todo; cualquier authenticated ve sus propias.
drop policy if exists "task_select_own_or_admin" on public.dim_task;
create policy "task_select_own_or_admin" on public.dim_task
  for select to authenticated
  using (public.is_admin() or owner_email = auth.email());

-- dim_person: directorio visible para todos los authenticated.
drop policy if exists "person_select_authenticated" on public.dim_person;
create policy "person_select_authenticated" on public.dim_person
  for select to authenticated
  using (true);

-- dim_project: visible para todos los authenticated.
drop policy if exists "project_select_authenticated" on public.dim_project;
create policy "project_select_authenticated" on public.dim_project
  for select to authenticated
  using (true);

-- fact_event: admin ve todo; otros ven eventos de sus tasks.
drop policy if exists "event_select_own_or_admin" on public.fact_event;
create policy "event_select_own_or_admin" on public.fact_event
  for select to authenticated
  using (
    public.is_admin()
    or task_id in (select id from public.dim_task where owner_email = auth.email())
  );

-- fact_email: igual que fact_event.
drop policy if exists "email_select_own_or_admin" on public.fact_email;
create policy "email_select_own_or_admin" on public.fact_email
  for select to authenticated
  using (
    public.is_admin()
    or task_id in (select id from public.dim_task where owner_email = auth.email())
  );

-- dim_embedding: solo admin (semantic search es función admin).
drop policy if exists "embedding_select_admin" on public.dim_embedding;
create policy "embedding_select_admin" on public.dim_embedding
  for select to authenticated
  using (public.is_admin());

-- =============================================================================
-- MATERIALIZED VIEW SECURITY
-- Las MVs no soportan RLS directo. Exponemos via función SECURITY INVOKER
-- que delega el filtrado a la RLS de dim_task subyacente.
-- =============================================================================

create or replace function public.task_current_state()
returns setof public.mv_task_current_state
language sql
stable
security invoker
as $$
  select mv.*
    from public.mv_task_current_state mv
   where exists (
     select 1 from public.dim_task t
      where t.id = mv.id  -- RLS de dim_task aplica acá
   );
$$;

-- =============================================================================
-- NEXT STEPS (manual, post-migration)
-- =============================================================================
-- 1. Habilitar pg_cron desde Supabase Dashboard → Database → Extensions
-- 2. Una vez habilitado, programar refresh:
--      select cron.schedule(
--        'refresh-mv-task-current-state',
--        '* * * * *',  -- cada minuto
--        $$select public.refresh_mv_task_current_state()$$
--      );
-- 3. Habilitar Realtime para fact_event y dim_task desde
--    Database → Replication → tablas a publicar.
-- 4. Generar tipos TypeScript:
--      pnpm dlx supabase gen types typescript \
--        --project-id vecspltvmyopwbjzerow > db/types.ts
