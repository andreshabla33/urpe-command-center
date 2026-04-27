-- =============================================================================
-- 20260427230000_fact_event_replay_unique.sql
-- Constraint único para hacer replays idempotentes.
-- (task_id, event_type, timestamp, actor_email) identifica un evento de manera
-- determinística — si el mismo dump se importa dos veces, el ON CONFLICT
-- evita duplicar.
-- NULLS NOT DISTINCT (PG 15+) trata NULL como igual, necesario porque actor_email
-- puede ser NULL.
-- =============================================================================

alter table public.fact_event
  add constraint fact_event_replay_unique
  unique nulls not distinct (task_id, event_type, "timestamp", actor_email);
