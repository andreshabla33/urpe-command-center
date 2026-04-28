"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/google/calendar";
import { captureServerEvent } from "@/lib/posthog/server";

const TaskIdSchema = z.object({ taskId: z.string().min(1) });

export async function linkTaskToCalendar(input: {
  taskId: string;
}): Promise<
  | { ok: true; event_id: string; html_link?: string }
  | { ok: false; error: string }
> {
  const parsed = TaskIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { data: task, error: readErr } = await supabase
    .from("dim_task")
    .select("id, title, description, due_date, metadata")
    .eq("id", parsed.data.taskId)
    .single();
  if (readErr || !task) return { ok: false, error: "task_not_found" };
  if (!task.due_date) return { ok: false, error: "task_has_no_due_date" };

  const metadata = (task.metadata as Record<string, unknown>) ?? {};
  if (typeof metadata.calendar_event_id === "string") {
    return { ok: false, error: "already_linked" };
  }

  try {
    const event = await createCalendarEvent({
      account: user.email,
      summary: `${task.id} · ${task.title}`,
      description: [task.description, `Task: ${task.id}`]
        .filter(Boolean)
        .join("\n\n"),
      startIso: task.due_date,
    });

    const newMetadata = {
      ...metadata,
      calendar_event_id: event.id,
      calendar_html_link: event.htmlLink ?? null,
    };
    await supabase
      .from("dim_task")
      .update({ metadata: newMetadata })
      .eq("id", task.id);

    await supabase.from("fact_event").insert({
      task_id: task.id,
      event_type: "comment",
      actor_email: user.email,
      timestamp: new Date().toISOString(),
      metadata: {
        source: "calendar",
        kind: "linked",
        calendar_event_id: event.id,
        html_link: event.htmlLink ?? null,
      },
    });

    await supabase.rpc("refresh_mv_task_current_state");
    revalidatePath(`/tasks/${task.id}`);

    await captureServerEvent({
      email: user.email,
      event: "task_calendar_linked",
      properties: { task_id: task.id, calendar_event_id: event.id },
    });

    return { ok: true, event_id: event.id, html_link: event.htmlLink };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function unlinkTaskFromCalendar(input: {
  taskId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = TaskIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid_input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { data: task } = await supabase
    .from("dim_task")
    .select("id, metadata")
    .eq("id", parsed.data.taskId)
    .single();
  if (!task) return { ok: false, error: "task_not_found" };

  const metadata = (task.metadata as Record<string, unknown>) ?? {};
  const eventId =
    typeof metadata.calendar_event_id === "string"
      ? metadata.calendar_event_id
      : null;
  if (!eventId) return { ok: false, error: "not_linked" };

  try {
    await deleteCalendarEvent(user.email, eventId);
  } catch (e) {
    const msg = (e as Error).message;
    if (!msg.includes("404") && !msg.includes("410")) {
      return { ok: false, error: msg };
    }
  }

  const next = { ...metadata };
  delete next.calendar_event_id;
  delete next.calendar_html_link;

  await supabase
    .from("dim_task")
    .update({ metadata: next })
    .eq("id", task.id);

  await supabase.from("fact_event").insert({
    task_id: task.id,
    event_type: "comment",
    actor_email: user.email,
    timestamp: new Date().toISOString(),
    metadata: {
      source: "calendar",
      kind: "unlinked",
      calendar_event_id: eventId,
    },
  });
  await supabase.rpc("refresh_mv_task_current_state");
  revalidatePath(`/tasks/${task.id}`);

  return { ok: true };
}
