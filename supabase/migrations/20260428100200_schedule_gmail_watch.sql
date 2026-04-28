-- Renueva el watch Gmail diariamente (Google expira watches a 7 días).

select cron.unschedule('gmail-watch-renew-daily')
  where exists (select 1 from cron.job where jobname = 'gmail-watch-renew-daily');

select cron.schedule(
  'gmail-watch-renew-daily',
  '0 2 * * *',
  $$
  select extensions.http_post(
    url := 'https://vecspltvmyopwbjzerow.functions.supabase.co/gmail-watch-renew',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'urpe_service_role_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
