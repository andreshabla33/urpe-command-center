export const TASK_STATUS = [
  "backlog",
  "in_progress",
  "blocked",
  "escalated",
  "responded",
  "done",
  "cancelled",
] as const;
export type TaskStatus = (typeof TASK_STATUS)[number];

export const TASK_PRIORITY = ["p0", "p1", "p2", "p3"] as const;
export type TaskPriority = (typeof TASK_PRIORITY)[number];
