import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { ApiScope } from "./scopes";

export type ResolvedToken = {
  tokenHash: string;
  tokenHashPrefix: string;            // primeros 8 chars (audit log, no expone hash completo)
  ownerEmail: string;
  ownerRole: string;
  ownerFullName: string | null;
  tokenName: string;
  scopes: ApiScope[];
  expiresAt: string | null;
};

/**
 * Genera un PAT plaintext nuevo (32 bytes hex = 64 chars). Solo se muestra
 * UNA vez al usuario, nunca se guarda en plaintext.
 */
export function generateTokenPlaintext(): string {
  return randomBytes(32).toString("hex");
}

/**
 * SHA-256 hex del plaintext. Es lo que se guarda en dim_user_token.token_hash.
 */
export function hashToken(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

/**
 * Lee el header Authorization, extrae el bearer, lo hashea, busca en
 * dim_user_token, valida expiry/revoke, actualiza last_used_at, devuelve
 * la identidad resuelta (con el role en vivo desde dim_person).
 *
 * Devuelve null si no hay token, está revocado, expirado, o no existe.
 */
export async function resolveTokenFromRequest(
  request: NextRequest,
): Promise<ResolvedToken | null> {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;

  const plaintext = auth.slice("Bearer ".length).trim();
  if (!plaintext) return null;

  const tokenHash = hashToken(plaintext);
  const supabase = createServiceRoleClient();

  const { data: tokenRow, error } = await supabase
    .from("dim_user_token")
    .select("token_hash, owner_email, name, scopes, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !tokenRow) return null;
  if (tokenRow.revoked_at) return null;
  if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
    return null;
  }

  const { data: person } = await supabase
    .from("dim_person")
    .select("email, full_name, role, is_active")
    .eq("email", tokenRow.owner_email)
    .single();

  if (!person || !person.is_active) return null;

  // Update last_used_at fire-and-forget
  void supabase
    .from("dim_user_token")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash);

  return {
    tokenHash,
    tokenHashPrefix: tokenHash.slice(0, 8),
    ownerEmail: person.email,
    ownerRole: person.role,
    ownerFullName: person.full_name,
    tokenName: tokenRow.name,
    scopes: tokenRow.scopes as ApiScope[],
    expiresAt: tokenRow.expires_at,
  };
}

/**
 * Verifica que el token tenga AL MENOS UNO de los scopes requeridos.
 * Para scopes con prefix (ej. "tasks.*"), también acepta el wildcard.
 */
export function hasAnyScope(
  token: ResolvedToken,
  required: ApiScope[],
): boolean {
  return required.some((req) => token.scopes.includes(req));
}
