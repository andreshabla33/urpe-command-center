import { TransitionBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const POST = makeEventEndpoint({
  scopes: ["tasks.update"],
  bodySchema: TransitionBodySchema,
  compute: async ({ body, taskId }) => ({
    eventType: "status_changed",
    metadata: { to: body.status, reason: body.reason ?? null },
    sideEffect: async () => {
      const supabase = createServiceRoleClient();
      const { data: prev } = await supabase
        .from("dim_task")
        .select("status")
        .eq("id", taskId)
        .single();
      if (prev?.status === body.status) return null;
      const { error } = await supabase
        .from("dim_task")
        .update({ status: body.status })
        .eq("id", taskId);
      return error ? { error: error.message } : null;
    },
  }),
});
