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
  const tone =
    days >= 7
      ? "bg-red-500/15 text-red-600 dark:text-red-400"
      : days >= 3
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";

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
