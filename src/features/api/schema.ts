import { z } from "zod";
import { TASK_STATUS, TASK_PRIORITY } from "@/features/tasks/types";

/**
 * API v1 — Zod schemas para todos los endpoints.
 * Single source of truth para validación + types + OpenAPI generation.
 */

// ============================================================
// Reusable primitives
// ============================================================

export const TaskIdSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[A-Z][A-Z0-9-]+$/, {
    message: "Task ID must start with uppercase letter and contain only A-Z, 0-9, hyphens",
  });

export const EmailSchema = z.string().email().max(254);

// ============================================================
// Task — write
// ============================================================

export const CreateTaskBodySchema = z.object({
  id: TaskIdSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  owner_email: EmailSchema,
  priority: z.enum(TASK_PRIORITY).default("p2"),
  project_id: z.string().min(1).max(100).optional(),
  due_date: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type CreateTaskBody = z.infer<typeof CreateTaskBodySchema>;

export const TransitionBodySchema = z.object({
  status: z.enum(TASK_STATUS),
  reason: z.string().max(500).optional(),
});
export type TransitionBody = z.infer<typeof TransitionBodySchema>;

export const AssignmentBodySchema = z.object({
  owner_email: EmailSchema,
  reason: z.string().max(500).optional(),
});
export type AssignmentBody = z.infer<typeof AssignmentBodySchema>;

export const CommentBodySchema = z.object({
  text: z.string().min(1).max(10000),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type CommentBody = z.infer<typeof CommentBodySchema>;

export const PingBodySchema = z.object({
  recipients: z.array(EmailSchema).max(10).default([]),
  message: z.string().max(1000).optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type PingBody = z.infer<typeof PingBodySchema>;

export const EscalationBodySchema = z.object({
  level: z.enum(["n1", "n2", "n3"]).optional(),
  reason: z.string().min(1).max(500),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type EscalationBody = z.infer<typeof EscalationBodySchema>;

export const EmailEventBodySchema = z.object({
  direction: z.enum(["sent", "received"]),
  msg_id: z.string().min(1).max(500),
  from: EmailSchema.optional(),
  to: z.array(EmailSchema).max(50).optional(),
  subject: z.string().max(1000).optional(),
  snippet: z.string().max(2000).optional(),
  is_response: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
export type EmailEventBody = z.infer<typeof EmailEventBodySchema>;

// ============================================================
// Task — read query params
// ============================================================

export const TasksQuerySchema = z.object({
  owner: EmailSchema.optional(),
  status: z.enum(TASK_STATUS).optional(),
  project: z.string().min(1).max(100).optional(),
  q: z.string().max(500).optional(),
  age: z.enum(["7d", "30d"]).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type TasksQuery = z.infer<typeof TasksQuerySchema>;

// ============================================================
// Token management (server actions / settings UI)
// ============================================================

export const CreateTokenInputSchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z
    .array(
      z.enum([
        "tasks.read",
        "tasks.create",
        "tasks.update",
        "events.write",
        "persons.read",
        "projects.read",
      ]),
    )
    .min(1),
  expires_in_days: z
    .union([z.literal(30), z.literal(90), z.literal(365), z.literal(0)])
    .default(90),                       // 0 = nunca expira
});
export type CreateTokenInput = z.infer<typeof CreateTokenInputSchema>;
