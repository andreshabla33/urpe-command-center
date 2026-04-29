import { getTasks } from "@/features/tasks/queries";
import { TaskGraph } from "@/features/tasks/components/task-graph";

export default async function GraphPage() {
  const tasks = await getTasks({});

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <h1 className="text-base sm:text-lg font-semibold tracking-tight">Grafo</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tareas agrupadas por owner; aristas tenues unen tareas del mismo proyecto.
        </p>
      </header>
      <div className="flex-1 overflow-hidden">
        <TaskGraph tasks={tasks} />
      </div>
    </main>
  );
}
