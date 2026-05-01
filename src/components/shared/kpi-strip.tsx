import type { DailyPoint, TaskKpis } from "@/features/tasks/queries";
import { CountUp } from "./count-up";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

type Tone = "default" | "danger" | "warning" | "success";

type Card = {
  label: string;
  value: number | string;
  tone: Tone;
  trend: DailyPoint[];
};

function computeDelta(trend: DailyPoint[]): number | null {
  if (trend.length < 4) return null;
  const half = Math.floor(trend.length / 2);
  const recent = trend.slice(-half).reduce((a, b) => a + b.count, 0);
  const prior = trend.slice(0, trend.length - half).reduce((a, b) => a + b.count, 0);
  if (prior === 0 && recent === 0) return null;
  if (prior === 0) return recent > 0 ? 100 : null;
  return Math.round(((recent - prior) / prior) * 100);
}

/**
 * Delta tone — brandbook restringido: gold para up, crimson para down, silver flat.
 * No semánticamente "verde=bueno" sino tonos de la paleta federal.
 */
const DELTA_TONE: Record<"up" | "down" | "flat", string> = {
  up: "bg-[var(--brand-gold)]/15 text-[var(--brand-bright-gold)] ring-[var(--brand-gold)]/35",
  down: "bg-[var(--brand-crimson)]/15 text-[var(--brand-crimson)] ring-[var(--brand-crimson)]/35",
  flat: "bg-[var(--brand-silver)]/8 text-muted-foreground ring-[var(--brand-silver)]/20",
};

export function KpiStrip({
  kpis,
  trend,
}: {
  kpis: TaskKpis;
  trend: DailyPoint[];
}) {
  const cards: Card[] = [
    {
      label: "Abiertas",
      value: kpis.open,
      tone: "default",
      trend,
    },
    {
      label: "Atascadas >7d",
      value: kpis.stuck,
      tone: kpis.stuck > 0 ? "danger" : "default",
      trend,
    },
    {
      label: "P0 activas",
      value: kpis.p0_active,
      tone: kpis.p0_active > 0 ? "warning" : "default",
      trend,
    },
    {
      label: "Avg response",
      value:
        kpis.avg_response_hours == null
          ? "—"
          : `${kpis.avg_response_hours.toFixed(1)}h`,
      tone: "success",
      trend,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px bg-border/70 sm:grid-cols-4">
      {cards.map((c) => {
        const delta = computeDelta(c.trend);
        const dir: "up" | "down" | "flat" =
          delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";

        return (
          <div key={c.label} className="bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {c.label}
              </p>
              {delta != null && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-mono ring-1 ring-inset",
                    DELTA_TONE[dir],
                  )}
                  title="Variación 7d vs 7d previos"
                >
                  {delta > 0 ? "+" : ""}
                  {delta}%
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
                c.tone === "danger" && "text-destructive",
              )}
            >
              <CountUp value={c.value} />
            </p>
            <div className="mt-2">
              <Sparkline data={c.trend} tone={c.tone} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
