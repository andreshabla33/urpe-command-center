# URPE Command Center — Roadmap

> Single pane of glass para operar el ecosistema URPE en tiempo real.
> Plan completo en [`docs/plan-del-proyecto.md`](docs/plan-del-proyecto.md).

## Estado actual

**Progreso**: Fases 0-4 completadas (MVP listo y deployado en Vercel). **Fase 5 (integraciones) en progreso.**

| Métrica | Valor |
|---|---|
| Rutas vivas | 11 (`/`, `/login`, `/auth/callback`, `/kanban`, `/calendar`, `/graph`, `/analytics`, `/tasks/[id]`, `/icon`, `/apple-icon`, `/manifest.webmanifest`) |
| Tablas Postgres | 8 + MV `mv_task_current_state` + RLS en cada una |
| Edge Functions | 3 (`suggest-action`, `batch-embeddings`, `daily-summary`) |
| Cron jobs activos | 6 (refresh MV 1m, embeddings 30m, suggest 60m, anomalies 60m, etas 60m, daily-summary 24h) |
| Personas (`dim_person`) | 59 (7 admins) |
| Tasks (`dim_task`) | 30 (importadas del dump N18) |
| Events (`fact_event`) | 106+ (append-only con replay-unique constraint) |
| Emails (`fact_email`) | 31 |
| Embeddings (`dim_embedding`) | 30/30 (halfvec 3072 + HNSW) |
| Daily summaries | 1 (probado, 1671 chars Markdown) |
| Build status | `pnpm build` ✅, `pnpm exec tsc --noEmit` ✅ |
| PWA | manifest + service worker + Web Push (VAPID configurado) |
| Costo LLM acumulado | ~$0.11 USD |

**Modelos AI canónicos**: `anthropic/claude-opus-4.7` (reasoning) + `openai/gpt-5.2` (rápido) vía OpenRouter.

---

## Fase 0 — Setup ✅
- [x] Scaffold Next.js 16 + React 19 + Tailwind v4 + TypeScript 5
- [x] Estructura por vertical slices (`src/features/*`)
- [x] Supabase clients (`server`, `client`, `service-role`, `middleware`)
- [x] OpenRouter client con modelos canónicos (`claude-opus-4.7`, `gpt-5.2`)
- [x] Helper de horas hábiles para cadencia N18 (lun-vie 9-18 EST)
- [x] Validación de env vars con Zod (`src/lib/env.ts`)
- [x] shadcn/ui configurado (`components.json`, theme neutral)
- [x] Skill `urpe-architecture` instalada (`~/.claude/skills/urpe-architecture/SKILL.md`)
- [x] Google OAuth Client + Supabase Auth provider configurado
- [x] Acceso al repo GitHub `Urpeailab-command-center` aceptado

## Fase 1 — Core ✅
- [x] Migration SQL: 6 tablas + RLS + MV `mv_task_current_state` + triggers append-only
  - [x] SQL escrito en `supabase/migrations/20260427212712_init.sql`
  - [x] Aplicada al proyecto Supabase `vecspltvmyopwbjzerow` vía Management API
  - [x] Tipos TS generados (`src/lib/supabase/database.types.ts`)
- [x] Migration: importar `wp_team_humano` (empresa_id 4 + 13) → `dim_person`
  - [x] 59 personas importadas, 7 admins (Diego, Andres + 5 que ya tenían rol admin en wp_team_humano)
  - [x] Enum de roles ampliado a 11 valores reales del ecosistema URPE
- [x] Script: importar `docs/n18_followups_dump.sql` → `fact_event` + `dim_task` + `fact_email`
  - [x] `scripts/import-n18-dump.ts` (better-sqlite3 in-memory + Supabase upserts)
  - [x] 30 tasks, 31 emails, 106 events, MV refreshada
  - [x] Idempotente vía `fact_event_replay_unique` constraint
- [x] Auth: integración Google SSO en código (login page + callback handler)
  - [x] Server Action `signInWithGoogle` con `hd=urpeailab.com` (restringe dominio en Google)
  - [x] Callback route `/auth/callback` valida dominio post-login y rechaza foráneos
  - [x] `src/proxy.ts` redirige a `/login` cualquier ruta no autenticada
- [—] ~~Parser `PENDIENTES.md` (GitHub) → `fact_event`~~ — **descartado**
  - El pipeline N18 SQLite → Supabase ya cubre la entrada de pendientes. Si en el futuro
    hace falta input manual vía Markdown, se agrega sin bloquear nada.
- [x] Vista lista: filtros server-side (owner, project, status, age) + heatmap de antigüedad
  - [x] `src/features/tasks/queries.ts` (lee de `mv_task_current_state`)
  - [x] Filtros vía URL searchParams + Client Component `task-filters.tsx`
  - [x] Heatmap por color (verde <3d, amarillo 3-7d, rojo ≥7d)
- [x] Sidebar + KPI strip (4 métricas: abiertas, atascadas >7d, p0 activas, response time avg)
  - [x] Layout `(dashboard)/layout.tsx` con redirect server-side si no auth
  - [x] Sidebar 240-280px con nav items y signout

## Fase 2 — Real-time + multi-vista ✅
- [x] Supabase Realtime suscrito a `fact_event` y `dim_task`
  - [x] Migration `enable_realtime` añade tablas a `supabase_realtime` publication
  - [x] `RealtimeProvider` Client Component con `router.refresh()` debounced 250ms
- [x] Kanban drag&drop con `@hello-pangea/dnd`
  - [x] Server Action `setTaskStatus` valida con Zod, escribe via service_role, emite `fact_event`
  - [x] Optimistic UI con `useOptimistic` (React 19)
- [x] Vista calendario por `due_date` (mensual, navegable con `?month=YYYY-MM`)
- [x] Vista grafo dependencias con `@xyflow/react` (agrupada por owner, edges por proyecto)
- [x] Keyboard shortcuts (`g+l/k/c/g/i` para navegar; modifier `g` con timeout 1.5s)

## Fase 3 — AI nativo ✅
- [x] Edge Function `suggest-action` (Claude Opus 4.7) sobre tareas atascadas
  - [x] Deployada en `https://vecspltvmyopwbjzerow.functions.supabase.co/suggest-action`
  - [x] Cron `pg_cron` cada hora (`:15`); soporta `?force=1&limit=N` para test manual
  - [x] Probada: 3 sugerencias generadas, output coherente (`wait`/`ping`/`escalate`)
- [x] Server Action `categorizeTask` (gpt-5.2) manual desde task detail
  - [x] Devuelve `{project_id, priority, category}` con Zod validado
  - [x] Update `dim_task` + emite `fact_event(ai_categorized)`
- [x] Anomaly detection: tiempo respuesta vs p95 histórico (función SQL `analyze_anomalies`)
  - [x] Programada vía pg_cron `:20` cada hora
  - Espera histórico de tasks cerradas para producir output
- [x] Predict completion via avg simple (función SQL `analyze_etas`)
  - [x] Programada vía pg_cron `:25` cada hora
- [x] pgvector + embeddings `text-embedding-3-large` (`halfvec(3072)` + HNSW)
  - [x] Edge Function `batch-embeddings` deployada
  - [x] Cron cada 30min; ya generó embeddings para las 30 tasks existentes
- [—] ~~Embed Gmail thread en panel lateral~~ — diferido (requiere Gmail OAuth scope + setup adicional)
- [x] Botón ping → emite `fact_event(ping)` desde la UI (Server Action `pingTask`)
- [x] Task detail page `/tasks/[id]` con timeline de eventos + sidebar de acciones
- [x] UI: `SuggestionBadge` inline en lista de tareas

## Fase 5 — Integraciones externas (en progreso)

> Cierra los criterios de éxito 2 y 5 del plan original (`docs/plan-del-proyecto.md`):
> "ver lista de TODAS las tareas (50+)" y "click en tarea → thread Gmail completo".
> Cada integración es un **vertical slice** en `src/features/integrations/<source>/` y un
> webhook handler en `src/app/api/webhooks/<source>/route.ts`.

### 5.1 Gmail (CRÍTICO — desbloquea criterio #5 del plan)

Estrategia: Diego (admin) conecta **su propia cuenta Gmail** una sola vez via OAuth dedicado.
El refresh token vive en `dim_person_integration`, encriptado en Vault. Los demás del equipo
no necesitan conectar — solo Diego es el remitente/destinatario en `fact_email`.

- [ ] **Migration `gmail_integration`** — tabla `dim_person_integration(email, provider, refresh_token_secret_id, scopes, watch_history_id, watch_expires_at)`. Refresh token guardado en Vault; la fila guarda solo el secret id.
- [ ] **OAuth flow Gmail** — `/auth/gmail/start` y `/auth/gmail/callback` con scopes `gmail.readonly`, `gmail.send`, `gmail.modify`. Solo Diego (rol admin) puede ejecutarlo.
- [ ] **Gmail watch setup** — Edge Function `gmail-watch-renew` que llama `users.watch` cada 6 días (Google expira los watches a 7 días). Cron diario.
- [ ] **Pub/Sub topic + subscription** — topic `urpe-gmail-events` en Google Cloud, subscription tipo `push` apuntando a `https://urpe-command-center.vercel.app/api/webhooks/gmail`.
- [ ] **Webhook `/api/webhooks/gmail/route.ts`** — valida JWT del token Pub/Sub, decodifica `data` (history_id), llama Gmail API con refresh_token, fetcha mensajes nuevos, parsea, escribe `fact_email` + `fact_event(email_received|email_sent)`.
- [ ] **Vinculación email ↔ task** — heurística:
  1. Si subject contiene `[URPE-XXX-NNN]` → match exacto a `dim_task.id`.
  2. Si `thread_id` ya existe en `fact_email` → mismo `task_id`.
  3. LLM gpt-5.2 con prompt "extrae task_id si lo hay" sobre subject + body (fallback).
- [ ] **Outbox pattern** — tabla `outbox_event` para retries idempotentes si Pub/Sub falla.
- [ ] **UI: thread panel en `/tasks/[id]`** — query `getTaskEmails(taskId)` + componente `EmailThread` que renderiza inbound/outbound como timeline. (Sin iframe Gmail — más limpio renderizar nuestro propio HTML).
- [ ] **Server Action `replyToTask(taskId, body)`** — usa Gmail API `users.messages.send` con `threadId` para responder dentro del thread; emite `fact_event(email_sent)`.
- [ ] **UI: textarea + botón Reply** en task detail con keyboard shortcut `r`.

### 5.2 Google Calendar ✅
- [x] Reusa `dim_person_integration` (provider='calendar') + Vault refresh token.
- [x] OAuth flow soporta `?provider=calendar` (mismo `/auth/google-integrations/{start,callback}`).
- [x] `lib/google/calendar.ts` cliente API (createEvent, deleteEvent).
- [x] Server Actions `linkTaskToCalendar` / `unlinkTaskFromCalendar`.
- [x] Idempotente: chequea `metadata.calendar_event_id` antes de crear; tolera 404/410 al borrar.
- [x] UI: `CalendarLinkButton` en task detail (link/unlink toggle, disabled sin due_date).
- [x] Emit `fact_event(comment)` con `metadata.source=calendar` (kind: linked/unlinked).
- [x] Tracking PostHog `task_calendar_linked`.
- [ ] Sync inverso (poll Calendar→tasks) — diferido, no necesario para MVP.

### 5.3 GitHub webhook ✅
- [x] Webhook `/api/webhooks/github/route.ts` con HMAC SHA-256 verify.
- [x] Eventos manejados: `push`, `pull_request`, `issues`, `ping`.
- [x] Parser regex `URPE-[A-Z]+-[A-Z0-9-]+` (commit message, PR title+body, issue title+body).
- [x] Filter a tasks existentes; emite `fact_event(comment)` con `metadata.source=github`.
- [x] Idempotente vía constraint `fact_event_replay_unique`.
- [x] Deploy en producción: `https://urpe-command-center.vercel.app/api/webhooks/github`.
- [ ] Setup en GitHub (3 min, ver pasos abajo).

### 5.4 Kapso webhook (WhatsApp) — bloqueado por decisión N18
- [x] Webhook `/api/webhooks/kapso/route.ts` con shared-token verify (query+headers).
- [x] Schema Zod permisivo (passthrough) hasta tener payload Kapso real.
- [x] Linker `phone → owner_email` vía `wp_team_humano.telefono` (exact + suffix).
- [x] `resolveTaskFromText` por regex `URPE-XXX-NNN`.
- [x] Emit `fact_event(comment)` con `metadata.source=kapso`, idempotente.
- [x] Helper `lib/phone/normalize.ts`.
- [x] Deploy en producción: `https://urpe-command-center.vercel.app/api/webhooks/kapso`.
- [ ] **Bloqueado**: Diego/N18 debe confirmar source-of-truth de eventos Kapso.
  Opciones: (a) N18 publica a `fact_event`, (b) webhook directo Command Center,
  (c) dual con dedup. Mensaje pendiente a N18 para coordinar.

### 5.5 Observabilidad (Sentry + PostHog)

- [ ] **Sentry**: `@sentry/nextjs` con DSN en env, captura errores de Server Actions, Edge Functions, route handlers.
- [ ] **PostHog**: `posthog-js` (browser) + `posthog-node` (server). Track: page views, task actions (status change, ping, categorize), AI suggestion impressions/clicks.
- [ ] Dashboard PostHog con embudos (login → first task open → first action) y heatmap de uso.

### 5.6 Crear tarea desde UI ✅
- [x] **Server Action `createTask(input)`** — Zod input + insert `dim_task` + emit `fact_event(created)`.
- [x] **Form en Cmd+K** — comando "Nueva tarea" en palette + dialog con shadcn primitives.
- [x] **Keyboard shortcut `c`** — abre el modal directo (event-bus pattern).
- [ ] Auto-categorize on submit (gpt-5.2 sugerir `project_id` y `priority`) — pendiente, opcional.

### Bloqueantes externos

- Diego conecta su Gmail vía OAuth (5.1) → genera refresh_token persistente.
- DNS verificado para Pub/Sub (ya hay para Resend, posiblemente sirve).
- Webhook secrets: `GMAIL_PUBSUB_VERIFICATION_TOKEN`, `GITHUB_WEBHOOK_SECRET`, `KAPSO_WEBHOOK_SECRET`.
- Sentry DSN + PostHog project key.

### Orden sugerido de ataque

1. **5.6** (Crear tarea desde UI) — sin dependencias externas, alto valor inmediato. ~30 min.
2. **5.1** (Gmail) — cierra criterio #5 del plan, el más impactante. ~3-4h.
3. **5.3** (GitHub webhook) — simple, mejora trazabilidad. ~1h.
4. **5.2** (Calendar) — útil pero depende de 5.1 estar funcionando. ~2h.
5. **5.4** (Kapso) — depende de info de Kapso (signature spec, formato del payload). ~1h.
6. **5.5** (Sentry + PostHog) — para cuando haya tráfico real. ~30 min.

---

## Fase 7 — List enhancements (en progreso)

- [x] **Search por texto** (input con shortcut `/`) — `?q=…`, ilike sobre title/description/id
- [x] **Sort por columna** — click en header (ID, Status, Edad, Prio) toggle asc/desc, persistido en URL
- [x] **Conteo por status en filtros** — `getStatusCounts()` agrega `(N)` al lado de cada option
- [x] **Vista "Sin asignar"** — opción extra en filter Owner que matchea `owner_email IS NULL`
- [ ] **Quick action en hover** — mini menú de status sin entrar al detail (diferido)
- [ ] **Densidad compacta toggle** — localStorage + data attribute en `<html>` (diferido)

---

## Fase 6 — Polish del plan original (en progreso)

### 6.1 Vista de agentes IA (N18, Sofía, Mónica, Rocky) — pendiente
Punto de la VISION del plan que estaba sin implementar.

### 6.2 Métricas ingresos URPE IS — pendiente
Bloqueado por decisión Diego sobre fuente de data.

### 6.3 Framer Motion micro-animations ✅
- [x] Lista de tasks con stagger fade-in (`MotionList`, 25ms entre rows, ease cubic-bezier)
- [x] KPI strip con `CountUp` (animación 600ms ease-out)
- [x] Sin animaciones decorativas — solo donde marca transiciones de estado.
  Strategic minimalism del skill.

### 6.4 Offline-first sync ✅
- [x] IndexedDB queue (`lib/offline/queue.ts` con lib `idb`).
- [x] Hook `useOnlineStatus` (escucha `online`/`offline` events).
- [x] Sync worker `flushOfflineQueue` ejecuta Server Actions encoladas.
- [x] Wrappers en Kanban: si offline → encolar; si online + falla → encolar; reintenta auto.
- [x] `OfflineIndicator` en sidebar muestra "Sin conexión · N en cola" / "Sincronizando…".
- [x] Auto-flush al volver online (efecto en mount + cuando `online` cambia).
- No es Replicache full pero cubre el espíritu del plan (sync resiliente sin perder mutaciones).

---

## Fase 4 — PWA + Push + analytics ✅
- [x] Manifest + iconos + Serwist service worker
  - [x] `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx` (auto-generados con ImageResponse)
  - [x] Serwist v9.5 con `cacheOnNavigation` + `reloadOnOnline`
  - [x] Service worker en `src/app/sw.ts` precachea + maneja `push` y `notificationclick`
- [x] Web Push notifications (VAPID)
  - [x] VAPID keys generadas y guardadas en `.env.local`
  - [x] Tabla `push_subscription` con RLS
  - [x] Server Actions `subscribePush` / `unsubscribePush` / `sendPushTo`
  - [x] Toggle UI en sidebar
- [x] Cmd+K command palette
  - [x] shadcn `Command` + `Dialog` con listener Cmd/Ctrl+K
  - [x] Navegación + búsqueda fuzzy de tasks (cmdk)
  - [x] **NL parsing con gpt-5.2** (`parseNlCommand`) cuando query no matchea
- [x] Burn-down chart (Recharts AreaChart, últimos 30 días)
- [x] Heatmap saturación por persona (status × owner_email, intensidad relativa)
- [x] Resúmenes ejecutivos diarios (Claude Opus 4.7)
  - [x] Edge Function `daily-summary` deployada
  - [x] Tabla `daily_summary` con unique constraint por `date_key` (idempotente)
  - [x] Cron pg_cron diario 12:00 UTC (8am EST)
  - [x] **Probada**: 1671 chars de Markdown ejecutivo generado correctamente
  - [x] Email opcional vía Resend (requiere `RESEND_API_KEY`); si no, queda guardado y visible en `/analytics`
- [x] Página `/analytics` muestra resumen + burn-down + heatmap
- [x] Sidebar y keyboard shortcuts ampliados con `g+a` para Analytics
