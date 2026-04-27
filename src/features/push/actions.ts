"use server";

import "server-only";
import { z } from "zod";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { serverEnv } from "@/lib/env-server";

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  userAgent: z.string().optional(),
});

function configureWebPush() {
  if (
    !serverEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !serverEnv.VAPID_PRIVATE_KEY ||
    !serverEnv.VAPID_SUBJECT
  ) {
    throw new Error("VAPID keys not configured");
  }
  webpush.setVapidDetails(
    serverEnv.VAPID_SUBJECT,
    serverEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    serverEnv.VAPID_PRIVATE_KEY,
  );
}

export async function subscribePush(input: unknown) {
  const parsed = SubscribeSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "invalid input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false as const, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("push_subscription").upsert(
    {
      user_email: user.email,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
      user_agent: parsed.data.userAgent ?? null,
    },
    { onConflict: "endpoint" },
  );
  if (error) return { ok: false as const, error: error.message };

  return { ok: true as const };
}

export async function unsubscribePush(endpoint: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("push_subscription").delete().eq("endpoint", endpoint);
  return { ok: true as const };
}

export async function sendPushTo(
  userEmail: string,
  payload: { title: string; body: string; url?: string; tag?: string },
) {
  configureWebPush();
  const supabase = createServiceRoleClient();
  const { data: subs } = await supabase
    .from("push_subscription")
    .select("endpoint, p256dh, auth")
    .eq("user_email", userEmail);

  const failed: string[] = [];
  for (const sub of subs ?? []) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload),
      );
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await supabase
          .from("push_subscription")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
      failed.push(sub.endpoint);
    }
  }

  return { sent: (subs ?? []).length - failed.length, failed: failed.length };
}
