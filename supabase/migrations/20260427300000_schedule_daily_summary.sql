-- Cron diario para daily-summary: 12:00 UTC = 8am EST.
-- service_role key se lee desde Supabase Vault (ver 20260427260000_schedule_crons.sql).

select cron.unschedule('daily-summary')
  where exists (select 1 from cron.job where jobname = 'daily-summary');

select cron.schedule(
  'daily-summary',
  '0 12 * * *',
  $$
  select extensions.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/daily-summary',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 180000
  );
  $$
);
