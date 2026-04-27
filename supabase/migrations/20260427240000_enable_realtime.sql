-- Habilita Supabase Realtime sobre las tablas que la UI escucha.
-- fact_event es la fuente principal de cambios; dim_task se publica también
-- para que la UI sepa cuándo aparece una tarea nueva (insert vía Server Action
-- emite ambos: row en dim_task + row en fact_event).

alter publication supabase_realtime add table public.fact_event;
alter publication supabase_realtime add table public.dim_task;
