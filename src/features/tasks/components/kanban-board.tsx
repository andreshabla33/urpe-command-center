"use client";

import { useOptimistic, useTransition } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { setTaskStatus } from "../actions";
import { PriorityBadge } from "./priority-badge";
import { AgeBadge } from "./age-badge";
import type { TaskRow } from "../queries";
import type { TaskStatus } from "../types";
import { enqueueMutation } from "@/lib/offline/queue";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "En curso" },
  { id: "blocked", label: "Bloqueada" },
  { id: "escalated", label: "Escalada" },
  { id: "responded", label: "Respondida" },
  { id: "done", label: "Completa" },
];

type OptimisticAction = { taskId: string; status: TaskStatus };

export function KanbanBoard({ tasks }: { tasks: TaskRow[] }) {
  const [, startTransition] = useTransition();
  const [optimisticTasks, applyOptimistic] = useOptimistic(
    tasks,
    (state: TaskRow[], action: OptimisticAction) =>
      state.map((t) =>
        t.id === action.taskId ? { ...t, status: action.status } : t,
      ),
  );

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const status = result.destination.droppableId as TaskStatus;
    if (result.source.droppableId === status) return;

    startTransition(async () => {
      applyOptimistic({ taskId, status });
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        await enqueueMutation({
          type: "setTaskStatus",
          payload: { taskId, status },
        });
        return;
      }
      const res = await setTaskStatus({ taskId, status });
      if (!res.ok) {
        await enqueueMutation({
          type: "setTaskStatus",
          payload: { taskId, status },
        });
        console.error("setTaskStatus failed, queued:", res.error);
      }
    });
  }

  const byColumn: Record<TaskStatus, TaskRow[]> = {
    backlog: [],
    in_progress: [],
    blocked: [],
    escalated: [],
    responded: [],
    done: [],
    cancelled: [],
  };
  for (const t of optimisticTasks) {
    const s = (t.status ?? "backlog") as TaskStatus;
    if (byColumn[s]) byColumn[s].push(t);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-3 overflow-x-auto px-4 sm:px-6 py-3 sm:py-4">
        {COLUMNS.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  "flex w-64 sm:w-72 shrink-0 flex-col rounded-md border bg-card " +
                  (snapshot.isDraggingOver ? "border-primary" : "border-border")
                }
              >
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wider">
                    {col.label}
                  </p>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {byColumn[col.id].length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
                  {byColumn[col.id].map((task, idx) => (
                    <Draggable draggableId={task.id ?? ""} index={idx} key={task.id}>
                      {(p, s) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          className={
                            "rounded-md border bg-background p-2.5 text-sm shadow-sm " +
                            (s.isDragging ? "shadow-lg" : "")
                          }
                        >
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {task.id}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs">
                            {task.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="truncate text-[10px] text-muted-foreground">
                              {task.owner_email}
                            </span>
                            <div className="flex gap-1">
                              <PriorityBadge priority={task.priority ?? "p2"} />
                              <AgeBadge ageDays={task.age_days} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
