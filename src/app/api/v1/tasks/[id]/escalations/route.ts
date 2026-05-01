import { EscalationBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const POST = makeEventEndpoint({
  scopes: ["events.write"],
  bodySchema: EscalationBodySchema,
  compute: ({ body, taskId }) => ({
    eventType: "escalated",
    metadata: { level: body.level ?? null, reason: body.reason, ...body.metadata },
    sideEffect: async () => {
      const supabase = createServiceRoleClient();
      const { data: prev } = await supabase
        .from("dim_task")
        .select("status")
        .eq("id", taskId)
        .single();
      if (prev?.status === "escalated") return null;
      const { error } = await supabase
        .from("dim_task")
        .update({ status: "escalated" })
        .eq("id", taskId);
      return error ? { error: error.message } : null;
    },
  }),
});
