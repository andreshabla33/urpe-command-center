import { cn } from "@/lib/utils";

export function AgeBadge({ ageDays }: { ageDays: number | null }) {
  if (ageDays == null) return <span className="text-xs text-muted-foreground">—</span>;

  const tone =
    ageDays >= 7
      ? "bg-red-500/15 text-red-600 dark:text-red-400"
      : ageDays >= 3
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";

  const label = ageDays < 1 ? "<1d" : `${Math.floor(ageDays)}d`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
        tone,
      )}
    >
      {label}
    </span>
  );
}
