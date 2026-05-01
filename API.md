# URPE Command Center · API v1 — Documentación

> Reference completo de la Public API para automatizar el Command Center desde scripts, bots y agentes IA.
>
> **Versión:** `1.0.0`
> **Producción:** `https://urpe-command-center.vercel.app`
> **Spec OpenAPI:** [`/api/v1/openapi.json`](https://urpe-command-center.vercel.app/api/v1/openapi.json) — para auto-generar SDKs
> **Docs interactivas (Scalar UI):** [`/api/v1/docs`](https://urpe-command-center.vercel.app/api/v1/docs) — para probar en vivo
> **Contacto:** `dau@urpeailab.com`

---

## Tabla de contenido

- [Conceptos generales](#conceptos-generales)
  - [Autenticación](#autenticación)
  - [Idempotencia](#idempotencia)
  - [Rate limiting](#rate-limiting)
  - [Auditoría](#auditoría)
  - [Visibilidad por rol](#visibilidad-por-rol)
- [Convenciones de respuesta](#convenciones-de-respuesta)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Tasks (lectura)](#tasks-lectura)
  - [Tasks (escritura)](#tasks-escritura)
  - [Tasks · Events](#tasks--events)
  - [Reference](#reference)
- [Schemas](#schemas)
- [Códigos de error](#códigos-de-error)
- [Ejemplos completos](#ejemplos-completos)
- [Generación de SDKs](#generación-de-sdks)

---

## Conceptos generales

### Autenticación

Cada request debe incluir un **Personal Access Token (PAT)** en el header:

```http
Authorization: Bearer <token>
```

Los tokens se generan desde el dashboard en [`/settings/tokens`](https://urpe-command-center.vercel.app/settings/tokens).

**Reglas clave:**

- Cada token **actúa AS el usuario** que lo emitió. Cuando tu script crea una tarea, en el dashboard aparece "creada por [tu email]".
- Los **scopes están pre-acotados por tu rol**. Un `asesor` no puede otorgar `tasks.update`, por ejemplo.
- El **role se resuelve en vivo** en cada request. Si fuiste degradado, los scopes efectivos se reducen al intersect.
- El token **se hashea** (SHA-256) en DB. El plaintext solo se ve UNA vez al crearlo.
- **Revoke instantáneo** desde la UI. Cualquier script que lo use pierde acceso al instante.

#### Scopes disponibles

| Scope | Permite |
|---|---|
| `tasks.read` | `GET /tasks`, `/tasks/:id`, `/tasks/:id/events` |
| `tasks.create` | `POST /tasks` |
| `tasks.update` | `POST /tasks/:id/transitions`, `/assignments` |
| `events.write` | `POST /tasks/:id/comments`, `/pings`, `/escalations`, `/email-events` |
| `persons.read` | `GET /persons` |
| `projects.read` | `GET /projects` |

### Idempotencia

Para todos los `POST`, se recomienda incluir un `Idempotency-Key` único (UUID v4) por operación lógica:

```http
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

**Comportamiento:**

| Caso | Respuesta |
|---|---|
| Primera request con esa key | Procesa normal, guarda response cached por 24h |
| Reintento con misma key + mismo body | `200` con la respuesta cached (no duplica acción) |
| Reintento con misma key + body distinto | `409 conflict` |

Sin `Idempotency-Key`, los reintentos duplican acciones (excepto cuando el constraint `fact_event_replay_unique` los dedupa naturalmente).

### Rate limiting

**60 requests por minuto por token**, sliding window.

Si lo excedés, recibís `429`:

```json
{
  "ok": false,
  "error": "rate_limit_exceeded",
  "retry_after_seconds": 23
}
```

Header de respuesta: `Retry-After: 23` — segundos hasta el próximo bucket.

### Auditoría

Cada acción genera un `fact_event` (append-only) con metadata estándar:

```json
{
  "actor_email": "am@urpeailab.com",
  "metadata": {
    "source": "api_v1",
    "via_token": "Amaterasu",
    "token_hash_prefix": "ede2c884"
  }
}
```

- `actor_email` = dueño del token (consistencia con UI)
- `metadata.via_token` = nombre amigable del token
- `metadata.token_hash_prefix` = primeros 8 chars del hash (correlación con `dim_user_token`)
- `metadata.source = "api_v1"` (distingue de UI / cron / webhook)

En el dashboard, el timeline de cada tarea muestra "vía API: \<token\>" para identificar acciones automatizadas.

### Visibilidad por rol

`GET /tasks` devuelve un subset filtrado según el role del usuario que emitió el token:

| Role | Tareas visibles |
|---|---|
| `admin`, `liderazgo` | **Todas** las tareas del sistema |
| Cualquier otro role | Solo tareas donde `owner_email = user OR created_by = user` |

El filtro se aplica server-side. No podés bypasear con query params.

---

## Convenciones de respuesta

### Estructura general

Todas las responses siguen la forma:

```json
{
  "ok": true | false,
  ...payload o detalles del error
}
```

### Headers convencionales

Cada response autenticada incluye headers para correlación y auditoría:

| Header | Valor |
|---|---|
| `X-Acting-As` | Email del owner del token |
| `X-Token-Name` | Nombre amigable del token |
| `X-Token-Hash-Prefix` | Primeros 8 chars del hash |

### Códigos HTTP

| Código | Significado |
|---|---|
| `200` | OK / replay deduplicado |
| `201` | Created (nuevo recurso o evento) |
| `400` | JSON inválido |
| `401` | Token bearer faltante o inválido |
| `403` | Token sin scope requerido |
| `404` | Recurso no existe o sin acceso |
| `409` | Conflict (ID duplicado, idempotency key reutilizada) |
| `422` | Body no cumple schema Zod (`details[]` con issues) |
| `429` | Rate limit excedido |
| `500` | Server error inesperado |
| `503` | Endpoint no configurado (env var faltante) |

---

## Endpoints

### Auth

#### `GET /api/v1/auth/me`

Introspect del token actual. Devuelve la identidad del usuario, scopes del token y metadata. **Sin rate limit** — útil para health check.

**Response 200:**

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

**Errors:** `401` si token inválido.

---

### Tasks (lectura)

#### `GET /api/v1/tasks`

Lista tareas con filtros. Visibilidad respeta el role del usuario.

**Required scope:** `tasks.read`

**Query params:**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `owner` | email | — | Filtra por `owner_email` exacto |
| `status` | enum | — | `backlog` / `in_progress` / `blocked` / `escalated` / `responded` / `done` / `cancelled` |
| `project` | string | — | Filtra por `project_id` |
| `q` | string | — | Búsqueda libre en `title`, `description`, `id` (ILIKE) |
| `age` | enum | — | `7d` (≥7 días) / `30d` (≥30 días) |
| `limit` | int | `50` | Max 200 |
| `offset` | int | `0` | Para paginación |

**Response 200:**

```json
{
  "ok": true,
  "data": [
    {
      "id": "URPE-IS-099",
      "title": "Auditar dependencias",
      "description": "...",
      "owner_email": "fl@urpeailab.com",
      "created_by": "am@urpeailab.com",
      "created_at": "2026-05-01T12:00:00.000Z",
      "updated_at": "2026-05-01T13:00:00.000Z",
      "due_date": "2026-05-15T00:00:00.000Z",
      "status": "in_progress",
      "priority": "p2",
      "project_id": "URPE-IS",
      "metadata": { "source": "api_v1" },
      "age_days": 0.04,
      "event_count": 3,
      "last_event_at": "2026-05-01T13:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 50,
    "offset": 0
  }
}
```

**Errors:** `401`, `403`, `429`.

---

#### `GET /api/v1/tasks/{id}`

Detalle de una tarea por ID.

**Required scope:** `tasks.read`

**Path:** `id` — ej. `URPE-IS-099`

**Response 200:**

```json
{
  "ok": true,
  "data": { ... mismo shape que en list ... }
}
```

**Errors:** `401`, `404` (tarea no existe o sin visibilidad).

---

#### `GET /api/v1/tasks/{id}/events`

Timeline de eventos (`fact_event`) de una tarea, en orden cronológico inverso (más recientes primero). Útil para reconstruir la historia.

**Required scope:** `tasks.read`

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `since` | ISO date-time | Solo eventos posteriores a este timestamp |

**Response 200:**

```json
{
  "ok": true,
  "data": [
    {
      "id": 12345,
      "event_id": "uuid-v4",
      "task_id": "URPE-IS-099",
      "event_type": "comment",
      "actor_email": "am@urpeailab.com",
      "timestamp": "2026-05-01T14:30:00.000Z",
      "metadata": {
        "text": "Encontré 3 deps con CVE...",
        "via_token": "Amaterasu",
        "source": "api_v1"
      }
    }
  ]
}
```

**Errors:** `401`, `404`.

---

### Tasks (escritura)

#### `POST /api/v1/tasks`

Crea una tarea nueva y emite `fact_event(created)`.

**Required scope:** `tasks.create`

**Headers:**

| Header | Required | Descripción |
|---|---|---|
| `Authorization` | ✅ | `Bearer <token>` |
| `Content-Type` | ✅ | `application/json` |
| `Idempotency-Key` | recomendado | UUID v4 |

**Request body:**

```json
{
  "id": "URPE-IS-099",
  "title": "Auditar dependencias del repo X",
  "description": "Contexto extra opcional",
  "owner_email": "fl@urpeailab.com",
  "priority": "p2",
  "project_id": "URPE-IS",
  "due_date": "2026-05-15T00:00:00.000Z",
  "metadata": {
    "source_thread": "https://github.com/...",
    "estimated_hours": 4
  }
}
```

**Field constraints:**

| Field | Tipo | Required | Reglas |
|---|---|---|---|
| `id` | string | ✅ | Pattern `^[A-Z][A-Z0-9-]+$`, único, max 100 |
| `title` | string | ✅ | 1–500 chars |
| `description` | string | — | max 10000 |
| `owner_email` | email | ✅ | Debe existir en `dim_person` con `is_active=true` |
| `priority` | enum | — | `p0`/`p1`/`p2`/`p3`, default `p2` |
| `project_id` | string | — | max 100 |
| `due_date` | ISO date-time | — | — |
| `metadata` | object | — | Arbitrary JSON |

**Response 201:**

```json
{
  "ok": true,
  "task": {
    "id": "URPE-IS-099",
    "title": "Auditar dependencias del repo X",
    "owner_email": "fl@urpeailab.com",
    "status": "backlog",
    "priority": "p2"
  },
  "event_id": "uuid-del-fact-event"
}
```

**Errors:** `400` (JSON inválido), `401`, `403`, `409` (ID duplicado o Idempotency-Key reutilizada con body distinto), `422` (validation), `429`.

---

### Tasks · Events

Los siguientes endpoints emiten un `fact_event` específico sobre una tarea existente. Todos:

- Requieren bearer + scope correspondiente
- Recomiendan `Idempotency-Key` para retries seguros
- Devuelven `201` si nuevo, `200` con `deduped: true` si replay

**Response common shape:**

```json
{
  "ok": true,
  "deduped": false,
  "event_id": "uuid-del-fact-event"
}
```

---

#### `POST /api/v1/tasks/{id}/transitions`

Cambia el status de una tarea. Emite `fact_event(status_changed)` + UPDATE en `dim_task`.

**Required scope:** `tasks.update`

**Body:**

```json
{
  "status": "in_progress",
  "reason": "Felix arrancó la auditoría hoy"
}
```

| Field | Required | Reglas |
|---|---|---|
| `status` | ✅ | enum status canónicos |
| `reason` | — | string, max 500 |

**Errors:** `404` si tarea no existe.

---

#### `POST /api/v1/tasks/{id}/assignments`

Reasigna el owner de una tarea. Emite `fact_event(assigned)` + UPDATE.

**Required scope:** `tasks.update`

**Body:**

```json
{
  "owner_email": "vl@urpeailab.com",
  "reason": "Felix reasignó a Luis por carga"
}
```

| Field | Required | Reglas |
|---|---|---|
| `owner_email` | ✅ | email válido en `dim_person` |
| `reason` | — | string, max 500 |

---

#### `POST /api/v1/tasks/{id}/comments`

Agrega un comentario a la tarea. Emite `fact_event(comment)`.

**Required scope:** `events.write`

**Body:**

```json
{
  "text": "Encontré 3 deps con CVE críticas: react-flow@10, axios@0.21, lodash@4.17.20",
  "metadata": {
    "attachment_url": "https://..."
  }
}
```

| Field | Required | Reglas |
|---|---|---|
| `text` | ✅ | string, 1–10000 |
| `metadata` | — | object arbitrario |

---

#### `POST /api/v1/tasks/{id}/pings`

Registra un ping al owner (recordatorio). Emite `fact_event(ping)`.

**Required scope:** `events.write`

**Body:**

```json
{
  "recipients": ["fl@urpeailab.com"],
  "message": "Felix, recordatorio de la auditoría. Necesitamos cerrar antes del viernes.",
  "metadata": {
    "channel": "slack",
    "sent_via": "Slack webhook"
  }
}
```

| Field | Required | Reglas |
|---|---|---|
| `recipients` | — | array de emails, max 10, default `[]` |
| `message` | — | string, max 1000 |
| `metadata` | — | object |

---

#### `POST /api/v1/tasks/{id}/escalations`

Escala una tarea. Emite `fact_event(escalated)` + UPDATE status a `escalated` (si no estaba ya).

**Required scope:** `events.write`

**Body:**

```json
{
  "level": "n2",
  "reason": "Owner sin respuesta hace 5 días, tema bloqueante para release",
  "metadata": {
    "escalated_to": "dau@urpeailab.com"
  }
}
```

| Field | Required | Reglas |
|---|---|---|
| `level` | — | `n1` / `n2` / `n3` |
| `reason` | ✅ | string, 1–500 |
| `metadata` | — | object |

---

#### `POST /api/v1/tasks/{id}/email-events`

Registra un email enviado o recibido vinculado a la tarea. Emite `fact_event(email_sent)` o `fact_event(email_received)`.

**Required scope:** `events.write`

**Body:**

```json
{
  "direction": "received",
  "msg_id": "<message-id-de-gmail>",
  "from": "cliente@external.com",
  "to": ["fl@urpeailab.com"],
  "subject": "Re: Visa renewal status",
  "snippet": "Hola Felix, gracias por la actualización...",
  "is_response": true,
  "metadata": {
    "thread_id": "thread-abc"
  }
}
```

| Field | Required | Reglas |
|---|---|---|
| `direction` | ✅ | `sent` / `received` |
| `msg_id` | ✅ | string, max 500 |
| `from` | — | email |
| `to` | — | array de emails, max 50 |
| `subject` | — | string, max 1000 |
| `snippet` | — | string, max 2000 |
| `is_response` | — | boolean, default `false` |
| `metadata` | — | object |

> Nota: si `is_response=true` y `direction=received`, el trigger reactivo `project_event_to_task` cambia automáticamente el status a `responded`.

---

### Reference

#### `GET /api/v1/persons`

Lista personas (humanos + agentes IA) registradas en `dim_person`.

**Required scope:** `persons.read`

**Query params:**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `active` | boolean | `true` | Si `true`, solo `is_active=true` |

**Response 200:**

```json
{
  "ok": true,
  "data": [
    {
      "email": "am@urpeailab.com",
      "full_name": "Andres Maldonado",
      "role": "admin",
      "is_active": true,
      "agent_id": null
    },
    {
      "email": "n18@urpeailab.com",
      "full_name": "N18 (Numero Dieciocho)",
      "role": "agent",
      "is_active": true,
      "agent_id": "n18"
    }
  ]
}
```

---

#### `GET /api/v1/projects`

Lista proyectos del catálogo.

**Required scope:** `projects.read`

**Response 200:**

```json
{
  "ok": true,
  "data": [
    {
      "id": "URPE-IS",
      "name": "URPE Integral Services",
      "parent_id": null,
      "color": "#0ea5e9"
    },
    {
      "id": "NIW",
      "name": "EB-2 NIW visas",
      "parent_id": "URPE-IS",
      "color": null
    }
  ]
}
```

---

## Schemas

### Task

```typescript
type Task = {
  id: string;                              // "URPE-IS-099"
  title: string;
  description: string | null;
  owner_email: string | null;              // email
  created_by: string | null;
  created_at: string;                      // ISO 8601
  updated_at: string;
  due_date: string | null;
  status: "backlog" | "in_progress" | "blocked" | "escalated" | "responded" | "done" | "cancelled";
  priority: "p0" | "p1" | "p2" | "p3";
  project_id: string | null;
  metadata: Record<string, unknown>;
  age_days: number | null;                 // float, días desde created_at
  event_count: number | null;              // total fact_events
  last_event_at: string | null;
};
```

### Person

```typescript
type Person = {
  email: string;
  full_name: string | null;
  role: "admin" | "asesor" | "supervisor" | "administrativo" | "comercial"
      | "dueño" | "liderazgo" | "operaciones" | "marketing" | "rrhh"
      | "agent" | "n/a";
  is_active: boolean;
  agent_id: string | null;                 // populated solo si es agente IA
};
```

### Project

```typescript
type Project = {
  id: string;
  name: string | null;
  parent_id: string | null;
  color: string | null;
};
```

### FactEvent

```typescript
type FactEvent = {
  id: number;
  event_id: string;                        // UUID v4
  task_id: string | null;
  event_type:
    | "created" | "assigned" | "email_sent" | "email_received"
    | "comment" | "escalated" | "status_changed" | "closed"
    | "n1_sent" | "n2_sent" | "n3_sent" | "ping" | "corrected"
    | "ai_suggestion" | "ai_categorized" | "ai_anomaly" | "ai_eta"
    | "ai_suggestion_applied" | "ai_suggestion_dismissed";
  actor_email: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
};
```

### EventResponse (write endpoints)

```typescript
type EventResponse = {
  ok: true;
  deduped: boolean;
  event_id: string | null;
};
```

### ErrorResponse

```typescript
type ErrorResponse = {
  ok: false;
  error: string;                           // machine-readable error code
  message: string;                         // human-readable
  details?: unknown;                       // array de Zod issues si validation_failed
  required_scopes?: string[];              // si error=forbidden
  retry_after_seconds?: number;            // si error=rate_limit_exceeded
};
```

---

## Códigos de error

### Tabla de errores comunes

| Status | Error code | Causa | Solución |
|---|---|---|---|
| `400` | `validation_failed` | JSON inválido | Verificar sintaxis JSON |
| `401` | `unauthorized` | Token bearer faltante, mal formateado, expirado o revocado | Verificar token, regenerar si es necesario |
| `403` | `forbidden` | Token sin el scope requerido | Crear token nuevo con scope correcto |
| `404` | `not_found` | Recurso no existe o sin visibilidad por rol | Verificar ID, role permissions |
| `409` | `conflict` | ID duplicado al crear, o Idempotency-Key reutilizada con body distinto | Usar ID nuevo o regenerar UUID |
| `422` | `validation_failed` | Body no cumple Zod schema | Revisar `details[]` con issues |
| `429` | `rate_limit_exceeded` | >60 req/min por token | Esperar `retry_after_seconds` |
| `500` | `server_error` | Bug del servidor o DB error | Reportar a Andres con `X-Request-Id` |
| `503` | `endpoint_not_configured` | Env var faltante (raro en producción) | Avisar al admin |

### Ejemplo de error 422 con details

```json
{
  "ok": false,
  "error": "validation_failed",
  "message": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["title"],
      "message": "Required"
    },
    {
      "code": "invalid_string",
      "validation": "email",
      "path": ["owner_email"],
      "message": "Invalid email"
    }
  ]
}
```

---

## Ejemplos completos

### Flujo completo: agente Rocky de Agustin Peralta

```bash
# 1. Configurar bearer en variable de entorno
export URPE_TOKEN="ede2c884a7f3..."
export BASE="https://urpe-command-center.vercel.app/api/v1"

# 2. Verificar identidad y scopes (health check)
curl -s -H "Authorization: Bearer $URPE_TOKEN" $BASE/auth/me | jq .

# 3. Listar tareas P0 abiertas asignadas a Agustin
curl -s -H "Authorization: Bearer $URPE_TOKEN" \
  "$BASE/tasks?owner=apg@urpeailab.com&status=in_progress" | jq '.data[]|.id+": "+.title'

# 4. Crear tarea nueva (con idempotency)
curl -X POST \
  -H "Authorization: Bearer $URPE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "id": "URPE-IS-300",
    "title": "Auditoría externa Q2",
    "owner_email": "apg@urpeailab.com",
    "priority": "p1",
    "project_id": "URPE-IS"
  }' \
  $BASE/tasks

# 5. Cambiar status
curl -X POST \
  -H "Authorization: Bearer $URPE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"status": "in_progress", "reason": "Iniciando auditoría"}' \
  $BASE/tasks/URPE-IS-300/transitions

# 6. Comentar
curl -X POST \
  -H "Authorization: Bearer $URPE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"text": "Recolectando dependencias..."}' \
  $BASE/tasks/URPE-IS-300/comments

# 7. Ver timeline completo
curl -s -H "Authorization: Bearer $URPE_TOKEN" \
  $BASE/tasks/URPE-IS-300/events | jq '.data[]|{type:.event_type,when:.timestamp}'
```

### TypeScript SDK minimalista

```typescript
const BASE = "https://urpe-command-center.vercel.app/api/v1";
const TOKEN = process.env.URPE_TOKEN!;

class UrpeClient {
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    };
    if (method === "POST") {
      headers["Idempotency-Key"] = crypto.randomUUID();
    }
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`${method} ${path} → ${res.status}: ${err.error} ${err.message}`);
    }
    return res.json();
  }

  me() {
    return this.request<{ identity: { email: string; role: string } }>("GET", "/auth/me");
  }

  listTasks(filters: { owner?: string; status?: string; q?: string } = {}) {
    const qs = new URLSearchParams(filters as Record<string, string>).toString();
    return this.request<{ data: any[]; pagination: any }>("GET", `/tasks?${qs}`);
  }

  createTask(body: {
    id: string;
    title: string;
    owner_email: string;
    priority?: string;
    project_id?: string;
  }) {
    return this.request<{ task: any; event_id: string }>("POST", "/tasks", body);
  }

  transitionTask(id: string, status: string, reason?: string) {
    return this.request<{ event_id: string }>("POST", `/tasks/${id}/transitions`, { status, reason });
  }

  commentTask(id: string, text: string) {
    return this.request<{ event_id: string }>("POST", `/tasks/${id}/comments`, { text });
  }

  pingTask(id: string, recipients: string[], message?: string) {
    return this.request<{ event_id: string }>("POST", `/tasks/${id}/pings`, { recipients, message });
  }
}

// Uso
const client = new UrpeClient();
const me = await client.me();
console.log(`Acting as ${me.identity.email} (${me.identity.role})`);

await client.createTask({
  id: "URPE-IS-301",
  title: "Tarea creada vía SDK TypeScript",
  owner_email: "fl@urpeailab.com",
});

await client.commentTask("URPE-IS-301", "Comentario inicial desde el agente");
```

### Python SDK minimalista

```python
import os
import uuid
import requests
from typing import Any, Optional

BASE = "https://urpe-command-center.vercel.app/api/v1"
TOKEN = os.environ["URPE_TOKEN"]


class UrpeClient:
    def __init__(self):
        self.s = requests.Session()
        self.s.headers["Authorization"] = f"Bearer {TOKEN}"
        self.s.headers["Content-Type"] = "application/json"

    def _req(self, method: str, path: str, body: Optional[dict] = None) -> dict:
        headers = {}
        if method == "POST":
            headers["Idempotency-Key"] = str(uuid.uuid4())
        res = self.s.request(method, f"{BASE}{path}", json=body, headers=headers)
        if not res.ok:
            err = res.json()
            raise RuntimeError(f"{method} {path} → {res.status_code}: {err.get('error')} {err.get('message')}")
        return res.json()

    def me(self) -> dict:
        return self._req("GET", "/auth/me")

    def list_tasks(self, **filters) -> dict:
        qs = "&".join(f"{k}={v}" for k, v in filters.items() if v is not None)
        return self._req("GET", f"/tasks?{qs}")

    def create_task(self, **body) -> dict:
        return self._req("POST", "/tasks", body)

    def transition_task(self, task_id: str, status: str, reason: Optional[str] = None) -> dict:
        return self._req("POST", f"/tasks/{task_id}/transitions", {"status": status, "reason": reason})

    def comment_task(self, task_id: str, text: str) -> dict:
        return self._req("POST", f"/tasks/{task_id}/comments", {"text": text})

    def ping_task(self, task_id: str, recipients: list[str], message: Optional[str] = None) -> dict:
        return self._req("POST", f"/tasks/{task_id}/pings", {"recipients": recipients, "message": message})


# Uso
client = UrpeClient()
me = client.me()
print(f"Acting as {me['identity']['email']} ({me['identity']['role']})")

client.create_task(
    id="URPE-IS-302",
    title="Tarea desde Python",
    owner_email="fl@urpeailab.com",
    priority="p2",
)

client.comment_task("URPE-IS-302", "Comentario inicial desde el script Python")
```

---

## Generación de SDKs

### Auto-generar cliente desde el OpenAPI spec

#### TypeScript

```bash
npx openapi-typescript \
  https://urpe-command-center.vercel.app/api/v1/openapi.json \
  -o src/sdk/types.ts
```

#### Python (con Pydantic)

```bash
pip install datamodel-code-generator
datamodel-codegen \
  --url https://urpe-command-center.vercel.app/api/v1/openapi.json \
  --output urpe_models.py \
  --output-model-type pydantic_v2.BaseModel
```

#### Go

```bash
go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest
oapi-codegen -package urpe \
  https://urpe-command-center.vercel.app/api/v1/openapi.json \
  > urpe_client.go
```

#### Cualquier otro lenguaje

Cualquier generador que consuma OpenAPI 3.1 funciona. Lista oficial: https://openapi-generator.tech/docs/generators/

---

## Limitaciones conocidas

- **Rate limit fijo**: 60 req/min, no configurable por token aún. Si necesitás más, hablá con `am@urpeailab.com`.
- **Sin webhooks salientes**: el dashboard no postea callbacks a tu URL cuando algo cambia. Para subscribirte a cambios en tiempo real, usá el `GET /tasks/:id/events?since=...` con polling, o suscribite directamente a Supabase Realtime.
- **Sin batch operations** todavía: si necesitás crear N tareas, son N requests. Considera implementar `Idempotency-Key` por tarea.
- **Filtros limitados**: `GET /tasks` no soporta filtros combinados complejos (ej. status IN (...)). Para queries arbitrarias, considera un agent del lado del usuario que filtre client-side.

---

## Changelog

### v1.0.0 — 2026-05-01

- Lanzamiento inicial
- 12 endpoints (7 write + 5 read + 1 introspect)
- 6 scopes
- Token PAT system con UI auto-servicio en `/settings/tokens`
- Rate limit 60/min sliding window
- Idempotency-Key con TTL 24h
- OpenAPI 3.1 spec + Scalar UI

---

## Soporte

- **Bugs / preguntas técnicas**: Andres Maldonado (`am@urpeailab.com`)
- **Feature requests**: crear tarea con prefijo `URPE-CC-API-` y owner `am@urpeailab.com`
- **Documentación viva (Scalar UI)**: https://urpe-command-center.vercel.app/api/v1/docs
- **Spec descargable**: https://urpe-command-center.vercel.app/api/v1/openapi.json

---

*Documento mantenido por Andres Maldonado. Última actualización: 2026-05-01. Cuando agregues un endpoint nuevo, actualizá tanto `src/features/api/openapi-spec.ts` como este archivo.*
