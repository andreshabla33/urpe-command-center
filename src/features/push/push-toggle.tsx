"use client";

import { useEffect, useState, useTransition } from "react";
import { subscribePush, unsubscribePush } from "./actions";
import { publicEnv } from "@/lib/env";

type State = "idle" | "denied" | "granted-no-sub" | "subscribed";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function PushToggle() {
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setSupported(false);
      return;
    }
    setSupported(true);

    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "subscribed" : "granted-no-sub");
    });
  }, []);

  if (!mounted || !supported) return null;

  const vapidKey = publicEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) return null;

  function enable() {
    startTransition(async () => {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState("denied");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey!) as BufferSource,
      });
      const json = sub.toJSON();
      const res = await subscribePush({
        endpoint: json.endpoint,
        keys: json.keys,
        userAgent: navigator.userAgent,
      });
      if (res.ok) setState("subscribed");
    });
  }

  function disable() {
    startTransition(async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("granted-no-sub");
    });
  }

  return (
    <button
      type="button"
      disabled={pending || state === "denied"}
      onClick={state === "subscribed" ? disable : enable}
      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
    >
      {state === "subscribed"
        ? "🔔 Notif activas"
        : state === "denied"
          ? "🔕 Notif bloqueadas"
          : pending
            ? "…"
            : "🔔 Activar notificaciones"}
    </button>
  );
}
