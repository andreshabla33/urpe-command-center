import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "urpe-offline";
const DB_VERSION = 1;
const STORE = "mutations";

export type QueuedMutationType = "setTaskStatus" | "pingTask";

export type QueuedMutation = {
  id: string;
  type: QueuedMutationType;
  payload: Record<string, unknown>;
  enqueuedAt: number;
  attempts: number;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("offline queue only on client"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function enqueueMutation(input: {
  type: QueuedMutationType;
  payload: Record<string, unknown>;
}): Promise<string> {
  const db = await getDb();
  const item: QueuedMutation = {
    id: crypto.randomUUID(),
    type: input.type,
    payload: input.payload,
    enqueuedAt: Date.now(),
    attempts: 0,
  };
  await db.put(STORE, item);
  return item.id;
}

export async function listQueued(): Promise<QueuedMutation[]> {
  const db = await getDb();
  return (await db.getAll(STORE)) as QueuedMutation[];
}

export async function dequeue(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function bumpAttempts(id: string): Promise<void> {
  const db = await getDb();
  const item = (await db.get(STORE, id)) as QueuedMutation | undefined;
  if (!item) return;
  item.attempts += 1;
  await db.put(STORE, item);
}

export async function queueLength(): Promise<number> {
  const db = await getDb();
  return db.count(STORE);
}
