import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const TASK_ID_REGEX = /\b([A-Z]{2,}-[A-Z0-9-]{2,})\b/;

export async function resolveTaskId(input: {
  threadId: string | null;
  subject: string;
  bodyPreview: string;
}): Promise<string | null> {
  const fromSubject = TASK_ID_REGEX.exec(input.subject)?.[1];
  if (fromSubject && (await taskExists(fromSubject))) return fromSubject;

  if (input.threadId) {
    const fromThread = await taskFromThread(input.threadId);
    if (fromThread) return fromThread;
  }

  const fromBody = TASK_ID_REGEX.exec(input.bodyPreview)?.[1];
  if (fromBody && (await taskExists(fromBody))) return fromBody;

  return null;
}

async function taskExists(id: string): Promise<boolean> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("dim_task")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  return !!data;
}

async function taskFromThread(threadId: string): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("fact_email")
    .select("task_id")
    .eq("thread_id", threadId)
    .not("task_id", "is", null)
    .limit(1)
    .maybeSingle();
  return data?.task_id ?? null;
}
