"use client";

import { setTaskStatus, pingTask } from "@/features/tasks/actions";
import { bumpAttempts, dequeue, listQueued } from "./queue";

let syncing = false;

export async function flushOfflineQueue(): Promise<{
  flushed: number;
  failed: number;
}> {
  if (syncing) return { flushed: 0, failed: 0 };
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { flushed: 0, failed: 0 };
  }

  syncing = true;
  let flushed = 0;
  let failed = 0;

  try {
    const items = await listQueued();
    for (const item of items) {
      try {
        let res: { ok: boolean } | undefined;
        switch (item.type) {
          case "setTaskStatus":
            res = await setTaskStatus(
              item.payload as { taskId: string; status: string },
            );
            break;
          case "pingTask":
            res = await pingTask(
              item.payload as { taskId: string },
            );
            break;
        }
        if (res?.ok) {
          await dequeue(item.id);
          flushed++;
        } else {
          await bumpAttempts(item.id);
          failed++;
        }
      } catch {
        await bumpAttempts(item.id);
        failed++;
      }
    }
  } finally {
    syncing = false;
  }

  return { flushed, failed };
}
