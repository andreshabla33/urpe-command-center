-- =============================================================================
-- 0002 / 20260427220000_seed_persons.sql
-- Seed dim_person desde wp_team_humano (empresa_id 4 + 13).
-- - Amplía el CHECK de role para aceptar los 11 roles reales del ecosistema URPE.
-- - team_humano_id pasa a bigint (consistente con wp_team_humano.id).
-- - Inserta Diego (dau@urpeailab.com) y Andres (am@urpeailab.com) como admins
--   PRIMERO, para que el import desde wp_team_humano no los pise.
-- - Filtra emails inválidos (basura histórica: '.', '1', '2', '3'...).
-- Idempotente: si se vuelve a correr, ON CONFLICT no duplica.
-- =============================================================================

-- 1. Ampliar el enum de role
alter table public.dim_person drop constraint if exists dim_person_role_check;
alter table public.dim_person add constraint dim_person_role_check
  check (role in (
    'admin','asesor','supervisor','administrativo',
    'comercial','dueño','liderazgo','operaciones',
    'marketing','rrhh','agent','n/a'
  ));

-- 2. team_humano_id a bigint (consistente con wp_team_humano.id)
alter table public.dim_person alter column team_humano_id type bigint;

-- 3. Seed admins (Diego + Andres) PRIMERO. Si ya están en wp_team_humano con otro rol,
-- la upsert los marca como admin de todos modos.
insert into public.dim_person (email, full_name, role, is_active)
values
  ('dau@urpeailab.com', 'Diego Urquijo',     'admin', true),
  ('am@urpeailab.com',  'Andres Maldonado',  'admin', true)
on conflict (email) do update
  set role       = 'admin',
      full_name  = excluded.full_name,
      is_active  = true;

-- 4. Import desde wp_team_humano (empresa 4 y 13, email válido).
-- ON CONFLICT (email) DO NOTHING → no toca a Diego/Andres ni duplicados.
insert into public.dim_person (email, full_name, role, team_humano_id, is_active)
select
  lower(trim(t.email))                                                    as email,
  nullif(trim(coalesce(t.nombre,'') || ' ' || coalesce(t.apellido,'')),'') as full_name,
  t.rol                                                                   as role,
  t.id                                                                    as team_humano_id,
  coalesce(t.is_active, true)                                             as is_active
from public.wp_team_humano t
where t.empresa_id in (4, 13)
  and t.email is not null
  and trim(t.email) <> ''
  and t.email like '%@%'
  and t.email like '%.%'
on conflict (email) do nothing;
