import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { resolveOwnerByPhone, resolveTaskFromText } from "./linker";
import {
  normalizeKapsoPayload,
  type KapsoMessagePayload,
} from "./schema";

export type KapsoProcessResult = {
  ok: boolean;
  ignored_reason?: string;
  message_id?: string;
  task_id?: string | null;
  resolved_owner?: string | null;
};

export async function processKapsoEvent(
  payload: KapsoMessagePayload,
): Promise<KapsoProcessResult> {
  const msg = normalizeKapsoPayload(payload);
  if (!msg) return { ok: false, ignored_reason: "no_message_id_in_payload" };

  const supabase = createServiceRoleClient();

  const fromPhoneOwner =
    msg.direction === "inbound"
      ? await resolveOwnerByPhone(msg.from_phone)
      : null;
  const toPhoneOwner =
    msg.direction === "outbound"
      ? await resolveOwnerByPhone(msg.to_phone)
      : null;
  const owner = fromPhoneOwner ?? toPhoneOwner;

  const taskId = await resolveTaskFromText(msg.body);

  const actorEmail =
    msg.direction === "inbound" ? owner ?? null : owner ?? "dau@urpeailab.com";

  await supabase.from("fact_event").upsert(
    {
      task_id: taskId,
      event_type: "comment",
      actor_email: actorEmail,
      timestamp: new Date(msg.timestamp).toISOString(),
      metadata: {
        source: "kapso",
        kind: "whatsapp_message",
        message_id: msg.message_id,
        direction: msg.direction,
        from_phone: msg.from_phone,
        to_phone: msg.to_phone,
        body: msg.body,
        contact_name: msg.contact_name,
        resolved_owner: owner,
      },
    },
    {
      onConflict: "task_id,event_type,timestamp,actor_email",
      ignoreDuplicates: true,
    },
  );

  if (taskId) {
    await supabase.rpc("refresh_mv_task_current_state");
  }

  return {
    ok: true,
    message_id: msg.message_id,
    task_id: taskId,
    resolved_owner: owner,
  };
}
