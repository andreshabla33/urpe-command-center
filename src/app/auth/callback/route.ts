import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_DOMAINS = ["urpeailab.com"];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", url.origin),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  const email = data.user?.email ?? "";
  const domain = email.split("@")[1];
  if (!ALLOWED_DOMAINS.includes(domain)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("Solo dominios @urpeailab.com")}`,
        url.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
