import { z } from "zod";

export const SuggestionSchema = z.object({
  action: z.enum(["ping", "escalate", "reassign", "split", "close", "wait"]),
  reason: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1),
  ping_recipients: z.array(z.string().email()).optional(),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const CategorizationSchema = z.object({
  project_id: z.string().nullable(),
  priority: z.enum(["p0", "p1", "p2", "p3"]),
  category: z.string().min(1).max(60),
});
export type Categorization = z.infer<typeof CategorizationSchema>;
