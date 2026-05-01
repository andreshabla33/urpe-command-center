import { CommentBodySchema } from "@/features/api/schema";
import { makeEventEndpoint } from "@/features/api/write-handler";

export const POST = makeEventEndpoint({
  scopes: ["events.write"],
  bodySchema: CommentBodySchema,
  compute: ({ body }) => ({
    eventType: "comment",
    metadata: { text: body.text, ...body.metadata },
  }),
});
