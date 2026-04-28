import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  buildGoogleAuthUrl,
  CALENDAR_SCOPES,
  GMAIL_SCOPES,
} from "@/lib/google/oauth";

const STATE_COOKIE = "urpe-google-oauth-state";
const PROVIDER_COOKIE = "urpe-google-oauth-provider";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? "gmail";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const sb = createServiceRoleClient();
  const { data: person } = await sb
    .from("dim_person")
    .select("role")
    .eq("email", user.email)
    .single();
  if (person?.role !== "admin") {
    return NextResponse.redirect(
      new URL("/?error=admin_only", url.origin),
    );
  }

  const scopes =
    provider === "calendar"
      ? [...CALENDAR_SCOPES]
      : provider === "both"
        ? [...GMAIL_SCOPES, ...CALENDAR_SCOPES]
        : [...GMAIL_SCOPES];

  const state = randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  cookieStore.set(PROVIDER_COOKIE, provider, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const redirectUri = `${url.origin}/auth/google-integrations/callback`;
  const authUrl = buildGoogleAuthUrl({
    redirectUri,
    scopes,
    state,
    loginHint: user.email,
  });

  return NextResponse.redirect(authUrl);
}
