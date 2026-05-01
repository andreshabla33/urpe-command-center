"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { generateTokenPlaintext, hashToken } from "./auth";
import { CreateTokenInputSchema } from "./schema";
import { validateScopesForRole } from "./scopes";

export type CreateTokenResult =
  | {
      ok: true;
      token_plaintext: string;
      token: { hash_prefix: string; name: string; scopes: string[]; expires_at: string | null };
    }
  | { ok: false; error: string; details?: unknown };

export async function createUserToken(
  input: unknown,
): Promise<CreateTokenResult> {
  const parsed = CreateTokenInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed", details: parsed.error.issues };
  }

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { data: person } = await supabase
    .from("dim_person")
    .select("email, role, is_active")
    .eq("email", user.email)
    .single();
  if (!person || !person.is_active) {
    return { ok: false, error: "user_not_active" };
  }

  const validation = validateScopesForRole(parsed.data.scopes, person.role);
  if (!validation.ok) {
    return {
      ok: false,
      error: "scopes_not_allowed_for_role",
      details: { invalid: validation.invalid, role: person.role },
    };
  }

  const plaintext = generateTokenPlaintext();
  const tokenHash = hashToken(plaintext);
  const expiresAt =
    parsed.data.expires_in_days === 0
      ? null
      : new Date(
          Date.now() + parsed.data.expires_in_days * 24 * 60 * 60 * 1000,
        ).toISOString();

  const { error: insertErr } = await supabase.from("dim_user_token").insert({
    token_hash: tokenHash,
    owner_email: person.email,
    name: parsed.data.name,
    scopes: parsed.data.scopes,
    expires_at: expiresAt,
  });
  if (insertErr) return { ok: false, error: insertErr.message };

  revalidatePath("/settings/tokens");

  return {
    ok: true,
    token_plaintext: plaintext,
    token: {
      hash_prefix: tokenHash.slice(0, 8),
      name: parsed.data.name,
      scopes: parsed.data.scopes,
      expires_at: expiresAt,
    },
  };
}

export async function revokeUserTokenByPrefix(
  hashPrefix: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^[a-f0-9]{8}$/.test(hashPrefix)) {
    return { ok: false, error: "invalid_prefix" };
  }
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("dim_user_token")
    .update({ revoked_at: new Date().toISOString() })
    .eq("owner_email", user.email)
    .like("token_hash", `${hashPrefix}%`)
    .is("revoked_at", null);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/settings/tokens");
  return { ok: true };
}

export type ListTokensRow = {
  hash_prefix: string;
  name: string;
  scopes: string[];
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
};

export async function listMyTokens(): Promise<ListTokensRow[]> {
  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return [];

  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("dim_user_token")
    .select("token_hash, name, scopes, created_at, last_used_at, expires_at, revoked_at")
    .eq("owner_email", user.email)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    hash_prefix: r.token_hash.slice(0, 8),
    name: r.name,
    scopes: r.scopes,
    created_at: r.created_at,
    last_used_at: r.last_used_at,
    expires_at: r.expires_at,
    revoked_at: r.revoked_at,
  }));
}
