"use client";

import { useOptimistic, useTransition } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { setTaskStatus } from "../actions";
import { PriorityBadge } from "./priority-badge";
import { AgeBadge } from "./age-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
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
                  "flex w-64 sm:w-72 shrink-0 flex-col rounded-md border bg-muted/30 transition-colors " +
                  (snapshot.isDraggingOver ? "border-primary/60 bg-accent/30" : "border-border/70")
                }
              >
                <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {col.label}
                  </p>
                  <span className="rounded-full bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
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
                            "rounded-md border border-border/70 bg-card p-2.5 text-sm transition-shadow shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:shadow-[0_2px_8px_rgb(0_0_0/0.06)] " +
                            (s.isDragging ? "shadow-lg ring-1 ring-primary/30" : "")
                          }
                        >
                          <p className="font-mono text-[10px] text-muted-foreground/80">
                            {task.id}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs font-medium text-foreground">
                            {task.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                              <UserAvatar email={task.owner_email} size="xs" />
                              <span className="truncate">{task.owner_email}</span>
                            </span>
                            <div className="flex shrink-0 gap-1">
                              <PriorityBadge priority={task.priority ?? "p2"} />
                              <AgeBadge ageDays={task.age_days} createdAt={task.created_at} />
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
