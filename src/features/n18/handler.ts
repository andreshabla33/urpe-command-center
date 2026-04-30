import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { N18EventInput } from "./schema";

const ACTOR_EMAIL = "n18@urpeailab.com";

export type IngestResult =
  | { ok: true; inserted: number; deduped: number }
  | { ok: false; error: string };

export async function ingestN18Events(
  events: N18EventInput[],
): Promise<IngestResult> {
  if (events.length === 0) {
    return { ok: true, inserted: 0, deduped: 0 };
  }

  const supabase = createServiceRoleClient();
  const rows = events.map((e) => ({
    task_id: e.task_id,
    event_type: e.event_type,
    actor_email: ACTOR_EMAIL,
    timestamp: e.timestamp ?? new Date().toISOString(),
    metadata: e.metadata,
  }));

  const { error, data } = await supabase
    .from("fact_event")
    .upsert(rows, {
      onConflict: "task_id,event_type,timestamp,actor_email",
      ignoreDuplicates: true,
    })
    .select("id");

  if (error) return { ok: false, error: error.message };

  const inserted = data?.length ?? 0;
  return {
    ok: true,
    inserted,
    deduped: rows.length - inserted,
  };
}
