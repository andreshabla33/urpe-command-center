-- Fix: los 4 cron jobs llamaban `extensions.http_post(...)` que dejó de existir.
-- La función real es `net.http_post(url, body, params, headers, timeout_milliseconds)`
-- en la extension `pg_net` (schema `net`). En algún momento Supabase movió el
-- namespace y los crons quedaron apuntando al schema viejo. Cada corrida fallaba
-- en milisegundos con "function extensions.http_post does not exist" sin llegar
-- a invocar la Edge Function — la AI de sugerencias dejó de generar output.
--
-- Refs: https://supabase.com/docs/guides/database/extensions/pg_net
--
-- Idempotente: cron.alter_job sobrescribe el comando del job existente. Si los
-- jobids cambian en un proyecto nuevo, este script falla rápido y el operador
-- debe recrearlos desde las migrations originales:
--   - 20260427260000_schedule_crons.sql
--   - 20260427300000_schedule_daily_summary.sql
--   - 20260428100200_schedule_gmail_watch.sql

begin;

select cron.alter_job(
  (select jobid from cron.job where jobname = 'batch-embeddings-30m'),
  command := $cmd$
  select net.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/batch-embeddings',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$cmd$
);

select cron.alter_job(
  (select jobid from cron.job where jobname = 'suggest-action-hourly'),
  command := $cmd$
  select net.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/suggest-action',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$cmd$
);

select cron.alter_job(
  (select jobid from cron.job where jobname = 'daily-summary'),
  command := $cmd$
  select net.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/daily-summary',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 180000
  );
$cmd$
);

select cron.alter_job(
  (select jobid from cron.job where jobname = 'gmail-watch-renew-daily'),
  command := $cmd$
  select net.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/gmail-watch-renew',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$cmd$
);

commit;
