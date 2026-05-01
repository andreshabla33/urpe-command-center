import { AssignmentBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const POST = makeEventEndpoint({
  scopes: ["tasks.update"],
  bodySchema: AssignmentBodySchema,
  compute: async ({ body, taskId }) => ({
    eventType: "assigned",
    metadata: { to: body.owner_email, reason: body.reason ?? null },
    sideEffect: async () => {
      const supabase = createServiceRoleClient();
      const { data: prev } = await supabase
        .from("dim_task")
        .select("owner_email")
        .eq("id", taskId)
        .single();
      if (prev?.owner_email === body.owner_email) return null;
      const { error } = await supabase
        .from("dim_task")
        .update({ owner_email: body.owner_email })
        .eq("id", taskId);
      return error ? { error: error.message } : null;
    },
  }),
});
