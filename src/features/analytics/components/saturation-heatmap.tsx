import { cn } from "@/lib/utils";
import type { HeatmapCell } from "../queries";

const STATUSES = ["backlog", "in_progress", "blocked", "escalated"] as const;

export function SaturationHeatmap({ cells }: { cells: HeatmapCell[] }) {
  const owners = Array.from(new Set(cells.map((c) => c.owner))).sort();
  const lookup = new Map<string, number>();
  let max = 0;
  for (const c of cells) {
    lookup.set(`${c.owner}|${c.status}`, c.count);
    if (c.count > max) max = c.count;
  }

  if (owners.length === 0 || max === 0) {
    return (
      <p className="px-4 py-12 text-center text-sm text-muted-foreground">
        Sin tareas activas para mostrar saturación.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-left font-normal text-muted-foreground">
              Persona
            </th>
            {STATUSES.map((s) => (
              <th
                key={s}
                className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {s}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => {
            const row = STATUSES.map((s) => lookup.get(`${owner}|${s}`) ?? 0);
            const total = row.reduce((a, b) => a + b, 0);
            return (
              <tr key={owner} className="border-b last:border-b-0">
                <td className="px-3 py-1.5 truncate max-w-[260px]">{owner}</td>
                {row.map((count, idx) => (
                  <td key={idx} className="px-3 py-1">
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded px-1.5 font-mono text-[10px] tabular-nums",
                        intensityClass(count, max),
                      )}
                    >
                      {count > 0 ? count : "·"}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-1 text-right font-mono tabular-nums">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function intensityClass(count: number, max: number): string {
  if (count === 0) return "text-muted-foreground/40";
  const ratio = count / max;
  // Brand-restricted heat: gold scale, crimson reserved para nivel crítico (>=75%)
  if (ratio >= 0.75)
    return "bg-[var(--brand-crimson)]/20 text-[var(--brand-crimson)]";
  if (ratio >= 0.5)
    return "bg-[var(--brand-bright-gold)]/22 text-[var(--brand-bright-gold)]";
  if (ratio >= 0.25)
    return "bg-[var(--brand-gold)]/14 text-[var(--brand-gold)]";
  return "bg-[var(--brand-silver)]/8 text-[var(--brand-silver)]";
}
