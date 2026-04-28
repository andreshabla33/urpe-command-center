"use client";

import { useEffect } from "react";
import { identifyUser, initPostHog } from "@/lib/posthog/client";

export function AnalyticsProvider({
  userEmail,
}: {
  userEmail: string | null;
}) {
  useEffect(() => {
    initPostHog();
    if (userEmail) identifyUser(userEmail);
  }, [userEmail]);

  return null;
}
