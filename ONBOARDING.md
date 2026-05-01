# URPE Command Center — Onboarding

> Guía paso a paso para empezar a usar el Command Center. Pensada tanto para humanos del equipo URPE como para agentes IA que necesitan operar el sistema.
>
> **Producción:** https://urpe-command-center.vercel.app
> **Repo:** https://github.com/andreshabla33/urpe-command-center
> **Soporte:** Andres Maldonado (`am@urpeailab.com`) · Diego Urquijo (`dau@urpeailab.com`)

---

## Tabla de contenido

1. [Pre-requisitos](#1-pre-requisitos)
2. [Cómo loguear (humano)](#2-cómo-loguear-humano)
3. [Tour de la interfaz](#3-tour-de-la-interfaz)
4. [Crear tu primera tarea](#4-crear-tu-primera-tarea)
5. [Operar tareas (mover, asignar, comentar)](#5-operar-tareas-mover-asignar-comentar)
6. [Smart Suggestions Bar — sugerencias IA accionables](#6-smart-suggestions-bar--sugerencias-ia-accionables)
7. [Filtros, búsqueda y atajos de teclado](#7-filtros-búsqueda-y-atajos-de-teclado)
8. [Personalización (temas, densidad, sidebar)](#8-personalización-temas-densidad-sidebar)
9. [Mobile y PWA](#9-mobile-y-pwa)
10. [Tokens de API — automatización con scripts y agentes IA](#10-tokens-de-api--automatización-con-scripts-y-agentes-ia)
11. [Ejemplos completos con curl](#11-ejemplos-completos-con-curl)
12. [Troubleshooting](#12-troubleshooting)
13. [Glosario](#13-glosario)

---

## 1. Pre-requisitos

### Para humanos

| Requerimiento | Detalle |
|---|---|
| **Cuenta Google** | Con dominio `@urpeailab.com` o `@urpeintegralservices.co` (otros dominios son rechazados) |
| **Estar en `dim_person`** | Tu email debe estar registrado y `is_active=true`. Si no podés entrar, pedile a Diego o Andres que te activen. |
| **Navegador moderno** | Chrome / Edge / Safari / Firefox versión actual. Para PWA en iOS, Safari obligatorio. |

### Para agentes IA / scripts

| Requerimiento | Detalle |
|---|---|
| **Un humano dueño** | El humano debe estar logueado y crear el Personal Access Token (PAT) desde el dashboard. El agente actúa AS ese humano. |
| **Cliente HTTP** | Cualquier cosa que mande requests con header `Authorization: Bearer ...` — curl, fetch, requests (Python), axios, etc. |
| **Soporte JSON** | Las requests y responses son JSON. |

---

## 2. Cómo loguear (humano)

### Paso 1: abrí la URL

```
https://urpe-command-center.vercel.app
```

### Paso 2: clickeá "Continuar con Google"

Te lleva a la pantalla estándar de Google OAuth.

### Paso 3: elegí tu cuenta `@urpeailab.com` o `@urpeintegralservices.co`

> ⚠️ Si elegís una cuenta personal (gmail.com, etc.), te va a rechazar y volver al login.

### Paso 4: aceptá los permisos

La primera vez Google pide permisos básicos (email + profile). Aceptás una vez y nunca más te lo pregunta.

### Paso 5: redirección automática al dashboard

Si tu email está en `dim_person` con `is_active=true`, vas a la lista de tareas. Si no, vas a ver "Acceso restringido" — pedile a admin que te active.

### Roles y qué ves

| Tu role en `dim_person` | Qué tareas ves |
|---|---|
| `admin` (Diego, Andres M., Jesús) | **Todas las tareas** del ecosistema URPE |
| `liderazgo` (Gigliola, Andres U., etc.) | Todas las tareas |
| `operaciones` / `supervisor` / `comercial` / `asesor` / etc. | **Solo las tuyas** (donde sos `owner_email` o `created_by`) |
| `agent` (N18, NEXUS, etc.) | No loguean por web — usan API con bearer token |

---

## 3. Tour de la interfaz

Después del login, ves esto:

```
┌──────────────────────────────────────────────────────────────────┐
│  URPE / Command Center  ⌘+K  + Nueva tarea (c)                   │
├──────┬───────────────────────────────────────────────────────────┤
│      │  TAREAS                                                    │
│ Lista│  90 tareas · vista lista                                  │
│      │  ┌────────────────────────────────────────────────────┐   │
│ Kanb │  │ ABIERTAS  ATASCADAS  P0 ACTIVAS  AVG RESPONSE       │   │
│      │  │   60         3           2          4.2h            │   │
│ Cale │  └────────────────────────────────────────────────────┘   │
│      │                                                            │
│ Graf │  [✦ AI · 3 sugerencias accionables]                        │
│      │  ┌──┬──┬──┬──┬──┐                                         │
│ Anal │  │  │  │  │  │  │ ← cards con sugerencias                 │
│      │  └──┴──┴──┴──┴──┘                                         │
│ Offi │                                                            │
│      │  /buscar   Owner: Todos   Status: Todos   Antigüedad: ...  │
│ Toke │  ┌────────────────────────────────────────────────────┐   │
│ ─── │   │ ID    Título    Owner    Status    Edad   Prio  AI  │   │
│ Tema│   ├────────────────────────────────────────────────────┤   │
│ Dens│   │ ...                                                  │   │
│ Salir│   └────────────────────────────────────────────────────┘   │
└──────┴───────────────────────────────────────────────────────────┘
```

### Sidebar izquierdo (240px, colapsable)

Tiene 6 destinos navegables (cada uno con atajo `g+letra`):

| Item | Atajo | Qué hace |
|---|---|---|
| Lista | `g+l` | Tabla de todas las tareas (vista por defecto) |
| Kanban | `g+k` | Vista por status, drag-and-drop |
| Calendario | `g+c` | Tareas por `due_date` mensual |
| Grafo | `g+g` | Red de tareas agrupadas por owner |
| Analytics | `g+a` | Burn-down + heatmap saturación + resumen ejecutivo IA |
| Office | `g+o` | Bridge embebido (pixel office de URPE AI Lab) |

### Footer del sidebar

- **Tema**: switch entre Federal (navy + gold, default) y Document (bone + ink, para impresión)
- **Density**: compact / comfortable
- **Push notifications**: activar Web Push para alertas
- **Tokens API**: link a `/settings/tokens` (auto-servicio de PATs)
- **Salir**: logout

### Header de la lista

- **+ Nueva tarea** (botón gold) — atajo `c`
- **Cmd+K** — command palette con NL parser

### KPI strip (4 cards arriba)

Cada card: número grande + sparkline 14 días + delta % vs 7d previos. Métricas:

- **Abiertas**: total de tareas activas
- **Atascadas >7d**: sin actividad >7 días
- **P0 activas**: prioridad crítica abiertas
- **Avg response**: tiempo promedio de respuesta a inbounds

### Smart Suggestions Bar (cuando hay tareas atascadas)

Cards con sugerencias de N18 (Claude Opus 4.7) sobre qué hacer con cada tarea atascada. Cada card tiene 2 botones: **Aplicar** (1-click) y **Descartar**.

---

## 4. Crear tu primera tarea

### 3 maneras de crearla

#### Manera 1: botón "+ Nueva tarea"

Click arriba a la derecha del header.

#### Manera 2: tecla `c`

Apretá `c` desde cualquier vista (cuando no estás en un input). Abre el mismo dialog.

#### Manera 3: Cmd+K → "Nueva tarea"

Abre el command palette, escribí "nueva", enter.

### Llená el dialog

```
┌─────────────────────────────────────────────────┐
│ Nueva tarea                                      │
│                                                  │
│ ID *           Título *                          │
│ [URPE-IS-099]  [Auditar dependencias del repo X] │
│                                                  │
│ Descripción                                      │
│ [Contexto extra opcional...]                     │
│                                                  │
│ Owner *              Prioridad                   │
│ [Felix Lara ▾]       [P2 ▾]                      │
│                                                  │
│ Proyecto             Due date                    │
│ [URPE-IS]            [2026-05-15]                │
│                                                  │
│              [Cancelar]  [Crear tarea]            │
└─────────────────────────────────────────────────┘
```

### Reglas de los campos

| Campo | Reglas |
|---|---|
| **ID** | Obligatorio. Formato `[A-Z][A-Z0-9-]+` (ej. `URPE-IS-099`, `LEGAL-005`, `NIW-2026-12`). Debe ser único — si el ID ya existe, falla. |
| **Título** | Obligatorio. Verbo en infinitivo + objeto concreto. Ej. "Auditar dependencias", "Llamar a Mercedes", "Cerrar I-485 de Pérez". |
| **Descripción** | Opcional. Contexto, links a docs, threads, etc. Markdown soportado. |
| **Owner** | Obligatorio. Selector de personas activas en `dim_person`. La tarea le aparece en su filtro. |
| **Prioridad** | P0 (crítico, alerta), P1 (urgente), P2 (default), P3 (nice-to-have). |
| **Proyecto** | Opcional. Bucket: `URPE-IS`, `NIW`, `SOFIA`, `URPE-AILAB`, `MONICA-DEVELOPER`, etc. |
| **Due date** | Opcional. Si lo ponés, aparece en el Calendario. |

### Click "Crear tarea"

La tarea aparece inmediatamente en la lista (status = `backlog`). Si abrís el detalle, vas a ver:
- Header con el ID + título + status badge
- Badge de origen: `[👤 UI]` (creada manualmente)
- Timeline con un evento `created` (vos, vía dashboard)

---

## 5. Operar tareas (mover, asignar, comentar)

### Cambiar el status

#### En la lista
- Hover sobre la fila → aparece menú `⋯` a la derecha
- Click → quick-status menu → elegí nuevo status
- La tarea cambia inmediatamente, animación suave

#### En kanban (`g+k`)
- Drag-and-drop la card a otra columna
- Optimistic update: cambio se ve instantáneo
- En background se persiste

#### En el detalle (`/tasks/[id]`)
- Panel de Acciones a la derecha
- Botones: "Marcar en curso", "Bloquear", "Escalar", "Marcar respondida", "Cerrar"
- Cada uno emite un `fact_event(status_changed)` correspondiente

### Status canónicos (no inventes otros)

| Status | Cuándo usarlo |
|---|---|
| `backlog` | Tarea nueva, sin trabajar |
| `in_progress` | Owner está activamente trabajando |
| `blocked` | Esperando algo externo (info, decisión, otro stack) |
| `escalated` | Owner pasó la pelota arriba (a Diego, sponsor, supervisor) |
| `responded` | El external party respondió, hay que procesarlo |
| `done` | Cerrada, completa |
| `cancelled` | Ya no aplica, no se va a hacer |

### Reasignar owner

#### En el detalle
Panel de Acciones → "Reasignar" → selector de personas → confirm.

Emite `fact_event(assigned)` y bumpea `updated_at`.

### Comentar

#### En el detalle, scroll hasta abajo
Sección de Comentarios → escribí texto → enter.

Emite `fact_event(comment)` con `metadata.text`. Aparece en el timeline.

### Pingear al owner

#### En el detalle
Panel de Acciones → "Ping owner" → confirm.

Emite `fact_event(ping)` con tu email como actor. Si Gmail está conectado (todavía no — bloqueado por GCP policy), envía un correo recordatorio.

### Escalar

#### En el detalle
Panel de Acciones → "Escalar" → razón → confirm.

Cambia status a `escalated`, notifica a Diego/sponsor, emite evento.

---

## 6. Smart Suggestions Bar — sugerencias IA accionables

### Qué es

Una barra en la lista que muestra hasta 5 cards con sugerencias automáticas de N18 sobre qué hacer con tareas atascadas (≥3 días sin actividad relevante).

### Cómo se generan

Un cron horario (`pg_cron`) corre la Edge Function `suggest-action`:

1. Selecciona top 20 tareas activas (`in_progress | blocked | escalated`) con `age_days >= 3`
2. Para cada una, manda contexto (task + últimos 15 eventos) a Claude Opus 4.7
3. El LLM devuelve JSON: `{action, reason, confidence, ping_recipients?}`
4. Se persiste como `fact_event(ai_suggestion)`
5. Las sugerencias con `action=wait` no se muestran (solo info)

### Acciones disponibles

| Acción | Qué pasa al click "Aplicar" |
|---|---|
| `ping` | Emite `fact_event(ping)` con los recipients que sugirió el LLM |
| `escalate` | Cambia status a `escalated` + emite `fact_event(escalated)` |
| `close` | Cambia status a `done` + emite `fact_event(closed)` |
| `reassign` | Te lleva al detalle de la tarea para que selecciones owner |
| `split` | Te lleva al detalle (creación manual de sub-tareas no auto) |

### Cómo aplicarla

En cada card:

```
┌──────────────────────────────────────┐
│ ✦ PINGEAR OWNER                  92%│
│ URPE-IS-005 · Hacer las visas...     │
│ Felix lleva 5 días sin responder al  │
│ último ping. Re-pingar a vl@ y a     │
│ fl@.                                  │
│ 👤 fl@urpeailab.com         5d       │
│ [Aplicar]   [Descartar]              │
└──────────────────────────────────────┘
```

- **Aplicar** (botón gold): ejecuta inmediatamente la acción del LLM
- **Descartar**: marca como `ai_suggestion_dismissed`, la sugerencia desaparece. Próxima ejecución del cron puede emitir una nueva si la tarea sigue atascada.

### Cómo funciona técnicamente

- `applySuggestion` Server Action emite el `fact_event` correspondiente + UPDATE en `dim_task` cuando aplique + emite `fact_event(ai_suggestion_applied)` para marcar la sugerencia como consumida
- El siguiente render filtra sugerencias con timestamp `applied >= suggestion`, así que no vuelven a aparecer

---

## 7. Filtros, búsqueda y atajos de teclado

### Filtros (parte superior de la lista)

| Filtro | Opciones |
|---|---|
| **Búsqueda** (`/`) | Texto libre que matchea en `title`, `description`, `id` |
| **Owner** | Combobox searchable con todas las personas activas |
| **Status** | 7 status canónicos + "Todos" |
| **Antigüedad** | "Cualquiera", "Más de 1 semana", "Más de 1 mes" |

Los filtros se reflejan en la URL (`?owner=vl@urpeailab.com&status=in_progress`), así que podés bookmarkear vistas.

### Sort

Click en cualquier header de columna (ID / Status / Antigüedad / Prio) → toggle ascendente/descendente.

### Atajos de teclado

| Tecla | Acción |
|---|---|
| `c` | Crear nueva tarea |
| `/` | Focus al buscador |
| `Cmd+K` (Mac) o `Ctrl+K` (Win/Linux) | Command palette |
| `[` | Colapsar / expandir sidebar |
| `g` luego `l` | Ir a Lista |
| `g` luego `k` | Ir a Kanban |
| `g` luego `c` | Ir a Calendario |
| `g` luego `g` | Ir a Grafo |
| `g` luego `a` | Ir a Analytics |
| `g` luego `o` | Ir a Office |
| `Esc` | Cerrar dialogs / modals |

> Los atajos se desactivan automáticamente cuando estás escribiendo en un input/textarea/select. No te van a interferir con tu typing.

### Cmd+K — natural language

Abrí el command palette, podés:

1. **Buscar tareas** por ID/título/owner
2. **Navegar** entre vistas (igual que `g+l`, etc.)
3. **Preguntar a la AI en lenguaje natural** (`Cmd+Enter`):
   - `"tareas de jesús atascadas hace 3 días"` → URL con filtros aplicados
   - `"abrí URPE-IS-024"` → navega al detalle
   - `"muéstrame las P0 sin asignar"` → filtra

GPT-5.2 parsea la query y devuelve un comando `navigate` / `open_task` / `filter`.

---

## 8. Personalización (temas, densidad, sidebar)

### Temas

Click en el icono de tema en el footer del sidebar. Dos opciones:

| Tema | Cuándo usarlo |
|---|---|
| **Federal** (default) | Trabajo diario. Navy + gold, contraste alto, identidad oficial del brandbook. |
| **Document** | Vistas que vas a imprimir o exportar a PDF. Bone + ink + gold accent, alto contraste para papel. |

La preferencia se guarda en `localStorage`, persiste entre sesiones.

### Densidad

| Modo | Qué hace |
|---|---|
| **Comfortable** (default) | Filas con padding generoso, fácil de escanear |
| **Compact** | Filas más densas, ves más en pantalla — útil con 100+ tareas |

### Sidebar colapsable

- Click en `[` arriba del sidebar (o tecla `[`) → colapsa a icon rail (56px)
- En modo colapsado: solo iconos, hover muestra tooltip con label + atajo
- Volver a expandir: mismo botón / tecla

---

## 9. Mobile y PWA

El Command Center es **PWA instalable** en iOS y Android.

### Instalar como app

#### iOS (Safari)
1. Abrí `https://urpe-command-center.vercel.app` en Safari
2. Tap el botón "Compartir" (cuadrado con flecha arriba)
3. Tap "Agregar a pantalla de inicio"
4. Tap "Agregar"

#### Android (Chrome)
1. Abrí la URL en Chrome
2. Menú (3 puntos) → "Instalar app" o "Agregar a pantalla de inicio"
3. Confirmá

Después aparece como una app más en tu home screen, sin barra del navegador.

### Diferencias en mobile

- Sidebar colapsa automáticamente — se abre desde el botón hamburguesa arriba a la izquierda (drawer)
- Kanban hace scroll horizontal entre columnas
- Detalle de tarea se apila vertical (info + acciones + timeline)
- Web Push notifications funcionan si las activás en el footer del sidebar

### Offline-first

Si perdés conexión:
- Las acciones se encolan en IndexedDB local
- Cuando vuelve la conexión, el OfflineIndicator (arriba) sincroniza automáticamente
- Solo aplica para mutaciones simples (status changes, comments). Crear tareas requiere conexión.

---

## 10. Tokens de API — automatización con scripts y agentes IA

Si querés que un script, bot o agente IA opere el dashboard automáticamente (ej. tu agente personal Rocky, NEXUS, Sofia, o cualquier código que escribas), generás un **Personal Access Token (PAT)**.

### Crear un token (paso a paso)

#### Paso 1: andá a `/settings/tokens`

Click en **"Tokens API"** abajo del sidebar (entre "Density" y "Salir").

#### Paso 2: click en "+ Nuevo token"

Abre un dialog.

#### Paso 3: llená los datos

**Nombre** (descriptivo, lo vas a recordar después):
- Ejemplos buenos: `Rocky bot`, `Mi sync N18`, `Triage script`, `Amaterasu`
- Ejemplo malo: `token1`, `test`, `asdfg`

**Scopes** (permisos — tildá solo lo que el token necesita):

| Scope | Qué permite |
|---|---|
| `tasks.read` | Leer la lista y detalle de tareas |
| `tasks.create` | Crear tareas nuevas (`POST /api/v1/tasks`) |
| `tasks.update` | Cambiar status, owner, prioridad de tareas existentes |
| `events.write` | Pingear, comentar, escalar, registrar emails |
| `persons.read` | Leer la lista de personas (para resolver owners) |
| `projects.read` | Leer la lista de proyectos |

Solo aparecen activos los scopes que tu rol permite. Ej. un `asesor` no puede dar `tasks.update` a su token.

**Expira** (cuándo deja de funcionar):
- 30 días (default sugerido para tokens cortos)
- 90 días (default — equilibrio rotación/conveniencia)
- 1 año (para automatizaciones estables)
- Nunca (no recomendado, pero válido)

#### Paso 4: click "Crear token"

Aparece un dialog con el **token plaintext**. Algo así:

```
ede2c884a7f3c2b1...64chars hex...
```

> ⚠️ **Copialo AHORA mismo y guardalo en un password manager** (1Password, Bitwarden, Mac Keychain). Después de cerrar el dialog, **NO lo vas a poder ver de nuevo**. Si lo perdés, tenés que revocar y crear uno nuevo.

#### Paso 5: pegalo en la config de tu agente/script

En tu `.env`, en variable de entorno, en el secret manager de tu hosting, donde sea — el token vive en tu lado.

### Reglas importantes

| Regla | Implicación |
|---|---|
| **El token actúa AS vos** | Cuando tu agente crea una tarea con tu token, en el dashboard aparece "creada por [tu email]". Tu agente no puede hacer cosas que vos no podés hacer. |
| **Visibilidad** | El token ve lo mismo que verías vos. Si sos asesor, el token solo ve tus tareas. Si sos admin, ve todo. |
| **Audit trail** | Cada acción del token deja huella en `fact_event` con `metadata.via_token = <nombre>`. En la lista de tareas aparece un badge `[Bot · API · <token>]` al lado del título. |
| **Si lo filtraste** | Andá a `/settings/tokens`, encontralo por el nombre, click "Revocar". Cualquier script/agente que lo use pierde acceso inmediatamente. |
| **Rotación** | Cada 90 días: generá uno nuevo, actualizalo en tu agente, revocá el viejo. Reduce riesgo de leak. |

### Endpoints disponibles

#### Identidad

```
GET /api/v1/auth/me
```
Devuelve `{identity: {email, role}, token: {name, scopes, expires_at, hash_prefix}}`. Útil para confirmar que el token funciona.

#### Tareas — escritura

```
POST /api/v1/tasks                       (crear)
POST /api/v1/tasks/:id/transitions       (cambiar status)
POST /api/v1/tasks/:id/assignments       (reasignar owner)
POST /api/v1/tasks/:id/comments          (comentar)
POST /api/v1/tasks/:id/pings             (pingear)
POST /api/v1/tasks/:id/escalations       (escalar)
POST /api/v1/tasks/:id/email-events      (email_sent / email_received)
```

#### Tareas — lectura

```
GET /api/v1/tasks?owner=&status=&project=&q=&age=&limit=&offset=
GET /api/v1/tasks/:id
GET /api/v1/tasks/:id/events?since=ISO_DATE
```

#### Reference data

```
GET /api/v1/persons?active=true
GET /api/v1/projects
```

#### Documentación interactiva

| URL | Para qué |
|---|---|
| `/api/v1/docs` | Interfaz visual (Scalar UI) — todos los endpoints, ejemplos, botón "Try it" para probar en vivo |
| `/api/v1/openapi.json` | Spec OpenAPI 3.1 técnico — útil para auto-generar SDKs en cualquier lenguaje |

### Límites

| Límite | Valor | Si lo excedés |
|---|---|---|
| Rate limit | 60 requests/minuto por token | HTTP 429 + header `Retry-After: <seconds>` |
| Body batch máximo | 100 elementos | HTTP 422 validation_failed |
| Token plaintext length | 64 chars hex (32 bytes) | — |
| Expiración mínima | 30 días | — |

### Idempotencia (importante para scripts)

Para POSTs, si querés evitar duplicar acciones por timeouts/retries, agregá un header `Idempotency-Key` con un UUID v4 único por operación lógica:

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{...}' \
  https://urpe-command-center.vercel.app/api/v1/tasks
```

Si reintentás con la misma key + mismo body → recibís la respuesta cached (sin duplicar). Si reintentás con misma key + body distinto → 409 conflict. TTL de 24 horas.

---

## 11. Ejemplos completos con curl

### Ejemplo 1: verificar que el token funciona

```bash
TOKEN="tu_token_aqui"

curl -H "Authorization: Bearer $TOKEN" \
  https://urpe-command-center.vercel.app/api/v1/auth/me
```

**Response esperada:**

```json
{
  "ok": true,
  "identity": {
    "email": "am@urpeailab.com",
    "full_name": "Andres Maldonado",
    "role": "admin"
  },
  "token": {
    "name": "Amaterasu",
    "scopes": ["tasks.read", "tasks.create", "tasks.update", "events.write", "persons.read", "projects.read"],
    "expires_at": "2026-08-01T00:00:00.000Z",
    "hash_prefix": "ede2c884"
  }
}
```

### Ejemplo 2: crear una tarea

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "id": "URPE-IS-200",
    "title": "Auditar dependencias del repo niw-generator",
    "description": "Revisar versiones de las deps críticas + lockfile drift",
    "owner_email": "fl@urpeailab.com",
    "priority": "p2",
    "project_id": "URPE-IS",
    "metadata": {
      "source_thread": "https://github.com/...",
      "estimated_hours": 4
    }
  }' \
  https://urpe-command-center.vercel.app/api/v1/tasks
```

**Response (201):**

```json
{
  "ok": true,
  "task": {
    "id": "URPE-IS-200",
    "title": "Auditar dependencias del repo niw-generator",
    "owner_email": "fl@urpeailab.com",
    "status": "backlog",
    "priority": "p2"
  },
  "event_id": "uuid-del-evento"
}
```

### Ejemplo 3: cambiar el status de una tarea

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "status": "in_progress",
    "reason": "Felix arrancó la auditoría hoy AM"
  }' \
  https://urpe-command-center.vercel.app/api/v1/tasks/URPE-IS-200/transitions
```

### Ejemplo 4: comentar en una tarea

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "text": "Encontré 3 deps con CVE críticas: react-flow@10, axios@0.21, lodash@4.17.20. Recomiendo bump inmediato."
  }' \
  https://urpe-command-center.vercel.app/api/v1/tasks/URPE-IS-200/comments
```

### Ejemplo 5: pingear al owner

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": ["fl@urpeailab.com"],
    "message": "Felix, recordatorio de la auditoría. Necesitamos cerrar antes del viernes."
  }' \
  https://urpe-command-center.vercel.app/api/v1/tasks/URPE-IS-200/pings
```

### Ejemplo 6: listar tareas con filtros

```bash
# Todas las tareas P0 abiertas
curl -H "Authorization: Bearer $TOKEN" \
  "https://urpe-command-center.vercel.app/api/v1/tasks?status=in_progress&limit=100"

# Tareas de Felix atascadas hace más de 7 días
curl -H "Authorization: Bearer $TOKEN" \
  "https://urpe-command-center.vercel.app/api/v1/tasks?owner=fl@urpeailab.com&age=7d"

# Búsqueda libre por keyword
curl -H "Authorization: Bearer $TOKEN" \
  "https://urpe-command-center.vercel.app/api/v1/tasks?q=visa"
```

### Ejemplo 7: ver el timeline completo de una tarea

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://urpe-command-center.vercel.app/api/v1/tasks/URPE-IS-200/events
```

**Response:**

```json
{
  "ok": true,
  "data": [
    {
      "id": 12345,
      "task_id": "URPE-IS-200",
      "event_type": "comment",
      "actor_email": "am@urpeailab.com",
      "timestamp": "2026-05-01T14:30:00Z",
      "metadata": { "text": "Encontré 3 deps...", "via_token": "Amaterasu" }
    },
    {
      "id": 12340,
      "task_id": "URPE-IS-200",
      "event_type": "status_changed",
      "actor_email": "am@urpeailab.com",
      "timestamp": "2026-05-01T13:00:00Z",
      "metadata": { "to": "in_progress", "via_token": "Amaterasu" }
    },
    {
      "id": 12330,
      "task_id": "URPE-IS-200",
      "event_type": "created",
      "actor_email": "am@urpeailab.com",
      "timestamp": "2026-05-01T12:00:00Z",
      "metadata": { "via_token": "Amaterasu", "source": "api_v1" }
    }
  ]
}
```

### Ejemplo 8: TypeScript / Node.js client

```typescript
const BASE = "https://urpe-command-center.vercel.app/api/v1";
const TOKEN = process.env.URPE_TOKEN!;

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API ${method} ${path} → ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Verificar identidad
const me = await api<{ identity: { email: string } }>("GET", "/auth/me");
console.log(`Acting as: ${me.identity.email}`);

// Crear tarea
await api("POST", "/tasks", {
  id: "URPE-IS-201",
  title: "Mi tarea creada vía SDK",
  owner_email: "fl@urpeailab.com",
});

// Cambiar status
await api("POST", "/tasks/URPE-IS-201/transitions", {
  status: "in_progress",
  reason: "Empezando ahora",
});
```

### Ejemplo 9: Python client

```python
import os
import uuid
import requests

BASE = "https://urpe-command-center.vercel.app/api/v1"
TOKEN = os.environ["URPE_TOKEN"]

def api(method, path, body=None):
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    }
    if method == "POST":
        headers["Idempotency-Key"] = str(uuid.uuid4())
    res = requests.request(method, f"{BASE}{path}", json=body, headers=headers)
    res.raise_for_status()
    return res.json()

# Verificar identidad
me = api("GET", "/auth/me")
print(f"Acting as: {me['identity']['email']}")

# Crear tarea
api("POST", "/tasks", {
    "id": "URPE-IS-202",
    "title": "Tarea desde Python",
    "owner_email": "fl@urpeailab.com",
})

# Listar todas las P0 abiertas
tasks = api("GET", "/tasks?priority=p0&status=in_progress")
for t in tasks["data"]:
    print(f"{t['id']}: {t['title']}")
```

---

## 12. Troubleshooting

### "No puedo loguear"

| Síntoma | Causa probable | Solución |
|---|---|---|
| Google OAuth me da error | Cuenta no es `@urpeailab.com` ni `@urpeintegralservices.co` | Usá tu cuenta corporativa |
| Veo "Acceso restringido" después de loguear | Tu email no está en `dim_person` o `is_active=false` | Pedile a Diego / Andres que te activen |
| Pantalla en blanco después de login | Caché del browser | Hard-refresh (`Cmd+Shift+R`) o usar incógnito |

### "El token no funciona"

| Error | Causa | Solución |
|---|---|---|
| `401 unauthorized` | Token mal copiado, expirado, o revocado | Andá a `/settings/tokens`, verificá estado, regenerá si es necesario |
| `403 forbidden` | Token no tiene el scope necesario para esa acción | Crear un token nuevo con el scope correcto |
| `429 rate_limit_exceeded` | Más de 60 requests/min | Esperá `Retry-After` segundos |
| `409 conflict` (al crear tarea) | El ID ya existe en `dim_task` | Usá un ID diferente |
| `409 conflict` (con Idempotency-Key) | Reusaste la misma key con body distinto | Usá un UUID nuevo por operación |
| `422 invalid_input` | El body no cumple el schema Zod | Mirá la respuesta `details[]` para ver qué campo falló |

### "No veo mis tareas"

| Síntoma | Causa probable | Solución |
|---|---|---|
| Lista vacía pero sé que tengo tareas | Tu role no es admin/liderazgo y no sos owner ni created_by | Pedí a admin que te asigne owner_email en las tareas relevantes |
| Las tareas que creé no aparecen | El sync de N18 las marcó como cancelled | Mirá metadata `consolidated_into` o `cancelled_by` |
| Filtro Owner no muestra a alguien | Esa persona tiene `is_active=false` | Pedí que la activen en `dim_person` |

### "Las acciones de mi agente no aparecen en la UI"

| Causa | Solución |
|---|---|
| `fact_event(replay_unique)` constraint dedupó tu acción (mismo task+type+timestamp+actor) | Agregá variabilidad al timestamp o cambiá los datos |
| Tu agente está hitting el endpoint correcto pero no autenticado | Mirá la response del endpoint — debería devolver 401/403 si auth está mal |
| El cron de refresh-mv todavía no corrió | Esperá 60 segundos — la materialized view se refresca cada minuto |
| El endpoint devuelve 201 pero la tarea no aparece | Verificá que `owner_email` exista en `dim_person`. Si no, FK constraint silenciosa puede bloquear |

### "Mi PWA no funciona offline"

| Síntoma | Causa | Solución |
|---|---|---|
| Indicador "sin conexión" no desaparece | Service worker desactualizado | Cerrá la app, abrila de nuevo |
| Cambios no se sincronizan | OfflineIndicator muestra "X en cola" | Esperá a que el indicador desaparezca |
| Push notifications no llegan | VAPID keys no configuradas en preview | Solo funcionan en production |

---

## 13. Glosario

| Término | Definición |
|---|---|
| **dim_task** | Tabla principal de tareas en Postgres. Estado actual canónico. |
| **fact_event** | Tabla append-only de eventos. Toda mutación queda registrada acá. |
| **mv_task_current_state** | Vista materializada que la UI consume. Refrescada cada minuto. |
| **dim_person** | Tabla de personas (humanos + agentes IA). Roles, emails, estado activo. |
| **PAT (Personal Access Token)** | Token bearer que generás en `/settings/tokens` para automatizar el dashboard. Actúa AS vos. |
| **Scope** | Permiso atómico de un token. Ej. `tasks.read`, `events.write`. |
| **Owner** | La persona responsable de una tarea (`owner_email`). |
| **N18** | Agente IA principal del ecosistema URPE. Vive en la Mac de Diego. Cron diario, sync de PENDIENTES.md, sugerencias accionables. Modelo: Claude Opus 4.7. |
| **Bridge** | Infraestructura inter-agente donde viven N18, NEXUS, Sofia, Rocky, Loki. |
| **Idempotency-Key** | Header opcional con UUID. Garantiza que reintentos no dupliquen acciones. |
| **fact_event(created)** | Evento que se emite cuando se crea una tarea. Su metadata indica el origen (UI / API / cron / webhook). |
| **Smart Suggestions Bar** | Cards con sugerencias N18 sobre tareas atascadas, accionables con 1 click. |
| **Brandbook** | Documento `brandbook/brandbook.pdf` con la identidad visual federal del Command Center. Vinculante. |
| **Federal theme** | Tema visual default del dashboard. Navy + gold + Cinzel. |
| **Document theme** | Tema secundario para vistas que se imprimen. Bone + ink + gold. |

---

## Soporte

- **Issues técnicos**: pingueá a Andres Maldonado (`am@urpeailab.com`) en Slack o creá una tarea con prefijo `URPE-CC-` y owner `am@`.
- **Decisiones de scope / nuevos features**: Diego Urquijo (`dau@urpeailab.com`).
- **Documentación adicional**: leé `LEEME.md` para más contexto técnico y `brandbook/brandbook.pdf` para la identidad visual.

---

*Documento mantenido por Andres Maldonado + Claude. Última actualización: 2026-05-01. Cuando agregues una funcionalidad nueva al dashboard, actualizá este archivo en el mismo PR.*
