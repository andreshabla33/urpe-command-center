"use client";

import { Button } from "@/components/ui/button";
import { CREATE_TASK_EVENT } from "./create-task-dialog";

export function NewTaskButton() {
  return (
    <Button
      type="button"
      size="sm"
      onClick={() => window.dispatchEvent(new CustomEvent(CREATE_TASK_EVENT))}
      className="gap-1.5"
    >
      <span className="text-base leading-none">+</span>
      <span>Nueva tarea</span>
      <kbd className="ml-1 hidden rounded bg-primary-foreground/20 px-1 py-0.5 font-mono text-[9px] sm:inline">
        c
      </kbd>
    </Button>
  );
}
