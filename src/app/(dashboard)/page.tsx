import { Suspense } from "react";
import { TaskFiltersSchema } from "@/features/tasks/schema";
import {
  getActivityTrend,
  getKpis,
  getStatusCounts,
  getTasks,
  listOwners,
} from "@/features/tasks/queries";
import { TaskRow } from "@/features/tasks/components/task-row";
import { TaskListHeader } from "@/features/tasks/components/task-list-header";
import { KpiStrip } from "@/components/shared/kpi-strip";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { NewTaskButton } from "@/features/tasks/components/new-task-button";
import { SuggestionsBar } from "@/features/tasks/components/suggestions-bar";
import { MotionList } from "@/components/shared/motion-list";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const filters = TaskFiltersSchema.parse({
    owner: raw.owner,
    project: raw.project,
    status: raw.status,
    age: raw.age,
    q: raw.q,
    sort: raw.sort,
    dir: raw.dir,
  });

  const [kpis, tasks, owners, statusCounts, trend] = await Promise.all([
    getKpis(),
    getTasks(filters),
    listOwners(),
    getStatusCounts(),
    getActivityTrend(14),
  ]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-start justify-between gap-3 border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div>
          <h1 className="h-display text-2xl sm:text-3xl text-foreground">Tareas</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"} · vista lista
          </p>
        </div>
        <NewTaskButton />
      </header>

      <div className="border-b">
        <KpiStrip kpis={kpis} trend={trend} />
      </div>

      <Suspense fallback={null}>
        <SuggestionsBar />
      </Suspense>

      <div className="border-b px-4 sm:px-6 py-3 overflow-x-auto">
        <Suspense fallback={null}>
          <TaskFilters
            owners={owners}
            current={filters}
            statusCounts={statusCounts}
          />
        </Suspense>
      </div>

      <div className="flex-1 overflow-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-4 sm:px-6 py-20 text-center">
            <p className="h-caption text-[10px] tracking-[0.2em]">
              VIGILAMUS · OPERAMUR · VINCIMUS
            </p>
            <p className="text-sm font-medium text-foreground">
              Sin tareas que coincidan con los filtros
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Ajuste filtros, limpie búsqueda, o cree nueva tarea con{" "}
              <kbd className="rounded border bg-card px-1.5 py-0.5 font-mono text-[10px]">
                c
              </kbd>
              .
            </p>
          </div>
        ) : (
          <div className="min-w-[900px]">
            <TaskListHeader sort={filters.sort} dir={filters.dir} />
            <MotionList>
              {tasks.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </MotionList>
          </div>
        )}
      </div>
    </main>
  );
}
