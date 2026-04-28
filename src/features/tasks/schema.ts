import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "./types";

export const TaskFiltersSchema = z.object({
  owner: z.string().email().optional(),
  project: z.string().optional(),
  status: z.enum(TASK_STATUS).optional(),
  age: z.enum(["7d", "30d"]).optional(),
});
export type TaskFilters = z.infer<typeof TaskFiltersSchema>;

const TaskIdRegex = /^[A-Z][A-Z0-9-]{2,40}$/;

export const CreateTaskSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(TaskIdRegex, "Formato: MAYÚSCULAS, números y guiones (ej. URPE-IS-022)"),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  owner_email: z.string().email(),
  project_id: z.string().trim().min(1).optional().or(z.literal("")),
  priority: z.enum(TASK_PRIORITY).default("p2"),
  due_date: z.string().optional().or(z.literal("")),
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
