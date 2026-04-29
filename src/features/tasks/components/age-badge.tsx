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

  const label = createdAt
    ? formatDistanceToNowStrict(parseISO(createdAt), {
        locale: es,
        addSuffix: true,
      })
    : days < 1
      ? "hoy"
      : `hace ${Math.floor(days)} d`;

  const tooltip = createdAt
    ? `Creada ${format(parseISO(createdAt), "d MMM yyyy, HH:mm", { locale: es })}`
    : undefined;

  return (
    <span
      title={tooltip}
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] tabular-nums",
        tone,
      )}
    >
      {label}
    </span>
  );
}
