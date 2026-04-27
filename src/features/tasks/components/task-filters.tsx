"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TASK_STATUS } from "../types";
import type { TaskFilters as TaskFiltersType } from "../schema";

type Props = {
  owners: { email: string; full_name: string | null }[];
  current: TaskFiltersType;
};

export function TaskFilters({ owners, current }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function update(name: string, value: string | undefined) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(name, value);
    else next.delete(name);
    startTransition(() => {
      router.push(`/?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Select
        label="Owner"
        value={current.owner ?? "all"}
        onChange={(v) => update("owner", v)}
        options={[
          { value: "all", label: "Todos" },
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
          ...TASK_STATUS.map((s) => ({ value: s, label: s })),
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
