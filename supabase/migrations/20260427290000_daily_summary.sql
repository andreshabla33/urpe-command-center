-- Resúmenes ejecutivos diarios generados por Claude Opus 4.7.
-- Tabla append-only por convención (sin trigger, ya que no es event sourcing puro).

create table if not exists public.daily_summary (
  id            bigserial primary key,
  generated_at  timestamptz not null default now(),
  date_key      date not null,
  content_md    text not null,
  metrics       jsonb not null default '{}'::jsonb,
  email_sent_at timestamptz
);

create unique index if not exists daily_summary_date_unique on public.daily_summary(date_key);
create index if not exists idx_daily_summary_generated on public.daily_summary(generated_at desc);

alter table public.daily_summary enable row level security;

drop policy if exists "daily_summary_admin_select" on public.daily_summary;
create policy "daily_summary_admin_select" on public.daily_summary
  for select to authenticated
  using (public.is_admin());
