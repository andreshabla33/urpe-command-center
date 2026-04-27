import "server-only";
import { createClient } from "@/lib/supabase/server";

export type BurnDownPoint = { date: string; open: number };
export type HeatmapCell = {
  owner: string;
  status: string;
  count: number;
};
export type DailySummaryRow = {
  date_key: string;
  generated_at: string;
  content_md: string;
  email_sent_at: string | null;
};

export async function getLatestDailySummary(): Promise<DailySummaryRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_summary")
    .select("date_key, generated_at, content_md, email_sent_at")
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DailySummaryRow | null) ?? null;
}

const ACTIVE_STATUSES = ["backlog", "in_progress", "blocked", "escalated"];

export async function getBurnDown(daysBack = 30): Promise<BurnDownPoint[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - daysBack * 86400 * 1000);

  const { data: tasks } = await supabase
    .from("dim_task")
    .select("id, created_at, status");

  const { data: closeEvents } = await supabase
    .from("fact_event")
    .select("task_id, timestamp")
    .eq("event_type", "closed");

  const closedAtByTask = new Map<string, Date>();
  for (const e of closeEvents ?? []) {
    if (e.task_id) closedAtByTask.set(e.task_id, new Date(e.timestamp));
  }

  const points: BurnDownPoint[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = daysBack - 1; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86400 * 1000);
    const dayEnd = new Date(day.getTime() + 86400 * 1000 - 1);
    let open = 0;
    for (const t of tasks ?? []) {
      const created = new Date(t.created_at);
      if (created > dayEnd) continue;
      const closedAt = t.id ? closedAtByTask.get(t.id) : undefined;
      if (closedAt && closedAt <= dayEnd) continue;
      open++;
    }
    points.push({
      date: day.toISOString().slice(0, 10),
      open,
    });
  }

  if (points.length === 0 || since) {
    // since used implicitly via daysBack
  }

  return points;
}

export async function getHeatmap(): Promise<HeatmapCell[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mv_task_current_state")
    .select("owner_email, status")
    .in("status", ACTIVE_STATUSES);

  const buckets = new Map<string, HeatmapCell>();
  for (const row of data ?? []) {
    const owner = row.owner_email ?? "(sin asignar)";
    const status = row.status ?? "backlog";
    const key = `${owner}|${status}`;
    const existing = buckets.get(key);
    if (existing) existing.count++;
    else buckets.set(key, { owner, status, count: 1 });
  }

  return Array.from(buckets.values()).sort(
    (a, b) => b.count - a.count || a.owner.localeCompare(b.owner),
  );
}
