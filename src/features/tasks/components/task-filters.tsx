"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TASK_STATUS } from "../types";
import type { TaskFilters as TaskFiltersType } from "../schema";
import type { StatusCounts } from "../queries";
import { cn } from "@/lib/utils";

type Props = {
  owners: { email: string; full_name: string | null }[];
  current: TaskFiltersType;
  statusCounts: StatusCounts;
};

type Option = {
  value: string;
  label: string;
  hint?: string;
  trailing?: string;
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

  const ownerOptions: Option[] = [
    { value: "all", label: "Todos" },
    { value: "unassigned", label: "Sin asignar", hint: "—" },
    ...owners.map((o) => ({
      value: o.email,
      label: o.full_name ?? o.email,
      hint: o.full_name ? o.email : undefined,
    })),
  ];

  const statusOptions: Option[] = [
    { value: "all", label: "Todos" },
    ...TASK_STATUS.map((s) => ({
      value: s,
      label: s,
      trailing: statusCounts[s] ? String(statusCounts[s]) : undefined,
    })),
  ];

  const ageOptions: Option[] = [
    { value: "all", label: "Cualquiera" },
    { value: "7d", label: "Más de 1 semana" },
    { value: "30d", label: "Más de 1 mes" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <form
        onSubmit={submitQuery}
        className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 transition-colors focus-within:ring-1 focus-within:ring-ring"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          /
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar título, ID, descripción"
          className="w-56 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="text-[10px] text-muted-foreground hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </form>

      <FilterCombobox
        label="Owner"
        value={current.owner ?? "all"}
        onChange={(v) => update("owner", v)}
        options={ownerOptions}
        searchable
        searchPlaceholder="Buscar persona…"
        emptyMessage="Sin coincidencias."
      />
      <FilterCombobox
        label="Status"
        value={current.status ?? "all"}
        onChange={(v) => update("status", v)}
        options={statusOptions}
      />
      <FilterCombobox
        label="Antigüedad"
        value={current.age ?? "all"}
        onChange={(v) => update("age", v)}
        options={ageOptions}
      />
    </div>
  );
}

type FilterComboboxProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

function FilterCombobox({
  label,
  value,
  onChange,
  options,
  searchable = false,
  searchPlaceholder = "Buscar…",
  emptyMessage = "Sin opciones.",
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs transition-colors hover:bg-accent/40",
            open && "ring-1 ring-ring",
          )}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span className="font-medium text-foreground">{selected?.label}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-56 overflow-hidden p-0"
      >
        <Command>
          {searchable && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandList className="max-h-72">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const isSelected = o.value === value;
                return (
                  <CommandItem
                    key={o.value}
                    value={`${o.label} ${o.hint ?? ""}`}
                    onSelect={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        isSelected ? "opacity-100 text-primary" : "opacity-0",
                      )}
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm">{o.label}</span>
                      {o.hint && (
                        <span className="truncate text-[10px] text-muted-foreground">
                          {o.hint}
                        </span>
                      )}
                    </div>
                    {o.trailing && (
                      <span className="ml-auto rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                        {o.trailing}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
