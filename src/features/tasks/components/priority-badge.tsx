import { cn } from "@/lib/utils";
import type { TaskPriority } from "../types";

const PRIORITY_TONE: Record<TaskPriority, string> = {
  p0: "bg-[var(--brand-crimson)]/15 text-[var(--brand-crimson)] ring-[var(--brand-crimson)]/40",
  p1: "bg-[var(--brand-gold)]/15 text-[var(--brand-bright-gold)] ring-[var(--brand-gold)]/40",
  p2: "bg-[var(--brand-silver)]/10 text-[var(--brand-silver)] ring-[var(--brand-silver)]/25",
  p3: "bg-[var(--brand-silver)]/6 text-[var(--brand-silver)]/60 ring-[var(--brand-silver)]/15",
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
