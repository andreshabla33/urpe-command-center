import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  extractBody,
  extractHeader,
  getMessage,
  listHistory,
  type GmailMessage,
} from "@/lib/google/gmail";
import { resolveTaskId } from "./linker";

const SUPPORTED_ACCOUNTS = [
  "dau@urpeailab.com",
  "dau@urpeintegralservices.co",
] as const;
type SupportedAccount = (typeof SUPPORTED_ACCOUNTS)[number];

export async function processGmailNotification(input: {
  emailAddress: string;
  historyId: string;
}): Promise<{ ingested: number; skipped: number }> {
  if (!SUPPORTED_ACCOUNTS.includes(input.emailAddress as SupportedAccount)) {
    return { ingested: 0, skipped: 0 };
  }

  const account = input.emailAddress as SupportedAccount;
  const supabase = createServiceRoleClient();

  const { data: integration } = await supabase
    .from("dim_person_integration")
    .select("watch_history_id")
    .eq("email", account)
    .eq("provider", "gmail")
    .single();

  const startHistoryId = integration?.watch_history_id ?? input.historyId;

  let ingested = 0;
  let skipped = 0;

  try {
    const history = await listHistory(account, startHistoryId);
    const messageIds = new Set<string>();
    for (const item of history.history ?? []) {
      for (const m of item.messages ?? []) messageIds.add(m.id);
      for (const ma of item.messagesAdded ?? []) messageIds.add(ma.message.id);
    }

    for (const id of messageIds) {
      try {
        const msg = await getMessage(account, id);
        const wrote = await ingestMessage(account, msg);
        if (wrote) ingested++;
        else skipped++;
      } catch (e) {
        console.error("ingest failed", id, e);
        skipped++;
      }
    }

    await supabase
      .from("dim_person_integration")
      .update({
        watch_history_id: history.historyId ?? input.historyId,
        updated_at: new Date().toISOString(),
      })
      .eq("email", account)
      .eq("provider", "gmail");
  } catch (e) {
    console.error("history list failed", e);
  }

  return { ingested, skipped };
}

async function ingestMessage(
  account: SupportedAccount,
  msg: GmailMessage,
): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from("fact_email")
    .select("message_id")
    .eq("message_id", msg.id)
    .maybeSingle();
  if (existing) return false;

  const subject = extractHeader(msg.payload, "Subject") ?? "";
  const fromHeader = extractHeader(msg.payload, "From") ?? "";
  const toHeader = extractHeader(msg.payload, "To") ?? "";
  const dateHeader = extractHeader(msg.payload, "Date");
  const sentAt = msg.internalDate
    ? new Date(parseInt(msg.internalDate, 10)).toISOString()
    : dateHeader
      ? new Date(dateHeader).toISOString()
      : new Date().toISOString();

  const fromEmail = extractEmailAddress(fromHeader);
  const toEmail = extractEmailAddress(toHeader);
  const direction = fromEmail === account ? "outbound" : "inbound";

  const body = extractBody(msg.payload);
  const snippet = msg.snippet ?? body.slice(0, 280);

  const taskId = await resolveTaskId({
    threadId: msg.threadId,
    subject,
    bodyPreview: snippet,
  });

  await supabase.from("fact_email").insert({
    message_id: msg.id,
    thread_id: msg.threadId,
    task_id: taskId,
    account,
    direction,
    from_email: fromEmail,
    to_email: toEmail,
    subject,
    snippet,
    sent_at: sentAt,
  });

  if (taskId) {
    await supabase.from("fact_event").upsert(
      {
        task_id: taskId,
        event_type: direction === "inbound" ? "email_received" : "email_sent",
        actor_email: direction === "inbound" ? fromEmail : account,
        timestamp: sentAt,
        metadata: {
          source: "gmail_pubsub",
          message_id: msg.id,
          subject,
        },
      },
      {
        onConflict: "task_id,event_type,timestamp,actor_email",
        ignoreDuplicates: true,
      },
    );
  }

  return true;
}

function extractEmailAddress(header: string): string {
  const match = /<([^>]+)>/.exec(header);
  if (match) return match[1].trim().toLowerCase();
  return header.trim().toLowerCase();
}
