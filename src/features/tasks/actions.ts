"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { TASK_STATUS } from "./types";
import { CreateTaskSchema } from "./schema";
import { chat, OPENROUTER_MODELS } from "@/lib/openrouter/client";
import { CategorizationSchema } from "@/features/ai/schema";
import { CATEGORIZE_TASK_SYSTEM } from "@/features/ai/prompts";

const SetStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(TASK_STATUS),
});

export async function setTaskStatus(input: {
  taskId: string;
  status: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = SetStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "invalid input" };
  }
  const { taskId, status } = parsed.data;

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();

  const { data: task, error: readErr } = await supabase
    .from("dim_task")
    .select("status")
    .eq("id", taskId)
    .single();
  if (readErr || !task) return { ok: false, error: "task_not_found" };
  if (task.status === status) return { ok: true };

  const { error: updateErr } = await supabase
    .from("dim_task")
    .update({ status })
    .eq("id", taskId);
  if (updateErr) return { ok: false, error: updateErr.message };

  const { error: eventErr } = await supabase.from("fact_event").insert({
    task_id: taskId,
    event_type: "status_changed",
    actor_email: user.email,
    timestamp: new Date().toISOString(),
    metadata: { from: task.status, to: status },
  });
  if (eventErr) return { ok: false, error: eventErr.message };

  await supabase.rpc("refresh_mv_task_current_state");

  revalidatePath("/");
  revalidatePath("/kanban");
  revalidatePath("/calendar");

  return { ok: true };
}

export async function createTask(
  input: unknown,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const parsed = CreateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "invalid input",
    };
  }

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("dim_task")
    .select("id")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (existing) return { ok: false, error: "task_id_already_exists" };

  const { error: insertErr } = await supabase.from("dim_task").insert({
    id: parsed.data.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    owner_email: parsed.data.owner_email,
    created_by: user.email,
    created_at: now,
    due_date: parsed.data.due_date || null,
    status: "backlog",
    priority: parsed.data.priority,
    project_id: parsed.data.project_id || null,
    metadata: { source: "ui_create" },
  });
  if (insertErr) return { ok: false, error: insertErr.message };

  const { error: eventErr } = await supabase.from("fact_event").insert({
    task_id: parsed.data.id,
    event_type: "created",
    actor_email: user.email,
    timestamp: now,
    metadata: {
      source: "ui_create",
      owner_email: parsed.data.owner_email,
      priority: parsed.data.priority,
    },
  });
  if (eventErr) return { ok: false, error: eventErr.message };

  await supabase.rpc("refresh_mv_task_current_state");
  revalidatePath("/");
  revalidatePath("/kanban");

  return { ok: true, id: parsed.data.id };
}

const TaskIdSchema = z.object({ taskId: z.string().min(1) });

export async function pingTask(input: { taskId: string }) {
  const parsed = TaskIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "invalid input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false as const, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("fact_event").insert({
    task_id: parsed.data.taskId,
    event_type: "ping",
    actor_email: user.email,
    timestamp: new Date().toISOString(),
    metadata: { source: "ui_button" },
  });
  if (error) return { ok: false as const, error: error.message };

  await supabase.rpc("refresh_mv_task_current_state");
  revalidatePath("/");
  return { ok: true as const };
}

export async function categorizeTask(input: { taskId: string }) {
  const parsed = TaskIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "invalid input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false as const, error: "not_authenticated" };

  const supabase = createServiceRoleClient();

  const { data: task, error: readErr } = await supabase
    .from("dim_task")
    .select("id,title,description")
    .eq("id", parsed.data.taskId)
    .single();
  if (readErr || !task) return { ok: false as const, error: "task_not_found" };

  const raw = await chat({
    model: OPENROUTER_MODELS.fast,
    messages: [
      { role: "system", content: CATEGORIZE_TASK_SYSTEM },
      {
        role: "user",
        content: JSON.stringify({
          title: task.title,
          description: task.description,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 200,
  });

  const cat = CategorizationSchema.safeParse(JSON.parse(raw));
  if (!cat.success) return { ok: false as const, error: "llm_invalid_output" };

  const updates: Record<string, unknown> = {
    priority: cat.data.priority,
  };
  if (cat.data.project_id) updates.project_id = cat.data.project_id;

  await supabase.from("dim_task").update(updates).eq("id", task.id);
  await supabase.from("fact_event").insert({
    task_id: task.id,
    event_type: "ai_categorized",
    actor_email: user.email,
    timestamp: new Date().toISOString(),
    metadata: cat.data,
  });
  await supabase.rpc("refresh_mv_task_current_state");

  revalidatePath("/");
  return { ok: true as const, ...cat.data };
}
