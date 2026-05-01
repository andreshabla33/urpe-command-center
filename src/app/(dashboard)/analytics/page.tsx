import { format, parseISO } from "date-fns";
import {
  getBurnDown,
  getHeatmap,
  getLatestDailySummary,
} from "@/features/analytics/queries";
import { BurnDownChart } from "@/features/analytics/components/burn-down-chart";
import { SaturationHeatmap } from "@/features/analytics/components/saturation-heatmap";

export default async function AnalyticsPage() {
  const [burn, heatmap, summary] = await Promise.all([
    getBurnDown(30),
    getHeatmap(),
    getLatestDailySummary(),
  ]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <h1 className="h-display text-2xl sm:text-3xl text-foreground">Analytics</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Burn-down · saturación · resumen ejecutivo diario (Claude Opus 4.7)
        </p>
      </header>

      {summary && (
        <section className="border-b">
          <div className="flex items-baseline justify-between border-b px-4 sm:px-6 pt-5 pb-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Resumen ejecutivo · {summary.date_key}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {format(parseISO(summary.generated_at), "yyyy-MM-dd HH:mm")}
              {summary.email_sent_at ? " · email enviado" : " · sin email"}
            </p>
          </div>
          <pre className="whitespace-pre-wrap px-4 sm:px-6 py-4 font-sans text-sm leading-relaxed">
            {summary.content_md}
          </pre>
        </section>
      )}

      <section className="border-b">
        <div className="px-4 sm:px-6 pt-5 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Burn-down (tareas abiertas por día, últimos 30)
          </p>
        </div>
        <BurnDownChart data={burn} />
      </section>

      <section>
        <div className="border-b px-4 sm:px-6 pt-5 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Saturación por persona (tareas activas)
          </p>
        </div>
        <SaturationHeatmap cells={heatmap} />
      </section>
    </main>
  );
}
