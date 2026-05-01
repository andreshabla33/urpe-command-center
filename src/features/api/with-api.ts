import "server-only";
import type { NextRequest } from "next/server";
import { hasAnyScope, resolveTokenFromRequest, type ResolvedToken } from "./auth";
import type { ApiScope } from "./scopes";
import { forbidden, tooManyRequests, unauthorized } from "./responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const RATE_LIMIT_PER_MINUTE = 60;

/**
 * Atomic increment via RPC public.increment_rate_limit_count.
 * Devuelve seconds-til-next-bucket si excede el límite, sino null.
 */
async function checkRateLimit(tokenHash: string): Promise<number | null> {
  const supabase = createServiceRoleClient();
  const bucket = new Date();
  bucket.setUTCSeconds(0, 0);
  const bucketIso = bucket.toISOString();

  const { data, error } = await supabase
    .rpc("increment_rate_limit_count", {
      p_token_hash: tokenHash,
      p_bucket: bucketIso,
    })
    .single<{ request_count: number }>();

  if (error || !data) return null; // fail-open en caso de error de DB

  if (data.request_count > RATE_LIMIT_PER_MINUTE) {
    const retryAfter = 60 - new Date().getUTCSeconds();
    return retryAfter;
  }

  return null;
}

export type ApiHandler = (args: {
  request: NextRequest;
  token: ResolvedToken;
  ctx: unknown;
}) => Promise<Response> | Response;

/**
 * HOF que envuelve un route handler con auth bearer + scope check + rate limit.
 *
 * Uso:
 *   export async function POST(request: NextRequest, ctx: RouteContext<'/api/v1/tasks/[id]'>) {
 *     return withApi({ scopes: ['tasks.create'] }, async ({ token }) => {
 *       // handler logic con token resolved
 *     })(request, ctx);
 *   }
 */
export function withApi(
  options: { scopes: ApiScope[]; rateLimit?: boolean },
  handler: ApiHandler,
) {
  return async (request: NextRequest, ctx?: unknown): Promise<Response> => {
    const token = await resolveTokenFromRequest(request);
    if (!token) return unauthorized();

    if (!hasAnyScope(token, options.scopes)) {
      return forbidden(
        `This token does not have any of the required scopes`,
        options.scopes,
      );
    }

    if (options.rateLimit !== false) {
      const retryAfter = await checkRateLimit(token.tokenHash);
      if (retryAfter !== null) {
        return tooManyRequests(retryAfter);
      }
    }

    try {
      return await handler({ request, token, ctx });
    } catch (e) {
      console.error("[api] handler error", e);
      return Response.json(
        { ok: false, error: "server_error", message: (e as Error).message },
        { status: 500 },
      );
    }
  };
}
