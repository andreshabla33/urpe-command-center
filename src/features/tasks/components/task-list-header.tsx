"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TASK_SORT_FIELDS, type TaskSortField } from "../schema";

const COLUMNS: {
  label: string;
  field: TaskSortField | null;
  sticky?: string;
}[] = [
  { label: "ID", field: "id" },
  { label: "Título", field: null },
  { label: "Owner", field: null },
  { label: "Status", field: "status" },
  { label: "Edad", field: "age_days" },
  { label: "Prio", field: "priority" },
  { label: "AI", field: null },
];

type Props = {
  sort: TaskSortField;
  dir: "asc" | "desc";
};

export function TaskListHeader({ sort, dir }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setSort(field: TaskSortField | null) {
    if (!field || !TASK_SORT_FIELDS.includes(field)) return;
    const next = new URLSearchParams(params);
    if (field === sort) {
      next.set("dir", dir === "asc" ? "desc" : "asc");
    } else {
      next.set("sort", field);
      next.set("dir", "desc");
    }
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="grid grid-cols-[60px_1fr_120px_180px_60px_60px_70px] items-center gap-3 border-b bg-muted/30 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
      {COLUMNS.map((c) => {
        const isActive = c.field && c.field === sort;
        const arrow = isActive ? (dir === "asc" ? " ↑" : " ↓") : "";
        if (!c.field) return <span key={c.label}>{c.label}</span>;
        return (
          <button
            key={c.label}
            type="button"
            onClick={() => setSort(c.field)}
            className={
              "text-left hover:text-foreground " +
              (isActive ? "text-foreground" : "")
            }
          >
            {c.label}
            {arrow}
          </button>
        );
      })}
    </div>
  );
}
