import { withApi } from "@/features/api/with-api";
import { ok } from "@/features/api/responses";

/**
 * Introspect del token actual. Útil para que el agente confirme su identidad
 * y scopes antes de operar.
 */
export const GET = withApi(
  // Cualquier scope sirve para hacer introspect; usamos persons.read como mínimo común
  { scopes: ["persons.read", "tasks.read", "projects.read", "events.write", "tasks.create", "tasks.update"], rateLimit: false },
  async ({ token }) => {
    return ok(
      {
        identity: {
          email: token.ownerEmail,
          full_name: token.ownerFullName,
          role: token.ownerRole,
        },
        token: {
          name: token.tokenName,
          scopes: token.scopes,
          expires_at: token.expiresAt,
          hash_prefix: token.tokenHashPrefix,
        },
      },
      token,
    );
  },
);
