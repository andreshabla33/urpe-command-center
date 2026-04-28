import "server-only";
import { serverEnv } from "@/lib/env-server";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
] as const;

export const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
] as const;

function requireOAuthEnv() {
  if (
    !serverEnv.GOOGLE_OAUTH_CLIENT_ID ||
    !serverEnv.GOOGLE_OAUTH_CLIENT_SECRET
  ) {
    throw new Error("GOOGLE_OAUTH_CLIENT_ID/SECRET not configured");
  }
  return {
    clientId: serverEnv.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: serverEnv.GOOGLE_OAUTH_CLIENT_SECRET,
  };
}

export function buildGoogleAuthUrl(input: {
  redirectUri: string;
  scopes: readonly string[];
  state: string;
  loginHint?: string;
}): string {
  const { clientId } = requireOAuthEnv();
  const url = new URL(AUTH_ENDPOINT);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", input.scopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", input.state);
  if (input.loginHint) url.searchParams.set("login_hint", input.loginHint);
  return url.toString();
}

export type GoogleTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<GoogleTokens> {
  const { clientId, clientSecret } = requireOAuthEnv();
  const r = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Google token exchange failed ${r.status}: ${text}`);
  }
  return (await r.json()) as GoogleTokens;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ access_token: string; expires_in: number; scope: string }> {
  const { clientId, clientSecret } = requireOAuthEnv();
  const r = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Google refresh failed ${r.status}: ${text}`);
  }
  return (await r.json()) as {
    access_token: string;
    expires_in: number;
    scope: string;
  };
}
