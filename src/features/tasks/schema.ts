import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "./types";

export const TaskFiltersSchema = z.object({
  owner: z.string().email().optional(),
  project: z.string().optional(),
  status: z.enum(TASK_STATUS).optional(),
  age: z.enum(["7d", "30d"]).optional(),
});
export type TaskFilters = z.infer<typeof TaskFiltersSchema>;
