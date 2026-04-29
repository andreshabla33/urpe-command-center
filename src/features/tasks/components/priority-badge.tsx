import { cn } from "@/lib/utils";
import type { TaskPriority } from "../types";

const PRIORITY_TONE: Record<TaskPriority, string> = {
  p0: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-400 dark:bg-red-500/15",
  p1: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15",
  p2: "bg-muted/60 text-muted-foreground ring-border",
  p3: "bg-muted/40 text-muted-foreground/60 ring-border",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const p = priority as TaskPriority;
  const tone = PRIORITY_TONE[p] ?? PRIORITY_TONE.p2;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tabular-nums ring-1 ring-inset",
        tone,
      )}
    >
      {p}
    </span>
  );
}
