import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { ResolvedToken } from "./auth";

/**
 * Emite un fact_event en nombre de un agente con audit trail completo.
 * Devuelve el event_id si se insertó (o null si dedupado por replay constraint).
 *
 * Convención del audit trail:
 * - actor_email = ownerEmail (el usuario que emitió el token)
 * - metadata.via_token = nombre amigable del token ("Rocky bot")
 * - metadata.token_hash_prefix = 8 chars para correlación con dim_user_token
 * - metadata.source = "api_v1" para distinguir de eventos de UI/cron/webhook
 */
export async function emitEventViaApi(args: {
  token: ResolvedToken;
  taskId: string;
  eventType: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}): Promise<{ ok: true; event_id: string; deduped: boolean } | { ok: false; error: string }> {
  const supabase = createServiceRoleClient();

  const baseMeta: Record<string, unknown> = {
    via_token: args.token.tokenName,
    token_hash_prefix: args.token.tokenHashPrefix,
    source: "api_v1",
    ...(args.metadata ?? {}),
  };

  const { data, error } = await supabase
    .from("fact_event")
    .upsert(
      {
        task_id: args.taskId,
        event_type: args.eventType,
        actor_email: args.token.ownerEmail,
        timestamp: args.timestamp ?? new Date().toISOString(),
        metadata: baseMeta,
      },
      {
        onConflict: "task_id,event_type,timestamp,actor_email",
        ignoreDuplicates: true,
      },
    )
    .select("event_id")
    .single();

  if (error) {
    // PG unique violation desde la constraint = dedup, no error real
    if (error.code === "23505") {
      return { ok: true, event_id: "", deduped: true };
    }
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: true, event_id: "", deduped: true };
  }

  return { ok: true, event_id: data.event_id, deduped: false };
}

/**
 * Verifica que la tarea exista (FK guard pre-emit). Retorna `null` si no existe.
 */
export async function fetchTaskExists(taskId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("dim_task")
    .select("id")
    .eq("id", taskId)
    .maybeSingle();
  return !!data;
}
