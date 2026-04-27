-- Programa los jobs recurrentes vía pg_cron + pg_net.
-- pg_cron está en schema `cron`, pg_net en `extensions`.
-- timeout_milliseconds 60000 = 60s para tolerar latencia de LLM.
--
-- IMPORTANTE: las llamadas a Edge Functions necesitan el service_role key.
-- Lo leemos de Supabase Vault para no committear el literal al repo.
-- Antes de aplicar esta migration por primera vez, el secret tiene que existir:
--   select vault.create_secret('<SERVICE_ROLE_KEY>', 'urpe_service_role_key', '...');

-- Refresh MV cada minuto.
select cron.unschedule('refresh-mv-task-current-state')
  where exists (select 1 from cron.job where jobname = 'refresh-mv-task-current-state');

select cron.schedule(
  'refresh-mv-task-current-state',
  '* * * * *',
  $$select public.refresh_mv_task_current_state()$$
);

-- batch-embeddings cada 30 minutos.
select cron.unschedule('batch-embeddings-30m')
  where exists (select 1 from cron.job where jobname = 'batch-embeddings-30m');

select cron.schedule(
  'batch-embeddings-30m',
  '*/30 * * * *',
  $$
  select extensions.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/batch-embeddings',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- suggest-action cada hora.
select cron.unschedule('suggest-action-hourly')
  where exists (select 1 from cron.job where jobname = 'suggest-action-hourly');

select cron.schedule(
  'suggest-action-hourly',
  '15 * * * *',
  $$
  select extensions.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/suggest-action',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
  $$
);
