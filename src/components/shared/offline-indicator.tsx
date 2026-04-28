"use client";

import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/lib/offline/use-online-status";
import { queueLength } from "@/lib/offline/queue";
import { flushOfflineQueue } from "@/lib/offline/sync";

const POLL_MS = 5000;

export function OfflineIndicator() {
  const online = useOnlineStatus();
  const [queued, setQueued] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const n = await queueLength();
        if (!cancelled) setQueued(n);
      } catch {}
    }
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [online]);

  useEffect(() => {
    if (online) {
      flushOfflineQueue().then(() => {
        queueLength().then(setQueued).catch(() => {});
      });
    }
  }, [online]);

  if (!mounted) return null;
  if (online && queued === 0) return null;

  return (
    <div
      className={
        "rounded border px-2 py-1 text-[10px] font-mono " +
        (online
          ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "border-destructive/40 bg-destructive/10 text-destructive")
      }
    >
      {online
        ? `Sincronizando ${queued} cambio${queued === 1 ? "" : "s"}…`
        : `Sin conexión${queued > 0 ? ` · ${queued} en cola` : ""}`}
    </div>
  );
}
