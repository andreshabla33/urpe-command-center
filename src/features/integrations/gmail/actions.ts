"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendReply } from "@/lib/google/gmail";

const ReplySchema = z.object({
  taskId: z.string().min(1),
  body: z.string().trim().min(1).max(20000),
});

export async function replyToTask(
  input: unknown,
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  const parsed = ReplySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid input" };

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email) return { ok: false, error: "not_authenticated" };

  const supabase = createServiceRoleClient();
  const { data: lastEmail } = await supabase
    .from("fact_email")
    .select("thread_id, account, from_email, to_email, subject, message_id, direction")
    .eq("task_id", parsed.data.taskId)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastEmail || !lastEmail.thread_id) {
    return { ok: false, error: "no_thread_to_reply_to" };
  }

  const replyTo =
    lastEmail.direction === "inbound"
      ? lastEmail.from_email ?? ""
      : lastEmail.to_email ?? "";
  if (!replyTo) return { ok: false, error: "no_recipient" };

  const subject = lastEmail.subject?.startsWith("Re:")
    ? lastEmail.subject
    : `Re: ${lastEmail.subject ?? ""}`;

  try {
    const sent = await sendReply({
      account: lastEmail.account,
      threadId: lastEmail.thread_id,
      to: replyTo,
      subject,
      body: parsed.data.body,
      inReplyToMessageId: lastEmail.message_id,
    });

    await supabase.from("fact_email").insert({
      message_id: sent.id,
      thread_id: sent.threadId,
      task_id: parsed.data.taskId,
      account: lastEmail.account,
      direction: "outbound",
      from_email: lastEmail.account,
      to_email: replyTo,
      subject,
      snippet: parsed.data.body.slice(0, 280),
      sent_at: new Date().toISOString(),
    });

    await supabase.from("fact_event").insert({
      task_id: parsed.data.taskId,
      event_type: "email_sent",
      actor_email: user.email,
      timestamp: new Date().toISOString(),
      metadata: {
        source: "ui_reply",
        message_id: sent.id,
        thread_id: sent.threadId,
        to: replyTo,
      },
    });

    revalidatePath(`/tasks/${parsed.data.taskId}`);
    return { ok: true, messageId: sent.id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
