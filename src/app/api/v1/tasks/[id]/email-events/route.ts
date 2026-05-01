import { EmailEventBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";

export const POST = makeEventEndpoint({
  scopes: ["events.write"],
  bodySchema: EmailEventBodySchema,
  compute: ({ body }) => ({
    eventType: body.direction === "sent" ? "email_sent" : "email_received",
    metadata: {
      msg_id: body.msg_id,
      from: body.from ?? null,
      to: body.to ?? [],
      subject: body.subject ?? null,
      snippet: body.snippet ?? null,
      is_response: body.is_response,
      ...body.metadata,
    },
  }),
});
