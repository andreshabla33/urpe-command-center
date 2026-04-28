import type { TaskKpis } from "@/features/tasks/queries";
import { CountUp } from "./count-up";

export function KpiStrip({ kpis }: { kpis: TaskKpis }) {
  const cards: Array<{ label: string; value: number | string; danger?: boolean }> = [
    { label: "Abiertas", value: kpis.open },
    { label: "Atascadas >7d", value: kpis.stuck, danger: kpis.stuck > 0 },
    { label: "P0 activas", value: kpis.p0_active, danger: kpis.p0_active > 0 },
    {
      label: "Avg response",
      value:
        kpis.avg_response_hours == null
          ? "—"
          : `${kpis.avg_response_hours.toFixed(1)}h`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {c.label}
          </p>
          <p
            className={
              "mt-1 text-2xl font-semibold tabular-nums " +
              (c.danger ? "text-destructive" : "")
            }
          >
            <CountUp value={c.value} />
          </p>
        </div>
      ))}
    </div>
  );
}
