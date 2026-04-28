"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { setTaskStatus } from "../actions";
import { TASK_STATUS, type TaskStatus } from "../types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "En curso",
  blocked: "Bloqueada",
  escalated: "Escalada",
  responded: "Respondida",
  done: "Completa",
  cancelled: "Cancelada",
};

export function QuickStatusMenu({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function pickStatus(status: TaskStatus, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    if (status === currentStatus) return;
    startTransition(async () => {
      await setTaskStatus({ taskId, status });
    });
  }

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label="Cambiar status"
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground",
          open ? "opacity-100" : "opacity-0 group-hover/row:opacity-100",
        )}
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-32 rounded-md border bg-popover py-1 shadow-md">
          {TASK_STATUS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => pickStatus(s, e)}
              className={cn(
                "block w-full px-3 py-1 text-left text-xs hover:bg-accent",
                s === currentStatus
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
