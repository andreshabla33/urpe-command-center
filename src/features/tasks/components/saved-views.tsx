"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type View = {
  id: string;
  label: string;
  params: Record<string, string>;
};

function buildViews(userEmail: string | null): View[] {
  return [
    { id: "all", label: "Todas", params: {} },
    ...(userEmail
      ? [{ id: "mine", label: "Mis tareas", params: { owner: userEmail } }]
      : []),
    { id: "blocked", label: "Bloqueadas", params: { status: "blocked" } },
    { id: "week", label: "Esta semana", params: { age: "7d" } },
  ];
}

function isActive(viewParams: Record<string, string>, current: URLSearchParams) {
  const knownKeys = ["owner", "status", "age", "project", "q"];
  for (const key of knownKeys) {
    const expected = viewParams[key] ?? null;
    const actual = current.get(key);
    if (expected !== (actual ?? null)) return false;
  }
  return true;
}

export function SavedViews({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const views = buildViews(userEmail);

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto"
      role="tablist"
      aria-label="Vistas guardadas"
    >
      {views.map((v) => {
        const active = isActive(v.params, params);
        const usp = new URLSearchParams();
        for (const [k, val] of Object.entries(v.params)) usp.set(k, val);
        const href = usp.toString() ? `${pathname}?${usp.toString()}` : pathname;
        return (
          <Link
            key={v.id}
            href={href}
            role="tab"
            aria-selected={active}
            className={cn(
              "inline-flex h-9 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors",
              active
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
            )}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}
