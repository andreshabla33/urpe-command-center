// Edge Function: batch-embeddings
// Encuentra tasks sin embedding (o cuyo content_hash cambió) y genera el vector
// con OpenRouter (text-embedding-3-large, 3072 dims, guardado como halfvec).
// Idempotente: por task_id (PK) con upsert. content_hash detecta cambios.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;

const EMBEDDING_MODEL = "openai/text-embedding-3-large";
const BATCH_SIZE = 50;
const MAX_TASKS_PER_RUN = 200;

async function sha1(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return encodeHex(new Uint8Array(buf));
}

function taskToText(t: { id: string; title: string; description: string | null }): string {
  return `${t.id}\n${t.title}\n${t.description ?? ""}`.trim();
}

async function embedBatch(inputs: string[]): Promise<number[][]> {
  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://urpe-command.vercel.app",
      "X-Title": "URPE Command Center",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: inputs }),
  });
  if (!r.ok) throw new Error(`OpenRouter embed ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.data.map((d: { embedding: number[] }) => d.embedding);
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: tasks, error } = await supabase
      .from("dim_task")
      .select("id,title,description")
      .order("created_at", { ascending: false })
      .limit(MAX_TASKS_PER_RUN);
    if (error) throw error;
    if (!tasks || tasks.length === 0) return Response.json({ ok: true, embedded: 0 });

    const { data: existing } = await supabase
      .from("dim_embedding")
      .select("task_id,content_hash")
      .in("task_id", tasks.map((t) => t.id));
    const existingMap = new Map(
      (existing ?? []).map((e) => [e.task_id, e.content_hash]),
    );

    const todo: { id: string; text: string; hash: string }[] = [];
    for (const t of tasks) {
      const text = taskToText(t);
      const hash = await sha1(text);
      if (existingMap.get(t.id) !== hash) {
        todo.push({ id: t.id, text, hash });
      }
    }

    if (todo.length === 0) return Response.json({ ok: true, embedded: 0, skipped: tasks.length });

    let embedded = 0;
    const errors: { taskId: string; error: string }[] = [];

    for (let i = 0; i < todo.length; i += BATCH_SIZE) {
      const chunk = todo.slice(i, i + BATCH_SIZE);
      try {
        const vectors = await embedBatch(chunk.map((c) => c.text));
        const rows = chunk.map((c, idx) => ({
          task_id: c.id,
          content_hash: c.hash,
          embedding: `[${vectors[idx].join(",")}]`,
          updated_at: new Date().toISOString(),
        }));
        const { error: upsertErr } = await supabase
          .from("dim_embedding")
          .upsert(rows, { onConflict: "task_id" });
        if (upsertErr) throw upsertErr;
        embedded += chunk.length;
      } catch (e) {
        for (const c of chunk) errors.push({ taskId: c.id, error: String(e) });
      }
    }

    return Response.json({ ok: true, embedded, total: tasks.length, errors });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
});
