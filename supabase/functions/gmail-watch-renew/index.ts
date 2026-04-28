// Edge Function: gmail-watch-renew
// Llama users.watch() en Gmail API por cada cuenta con integración gmail activa.
// Google expira los watches a 7 días; correr esta function diariamente garantiza
// que Pub/Sub siga recibiendo notificaciones.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");
const GMAIL_PUBSUB_TOPIC = Deno.env.get("GMAIL_PUBSUB_TOPIC");

async function refresh(refreshToken: string): Promise<string> {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!r.ok) throw new Error(`refresh failed ${r.status}`);
  const j = await r.json();
  return j.access_token as string;
}

async function startWatch(accessToken: string, topic: string) {
  const r = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/watch",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicName: topic,
        labelIds: ["INBOX", "SENT"],
        labelFilterAction: "include",
      }),
    },
  );
  if (!r.ok) throw new Error(`watch failed ${r.status}: ${await r.text()}`);
  return (await r.json()) as { historyId: string; expiration: string };
}

Deno.serve(async () => {
  if (
    !GOOGLE_OAUTH_CLIENT_ID ||
    !GOOGLE_OAUTH_CLIENT_SECRET ||
    !GMAIL_PUBSUB_TOPIC
  ) {
    return Response.json(
      { ok: false, error: "missing_env" },
      { status: 500 },
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: integrations } = await supabase
      .from("dim_person_integration")
      .select("email, vault_secret_id")
      .eq("provider", "gmail");

    if (!integrations || integrations.length === 0) {
      return Response.json({ ok: true, renewed: 0, total: 0 });
    }

    let renewed = 0;
    const errors: { email: string; error: string }[] = [];

    for (const integ of integrations) {
      try {
        const { data: tokenRow } = await supabase.rpc(
          "urpe_vault_read_secret",
          { secret_id: integ.vault_secret_id },
        );
        if (!tokenRow) throw new Error("no refresh token");

        const accessToken = await refresh(tokenRow as string);
        const watch = await startWatch(accessToken, GMAIL_PUBSUB_TOPIC);

        await supabase
          .from("dim_person_integration")
          .update({
            watch_history_id: watch.historyId,
            watch_expires_at: new Date(parseInt(watch.expiration, 10)).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("email", integ.email)
          .eq("provider", "gmail");

        renewed++;
      } catch (e) {
        errors.push({ email: integ.email, error: String(e) });
      }
    }

    return Response.json({
      ok: true,
      renewed,
      total: integrations.length,
      errors,
    });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
});
