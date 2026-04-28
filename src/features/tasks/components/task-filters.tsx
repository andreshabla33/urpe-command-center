"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TASK_STATUS } from "../types";
import type { TaskFilters as TaskFiltersType } from "../schema";
import type { StatusCounts } from "../queries";

type Props = {
  owners: { email: string; full_name: string | null }[];
  current: TaskFiltersType;
  statusCounts: StatusCounts;
};

export function TaskFilters({ owners, current, statusCounts }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(current.q ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? "";
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function update(name: string, value: string | undefined) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(name, value);
    else next.delete(name);
    startTransition(() => {
      router.push(`/?${next.toString()}`);
    });
  }

  function submitQuery(e: React.FormEvent) {
    e.preventDefault();
    update("q", query.trim() || undefined);
  }

  function clearQuery() {
    setQuery("");
    update("q", undefined);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <form onSubmit={submitQuery} className="flex items-center gap-1.5 rounded border bg-background px-2 py-1">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          /
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar título, ID, descripción"
          className="bg-transparent text-xs focus:outline-none w-56"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="text-[10px] text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </form>

      <Select
        label="Owner"
        value={current.owner ?? "all"}
        onChange={(v) => update("owner", v)}
        options={[
          { value: "all", label: "Todos" },
          { value: "unassigned", label: "(Sin asignar)" },
          ...owners.map((o) => ({
            value: o.email,
            label: o.full_name ?? o.email,
          })),
        ]}
      />
      <Select
        label="Status"
        value={current.status ?? "all"}
        onChange={(v) => update("status", v)}
        options={[
          { value: "all", label: "Todos" },
          ...TASK_STATUS.map((s) => {
            const count = statusCounts[s] ?? 0;
            return {
              value: s,
              label: count > 0 ? `${s} (${count})` : s,
            };
          }),
        ]}
      />
      <Select
        label="Edad"
        value={current.age ?? "all"}
        onChange={(v) => update("age", v)}
        options={[
          { value: "all", label: "Todas" },
          { value: "7d", label: "≥ 7 días" },
          { value: "30d", label: "≥ 30 días" },
        ]}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 rounded border bg-background px-2 py-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
