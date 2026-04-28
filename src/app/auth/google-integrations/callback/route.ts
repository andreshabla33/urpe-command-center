import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { vaultCreateSecret, vaultUpdateSecret } from "@/lib/supabase/vault";
import { exchangeCodeForTokens } from "@/lib/google/oauth";

const STATE_COOKIE = "urpe-google-oauth-state";
const PROVIDER_COOKIE = "urpe-google-oauth-provider";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateFromGoogle = url.searchParams.get("state");
  const errorFromGoogle = url.searchParams.get("error");

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(STATE_COOKIE)?.value;
  const providerCookie = cookieStore.get(PROVIDER_COOKIE)?.value ?? "gmail";
  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(PROVIDER_COOKIE);

  if (errorFromGoogle) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(errorFromGoogle)}`, url.origin),
    );
  }
  if (!code || !stateFromGoogle || stateFromGoogle !== stateCookie) {
    return NextResponse.redirect(
      new URL("/?error=oauth_state_mismatch", url.origin),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const tokens = await exchangeCodeForTokens(
    code,
    `${url.origin}/auth/google-integrations/callback`,
  );
  if (!tokens.refresh_token) {
    return NextResponse.redirect(
      new URL("/?error=no_refresh_token", url.origin),
    );
  }

  const grantedScopes = tokens.scope.split(" ");
  const sb = createServiceRoleClient();
  const providers: ("gmail" | "calendar")[] = [];
  if (providerCookie === "both") providers.push("gmail", "calendar");
  else if (providerCookie === "calendar") providers.push("calendar");
  else providers.push("gmail");

  for (const provider of providers) {
    const { data: existing } = await sb
      .from("dim_person_integration")
      .select("vault_secret_id")
      .eq("email", user.email)
      .eq("provider", provider)
      .maybeSingle();

    let vaultId = existing?.vault_secret_id;
    if (vaultId) {
      await vaultUpdateSecret(vaultId, tokens.refresh_token);
    } else {
      vaultId = await vaultCreateSecret(
        `${provider}_refresh_token_${user.email}`,
        tokens.refresh_token,
        `${provider} OAuth refresh token for ${user.email}`,
      );
    }

    await sb.from("dim_person_integration").upsert(
      {
        email: user.email,
        provider,
        vault_secret_id: vaultId,
        scopes: grantedScopes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email,provider" },
    );
  }

  return NextResponse.redirect(
    new URL("/?integration=connected", url.origin),
  );
}
