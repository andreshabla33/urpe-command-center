"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const REFRESH_DEBOUNCE_MS = 250;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), REFRESH_DEBOUNCE_MS);
    };

    const channel = supabase
      .channel("urpe-tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fact_event" },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dim_task" },
        refresh,
      )
      .subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return <>{children}</>;
}
