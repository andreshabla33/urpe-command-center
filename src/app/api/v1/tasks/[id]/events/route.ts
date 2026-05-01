import { withApi } from "@/features/api/with-api";
import { ok, badRequest, serverError, notFound } from "@/features/api/responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const GET = withApi(
  { scopes: ["tasks.read"] },
  async ({ request, token, ctx }) => {
    const params = await (ctx as { params?: Promise<{ id?: string }> }).params;
    const taskId = params?.id;
    if (!taskId) return badRequest("Missing task id");

    const supabase = createServiceRoleClient();

    // Visibility check first
    const { data: task } = await supabase
      .from("dim_task")
      .select("id, owner_email, created_by")
      .eq("id", taskId)
      .maybeSingle();
    if (!task) return notFound(`Task ${taskId}`);

    const isPrivileged =
      token.ownerRole === "admin" || token.ownerRole === "liderazgo";
    if (
      !isPrivileged &&
      task.owner_email !== token.ownerEmail &&
      task.created_by !== token.ownerEmail
    ) {
      return notFound(`Task ${taskId}`);
    }

    const since = request.nextUrl.searchParams.get("since");
    let q = supabase
      .from("fact_event")
      .select("*")
      .eq("task_id", taskId)
      .order("timestamp", { ascending: false })
      .limit(200);

    if (since) {
      q = q.gte("timestamp", since);
    }

    const { data, error } = await q;
    if (error) return serverError(error.message);

    return ok({ data: data ?? [] }, token);
  },
);
