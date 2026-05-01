import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Props = {
  ageDays: number | null;
  createdAt?: string | null;
};

export function AgeBadge({ ageDays, createdAt }: Props) {
  if (ageDays == null && !createdAt) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const days = ageDays ?? 0;
  // Brand-restricted heat: crimson (atascada >7d), bright gold (3-7d), gold (fresca).
  const tone =
    days >= 7
      ? "bg-[var(--brand-crimson)]/15 text-[var(--brand-crimson)] ring-1 ring-inset ring-[var(--brand-crimson)]/35"
      : days >= 3
        ? "bg-[var(--brand-bright-gold)]/15 text-[var(--brand-bright-gold)] ring-1 ring-inset ring-[var(--brand-bright-gold)]/35"
        : "bg-[var(--brand-gold)]/12 text-[var(--brand-gold)] ring-1 ring-inset ring-[var(--brand-gold)]/30";

  const relative = createdAt
    ? formatDistanceToNowStrict(parseISO(createdAt), {
        locale: es,
        addSuffix: true,
      })
    : days < 1
      ? "hoy"
      : `hace ${Math.floor(days)} d`;

  const dateLabel = createdAt
    ? format(parseISO(createdAt), "d MMM yyyy", { locale: es })
    : null;

  const tooltip = createdAt
    ? `Creada ${format(parseISO(createdAt), "d MMM yyyy, HH:mm", { locale: es })}`
    : undefined;

  return (
    <div title={tooltip} className="flex flex-col items-start gap-0.5 leading-tight">
      <span
        className={cn(
          "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] tabular-nums",
          tone,
        )}
      >
        {relative}
      </span>
      {dateLabel && (
        <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
          {dateLabel}
        </span>
      )}
    </div>
  );
}
