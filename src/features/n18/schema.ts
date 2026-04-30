import { z } from "zod";

export const N18_ALLOWED_EVENTS = [
  "ping",
  "email_sent",
  "email_received",
  "comment",
  "escalated",
  "n1_sent",
  "n2_sent",
  "n3_sent",
] as const;

export const N18EventInputSchema = z.object({
  task_id: z.string().min(1).max(100),
  event_type: z.enum(N18_ALLOWED_EVENTS),
  metadata: z.record(z.string(), z.unknown()).default({}),
  timestamp: z.string().datetime().optional(),
});

export const N18EventBatchSchema = z.object({
  events: z.array(N18EventInputSchema).min(1).max(100),
});

export type N18EventInput = z.infer<typeof N18EventInputSchema>;
