QUE ES esto:
Un panel web unico — entrar desde mi cel o desktop a urpe-command —
donde de un solo vistazo veo TODO lo que esta pasando en URPE: cada
tarea pendiente, quien la tiene asignada, hace cuanto, si ya hubo
respuesta, si esta atascada. Como un Linear pero hecho a la medida de
URPE, con AI integrado que me sugiere acciones (pingear a alguien,
escalar, reasignar) y bridge con los agentes IA del equipo (N18,
Sofia, Rocky, los que se vienen).

POR QUE lo necesito:
Hoy todo vive en archivos de texto y consultas a N18 — funciona pero
me obliga a pedirle a el la lista de pendientes cada vez. Quiero ver
el estado completo del ecosistema sin tener que conversar. Tambien lo
voy a usar para tomar decisiones rapidas en reuniones (saturacion del
equipo, atascos, prioridades), y eventualmente para que el equipo vea
sus propias tareas con permisos limitados.

PARA QUE NOS SIRVE como empresa:
- Visibilidad ejecutiva 24/7 sin depender de un humano que arme reportes.
- Detectar tareas atascadas antes que se vuelvan crisis.
- Que cada empleado vea sus pendientes y status sin pedirme info.
- Base para futuras integraciones (calendar, slack, kpi de ingresos URPE IS).

REPO:
Acabo de crear el repo privado en mi cuenta personal de GitHub:
https://github.com/diegourquijo-personal/Urpeailab-command-center

Esta vacio, espera tu primer commit.

LO QUE NECESITO DE TI HOY:
1. Confirmame por respuesta a este correo que recibiste el correo con
la arquitectura tecnica detallada.
2. **Pasame tu username de GitHub** para agregarte como collaborator
(sin esto no puedes hacer push). Es solo el handle, ej: @tu-usuario.
3. Cualquier duda tecnica sobre la arquitectura o stack — preguntame
antes de arrancar.

---------------------
VISION
================================================================

No es una "lista de tareas con filtros". Es el single pane of glass
nivel Linear + Superhuman + AI nativo. Un control center desde el cual
yo (Diego) veo y opero TODO el ecosistema URPE en tiempo real:

- Cada tarea, quien la tiene, hace cuanto, en que estado
- Cada email enviado y su respuesta
- Cada agente IA (N18, Sofia, Monica, Rocky) y que esta haciendo
- Metricas de ingresos URPE IS y health de cada area
- AI sugiere acciones, detecta anomalias, predice completion

================================================================
STACK PRODUCTION-GRADE
================================================================

Frontend:
- Next.js 15 (App Router + React Server Components)
- Tailwind v4 + shadcn/ui + Radix
- Framer Motion (animaciones premium)
- TanStack Query (estado servidor)
- ReactFlow (vista grafo dependencias)

Backend:
- Supabase (project: vecspltvmyopwbjzerow, el de produccion Monica)
- Postgres + Row Level Security
- Edge Functions (Deno)
- Supabase Realtime (websockets para updates en vivo)
- pgvector (embeddings para search semantica)

AI Layer:
- OpenRouter (anthropic/claude-opus-4.7 + google/gemini-flash)
- Embeddings: text-embedding-3-large

Auth:
- Supabase Auth + Google SSO con Workspace URPE
- RLS policies: Diego ve todo, empleados ven solo sus tareas

Integraciones:
- Gmail Pub/Sub para webhook entrantes
- Kapso webhook para WhatsApp
- GitHub webhook para vincular commits a tareas
- Google Calendar API

Deploy:
- Vercel (frontend, conectar al repo nuevo)
- Supabase Cloud (backend ya tenemos)
- Sentry + PostHog para observabilidad

Mobile:
- PWA instalable (manifest.json + service worker)
- Web Push notifications
- Offline-first sync (libreria recomendada: replicache o liveblocks)

============================== ============================== ====
ESQUEMA DE DATOS (event-sourced)
============================== ============================== ====

Tablas Supabase nuevas:

dim_task
  id text PRIMARY KEY -- ej "URPE-IS-022"
  title text NOT NULL
  description text
  project_id text REFERENCES dim_project(id)
  owner_email text REFERENCES dim_person(email)
  created_by text
  created_at timestamptz
  due_date timestamptz
  status text --
backlog|in_progress|blocked|re sponded|done|cancelled
  priority text -- p0|p1|p2|p3
  metadata jsonb

dim_person
  email text PRIMARY KEY
  full_name text
  role text -- admin|asesor|supervisor|admini strativo
  team_humano_id int -- FK a wp_team_humano (Supabase ya existe)
  agent_id text -- ej "rocky" si tiene agente IA propio
  bridge_url text
  is_active bool

dim_project
  id text PRIMARY KEY -- ej "URPE-IS"
  name text
  parent_id text -- jerarquia
  color text

fact_event
  id bigserial PRIMARY KEY
  task_id text REFERENCES dim_task(id)
  event_type text --
created|assigned|email_sent|em ail_received|comment|escalated |status_changed|closed
  actor_email text
  timestamp timestamptz
  metadata jsonb -- fragmento, message_id, old_status,
new_status, etc.

fact_email
  message_id texto CLAVE PRIMARIA
  thread_id texto
  task_id texto REFERENCIAS dim_task(id)
  account texto -- dau@urpeailab.com o dau@urpeintegralservices.co
  direction texto -- outbound|inbound
  from_email texto
  to_email texto
  subject texto
  snippet texto
  sent_at timestamptz

dim_embedding
  task_id texto CLAVE PRIMARIA
  content_hash texto
  embedding vector(3072) -- text-embedding-3-large

============================== ============================== ====
CARACTERÍSTICAS MVP (4 fases, 3-4h con Claude Code)
============================== =============================== ====

FASE 1 — Core (1h)
- Migración SQL: crear las 6 tablas + políticas RLS
- Migrar SQLite ~/clawd/data/n18_followups.db a Supabase
- Parser PENDIENTES.md a JSON (script Python via cron c/15min)
- Parser wp_team_humano (empresa_id 4 + 13) a dim_person
- Vista lista basica con filtros (owner, project, status, age)
- Auth Google SSO

FASE 2 — Real-time + Multi-vista (1h)
- Kanban drag-and-drop (Backlog/In Progress/Blocked/Done)
- Vista calendario con due dates
- Vista grafo dependencias (ReactFlow)
- Supabase Realtime (subscribirse a cambios, UI updates sin refresh)
- Keyboard shortcuts tipo Linear (c crea, / busca, g+i inbox)

FASE 3 — AI nativo + integraciones (1h)
- Smart Suggestions Bar: LLM analiza tareas atascadas y sugiere accion
- Auto-categorization: nueva tarea → LLM detecta proyecto + urgencia
- Anomaly detection: comparar tiempo de respuesta vs baseline
- Predict completion: simple regression sobre history
- Embed Gmail thread por tarea (responder desde dashboard)
- Boton ping → trigger followup-monitor manual

FASE 4 — Voice + Mobile + Analytics (1h)
- PWA instalable iOS + Android (manifest + iconos + service worker)
- Web Push notifications cuando hay novedad
- Cmd+K command palette con natural language (LLM parsea query)
- Burn-down chart por proyecto
- Heatmap por persona (saturacion)
- Resumenes ejecutivos diarios generados por LLM

================================================================
DECISIONES ARQUITECTURALES CLAVE
================================================================

1. Event sourcing sobre CRUD plano: cada cambio es un evento en
fact_event, nunca se pierde historia. Permite reconstruir estado en
cualquier momento.

2. Edge-first: Edge Functions de Supabase + Vercel Edge → latencia <
100ms global, no fragiles backends en mi Mac mini.

3. Postgres como source of truth: SQLite local muere si mi Mac se cae.
Una tabla compartida en Supabase es para siempre y permite que
multiples agentes IA (N18, Rocky, Sofia) lean del mismo lugar.

4. AI como first-class citizen: no un addon, integrado en cada vista
(sugerencias, search semantica, summaries).

5. PWA sobre app nativa: ahorras App Store + funciona en iOS/Android,
install-as-app funcional.

================================================================
REPO Y SETUP
================================================================

Crear: github.com/diegourquijo-personal/Urpeailab-command-center (privado)
Stack inicial:
  npx create-next-app@latest --typescript --tailwind --app
  npm install @supabase/ssr @supabase/supabase-js
@tanstack/react-query @radix-ui/react-* shadcn-ui framer-motion
reactflow
  npx shadcn-ui@latest init

Variables de entorno (.env.local):
  NEXT_PUBLIC_SUPABASE_URL=https://vecspltvmyopwbjzerow.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=... (server-side only)
  OPENROUTER_API_KEY=... (para AI features)

Deploy:
  vercel --prod (autoconectado al repo nuevo)

================================================================
ENTREGABLES Y CRITERIOS DE EXITO
================================================================

Al final de las 3-4 horas debo poder:

1. Entrar a urpe-command.vercel.app (o subdominio que decidas) y
autenticarme con Google
2. Ver lista de TODAS las tareas pendientes (50+ items hoy)
3. Filtrar por owner (ej: ver solo lo de Jesus Moran)
4. Ver heatmap de antiguedad (tareas rojas > 7 dias)
5. Click en una tarea → ver thread Gmail completo + historia + boton ping
6. Vista Kanban con drag-and-drop
7. Smart Suggestion en alguna tarea atascada
8. PWA instalable en mi celular

================================================================
PROXIMOS PASOS
================================================================

1. Confirmame por email que recibiste este correo (necesito
verificacion explicita).
2. Crea el repo nuevo Urpeailab-command-center.
3. Manda primer commit con la migration SQL de las 6 tablas.
4. Reportame avance al final de cada fase.

Si tienes dudas tecnicas en cualquier momento, escribime — esto es
prioritario y bloquea otras decisiones operativas mias. Si necesitas
acceso a credenciales o repos privados, te los paso.