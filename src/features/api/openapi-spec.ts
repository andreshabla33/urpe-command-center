import "server-only";

/**
 * OpenAPI 3.1 spec — hand-built. Mantenido en sincronía con los route handlers.
 * Cuando agregues un endpoint, agregalo acá también.
 *
 * Verificación contra spec:
 *   - https://editor.swagger.io/ (paste JSON)
 *   - npx @apidevtools/swagger-cli validate openapi.json
 */

const TASK_STATUSES = [
  "backlog",
  "in_progress",
  "blocked",
  "escalated",
  "responded",
  "done",
  "cancelled",
];
const TASK_PRIORITIES = ["p0", "p1", "p2", "p3"];

export function buildOpenApiSpec(serverUrl: string) {
  return {
    openapi: "3.1.0",
    info: {
      title: "URPE Command Center API",
      version: "1.0.0",
      description: `Public API para que scripts, bots y agentes IA automaticen tareas en el Command Center.

## Autenticación

Cada request debe incluir un Personal Access Token (PAT) en el header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

Los tokens se generan desde el dashboard en \`/settings/tokens\`. Cada token actúa con los permisos del usuario que lo emitió.

## Idempotencia

Para POSTs, se recomienda incluir un \`Idempotency-Key\` único (UUID v4) por operación lógica. Si reintentás con la misma key + mismo body, recibís la respuesta original cached. Si misma key con body distinto, recibís 409 conflict.

## Rate limiting

60 requests por minuto por token. Header \`Retry-After\` indica cuántos segundos esperar al recibir 429.

## Auditoría

Cada acción crea un \`fact_event\` con \`actor_email\` = el dueño del token y \`metadata.via_token\` = el nombre del token, visible en el timeline de cada tarea.`,
      contact: {
        name: "URPE Command Center",
        email: "dau@urpeailab.com",
        url: "https://urpe-command-center.vercel.app",
      },
    },
    servers: [{ url: serverUrl, description: "Production" }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Personal Access Token (PAT) generado en /settings/tokens",
        },
      },
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "URPE-IS-099" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            owner_email: { type: "string", format: "email", nullable: true },
            created_by: { type: "string", format: "email", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            due_date: { type: "string", format: "date-time", nullable: true },
            status: { type: "string", enum: TASK_STATUSES },
            priority: { type: "string", enum: TASK_PRIORITIES },
            project_id: { type: "string", nullable: true },
            metadata: { type: "object", additionalProperties: true },
            age_days: { type: "number", nullable: true },
            event_count: { type: "integer", nullable: true },
            last_event_at: { type: "string", format: "date-time", nullable: true },
          },
        },
        Person: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            full_name: { type: "string", nullable: true },
            role: { type: "string" },
            is_active: { type: "boolean" },
            agent_id: { type: "string", nullable: true },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string", nullable: true },
            parent_id: { type: "string", nullable: true },
            color: { type: "string", nullable: true },
          },
        },
        FactEvent: {
          type: "object",
          properties: {
            id: { type: "integer" },
            event_id: { type: "string", format: "uuid" },
            task_id: { type: "string", nullable: true },
            event_type: { type: "string" },
            actor_email: { type: "string", format: "email", nullable: true },
            timestamp: { type: "string", format: "date-time" },
            metadata: { type: "object", additionalProperties: true },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            ok: { type: "boolean", example: false },
            error: { type: "string" },
            message: { type: "string" },
            details: {},
          },
        },
        EventResponse: {
          type: "object",
          properties: {
            ok: { type: "boolean", example: true },
            deduped: { type: "boolean" },
            event_id: { type: "string", format: "uuid", nullable: true },
          },
        },
      },
      parameters: {
        IdempotencyKey: {
          name: "Idempotency-Key",
          in: "header",
          required: false,
          schema: { type: "string", format: "uuid" },
          description: "UUID v4 único por operación lógica.",
        },
        TaskIdPath: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      },
      responses: {
        Unauthorized: {
          description: "Token bearer faltante o inválido",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "Scope insuficiente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ValidationError: {
          description: "Body o query inválido",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        RateLimited: {
          description: "60 req/min excedidos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/me": {
        get: {
          summary: "Introspect del token actual",
          description:
            "Devuelve la identidad del usuario, scopes del token y metadata.",
          tags: ["Auth"],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      identity: {
                        type: "object",
                        properties: {
                          email: { type: "string", format: "email" },
                          full_name: { type: "string", nullable: true },
                          role: { type: "string" },
                        },
                      },
                      token: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          scopes: { type: "array", items: { type: "string" } },
                          expires_at: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          hash_prefix: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/api/v1/tasks": {
        get: {
          summary: "Lista tareas",
          description:
            "Filtros vía query string. La visibilidad respeta el role del usuario.",
          tags: ["Tasks"],
          parameters: [
            {
              name: "owner",
              in: "query",
              schema: { type: "string", format: "email" },
            },
            {
              name: "status",
              in: "query",
              schema: { type: "string", enum: TASK_STATUSES },
            },
            { name: "project", in: "query", schema: { type: "string" } },
            { name: "q", in: "query", schema: { type: "string" } },
            {
              name: "age",
              in: "query",
              schema: { type: "string", enum: ["7d", "30d"] },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 50, maximum: 200 },
            },
            {
              name: "offset",
              in: "query",
              schema: { type: "integer", default: 0 },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Task" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          limit: { type: "integer" },
                          offset: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "429": { $ref: "#/components/responses/RateLimited" },
          },
        },
        post: {
          summary: "Crear tarea",
          description: "Crea una tarea nueva y emite fact_event(created).",
          tags: ["Tasks"],
          parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id", "title", "owner_email"],
                  properties: {
                    id: {
                      type: "string",
                      pattern: "^[A-Z][A-Z0-9-]+$",
                      example: "URPE-IS-099",
                    },
                    title: { type: "string", maxLength: 500 },
                    description: { type: "string", maxLength: 10000 },
                    owner_email: { type: "string", format: "email" },
                    priority: {
                      type: "string",
                      enum: TASK_PRIORITIES,
                      default: "p2",
                    },
                    project_id: { type: "string" },
                    due_date: { type: "string", format: "date-time" },
                    metadata: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Tarea creada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      task: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          owner_email: { type: "string", format: "email" },
                          status: { type: "string" },
                          priority: { type: "string" },
                        },
                      },
                      event_id: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "409": {
              description: "Task ID ya existe o Idempotency-Key reutilizada",
            },
            "429": { $ref: "#/components/responses/RateLimited" },
          },
        },
      },
      "/api/v1/tasks/{id}": {
        get: {
          summary: "Obtener tarea por ID",
          tags: ["Tasks"],
          parameters: [{ $ref: "#/components/parameters/TaskIdPath" }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      data: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { description: "Tarea no encontrada o sin acceso" },
          },
        },
      },
      "/api/v1/tasks/{id}/events": {
        get: {
          summary: "Timeline de eventos de una tarea",
          tags: ["Tasks"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            {
              name: "since",
              in: "query",
              schema: { type: "string", format: "date-time" },
              description: "Solo eventos posteriores a este timestamp",
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/FactEvent" },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { description: "Tarea no encontrada o sin acceso" },
          },
        },
      },
      "/api/v1/tasks/{id}/transitions": {
        post: {
          summary: "Cambiar status (status_changed)",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: TASK_STATUSES },
                    reason: { type: "string", maxLength: 500 },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
            "200": {
              description: "Replay deduplicado (mismo Idempotency-Key)",
            },
            "404": { description: "Tarea no encontrada" },
          },
        },
      },
      "/api/v1/tasks/{id}/assignments": {
        post: {
          summary: "Reasignar owner (assigned)",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["owner_email"],
                  properties: {
                    owner_email: { type: "string", format: "email" },
                    reason: { type: "string", maxLength: 500 },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/tasks/{id}/comments": {
        post: {
          summary: "Agregar comentario",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", maxLength: 10000 },
                    metadata: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/tasks/{id}/pings": {
        post: {
          summary: "Pingear (recordar al owner)",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recipients: {
                      type: "array",
                      items: { type: "string", format: "email" },
                    },
                    message: { type: "string", maxLength: 1000 },
                    metadata: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/tasks/{id}/escalations": {
        post: {
          summary: "Escalar tarea (escalated)",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reason"],
                  properties: {
                    level: { type: "string", enum: ["n1", "n2", "n3"] },
                    reason: { type: "string", minLength: 1, maxLength: 500 },
                    metadata: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/tasks/{id}/email-events": {
        post: {
          summary: "Registrar email enviado/recibido",
          tags: ["Tasks · Events"],
          parameters: [
            { $ref: "#/components/parameters/TaskIdPath" },
            { $ref: "#/components/parameters/IdempotencyKey" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["direction", "msg_id"],
                  properties: {
                    direction: { type: "string", enum: ["sent", "received"] },
                    msg_id: { type: "string", maxLength: 500 },
                    from: { type: "string", format: "email" },
                    to: {
                      type: "array",
                      items: { type: "string", format: "email" },
                    },
                    subject: { type: "string", maxLength: 1000 },
                    snippet: { type: "string", maxLength: 2000 },
                    is_response: { type: "boolean", default: false },
                    metadata: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Evento emitido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/persons": {
        get: {
          summary: "Lista personas (para resolver owners)",
          tags: ["Reference"],
          parameters: [
            {
              name: "active",
              in: "query",
              schema: { type: "boolean", default: true },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Person" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/projects": {
        get: {
          summary: "Lista proyectos",
          tags: ["Reference"],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Project" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  } as const;
}
