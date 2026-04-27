import { cn } from "@/lib/utils";
import type { TaskPriority } from "../types";

const PRIORITY_TONE: Record<TaskPriority, string> = {
  p0: "bg-red-500/15 text-red-600 dark:text-red-400",
  p1: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  p2: "bg-muted text-muted-foreground",
  p3: "bg-muted text-muted-foreground/60",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const p = priority as TaskPriority;
  const tone = PRIORITY_TONE[p] ?? PRIORITY_TONE.p2;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tabular-nums",
        tone,
      )}
    >
      {p}
    </span>
  );
}
