-- Agrega event_types para el ciclo de vida de las sugerencias IA:
--   ai_suggestion_applied  → el usuario aceptó/ejecutó la sugerencia (queda en log)
--   ai_suggestion_dismissed → el usuario la descartó (acción "wait" o explícita)
--
-- Permite filtrar en queries: una sugerencia "vigente" es la última ai_suggestion
-- cuyo timestamp es mayor a cualquier applied/dismissed posterior.

alter table public.fact_event drop constraint if exists fact_event_event_type_check;

alter table public.fact_event add constraint fact_event_event_type_check
  check (event_type in (
    'created','assigned','email_sent','email_received',
    'comment','escalated','status_changed','closed',
    'n1_sent','n2_sent','n3_sent','ping','corrected',
    'ai_suggestion','ai_categorized','ai_anomaly','ai_eta',
    'ai_suggestion_applied','ai_suggestion_dismissed'
  ));
