"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PanelLeftClose, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "urpe-filters-panel-open";

type Props = {
  filters: ReactNode;
  children: ReactNode;
};

export function FiltersPanel({ filters, children }: Props) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setOpen(saved === "1");
    setMounted(true);
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 sm:px-6 py-2">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={open}
          aria-expanded={open}
          aria-controls="filters-aside"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border/70 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
        >
          {open ? (
            <PanelLeftClose className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          )}
          {open ? "Ocultar filtros" : "Filtros"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          id="filters-aside"
          className={cn(
            "shrink-0 overflow-y-auto bg-muted/20 transition-[width] duration-200 ease-out",
            mounted && open
              ? "w-[260px] sm:w-[280px] border-r"
              : "w-0",
          )}
          aria-hidden={!open}
        >
          <div
            className={cn(
              "p-4",
              !open && "pointer-events-none opacity-0",
            )}
          >
            {filters}
          </div>
        </aside>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
