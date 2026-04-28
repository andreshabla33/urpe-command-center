import { Suspense } from "react";
import { TaskFiltersSchema } from "@/features/tasks/schema";
import { getKpis, getTasks, listOwners } from "@/features/tasks/queries";
import { TaskRow } from "@/features/tasks/components/task-row";
import { KpiStrip } from "@/components/shared/kpi-strip";
import { TaskFilters } from "@/features/tasks/components/task-filters";
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
  });

  const [kpis, tasks, owners] = await Promise.all([
    getKpis(),
    getTasks(filters),
    listOwners(),
  ]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-6 pt-6 pb-4">
        <h1 className="text-lg font-semibold tracking-tight">Tareas</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"} · vista lista
        </p>
      </header>

      <div className="border-b">
        <KpiStrip kpis={kpis} />
      </div>

      <div className="border-b px-6 py-3">
        <Suspense fallback={null}>
          <TaskFilters owners={owners} current={filters} />
        </Suspense>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            Sin tareas que coincidan con los filtros.
          </p>
        ) : (
          <MotionList>
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </MotionList>
        )}
      </div>
    </main>
  );
}
