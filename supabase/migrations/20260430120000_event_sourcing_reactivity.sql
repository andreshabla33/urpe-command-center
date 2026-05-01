-- Cierra el modelo event-sourced del Command Center con 5 piezas pedidas por N18:
--
-- A. Trigger AFTER INSERT en fact_event que proyecta a dim_task.status según el evento
--    (status_changed | closed | escalated | email_received[is_response]) y refresca
--    updated_at en cualquier otro evento. Cierra el bug "fact_event(closed) no actualiza
--    el row → la UI sigue mostrando el status viejo".
--
-- B. Columna updated_at en dim_task + trigger BEFORE UPDATE que la mantiene fresca.
--    Permite ordenar el listado por actividad reciente. Backfill = greatest(created_at,
--    last_event_timestamp) para que las tareas viejas con eventos recientes ya queden bien.
--
-- C. Consolidación split-by-person: URPE-IS-014-{VL,GB,VL-REPO}, URPE-IS-005-{FL,VL},
--    PLAYBOOK-{AP,AU,AV,GB} → IDs canónicos con metadata.co_owners. Los splits quedan
--    cancelled con metadata.consolidated_into apuntando al canonical (preserva history
--    sin renombrar fact_event.task_id, que rompería append-only).
--    No se tocan URPE-IS-REPO-LIBROS-AV / URPE-IS-NIW-REPO / URPE-DASH-001-GH-USER:
--    son contexto-cruzado, requieren decisión humana caso por caso.
--
-- D. (intencionalmente vacío) — los zombies OPS-OPENCLAW-001/002 requieren confirmación
--    de Jesús/Diego antes de archivar. No se tocan.
--
-- E. Service account gmail-api-push@system.gserviceaccount.com en dim_person con
--    role='agent' (el constraint actual no permite 'service_account' y 'agent' ya
--    existe — más simple agregarlo a esa categoría que expandir el check).
--
-- F. Recreación de mv_task_current_state para incluir updated_at, junto con sus 4
--    índices originales. Fuera de transacción NO se puede usar CONCURRENTLY para
--    refresh; lo llamamos al final con un select aparte.
--
-- Idempotente: DDL usa IF NOT EXISTS / DROP IF EXISTS / OR REPLACE.

begin;

-- ============================================================
-- B. updated_at en dim_task
-- ============================================================

alter table public.dim_task
  add column if not exists updated_at timestamptz not null default now();

-- Backfill: max entre created_at y el timestamp del último fact_event de la tarea.
-- Importante: este UPDATE corre ANTES de crear el trigger BEFORE UPDATE, así que
-- nuestros valores no son sobrescritos por now().
update public.dim_task t
set updated_at = greatest(
  t.created_at,
  coalesce((select max(timestamp) from public.fact_event where task_id = t.id), t.created_at)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql as $func$
begin
  new.updated_at = now();
  return new;
end;
$func$;

drop trigger if exists dim_task_set_updated_at on public.dim_task;
create trigger dim_task_set_updated_at
  before update on public.dim_task
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- A. Trigger reactivo en fact_event
-- ============================================================

create or replace function public.project_event_to_task()
returns trigger
language plpgsql as $func$
declare
  v_to_status text;
  v_is_response boolean;
begin
  if new.task_id is null then
    return new;
  end if;

  v_to_status := null;

  if new.event_type = 'status_changed' then
    v_to_status := new.metadata->>'to';
    if v_to_status not in (
      'backlog','in_progress','blocked','escalated','responded','done','cancelled'
    ) then
      v_to_status := null;
    end if;
  elsif new.event_type = 'closed' then
    v_to_status := 'done';
  elsif new.event_type = 'escalated' then
    v_to_status := 'escalated';
  elsif new.event_type = 'email_received' then
    v_is_response := coalesce((new.metadata->>'is_response')::boolean, false);
    if v_is_response then
      v_to_status := 'responded';
    end if;
  end if;

  if v_to_status is not null then
    update public.dim_task
    set status = v_to_status
    where id = new.task_id and status is distinct from v_to_status;
  else
    update public.dim_task
    set updated_at = now()
    where id = new.task_id;
  end if;

  return new;
end;
$func$;

drop trigger if exists fact_event_project_to_task on public.fact_event;
create trigger fact_event_project_to_task
  after insert on public.fact_event
  for each row
  execute function public.project_event_to_task();

-- ============================================================
-- E. Service account en dim_person
-- ============================================================

insert into public.dim_person (email, full_name, role, is_active, agent_id)
values (
  'gmail-api-push@system.gserviceaccount.com',
  'Gmail Pub/Sub (GCP service account)',
  'agent',
  false,
  'gmail-pubsub-system'
)
on conflict (email) do nothing;

-- ============================================================
-- C. Consolidación split-by-person
-- ============================================================

-- C.1 URPE-IS-014 (canonical ya existe) — enriquecer metadata
update public.dim_task
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'co_owners', jsonb_build_array('vl@urpeailab.com','gb@urpeintegralservices.co'),
  'consolidated_from', jsonb_build_array('URPE-IS-014-VL','URPE-IS-014-GB','URPE-IS-014-VL-REPO'),
  'consolidation_source', 'migration_20260430'
)
where id = 'URPE-IS-014';

-- C.2 URPE-IS-005 (canonical ya existe) — enriquecer metadata
update public.dim_task
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'co_owners', jsonb_build_array('fl@urpeailab.com','vl@urpeailab.com'),
  'consolidated_from', jsonb_build_array('URPE-IS-005-FL','URPE-IS-005-VL'),
  'consolidation_source', 'migration_20260430'
)
where id = 'URPE-IS-005';

-- C.3 PLAYBOOK (canonical no existe) — insertar
insert into public.dim_task (
  id, title, description, project_id, owner_email, created_by,
  created_at, status, priority, metadata
)
values (
  'PLAYBOOK',
  'Playbooks URPE',
  'Tarea consolidada de PLAYBOOK-AP/AU/AV/GB. Ver metadata.co_owners.',
  'URPE-PLAYBOOKS',
  'ap@urpeintegralservices.co',
  null,
  coalesce(
    (select min(created_at) from public.dim_task where id like 'PLAYBOOK-%'),
    now()
  ),
  'in_progress',
  'p2',
  jsonb_build_object(
    'co_owners', jsonb_build_array(
      'ap@urpeintegralservices.co',
      'au@urpeintegralservices.co',
      'av@urpeintegralservices.co',
      'gb@urpeintegralservices.co'
    ),
    'consolidated_from', jsonb_build_array(
      'PLAYBOOK-AP','PLAYBOOK-AU','PLAYBOOK-AV','PLAYBOOK-GB'
    ),
    'consolidation_source', 'migration_20260430'
  )
)
on conflict (id) do nothing;

-- C.4 Marcar splits como cancelled con puntero al canonical
update public.dim_task
set status = 'cancelled',
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'consolidated_into', case
        when id like 'URPE-IS-014%' then 'URPE-IS-014'
        when id like 'URPE-IS-005-%' then 'URPE-IS-005'
        when id like 'PLAYBOOK-%' then 'PLAYBOOK'
      end,
      'consolidated_at', now(),
      'consolidation_source', 'migration_20260430'
    )
where id in (
  'URPE-IS-014-VL', 'URPE-IS-014-GB', 'URPE-IS-014-VL-REPO',
  'URPE-IS-005-FL', 'URPE-IS-005-VL',
  'PLAYBOOK-AP', 'PLAYBOOK-AU', 'PLAYBOOK-AV', 'PLAYBOOK-GB'
);

-- C.5 Emitir fact_event(corrected) por cada split (timeline auditable).
-- El trigger fact_event_project_to_task verá estos eventos pero como 'corrected' no
-- mapea a ningún status, solo refresca updated_at (que ya está en now() por C.4).
insert into public.fact_event (task_id, event_type, actor_email, timestamp, metadata)
select
  id,
  'corrected',
  'am@urpeailab.com',
  now(),
  jsonb_build_object(
    'reason', 'consolidated_into_canonical_id',
    'canonical_id', case
      when id like 'URPE-IS-014%' then 'URPE-IS-014'
      when id like 'URPE-IS-005-%' then 'URPE-IS-005'
      when id like 'PLAYBOOK-%' then 'PLAYBOOK'
    end,
    'migration', '20260430120000_event_sourcing_reactivity'
  )
from public.dim_task
where id in (
  'URPE-IS-014-VL', 'URPE-IS-014-GB', 'URPE-IS-014-VL-REPO',
  'URPE-IS-005-FL', 'URPE-IS-005-VL',
  'PLAYBOOK-AP', 'PLAYBOOK-AU', 'PLAYBOOK-AV', 'PLAYBOOK-GB'
);

-- ============================================================
-- F. Recrear mv_task_current_state con updated_at
-- ============================================================

-- task_current_state() wrapper RLS-aware depende del tipo de la MV.
-- La drop antes y la recreamos después con la misma definición.
drop function if exists public.task_current_state();

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
    t.updated_at,
    t.due_date,
    t.status,
    t.priority,
    t.metadata,
    e_agg.last_event_at,
    e_agg.event_count,
    e_agg.escalation_count,
    m_agg.last_inbound_at,
    m_agg.last_outbound_at,
    extract(epoch from now() - t.created_at) / 86400.0 as age_days
  from public.dim_task t
  left join lateral (
    select
      max(e.timestamp) as last_event_at,
      count(*) as event_count,
      count(*) filter (where e.event_type = 'escalated'::text) as escalation_count
    from public.fact_event e
    where e.task_id = t.id
  ) e_agg on true
  left join lateral (
    select
      max(m.sent_at) filter (where m.direction = 'inbound'::text) as last_inbound_at,
      max(m.sent_at) filter (where m.direction = 'outbound'::text) as last_outbound_at
    from public.fact_email m
    where m.task_id = t.id
  ) m_agg on true;

-- Recrear los 4 índices originales
create unique index mv_task_current_state_pk
  on public.mv_task_current_state using btree (id);
create index mv_task_status_owner
  on public.mv_task_current_state using btree (status, owner_email);
create index mv_task_status_age
  on public.mv_task_current_state using btree (status, age_days desc);
create index mv_task_project_status
  on public.mv_task_current_state using btree (project_id, status);

-- Recrear el wrapper RLS-aware (definición original del proyecto)
create or replace function public.task_current_state()
returns setof public.mv_task_current_state
language sql
stable
as $func$
  select mv.*
    from public.mv_task_current_state mv
   where exists (
     select 1 from public.dim_task t
      where t.id = mv.id
   );
$func$;

commit;

-- Refresh CONCURRENTLY no puede ir dentro de la transacción.
-- (Opcional: el cron pg_cron ya lo refresca cada minuto; este es solo para reflejar
-- cambios inmediatamente al terminar la migración.)
-- select public.refresh_mv_task_current_state();
