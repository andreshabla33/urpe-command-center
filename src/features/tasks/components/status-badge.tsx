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

/**
 * Paleta brandbook-restringida: solo Navy, Gold (variantes), Silver, Crimson.
 * Nada de blue/violet/emerald/cyan/orange — el sistema es deliberadamente austero.
 */
const STATUS_TONE: Record<
  TaskStatus,
  { bg: string; ring: string; dot: string; text: string }
> = {
  backlog: {
    bg: "bg-[var(--brand-silver)]/10",
    ring: "ring-[var(--brand-silver)]/30",
    dot: "bg-[var(--brand-silver)]",
    text: "text-[var(--brand-silver)]",
  },
  in_progress: {
    bg: "bg-[var(--brand-gold)]/12",
    ring: "ring-[var(--brand-gold)]/35",
    dot: "bg-[var(--brand-gold)]",
    text: "text-[var(--brand-gold)]",
  },
  blocked: {
    bg: "bg-[var(--brand-crimson)]/15",
    ring: "ring-[var(--brand-crimson)]/40",
    dot: "bg-[var(--brand-crimson)]",
    text: "text-[var(--brand-crimson)]",
  },
  escalated: {
    bg: "bg-[var(--brand-crimson)]/15",
    ring: "ring-[var(--brand-crimson)]/40",
    dot: "bg-[var(--brand-crimson)]",
    text: "text-[var(--brand-crimson)]",
  },
  responded: {
    bg: "bg-[var(--brand-bright-gold)]/15",
    ring: "ring-[var(--brand-bright-gold)]/40",
    dot: "bg-[var(--brand-bright-gold)]",
    text: "text-[var(--brand-bright-gold)]",
  },
  done: {
    bg: "bg-[var(--brand-gold)]/22",
    ring: "ring-[var(--brand-gold)]/50",
    dot: "bg-[var(--brand-gold)]",
    text: "text-[var(--brand-bright-gold)]",
  },
  cancelled: {
    bg: "bg-[var(--brand-silver)]/8",
    ring: "ring-[var(--brand-silver)]/20",
    dot: "bg-[var(--brand-silver)]/60",
    text: "text-[var(--brand-silver)]/70 line-through",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as TaskStatus;
  const tone = STATUS_TONE[s] ?? STATUS_TONE.backlog;
  const label = STATUS_LABEL[s] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] ring-1 ring-inset",
        tone.bg,
        tone.text,
        tone.ring,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden />
      {label}
    </span>
  );
}
