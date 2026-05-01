import { PingBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";

export const POST = makeEventEndpoint({
  scopes: ["events.write"],
  bodySchema: PingBodySchema,
  compute: ({ body }) => ({
    eventType: "ping",
    metadata: {
      recipients: body.recipients,
      message: body.message ?? null,
      ...body.metadata,
    },
  }),
});
