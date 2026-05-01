import "server-only";
import { createHash } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const MAX_KEY_LEN = 200;

/**
 * Si el cliente envía Idempotency-Key, busca si ya respondimos esa key+body.
 * - Si existe con mismo body hash → devuelve la response cached (replay seguro)
 * - Si existe con body distinto → 409 conflict (key reutilizada con request distinto)
 * - Si no existe → null, el handler puede proceder
 *
 * Llamar storeIdempotentResponse() después del handler exitoso.
 */
export async function checkIdempotency(args: {
  key: string | null;
  ownerEmail: string;
  bodyText: string;
}): Promise<
  | { kind: "cached"; status: number; body: unknown }
  | { kind: "conflict"; existingHash: string }
  | { kind: "fresh" }
  | null
> {
  if (!args.key) return null;
  if (args.key.length > MAX_KEY_LEN) return null;

  const supabase = createServiceRoleClient();
  const requestHash = createHash("sha256").update(args.bodyText).digest("hex");

  const { data } = await supabase
    .from("request_idempotency")
    .select("request_hash, response_status, response_body, expires_at")
    .eq("key", args.key)
    .single();

  if (!data) return { kind: "fresh" };
  if (new Date(data.expires_at) < new Date()) return { kind: "fresh" };

  if (data.request_hash !== requestHash) {
    return { kind: "conflict", existingHash: data.request_hash };
  }
  return { kind: "cached", status: data.response_status, body: data.response_body };
}

/**
 * Guarda la response indexada por idempotency key. Idempotente — si ya existe
 * la key, no sobrescribe (la primera respuesta gana).
 */
export async function storeIdempotentResponse(args: {
  key: string | null;
  ownerEmail: string;
  bodyText: string;
  responseStatus: number;
  responseBody: unknown;
}) {
  if (!args.key) return;
  if (args.key.length > MAX_KEY_LEN) return;

  const supabase = createServiceRoleClient();
  const requestHash = createHash("sha256").update(args.bodyText).digest("hex");

  await supabase.from("request_idempotency").upsert(
    {
      key: args.key,
      owner_email: args.ownerEmail,
      request_hash: requestHash,
      response_status: args.responseStatus,
      response_body: args.responseBody as object,
    },
    { onConflict: "key", ignoreDuplicates: true },
  );
}
