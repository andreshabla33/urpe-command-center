import { withApi } from "@/features/api/with-api";
import { ok, notFound, badRequest, serverError } from "@/features/api/responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const GET = withApi(
  { scopes: ["tasks.read"] },
  async ({ token, ctx }) => {
    const params = await (ctx as { params?: Promise<{ id?: string }> }).params;
    const taskId = params?.id;
    if (!taskId) return badRequest("Missing task id");

    // Canonical fields desde dim_task (read-after-write consistente).
    // Aggregations desde mv_task_current_state (puede ir <1s atrasada).
    const supabase = createServiceRoleClient();
    const [taskRes, aggRes] = await Promise.all([
      supabase.from("dim_task").select("*").eq("id", taskId).maybeSingle(),
      supabase
        .from("mv_task_current_state")
        .select(
          "last_event_at, event_count, escalation_count, last_inbound_at, last_outbound_at, age_days",
        )
        .eq("id", taskId)
        .maybeSingle(),
    ]);
    if (taskRes.error) return serverError(taskRes.error.message);
    if (!taskRes.data) return notFound(`Task ${taskId}`);

    const isPrivileged =
      token.ownerRole === "admin" || token.ownerRole === "liderazgo";
    if (
      !isPrivileged &&
      taskRes.data.owner_email !== token.ownerEmail &&
      taskRes.data.created_by !== token.ownerEmail
    ) {
      return notFound(`Task ${taskId}`);
    }

    const data = { ...taskRes.data, ...(aggRes.data ?? {}) };
    return ok({ data }, token);
  },
);
