import "server-only";
import { PostHog } from "posthog-node";
import { serverEnv } from "@/lib/env-server";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (!serverEnv.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (client) return client;
  client = new PostHog(serverEnv.NEXT_PUBLIC_POSTHOG_KEY, {
    host: serverEnv.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}

export async function captureServerEvent(input: {
  email: string | null;
  event: string;
  properties?: Record<string, unknown>;
}) {
  const c = getClient();
  if (!c) return;
  c.capture({
    distinctId: input.email ?? "anonymous",
    event: input.event,
    properties: input.properties,
  });
  await c.flush();
}
