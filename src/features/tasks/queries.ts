import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { TaskFiltersSchema, type TaskFilters } from "./schema";

type RawTaskRow = Database["public"]["Views"]["mv_task_current_state"]["Row"];
type FactEventRow = Database["public"]["Tables"]["fact_event"]["Row"];

export type AiSuggestion = {
  action: string;
  reason: string;
  confidence: number;
  ping_recipients?: string[];
  generated_at: string;
};

export type TaskRow = RawTaskRow & { suggestion: AiSuggestion | null };

const ACTIVE_STATUSES = ["backlog", "in_progress", "blocked", "escalated"] as const;

export async function getTasks(
  input: Partial<TaskFilters> = {},
): Promise<TaskRow[]> {
  const filters = TaskFiltersSchema.parse(input);
  const supabase = await createClient();
  let query = supabase
    .from("mv_task_current_state")
    .select("*")
    .order(filters.sort, {
      ascending: filters.dir === "asc",
      nullsFirst: false,
    });

  if (filters.owner === "unassigned") {
    query = query.is("owner_email", null);
  } else if (filters.owner) {
    query = query.eq("owner_email", filters.owner);
  }
  if (filters.project) query = query.eq("project_id", filters.project);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.age === "7d") query = query.gte("age_days", 7);
  if (filters.age === "30d") query = query.gte("age_days", 30);
  if (filters.q) {
    const escaped = filters.q.replace(/[%_]/g, (c) => `\\${c}`);
    query = query.or(
      `title.ilike.%${escaped}%,description.ilike.%${escaped}%,id.ilike.%${escaped}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  const tasks = data ?? [];
  if (tasks.length === 0) return [];

  const ids = tasks.map((t) => t.id).filter((id): id is string => id != null);
  return attachSuggestions(tasks, ids);
}

export type StatusCounts = Record<string, number>;

export async function getStatusCounts(): Promise<StatusCounts> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mv_task_current_state")
    .select("status");
  const counts: StatusCounts = {};
  for (const row of data ?? []) {
    if (!row.status) continue;
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

async function attachSuggestions(
  tasks: RawTaskRow[],
  ids: string[],
): Promise<TaskRow[]> {
  const supabase = await createClient();
  const { data: suggestions } = await supabase
    .from("fact_event")
    .select("task_id, metadata, timestamp")
    .eq("event_type", "ai_suggestion")
    .in("task_id", ids);

  const latest = new Map<string, AiSuggestion & { ts: string }>();
  for (const s of suggestions ?? []) {
    if (!s.task_id || !s.metadata) continue;
    const m = s.metadata as Record<string, unknown>;
    const current = latest.get(s.task_id);
    if (!current || s.timestamp > current.ts) {
      latest.set(s.task_id, {
        ts: s.timestamp,
        generated_at: s.timestamp,
        action: String(m.action ?? ""),
        reason: String(m.reason ?? ""),
        confidence: Number(m.confidence ?? 0),
        ping_recipients: Array.isArray(m.ping_recipients)
          ? (m.ping_recipients as string[])
          : undefined,
      });
    }
  }

  return tasks.map((t) => ({
    ...t,
    suggestion: t.id ? latest.get(t.id) ?? null : null,
  }));
}

export async function getTask(id: string): Promise<TaskRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mv_task_current_state")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return null;
  const [withSugg] = await attachSuggestions([data], [id]);
  return withSugg ?? null;
}

export async function getTaskEvents(taskId: string): Promise<FactEventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_event")
    .select("*")
    .eq("task_id", taskId)
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type TaskKpis = {
  open: number;
  stuck: number;
  p0_active: number;
  avg_response_hours: number | null;
};

export type DailyPoint = { day: string; count: number };

export async function getActivityTrend(days = 14): Promise<DailyPoint[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 86_400_000);
  since.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("fact_event")
    .select("timestamp")
    .gte("timestamp", since.toISOString());
  if (error) throw error;

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 86_400_000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of data ?? []) {
    const key = row.timestamp.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({ day, count }));
}

export async function getKpis(): Promise<TaskKpis> {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase
    .from("mv_task_current_state")
    .select("status, priority, age_days, last_inbound_at, last_outbound_at, created_at");
  if (error) throw error;

  const open = (tasks ?? []).filter((t) =>
    ACTIVE_STATUSES.includes(t.status as (typeof ACTIVE_STATUSES)[number]),
  ).length;
  const stuck = (tasks ?? []).filter(
    (t) =>
      ACTIVE_STATUSES.includes(t.status as (typeof ACTIVE_STATUSES)[number]) &&
      (t.age_days ?? 0) >= 7,
  ).length;
  const p0_active = (tasks ?? []).filter(
    (t) =>
      t.priority === "p0" &&
      ACTIVE_STATUSES.includes(t.status as (typeof ACTIVE_STATUSES)[number]),
  ).length;

  const responseTimes: number[] = [];
  for (const t of tasks ?? []) {
    if (t.last_inbound_at && t.last_outbound_at) {
      const inbound = new Date(t.last_inbound_at).getTime();
      const outbound = new Date(t.last_outbound_at).getTime();
      if (inbound > outbound) {
        responseTimes.push((inbound - outbound) / 3_600_000);
      }
    }
  }
  const avg_response_hours =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : null;

  return { open, stuck, p0_active, avg_response_hours };
}

export async function listOwners(): Promise<{ email: string; full_name: string | null }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dim_person")
    .select("email, full_name")
    .eq("is_active", true)
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}
