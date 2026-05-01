# URPE Command Center — LEEME

> Single pane of glass del ecosistema URPE. Operación en tiempo real sobre tareas, agentes IA, comunicaciones y métricas. Estética federal-government (Numero 18 Operations Division) — no SaaS genérico.
>
> **Producción:** https://urpe-command-center.vercel.app
> **Repo:** https://github.com/andreshabla33/urpe-command-center
> **Stack:** Next.js 16 + Supabase + OpenRouter (Claude Opus 4.7 + GPT-5.2) + Tailwind v4 + shadcn/ui

Este documento sirve dos audiencias en paralelo:

- **Parte I** — manual de usuario (no técnico, para Diego y el equipo)
- **Parte II** — manual técnico (para LLMs y devs que tocan el código)

---

# PARTE I — MANUAL DE USUARIO

## 1. Qué es y quién lo usa

El Command Center es el panel ejecutivo de URPE. **Diego Urquijo** lo opera como CEO, y el equipo URPE (`@urpeailab.com` / `@urpeintegralservices.co`) puede entrar para ver sus propias tareas. Permite:

- Ver todas las tareas del ecosistema en un solo lugar
- Ver qué agente IA (N18, Sofía, Mónica, Rocky, NEXUS) hizo qué y cuándo
- Recibir sugerencias automáticas de la AI sobre tareas atascadas y aplicarlas con 1 click
- Operar sin fricción: keyboard shortcuts tipo Linear, Cmd+K con natural language, drag-drop en kanban

**No es** un dashboard de BI, ni un Trello, ni Linear genérico. Es la sala de comando ejecutivo. La estética es deliberadamente austera (federal: navy + gold + Cinzel). Sin emojis, sin tonos pastel, sin "powered by AI" decorativo.

## 2. Cómo entrar

1. Abrí https://urpe-command-center.vercel.app
2. Click **"Continuar con Google"**
3. Login con `@urpeailab.com` o `@urpeintegralservices.co` (otros dominios son rechazados)
4. La primera vez Google pide permisos básicos. Después entra automático.

**Roles** (definidos en `dim_person.role`):

- `admin` (Diego, Andrés Maldonado, Jesús Morán) — ven todo
- `liderazgo`, `operaciones`, `supervisor`, `comercial`, `asesor`, etc. — ven solo lo suyo
- `agent` — agentes IA (N18, etc.). No loguean por web; usan el endpoint con bearer

## 3. Las 6 vistas

El sidebar izquierdo tiene 6 destinos. Cada uno tiene atajo `g+letra`:

### 3.1 Lista (`g+l`) — la vista por defecto
- Tabla de todas las tareas con: ID, título, owner, status, antigüedad, prioridad, sugerencia AI
- Filtros arriba: búsqueda libre (`/`), Owner, Status, Antigüedad
- KPI strip arriba: Abiertas, Atascadas >7d, P0 activas, Avg response time + sparklines de actividad
- **Smart Suggestions Bar**: hasta 5 cards con sugerencias N18 sobre tareas atascadas, accionables con 1 click
- Click en una tarea → detalle

### 3.2 Kanban (`g+k`)
- 6 columnas: Backlog / En curso / Bloqueada / Escalada / Respondida / Completa
- Drag-and-drop entre columnas → cambia status + emite evento
- Optimistic updates (cambio se ve instantáneo, queda commiteado en background)

### 3.3 Calendario (`g+c`)
- Vista mensual de tareas por `due_date`
- Tareas con vencimiento en cada celda, con priority badge
- Navegación ← / Hoy / → entre meses
- Click en tarea → detalle

### 3.4 Grafo (`g+g`)
- Vista de red: cada owner es un nodo, sus tareas cuelgan abajo
- Aristas tenues unen tareas del mismo proyecto
- Scroll = zoom (sin Ctrl), drag con click izquierdo = pan
- En mobile: pinch para zoom

### 3.5 Analytics (`g+a`)
- **Resumen ejecutivo diario** generado por Claude Opus 4.7 (cron diario)
- **Burn-down chart**: tareas abiertas por día, últimos 30
- **Heatmap de saturación**: por persona × status, intensidad indica carga

### 3.6 Office (`g+o`)
- Bridge embebido (iframe) al pixel office de URPE AI Lab donde viven los agentes IA
- Vista en vivo de N18, Sofía, Rocky, etc.

## 4. Crear y operar tareas

**Crear una tarea** — 3 formas:
- Botón **+ Nueva tarea** arriba a la derecha de la lista
- Tecla `c` desde cualquier vista
- Cmd+K → "Nueva tarea"

Campos:
- ID obligatorio (formato `URPE-IS-NNN`, `LEGAL-NNN`, etc.)
- Título
- Descripción (opcional)
- Owner (selector de personas activas)
- Prioridad (P0=crítico, P1=urgente, P2=default, P3=nice-to-have)
- Proyecto (URPE-IS, NIW, SOFIA, etc.)
- Due date (opcional)

**Cambiar status de una tarea**:
- En la lista, hover sobre el ⋯ a la derecha → menú quick-status
- En kanban, drag a otra columna
- En el detalle, panel de Acciones

**Reasignar owner**: en el detalle, hay selector de owner. O usá la sugerencia AI si aplica.

**Pingear o escalar manualmente**: panel de Acciones en el detalle.

## 5. AI y sugerencias accionables

### Smart Suggestions Bar
Aparece al tope de la lista cuando hay tareas atascadas (≥3 días sin actividad). Cada hora un cron en Supabase corre N18 (Claude Opus 4.7) sobre las top 20 tareas atascadas y emite recomendaciones:

- **Pingear owner** (con email auto-prefilled)
- **Escalar** al sponsor / supervisor
- **Reasignar** a otra persona
- **Dividir** en sub-tareas
- **Cerrar** (ya no aplica)
- **Esperar** (hay razón legítima, descartar)

Cada card muestra: action label, % confianza, título, reason del LLM, owner avatar, antigüedad. Botones:

- **[Aplicar]** índigo → ejecuta la acción inmediatamente. Para `ping`, emite evento ping. Para `escalate`, cambia status a escalada. Para `close`, status a done. Para `reassign` y `split`, abre el detalle de la tarea para input adicional.
- **[Descartar]** discreto → marca la sugerencia como descartada. La próxima ejecución del cron puede emitir una nueva si la tarea sigue atascada.

### Cmd+K — natural language
Cmd+K abre el command palette. Podés:
- Buscar tareas por ID, título, owner
- Navegar entre vistas (`g+l`, etc.)
- **Preguntar a la AI en lenguaje natural** (`Cmd+Enter`):
  - "tareas de jesús atascadas hace 3 días"
  - "muéstrame todas las P0 sin owner"
  - "abrí URPE-IS-024"

GPT-5.2 parsea la query y la convierte en URL con filtros (`/?owner=jm@urpeailab.com&age=7d`) o navega directo.

### Auto-categorización (próximamente)
Cuando se crea una tarea, GPT-5.2 sugerirá `project_id` y `priority` automáticamente desde título+descripción. (Hoy: prompt existe pero invocación pendiente.)

## 6. Atajos de teclado

| Tecla | Acción |
|---|---|
| `c` | Crear nueva tarea |
| `/` | Focus al buscador |
| `Cmd+K` (o `Ctrl+K`) | Command palette |
| `[` | Colapsar / expandir sidebar |
| `g` luego `l` | Ir a Lista |
| `g` luego `k` | Ir a Kanban |
| `g` luego `c` | Ir a Calendario |
| `g` luego `g` | Ir a Grafo |
| `g` luego `a` | Ir a Analytics |
| `g` luego `o` | Ir a Office |
| `Esc` | Cerrar dialogs / modals |

Los atajos se desactivan cuando estás en un input/textarea.

## 7. Personalización

Abajo del sidebar hay 4 controles:

### Theme — 2 modos
- **Federal** (default): navy bg + gold accent. La identidad oficial del brandbook v1.0.
- **Document**: bone bg + ink text + gold accent. Para vistas que se imprimen o reportes ejecutivos.

Click en el icono Shield (Federal) o FileText (Document) para alternar. La preferencia se guarda en `localStorage` por usuario.

### Density
- **Comfortable** (default): filas con padding generoso
- **Compact**: filas más densas, ver más en pantalla

### Push notifications
Toggle para recibir Web Push cuando llegue un evento relevante (escalada, sugerencia de alta confianza, etc.). Requiere VAPID keys configuradas en producción.

### Salir
Logout. Vuelve a `/login`.

## 8. Mobile y PWA

El Command Center es PWA instalable en iOS y Android. Mobile (≤768px):

- Sidebar se reemplaza por **MobileNav** (hamburger arriba) que abre Sheet drawer
- Kanban, Grafo y otras vistas se adaptan a pantalla angosta
- Funciona offline para acciones simples (offline queue con IndexedDB; cambios sincronizan al volver la conexión)

**Instalar como app**:
- iOS Safari: Compartir → Agregar a pantalla de inicio
- Android Chrome: menú → Instalar app

**Web Push** funcional en ambas plataformas (con VAPID keys configuradas).

## 9. Limitaciones conocidas

- **Gmail thread embed**: bloqueado por GCP org policy (`cowork` project). No se ven los hilos de Gmail dentro del detalle de tarea hasta que se destrabé.
- **Kapso webhook**: pendiente conectar el segundo URL en panel Kapso para que mensajes WhatsApp del bot se vinculen automáticamente a tareas.
- **Gigliola y otros sin acceso aún**: solo dominios `@urpeailab.com` y `@urpeintegralservices.co` con `is_active=true` pueden loguear. Si alguien no entra, verificar `dim_person`.

---

# PARTE II — MANUAL TÉCNICO

> Este apartado está pensado para que un LLM (Claude, N18, etc.) o un desarrollador humano tenga contexto suficiente para operar el codebase sin leer todos los archivos.

## 1. Stack canónico

| Capa | Tecnología | Versión / nota |
|---|---|---|
| Framework | Next.js | **16** (App Router + RSC) |
| Runtime | React | 19 |
| Lenguaje | TypeScript | 5+ strict |
| Styling | Tailwind | **v4** (`@import "tailwindcss"`, sin `tailwind.config`) |
| UI primitives | shadcn/ui | new-york style, base color `neutral` (overridden con paleta brandbook) |
| Validation | Zod | v4+ |
| Server state | TanStack Query | v5 |
| Backend | Supabase | proyecto **`vecspltvmyopwbjzerow`** (compartido con Mónica prod) |
| DB | Postgres + RLS + Realtime + pgvector + Vault + pg_cron + pg_net | |
| AI | OpenRouter | siempre vía OpenRouter, nunca SDKs directos |
| Modelos AI | `anthropic/claude-opus-4.7` (reasoning) + `openai/gpt-5.2` (rápido) | regla Diego — NO usar otros |
| Embeddings | `text-embedding-3-large` | 3072 dims |
| Auth | Supabase Auth + Google SSO | restringido a `@urpeailab.com` y `@urpeintegralservices.co` |
| Package manager | pnpm | 10+ |
| Deploy | Vercel | Hobby plan; CI/CD vía GitHub integration |
| Crons | Supabase Edge Functions + `pg_cron` | NO Vercel Cron (Hobby limita 1/día) |
| Mobile | PWA (Serwist) + Web Push (VAPID) | NO nativa |
| Drag&drop | `@hello-pangea/dnd` | sucesor de react-beautiful-dnd |
| Graph | `@xyflow/react` (ReactFlow v12) | |
| Charts | Recharts | |
| Theming | next-themes | 2 themes: `federal` (default) + `document` |
| Fonts | next/font | Cinzel display + Inter body + JetBrains Mono |

## 2. File layout (vertical slices)

```
src/
├── app/                              Next.js App Router
│   ├── (dashboard)/                  Layout autenticado
│   │   ├── layout.tsx                Sidebar + KPI strip + RealtimeProvider
│   │   ├── page.tsx                  Lista (default)
│   │   ├── kanban/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── graph/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── office/page.tsx           Iframe al bridge Railway
│   │   └── tasks/[id]/page.tsx       Detail de tarea + Timeline + Email thread
│   ├── login/page.tsx                Login splash con eagle seal
│   ├── auth/                         OAuth callbacks Supabase + Google integrations
│   ├── api/
│   │   ├── webhooks/{gmail,github,kapso}/route.ts
│   │   └── n18/{event,events}/route.ts   Bearer-auth para N18
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx   Brand assets
│   ├── globals.css                   Tokens federal + utilities (h-display, ai-shimmer, etc.)
│   ├── layout.tsx                    Root: ThemeProvider + TooltipProvider + fonts
│   └── manifest.ts                   PWA manifest
├── features/                         Vertical slices por dominio
│   ├── tasks/
│   │   ├── actions.ts                Server Actions (createTask, setTaskStatus, applySuggestion, dismissSuggestion, pingTask, categorizeTask)
│   │   ├── queries.ts                Read functions (getTasks, getKpis, getActivityTrend, getStuckSuggestions)
│   │   ├── schema.ts                 Zod schemas
│   │   ├── types.ts                  TASK_STATUS, TASK_PRIORITY
│   │   └── components/               TaskRow, KanbanBoard, TaskGraph, SuggestionsBar, etc.
│   ├── events/                       fact_event types + RealtimeProvider
│   ├── ai/                           Prompts + nl-actions (Cmd+K NL parser)
│   ├── n18/                          Schema + handler + auth para endpoint /api/n18
│   ├── integrations/{gmail,kapso,calendar}/
│   ├── analytics/                    BurnDown + SaturationHeatmap + DailySummary
│   ├── auth/                         Server Actions login/logout + role guards
│   ├── push/                         Web Push subscriber
│   └── persons/                      Owner queries
├── components/
│   ├── ui/                           shadcn primitives (vendored)
│   └── shared/                       Sidebar, MobileNav, KpiStrip, CommandPalette,
│                                     ThemeProvider, ThemeToggle, DensityToggle,
│                                     SidebarCollapseToggle, UserAvatar, Sparkline, etc.
├── lib/
│   ├── env.ts                        publicEnv (Zod-validated, browser-safe)
│   ├── env-server.ts                 serverEnv ("server-only", service-role + openrouter + N18 token)
│   ├── utils.ts                      cn()
│   ├── supabase/{server,client,service-role,middleware}.ts
│   ├── openrouter/client.ts          chat() + OPENROUTER_MODELS
│   ├── time/business-hours.ts        addBusinessHours (lun-vie 9-18 EST)
│   ├── posthog/                      Analytics tracking
│   ├── sentry/                       Error tracking (v10 — captureRequestError)
│   └── offline/                      IndexedDB queue + sync
├── proxy.ts                          NOT middleware.ts (Next 16 deprecó esa convención)
public/
├── brand/                            v4-eagle-seal.png + horizontal-lockup.jpg + mark-only.jpg + monochrome-gold.jpg
├── manifest.webmanifest, sw.js, workbox-*
└── icon-{16,32,192,512}.png
supabase/
├── migrations/                       SQL versionado (formato YYYYMMDDHHMMSS_description.sql)
└── functions/                        Edge Functions Deno
    ├── suggest-action/               Cron horario que genera ai_suggestion
    ├── batch-embeddings/             Genera embeddings cada 30min
    ├── daily-summary/                Resumen ejecutivo diario LLM
    └── gmail-watch-renew/            Renovación de Gmail Pub/Sub watch
brandbook/                            PDF + 4 logos PNG/JPG
docs/                                 plan-del-proyecto.md, dumps SQL de referencia
```

## 3. Reglas duras (no romper)

### Event sourcing
1. **`fact_event` es append-only.** Trigger PG bloquea UPDATE y DELETE. Para "corregir" un evento, emitir uno compensatorio (`event_type='corrected'`).
2. **Las queries de UI van contra `mv_task_current_state`** (vista materializada), refrescada por cron pg_cron cada minuto.
3. **Cada evento tiene `event_id` único** y los handlers (parsers, AI, webhooks) deben ser **idempotentes**.
4. **Las mutaciones siempre van por Server Actions o Edge Functions**, nunca cliente → Supabase directo. RLS solo cubre SELECTs.
5. **Trigger reactivo `project_event_to_task`** (migration `20260430120000_event_sourcing_reactivity`) actualiza `dim_task.status` automáticamente cuando entra `fact_event(closed | escalated | status_changed | email_received[is_response])`.

### Server-first
6. **Páginas son Server Components por default.** `"use client"` solo para realtime, drag, Cmd+K, formularios.
7. **Server Components hacen el fetch inicial.** Client Components reciben `initialData` y se suscriben a Realtime para deltas.
8. **No usar API routes** (`app/api/`) salvo webhooks externos. Para mutaciones internas: Server Actions.

### Tipos y validación
9. **Zod schemas como contrato único.** Cada feature define sus schemas en `schema.ts`.
10. **Tipos de DB se generan**: `pnpm exec supabase gen types typescript --project-id vecspltvmyopwbjzerow > src/lib/supabase/database.types.ts`
11. **Validar inputs en boundaries**: Server Actions, parsers de LLM output, webhooks. Datos internos confiables ya validados.
12. **Env vars: split estricto público/servidor.** `lib/env.ts` solo `NEXT_PUBLIC_*`. `lib/env-server.ts` con `"server-only"` valida secrets. Si un Client Component (directo o transitivo) importa de `env-server.ts`, build falla.

### AI / LLM
13. **Siempre vía OpenRouter** (`src/lib/openrouter/client.ts`). Nunca llamar Anthropic/OpenAI SDK directos.
14. **Modelos canónicos** (regla Diego, no negociable):
    - Reasoning complejo → `OPENROUTER_MODELS.reasoning` (claude-opus-4.7)
    - Clasificación rápida / parsing NL → `OPENROUTER_MODELS.fast` (gpt-5.2)
    - **NO usar otros modelos** (Gemini, Llama, Mistral, etc.) sin permiso explícito.
15. **Prompts versionados** en `src/features/<x>/prompts.ts` o `src/lib/openrouter/prompts/<name>.ts`.
16. **Outputs estructurados**: `response_format: { type: "json_object" }` + parsing con Zod.

### Estados y dominio
17. **Status canónico de `dim_task`**:
    `backlog | in_progress | blocked | escalated | responded | done | cancelled`
18. **Priority**: `p0 | p1 | p2 | p3` (p0 = crítico).
19. **Cadencia escalado N18**: N1=+2h hábiles, N2=+8h, N3=+24h. Horario lun-vie 9:00-18:00 EST. `addBusinessHours` en `lib/time`.
20. **Email accounts soportadas**: `dau@urpeailab.com` / `dau@urpeintegralservices.co` (Diego), agentes via service account `n18@urpeailab.com`.

### Crons y jobs
21. **Crons van a Supabase Edge Functions con `pg_cron`**, no a Vercel Cron.
22. **Webhooks externos** viven en `app/api/webhooks/<source>/route.ts` y solo validan firma + insertan en `fact_event` o `outbox_event`. Procesamiento es asíncrono.

### UI / UX
23. **Strategic minimalism**: status, priority, assignee. Nada decorativo.
24. **Layout canónico**: sidebar 240px (colapsable a 56px) + KPI strip 4 cards + grid flexible.
25. **AI invisible**: sugerencias inline en cada tarea atascada. NO chatbot al margen, NO "✨ Powered by AI" decorativo.
26. **Skeleton shimmer** para loading, no spinners.
27. **Keyboard-first** (ver Parte I sección 6).
28. **Brand identity v1.0 (federal)**: navy + gold + Cinzel. Sin emojis. Sin colores fuera de paleta. Detalles en sección 12 abajo.

### Convenciones de código
29. **Imports absolutos** con alias `@/`.
30. **Server-only modules**: `import "server-only"` al tope (service-role, openrouter, prompts).
31. **Naming**: archivos `kebab-case.ts`, componentes `PascalCase.tsx`, funciones `camelCase`, constantes `SCREAMING_SNAKE_CASE`.
32. **Sin comentarios** salvo para explicar un *why* no obvio (workaround, invariante oculta).
33. **Sin abstracciones especulativas**: tres líneas similares > una abstracción prematura.

## 4. Schema de datos (Postgres / Supabase)

Tablas principales en `public.*`:

```sql
dim_person (
  email text PRIMARY KEY,
  full_name text,
  role text NOT NULL CHECK (role IN ('admin','asesor','supervisor','administrativo',
    'comercial','dueño','liderazgo','operaciones','marketing','rrhh','agent','n/a')),
  is_active boolean DEFAULT true,
  agent_id text,            -- "n18", "rocky-assistant", "nexus-andres", etc.
  team_humano_id integer,
  bridge_url text,
  created_at timestamptz DEFAULT now()
)

dim_project (
  id text PRIMARY KEY,      -- "URPE-IS", "NIW", "SOFIA", "URPE-AILAB", etc.
  name text,
  parent_id text REFERENCES dim_project(id),
  color text,
  created_at timestamptz DEFAULT now()
)

dim_task (
  id text PRIMARY KEY,                     -- "URPE-IS-014", "LEGAL-003", etc.
  title text NOT NULL,
  description text,
  project_id text REFERENCES dim_project(id),
  owner_email text REFERENCES dim_person(email),
  created_by text REFERENCES dim_person(email),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),    -- F14: trigger BEFORE UPDATE mantiene
  due_date timestamptz,
  status text NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog','in_progress','blocked','escalated','responded','done','cancelled')),
  priority text NOT NULL DEFAULT 'p2' CHECK (priority IN ('p0','p1','p2','p3')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb       -- co_owners, consolidated_into, inferred_owner, calendar_event_id, etc.
)

fact_event (
  id bigserial PRIMARY KEY,
  event_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  task_id text REFERENCES dim_task(id),
  event_type text NOT NULL CHECK (event_type IN (
    'created','assigned','email_sent','email_received','comment',
    'escalated','status_changed','closed','n1_sent','n2_sent','n3_sent',
    'ping','corrected',
    'ai_suggestion','ai_categorized','ai_anomaly','ai_eta',
    'ai_suggestion_applied','ai_suggestion_dismissed'
  )),
  actor_email text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Idempotencia:
  UNIQUE (task_id, event_type, timestamp, actor_email)   -- fact_event_replay_unique
)
-- Triggers:
-- fact_event_no_update / fact_event_no_delete (BEFORE) → bloquean mutación (append-only)
-- fact_event_project_to_task (AFTER INSERT) → proyecta a dim_task.status según event_type

fact_email (...)         -- threads Gmail por tarea (direction inbound/outbound, msg_id, etc.)

mv_task_current_state    -- materialized view: dim_task + agregados de fact_event/fact_email + age_days
                         -- refrescada cada minuto vía pg_cron
                         -- 18 columnas, 4 índices, ID único PK

-- Wrapper RLS-aware:
public.task_current_state()  -- function que filtra mv por RLS de dim_task
```

## 5. Event sourcing — flujo

1. Usuario o agente IA dispara una mutación (Server Action o webhook)
2. La mutación inserta `fact_event(event_type, task_id, actor_email, metadata)` con service-role
3. Trigger `fact_event_project_to_task` (AFTER INSERT) actualiza `dim_task.status` si el event_type lo requiere (closed/escalated/status_changed/email_received) o solo refresca `updated_at`
4. Cron pg_cron `refresh-mv-task-current-state` corre cada minuto y recompila la MV
5. Supabase Realtime publica el evento a clients suscritos via WebSocket
6. Client (ej. `RealtimeProvider`) recibe el evento, hace `router.refresh()` o aplica delta optimistic
7. UI re-renderiza con state actualizado

**Garantías:**
- `dim_task` siempre es proyección consistente de `fact_event` (gracias al trigger)
- Replay completo es posible: dropear MV, recompilar leyendo todos los `fact_event` desde el inicio
- Idempotencia: misma `(task_id, event_type, timestamp, actor_email)` no se duplica (constraint `fact_event_replay_unique`)

## 6. Integraciones AI

### Edge Function `suggest-action` — Sugerencias accionables
- Cron horario (`15 * * * *`) en `pg_cron`
- Lee top 20 tareas activas con `age_days >= 3`
- Por cada una, manda el contexto (task + últimos 15 eventos) a Claude Opus 4.7
- LLM devuelve JSON validado por Zod: `{action, reason, confidence, ping_recipients?}`
- Insert idempotente como `fact_event(event_type='ai_suggestion', actor='n18@urpeailab.com')`
- UI lee la última sugerencia vigente por task vía `attachSuggestions` (filtra dismissed/applied)

### Edge Function `daily-summary`
- Cron diario 7 AM EDT
- Agrega: tareas creadas/cerradas/escaladas en las últimas 24h
- Claude Opus 4.7 redacta el resumen ejecutivo en español, voz autoritaria/directa
- Persistido en tabla `daily_summary` + opcional email a Diego

### Edge Function `batch-embeddings`
- Cron cada 30min
- Genera embeddings (text-embedding-3-large, 3072 dims) de tareas y comments para search semántica
- Persistido en columna `embedding vector(3072)`

### Server Action `categorizeTask`
- Cuando el usuario crea una tarea, GPT-5.2 sugiere `project_id` y `priority` desde título+descripción
- Output validado con Zod, persistido como `fact_event(ai_categorized)`

### Cmd+K NL parser (`features/ai/nl-actions.ts`)
- Cliente envía la query natural a `parseNlCommand`
- GPT-5.2 con response_format JSON devuelve `{action: 'navigate'|'open_task'|'filter', target?, filters?}`
- Cliente navega o aplica filtros

## 7. Endpoints externos

### `POST /api/webhooks/gmail`
Pub/Sub de Gmail. Bloqueado actualmente por GCP org policy en project `cowork`. Cuando destrabe, los emails se vinculan a tareas vía regex en subject/body.

### `POST /api/webhooks/github`
Eventos de GitHub (push, PR, issue) se vinculan a tareas si el commit message contiene `URPE-IS-NNN`.

### `POST /api/webhooks/kapso`
WhatsApp inbound desde Kapso bot. Multi-webhook configurado (uno apunta a Mónica, otro al Command Center). Crea/actualiza tareas con `event_type='comment'`.

### `POST /api/n18/event` y `POST /api/n18/events`
- Bearer auth con `N18_INGEST_TOKEN` (env var)
- N18 (Mac de Diego) inserta eventos sin compartir service_role
- Whitelist de event_types: `ping, email_sent, email_received, comment, escalated, n1_sent, n2_sent, n3_sent`
- `actor_email` forzado server-side a `n18@urpeailab.com`
- Idempotencia via constraint `fact_event_replay_unique`
- Single: `{task_id, event_type, metadata, timestamp?}`
- Batch: `{events: [...]}` (max 100)
- Respuestas: 201 nuevo, 200 dedup, 401 auth, 422 zod, 503 endpoint sin token

## 8. Crons (pg_cron)

| Job | Schedule | Función |
|---|---|---|
| `refresh-mv-task-current-state` | `* * * * *` (cada minuto) | `refresh materialized view concurrently mv_task_current_state` |
| `batch-embeddings-30m` | `*/30 * * * *` | HTTP POST a Edge Function `batch-embeddings` |
| `suggest-action-hourly` | `15 * * * *` | HTTP POST a `suggest-action` |
| `daily-summary` | `0 7 * * *` (7 AM UTC) | HTTP POST a `daily-summary` |
| `gmail-watch-renew` | `0 0 * * *` (diario) | HTTP POST a `gmail-watch-renew` (renueva subscription) |

Las URLs y bearer (`urpe_service_role_key`) viven en Supabase Vault, no commiteadas.

## 9. Auth + RLS

- **Login**: Supabase Auth + Google SSO (provider). Restricción de dominio en redirect URL config.
- **Roles**: `dim_person.role` controla qué ve cada usuario.
- **RLS policies**: solo SELECTs. Diego (admin) ve todo. Otros ven `WHERE owner_email = auth.email() OR created_by = auth.email()`. Mutaciones bypassean RLS porque van con service-role server-side.
- **Proxy** (`src/proxy.ts`, antes middleware): valida sesión, redirige a `/login` si no logged. Public paths: `/login`, `/auth`, `/api/webhooks`, `/api/n18`, manifest+sw+icon.

## 10. Deploy

- **Production**: push a `main` → Vercel auto-deploy → https://urpe-command-center.vercel.app
- **Preview**: push a feature branch → Vercel preview URL (gated por Vercel SSO)
- **Env vars**: production vs preview scopes. Algunas vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY, N18_INGEST_TOKEN) deben estar en ambos para que el build pase.
- **Migrations**: `supabase/migrations/`. Aplicación: vía Supabase CLI (`pnpm exec supabase db push`) o vía Management API con SQL crudo. Tracking en `supabase_migrations.schema_migrations`.

## 11. Cómo extender (patrones)

### Agregar una nueva vista
1. `src/app/(dashboard)/<vista>/page.tsx` (Server Component)
2. Función de query en `src/features/<dominio>/queries.ts`
3. Componente cliente en `src/features/<dominio>/components/<vista>.tsx` si necesita interactividad
4. Agregar al `NAV_ITEMS` en `src/components/shared/sidebar-nav-items.ts` con icono lucide
5. Agregar al `KeyboardShortcuts` con `g+letra`
6. Agregar al `CommandPalette`

### Agregar un nuevo event_type
1. Migration: amplía CHECK constraint en `fact_event_event_type_check`
2. Actualizar `src/features/events/types.ts` con el nuevo type
3. Si requiere proyectar a `dim_task`, actualizar `project_event_to_task()` plpgsql function
4. Si la UI lo necesita, agregar entrada al `EVENT_LABEL` en `tasks/[id]/page.tsx`

### Agregar una nueva acción AI
1. Prompt nuevo en `src/features/<x>/prompts.ts` o `src/lib/openrouter/prompts/`
2. Schema Zod del output
3. Server Action en `src/features/<x>/actions.ts` que llama `chat()` de openrouter, parsea con Zod, persiste como `fact_event`
4. UI button que dispara la action

### Agregar una integración externa
1. Webhook handler en `src/app/api/webhooks/<source>/route.ts`
2. Validación de firma con secret en env-server
3. Parser en `src/features/integrations/<source>/handler.ts`
4. Insert a `fact_event` con event_type apropiado

## 12. Brandbook v1.0 — reglas visuales

> Vinculante. NO tocar sin permiso de Diego. Brandbook completo en `brandbook/brandbook.pdf`.

### Paleta (regla 60-30-10)
| Token CSS | Hex | Uso |
|---|---|---|
| `--brand-navy` | `#0a1f44` | Background dominante 60% |
| `--brand-deep-navy` | `#061535` | Card bg, sombras |
| `--brand-gold` | `#c5a572` | Acento metálico 30% |
| `--brand-bright-gold` | `#e6c97a` | Hover, focus, highlight |
| `--brand-silver` | `#c0c0c0` | Wordmark UR, secundarios |
| `--brand-bone` | `#faf8f3` | Foreground, document theme bg |
| `--brand-ink` | `#1a1a1a` | Body sobre Bone |
| `--brand-crimson` | `#b91c1c` | **Solo** alertas críticas (P0, blocked, escalated, age>7d) |

### Tipografía
- **Cinzel** (display): H1-H4, sellos, mottos. Weight 400/600/700, letter-spacing 0.04-0.16em según jerarquía.
- **Inter** (body): UI text, párrafos, inputs.
- **JetBrains Mono**: IDs, hashes, fechas técnicas, kbd shortcuts.

### Logos (en `public/brand/`)
- `v4-eagle-seal.png` — sello completo (login, headers ejecutivos)
- `v4-mark-only.jpg` — sin texto curvo (favicon, sidebar, app-icon)
- `v4-horizontal-lockup.jpg` — sello + URPE wordmark + Command Center (email signature, OG image)
- `v4-monochrome-gold.jpg` — gold-only sobre fondos claros (Document theme)

### Don'ts (vinculantes)
- ❌ NO emojis en UI (solo lucide icons o glyphs unicode técnicos)
- ❌ NO colores fuera de la paleta (purple, green, magenta, orange, etc.)
- ❌ NO mezclar más de 3 colores primarios en una composición
- ❌ NO Cinzel para párrafos largos (es display, no body)
- ❌ NO Inter en sellos (sin gravitas)
- ❌ NO copiar tono SaaS (Linear/Notion/Asana)
- ❌ NO afirmar sin fuente (si no hay evidencia trazable, marcar como inferencia)

### Voice (vinculante)
- Briefing del Pentágono. Bullets, no párrafos.
- Vocabulario aprobado: tarea, cerrada, owner, ETA, escalar, reasignar, cron, sync, handoff
- Vocabulario prohibido: sinergia, aprovechar, holísticamente, "espero que esto te encuentre bien"
- Español latino neutral (sin "che", sin "vos", sin "tío")

## 13. Personas y agentes (current state)

| Email | Rol | Notas |
|---|---|---|
| `dau@urpeailab.com` | admin (Diego Urquijo) | Sponsor, dueño del producto. Ve todo. |
| `am@urpeailab.com` | admin (Andres Maldonado) | Dev del Command Center. Owner BRIDGE-* y URPE-AILAB-*. Peer agent: NEXUS. |
| `au@urpeintegralservices.co` | operaciones (Andres Urquijo) | URPE Migratory + URPE IS. Peer agent: nexus-andres. |
| `av@urpeintegralservices.co` | asesor (Ana Villalobos) | Operaciones URPE-IS. Default owner para URPE-IS-* sin explicit. |
| `fl@urpeailab.com` | n/a (Felix Lara) | Dev URPE IS técnico. |
| `vl@urpeailab.com` | dueño (Luis Villegas) | Co-owner URPE-IS-014, URPE-IS-005, URPE-IS-008. |
| `gb@urpeintegralservices.co` | liderazgo (Gigy Bocanegra) | Co-owner URPE-IS-014. |
| `jm@urpeailab.com` | admin (Jesus Moran) | Owner URPE-IS-022. Ops infra URPE IS + Sofía + Clawdbots. |
| `apg@urpeailab.com` | administrativo (Agustin Peralta) | Owner URPE-IS-023. Peer agent: rocky-assistant. |
| `ap@urpeintegralservices.co` | asesor (Andrea Peinado) | Operaciones URPE IS (NO confundir con apg@). |
| `eg@urpeintegralservices.co` | operaciones (Eliana Giraldo) | Owner LEGAL-* (legal/migratory). |
| `aa@urpeailab.com` | asesor (Anthony Alarcon) | Default NIW-*, URPE-MIG-*. |
| `n18@urpeailab.com` | agent (N18) | Vive en Mac de Diego. Cron diario 8 AM EDT. Escribe via `/api/n18/event`. |
| `gmail-api-push@system.gserviceaccount.com` | agent | Service account GCP Pub/Sub. is_active=false. |

## 14. Limitaciones / TODO conocidos

- **Gmail Pub/Sub**: bloqueado por GCP org policy `cowork`. F5.1 in_progress.
- **Kapso webhook URL**: pendiente conectar segundo webhook en panel Kapso. F5.4 in_progress.
- **Auto-categorización al crear tarea**: prompt existe (`CATEGORIZE_TASK_SYSTEM`) pero no se invoca desde `createTask`. Backlog.
- **Anomaly detection**: tiempo de respuesta vs baseline 30d. No implementado.
- **Predict completion**: simple regression sobre history. No implementado.
- **Voice (Whisper)**: no comprometido.
- **F15 brandbook**: rama `feat/brandbook-v1`, pendiente aprobación visual de Diego antes de merge a main.
- **AP duplicate dim_person**: `ap@urpeailab.com` está labeled "Agustin" pero per N18 mapping puede ser otra persona. Pending clarificación.
- **N18 sync overwrite risk**: si N18's cron sync no respeta `owner_email IS NOT NULL`, puede sobrescribir defaults asignados manualmente. Pending update de la lógica del sync.

## 15. Referencias

- **Brandbook completo**: `brandbook/brandbook.pdf`
- **Plan original**: `docs/plan-del-proyecto.md`
- **Plan F15 (rediseño brand)**: `docs/Plan F15 — Brand Identity v1.0 impl.md`
- **CLAUDE.md guidelines** (behavioral): `docs/CLAUDE (1).md`
- **AGENTS.md** (Next.js 16 specific): raíz del repo
- **Supabase project**: `vecspltvmyopwbjzerow` (compartido con producción Mónica)
- **Vercel project**: `andres-maldonados-projects-0d92e053/urpe-command-center`
- **GitHub repo**: https://github.com/andreshabla33/urpe-command-center

## 16. Contacto

- **Diego Urquijo** (`dau@urpeailab.com` / `dau@urpeintegralservices.co`) — sponsor, dueño del producto. Decisiones estratégicas y de scope.
- **Andres Maldonado** (`am@urpeailab.com`, GitHub `andreshabla33`) — desarrollador. Issues técnicos, feature requests, deploys.
- **N18** (Claude Opus 4.7 en Mac de Diego) — agente IA operativo. Cron diario, sync de PENDIENTES.md, sugerencias accionables. Comunicación vía bridge inter-agente.

---

*Documento mantenido por Andres Maldonado + Claude. Última actualización: 2026-05-01 (rama `feat/brandbook-v1`, post-F15.9). Cambios futuros: actualizar este archivo en el mismo PR/commit que introduzca el cambio.*
