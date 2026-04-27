/**
 * One-shot: importa docs/n18_followups_dump.sql al ecosistema Postgres
 * (dim_task, fact_email, fact_event).
 *
 * Idempotente — re-correr es seguro:
 *   - dim_task vía upsert (PK = task_id).
 *   - fact_email ON CONFLICT (message_id) DO NOTHING.
 *   - fact_event ON CONFLICT (task_id, event_type, timestamp, actor_email) DO NOTHING.
 *
 * Uso:
 *   pnpm exec tsx scripts/import-n18-dump.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const DUMP_PATH = resolve(process.cwd(), "docs/n18_followups_dump.sql");
const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const FollowupRow = z.object({
  id: z.number().int(),
  message_id: z.string().min(1),
  thread_id: z.string().nullable(),
  account: z.enum(["dau@urpeailab.com", "dau@urpeintegralservices.co"]),
  recipient_email: z.string().email(),
  recipient_name: z.string().nullable(),
  subject: z.string().nullable(),
  task_id: z.string().min(1),
  task_description: z.string().nullable(),
  due_date: z.string(),
  expected_response: z.string().nullable(),
  status: z.enum(["pending", "responded", "escalado", "cerrado", "cancelled"]),
  last_check_at: z.string().nullable(),
  alerted_at: z.string().nullable(),
  response_summary: z.string().nullable(),
  created_at: z.string(),
  escalation_email_at: z.string().nullable(),
  confirmation_email_at: z.string().nullable(),
  followup_n1_at: z.string().nullable(),
  followup_n2_at: z.string().nullable(),
  followup_n3_at: z.string().nullable(),
});
type FollowupRow = z.infer<typeof FollowupRow>;

const STATUS_MAP: Record<FollowupRow["status"], string> = {
  pending: "in_progress",
  responded: "responded",
  escalado: "escalated",
  cerrado: "done",
  cancelled: "cancelled",
};

type EventInsert = {
  task_id: string;
  event_type: string;
  actor_email: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var: ${name}`);
    console.error("Make sure .env.local is loaded (run with: pnpm exec tsx --env-file=.env.local scripts/import-n18-dump.ts)");
    process.exit(1);
  }
  return v;
}

function loadDumpToSqlite(): FollowupRow[] {
  const sql = readFileSync(DUMP_PATH, "utf8");
  const db = new Database(":memory:");
  db.exec(sql);
  const rows = db.prepare("SELECT * FROM followups ORDER BY id").all();
  db.close();
  return rows.map((r) => FollowupRow.parse(r));
}

function toTask(r: FollowupRow) {
  return {
    id: r.task_id,
    title: r.subject ?? r.task_description ?? r.task_id,
    description: r.task_description,
    owner_email: r.recipient_email,
    created_by: r.account,
    created_at: r.created_at,
    due_date: r.due_date,
    status: STATUS_MAP[r.status],
    priority: "p2",
    metadata: {
      source: "n18-followups",
      thread_id: r.thread_id,
      original_status: r.status,
      expected_response: r.expected_response,
    },
  };
}

function buildEvents(row: FollowupRow): EventInsert[] {
  const events: EventInsert[] = [
    {
      task_id: row.task_id,
      event_type: "created",
      actor_email: row.account,
      timestamp: row.created_at,
      metadata: {
        source: "n18-followups",
        message_id: row.message_id,
        thread_id: row.thread_id,
      },
    },
    {
      task_id: row.task_id,
      event_type: "email_sent",
      actor_email: row.account,
      timestamp: row.created_at,
      metadata: {
        message_id: row.message_id,
        to: row.recipient_email,
        subject: row.subject,
      },
    },
  ];

  const followupTimestamps = [
    { ts: row.followup_n1_at, type: "n1_sent" as const },
    { ts: row.followup_n2_at, type: "n2_sent" as const },
    { ts: row.followup_n3_at, type: "n3_sent" as const },
  ];
  for (const { ts, type } of followupTimestamps) {
    if (ts) {
      events.push({
        task_id: row.task_id,
        event_type: type,
        actor_email: row.account,
        timestamp: ts,
        metadata: { source: "n18-followups" },
      });
    }
  }

  if (row.escalation_email_at) {
    events.push({
      task_id: row.task_id,
      event_type: "escalated",
      actor_email: row.account,
      timestamp: row.escalation_email_at,
      metadata: { source: "n18-followups" },
    });
  }

  if (row.confirmation_email_at) {
    events.push({
      task_id: row.task_id,
      event_type: "email_received",
      actor_email: row.recipient_email,
      timestamp: row.confirmation_email_at,
      metadata: {
        kind: "confirmation",
        summary: row.response_summary,
      },
    });
  }

  if (row.status === "responded" && row.response_summary && !row.confirmation_email_at) {
    events.push({
      task_id: row.task_id,
      event_type: "email_received",
      actor_email: row.recipient_email,
      timestamp: row.last_check_at ?? row.created_at,
      metadata: { summary: row.response_summary },
    });
  }

  if (row.status === "responded" || row.status === "cerrado") {
    events.push({
      task_id: row.task_id,
      event_type: "closed",
      actor_email: row.account,
      timestamp: row.last_check_at ?? row.created_at,
      metadata: { reason: row.status },
    });
  }

  if (row.status === "cancelled") {
    events.push({
      task_id: row.task_id,
      event_type: "closed",
      actor_email: row.account,
      timestamp: row.last_check_at ?? row.created_at,
      metadata: { reason: "cancelled", note: row.response_summary },
    });
  }

  return events;
}

async function main() {
  console.log(`Loading dump from ${DUMP_PATH}...`);
  const rows = loadDumpToSqlite();
  console.log(`Parsed ${rows.length} followup rows.`);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const personsFromDump = new Map<
    string,
    { email: string; full_name: string | null; role: string; is_active: boolean }
  >();
  for (const r of rows) {
    if (!personsFromDump.has(r.recipient_email)) {
      personsFromDump.set(r.recipient_email, {
        email: r.recipient_email,
        full_name: r.recipient_name,
        role: "asesor",
        is_active: true,
      });
    }
    if (!personsFromDump.has(r.account)) {
      personsFromDump.set(r.account, {
        email: r.account,
        full_name: null,
        role: "admin",
        is_active: true,
      });
    }
  }
  const personsToBackfill = Array.from(personsFromDump.values());

  console.log(`Backfilling ${personsToBackfill.length} persons from dump (skip if exist)...`);
  const { error: personsErr } = await supabase
    .from("dim_person")
    .upsert(personsToBackfill, { onConflict: "email", ignoreDuplicates: true });
  if (personsErr) throw personsErr;

  const taskMap = new Map<string, ReturnType<typeof toTask>>();
  for (const r of rows) {
    const t = toTask(r);
    const existing = taskMap.get(t.id);
    if (!existing || (t.created_at ?? "") > (existing.created_at ?? "")) {
      taskMap.set(t.id, t);
    }
  }
  const tasks = Array.from(taskMap.values());

  const emails = rows.map((r) => ({
    message_id: r.message_id,
    thread_id: r.thread_id,
    task_id: r.task_id,
    account: r.account,
    direction: "outbound" as const,
    from_email: r.account,
    to_email: r.recipient_email,
    subject: r.subject,
    snippet: r.task_description,
    sent_at: r.created_at,
  }));

  const eventMap = new Map<string, EventInsert>();
  for (const e of rows.flatMap(buildEvents)) {
    const key = `${e.task_id}|${e.event_type}|${e.timestamp}|${e.actor_email ?? ""}`;
    if (!eventMap.has(key)) eventMap.set(key, e);
  }
  const events = Array.from(eventMap.values());

  console.log(`Upserting ${tasks.length} tasks...`);
  const { error: tasksErr } = await supabase
    .from("dim_task")
    .upsert(tasks, { onConflict: "id" });
  if (tasksErr) throw tasksErr;

  console.log(`Inserting ${emails.length} emails (skip duplicates)...`);
  const { error: emailsErr } = await supabase
    .from("fact_email")
    .upsert(emails, { onConflict: "message_id", ignoreDuplicates: true });
  if (emailsErr) throw emailsErr;

  console.log(`Inserting ${events.length} events (skip duplicates)...`);
  const chunkSize = 500;
  for (let i = 0; i < events.length; i += chunkSize) {
    const chunk = events.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("fact_event")
      .upsert(chunk, {
        onConflict: "task_id,event_type,timestamp,actor_email",
        ignoreDuplicates: true,
      });
    if (error) throw error;
  }

  console.log("Refreshing mv_task_current_state...");
  const { error: refreshErr } = await supabase.rpc(
    "refresh_mv_task_current_state",
  );
  if (refreshErr) {
    console.warn("Failed to refresh MV:", refreshErr.message);
  }

  console.log("\n✅ Import done.");
  console.log(`   ${tasks.length} tasks, ${emails.length} emails, ${events.length} events.`);
}

main().catch((err) => {
  console.error("\n❌ Import failed:", err);
  process.exit(1);
});
