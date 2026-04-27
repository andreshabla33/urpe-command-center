-- Suscripciones de Web Push por usuario.
-- Una persona puede tener varias (un device por subscription).

create table if not exists public.push_subscription (
  id          bigserial primary key,
  user_email  text not null references public.dim_person(email) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_push_sub_user on public.push_subscription(user_email);

alter table public.push_subscription enable row level security;

drop policy if exists "push_select_own" on public.push_subscription;
create policy "push_select_own" on public.push_subscription
  for select to authenticated
  using (user_email = auth.email());
