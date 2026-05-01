import { withApi } from "@/features/api/with-api";
import { ok, notFound, badRequest, serverError } from "@/features/api/responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const GET = withApi(
  { scopes: ["tasks.read"] },
  async ({ token, ctx }) => {
    const params = await (ctx as { params?: Promise<{ id?: string }> }).params;
    const taskId = params?.id;
    if (!taskId) return badRequest("Missing task id");

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("mv_task_current_state")
      .select("*")
      .eq("id", taskId)
      .maybeSingle();
    if (error) return serverError(error.message);
    if (!data) return notFound(`Task ${taskId}`);

    const isPrivileged =
      token.ownerRole === "admin" || token.ownerRole === "liderazgo";
    if (
      !isPrivileged &&
      data.owner_email !== token.ownerEmail &&
      data.created_by !== token.ownerEmail
    ) {
      return notFound(`Task ${taskId}`);
    }

    return ok({ data }, token);
  },
);
