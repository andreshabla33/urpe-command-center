/**
 * API v1 — Scopes registry.
 *
 * Cada token tiene un subset de estos scopes. La validación al crear token
 * verifica que el subset esté autorizado por el role del usuario.
 *
 * Single source of truth para "qué puede hacer un agente automatizado".
 */

export const API_SCOPES = [
  "tasks.read",          // GET /tasks (filtrado por visibility del owner)
  "tasks.create",        // POST /tasks
  "tasks.update",        // status/owner/priority changes via eventos
  "events.write",        // ping, comment, escalate, email events
  "persons.read",        // GET /persons
  "projects.read",       // GET /projects
] as const;

export type ApiScope = (typeof API_SCOPES)[number];

/**
 * Permisos por role (qué scopes puede otorgar un usuario a sus propios tokens).
 * Si un usuario con role X intenta crear un token con scope no listado en su
 * fila, falla con 403.
 *
 * Roles que no figuran (legal, n/a) → no pueden crear tokens (set vacío).
 */
export const ROLE_SCOPES: Record<string, ApiScope[]> = {
  admin: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  liderazgo: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  operaciones: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  supervisor: [
    "tasks.read",
    "tasks.create",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  comercial: [
    "tasks.read",
    "tasks.create",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  administrativo: [
    "tasks.read",
    "tasks.create",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  asesor: [
    "tasks.read",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  rrhh: [
    "tasks.read",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  marketing: [
    "tasks.read",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  dueño: [
    "tasks.read",
    "tasks.create",
    "tasks.update",
    "events.write",
    "persons.read",
    "projects.read",
  ],
  agent: [],     // un agente nunca emite tokens (solo los consume)
  "n/a": [],
};

/**
 * Validar que un set de scopes solicitados esté autorizado por el role.
 * Devuelve los scopes inválidos (los que el role no permite). Vacío = OK.
 */
export function validateScopesForRole(
  requested: string[],
  role: string,
): { ok: true } | { ok: false; invalid: string[] } {
  const allowed = ROLE_SCOPES[role] ?? [];
  const invalid = requested.filter(
    (s) => !(allowed as readonly string[]).includes(s),
  );
  if (invalid.length === 0) return { ok: true };
  return { ok: false, invalid };
}
