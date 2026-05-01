import { getTasks } from "@/features/tasks/queries";
import { KanbanBoard } from "@/features/tasks/components/kanban-board";

export default async function KanbanPage() {
  const tasks = await getTasks({});

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <h1 className="h-display text-2xl sm:text-3xl text-foreground">Kanban</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Arrastra para cambiar status — emite un evento por cada movimiento.
        </p>
      </header>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard tasks={tasks} />
      </div>
    </main>
  );
}
