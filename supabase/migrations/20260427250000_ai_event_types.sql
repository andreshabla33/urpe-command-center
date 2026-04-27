-- Amplía el CHECK de fact_event.event_type para incluir tipos generados por IA.
-- Esto permite que las Edge Functions/Server Actions escriban sus outputs como
-- eventos en lugar de tablas separadas (mantiene la fuente de verdad única).

alter table public.fact_event drop constraint if exists fact_event_event_type_check;

alter table public.fact_event add constraint fact_event_event_type_check
  check (event_type in (
    -- humanos / N18 (existentes)
    'created','assigned','email_sent','email_received',
    'comment','escalated','status_changed','closed',
    'n1_sent','n2_sent','n3_sent','ping','corrected',
    -- generados por IA
    'ai_suggestion','ai_categorized','ai_anomaly','ai_eta'
  ));
