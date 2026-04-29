import type { TaskStatus } from "../types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "En curso",
  blocked: "Bloqueada",
  escalated: "Escalada",
  responded: "Respondida",
  done: "Completa",
  cancelled: "Cancelada",
};

const STATUS_TONE: Record<TaskStatus, { bg: string; dot: string; text: string }> = {
  backlog: {
    bg: "bg-muted/60 ring-border",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
  },
  in_progress: {
    bg: "bg-blue-500/10 ring-blue-500/20 dark:bg-blue-500/15",
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300",
  },
  blocked: {
    bg: "bg-rose-500/10 ring-rose-500/20 dark:bg-rose-500/15",
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-300",
  },
  escalated: {
    bg: "bg-orange-500/10 ring-orange-500/25 dark:bg-orange-500/15",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
  },
  responded: {
    bg: "bg-violet-500/10 ring-violet-500/20 dark:bg-violet-500/15",
    dot: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-300",
  },
  done: {
    bg: "bg-emerald-500/10 ring-emerald-500/20 dark:bg-emerald-500/15",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  cancelled: {
    bg: "bg-muted/40 ring-border",
    dot: "bg-muted-foreground/40",
    text: "text-muted-foreground/70 line-through",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as TaskStatus;
  const tone = STATUS_TONE[s] ?? STATUS_TONE.backlog;
  const label = STATUS_LABEL[s] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
        tone.bg,
        tone.text,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", tone.dot)}
        aria-hidden
      />
      {label}
    </span>
  );
}
