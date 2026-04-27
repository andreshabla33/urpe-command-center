-- AI analytics implementadas como funciones Postgres (no Edge Function).
-- Ventaja: corren transaccionalmente, sin overhead de HTTP, sin tokens LLM.
-- Cuando se acumule suficiente histórico de tasks cerradas, los baselines
-- son data real; mientras no haya, las funciones no emiten eventos (idempotentes).

-- =============================================================================
-- analyze_anomalies()
-- Para cada owner, calcula p95 de tiempo-hasta-cerrar (días) de los últimos
-- 30 días, y emite ai_anomaly si la tarea actual excede baseline * 1.5.
-- =============================================================================

create or replace function public.analyze_anomalies()
returns int
language plpgsql
security definer
as $$
declare
  rec record;
  baseline numeric;
  emitted int := 0;
begin
  for rec in
    select id, owner_email, age_days
      from public.mv_task_current_state
     where status in ('in_progress','blocked','escalated')
       and owner_email is not null
       and age_days >= 1
  loop
    select percentile_cont(0.95) within group (
      order by extract(epoch from (e."timestamp" - t.created_at)) / 86400.0
    )
      into baseline
      from public.dim_task t
      join public.fact_event e
        on e.task_id = t.id and e.event_type = 'closed'
     where t.owner_email = rec.owner_email
       and e."timestamp" > now() - interval '30 days';

    if baseline is not null and baseline > 0 and rec.age_days > baseline * 1.5 then
      insert into public.fact_event (task_id, event_type, actor_email, "timestamp", metadata)
      values (
        rec.id,
        'ai_anomaly',
        'system@urpeailab.com',
        date_trunc('day', now()),
        jsonb_build_object(
          'kind', 'slow_response',
          'baseline_p95_days', round(baseline, 2),
          'current_age_days', round(rec.age_days, 2),
          'multiplier', round(rec.age_days / baseline, 2)
        )
      )
      on conflict (task_id, event_type, "timestamp", actor_email) do nothing;
      emitted := emitted + 1;
    end if;
  end loop;
  return emitted;
end;
$$;

-- =============================================================================
-- analyze_etas()
-- Para cada tarea abierta, predice fecha de cierre basada en avg time-to-close
-- de tasks cerradas del mismo owner. Emite ai_eta con metadata.predicted_close_at.
-- =============================================================================

create or replace function public.analyze_etas()
returns int
language plpgsql
security definer
as $$
declare
  rec record;
  avg_days numeric;
  predicted timestamptz;
  emitted int := 0;
begin
  for rec in
    select id, owner_email, created_at, age_days
      from public.mv_task_current_state
     where status in ('in_progress','blocked','escalated')
       and owner_email is not null
  loop
    select avg(extract(epoch from (e."timestamp" - t.created_at)) / 86400.0)
      into avg_days
      from public.dim_task t
      join public.fact_event e
        on e.task_id = t.id and e.event_type = 'closed'
     where t.owner_email = rec.owner_email
       and e."timestamp" > now() - interval '60 days';

    if avg_days is not null and avg_days > 0 then
      predicted := rec.created_at + make_interval(secs => avg_days * 86400);
      insert into public.fact_event (task_id, event_type, actor_email, "timestamp", metadata)
      values (
        rec.id,
        'ai_eta',
        'system@urpeailab.com',
        date_trunc('day', now()),
        jsonb_build_object(
          'predicted_close_at', predicted,
          'avg_days_owner', round(avg_days, 2),
          'sample_window_days', 60
        )
      )
      on conflict (task_id, event_type, "timestamp", actor_email) do nothing;
      emitted := emitted + 1;
    end if;
  end loop;
  return emitted;
end;
$$;

-- =============================================================================
-- Schedule: cada hora junto con suggest-action
-- =============================================================================

select cron.unschedule('analyze-anomalies-hourly')
  where exists (select 1 from cron.job where jobname = 'analyze-anomalies-hourly');

select cron.schedule(
  'analyze-anomalies-hourly',
  '20 * * * *',
  $$select public.analyze_anomalies()$$
);

select cron.unschedule('analyze-etas-hourly')
  where exists (select 1 from cron.job where jobname = 'analyze-etas-hourly');

select cron.schedule(
  'analyze-etas-hourly',
  '25 * * * *',
  $$select public.analyze_etas()$$
);
