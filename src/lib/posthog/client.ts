"use client";

import posthog from "posthog-js";
import { publicEnv } from "@/lib/env";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = publicEnv.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: "history_change",
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false,
  });
  initialized = true;
}

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  if (!publicEnv.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(name, properties);
}

export function identifyUser(email: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!publicEnv.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.identify(email, { email, ...properties });
}

export { posthog };
