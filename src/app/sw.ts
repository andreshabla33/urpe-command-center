/// <reference lib="webworker" />
/// <reference types="@serwist/next/typings" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const isLocalhost = self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";

if (isLocalhost) {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        await self.registration.unregister();
        const clients = await self.clients.matchAll();
        for (const client of clients) {
          if ("navigate" in client) (client as WindowClient).navigate(client.url);
        }
      })(),
    );
  });
} else {
  const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
  });
  serwist.addEventListeners();

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((k) => !k.startsWith("serwist-precache"))
            .map((k) => caches.delete(k)),
        );
      })(),
    );
  });
}

if (!isLocalhost) {
  self.addEventListener("push", (event) => {
    const payload = event.data?.json() ?? {};
    const title = typeof payload.title === "string" ? payload.title : "URPE";
    const body = typeof payload.body === "string" ? payload.body : "";
    const url = typeof payload.url === "string" ? payload.url : "/";

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/icon",
        badge: "/icon",
        data: { url },
        tag: typeof payload.tag === "string" ? payload.tag : undefined,
      }),
    );
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const data = event.notification.data as { url?: string } | undefined;
    const url = data?.url ?? "/";
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client && url) client.navigate(url);
            return;
          }
        }
        return self.clients.openWindow(url);
      }),
    );
  });
}
