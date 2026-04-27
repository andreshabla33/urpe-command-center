"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  listTasksForPalette,
  type PaletteTask,
} from "@/features/tasks/palette-actions";
import { parseNlCommand } from "@/features/ai/nl-actions";

const NAV = [
  { href: "/", label: "Lista", shortcut: "g+l" },
  { href: "/kanban", label: "Kanban", shortcut: "g+k" },
  { href: "/calendar", label: "Calendario", shortcut: "g+c" },
  { href: "/graph", label: "Grafo", shortcut: "g+g" },
  { href: "/analytics", label: "Analytics", shortcut: "g+a" },
] as const;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<PaletteTask[] | null>(null);
  const [query, setQuery] = useState("");
  const [askingAi, startAi] = useTransition();
  const [aiHint, setAiHint] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open && tasks === null) {
      listTasksForPalette().then(setTasks);
    }
  }, [open, tasks]);

  function close() {
    setOpen(false);
    setQuery("");
    setAiHint(null);
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  function askAi() {
    const text = query;
    if (!text.trim()) return;
    setAiHint("Pensando…");
    startAi(async () => {
      const res = await parseNlCommand(text);
      if (res.action === "navigate" && res.target) {
        go(res.target);
        return;
      }
      if (res.action === "open_task" && res.target) {
        go(`/tasks/${res.target}`);
        return;
      }
      if (res.action === "filter" && res.filters) {
        const params = new URLSearchParams();
        if (res.filters.owner) params.set("owner", res.filters.owner);
        if (res.filters.status) params.set("status", res.filters.status);
        if (res.filters.age) params.set("age", res.filters.age);
        go(`/?${params.toString()}`);
        return;
      }
      setAiHint("No entendí. Probá otra frase.");
    });
  }

  return (
    <CommandDialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <CommandInput
        placeholder="Buscar tarea o escribir un comando…"
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            e.preventDefault();
            askAi();
          }
        }}
      />
      <CommandList>
        <CommandEmpty>
          <button
            type="button"
            onClick={askAi}
            disabled={askingAi}
            className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
          >
            {askingAi
              ? "Consultando AI…"
              : `Preguntar a la AI: "${query.trim() || "…"}"`}
          </button>
          {aiHint && (
            <p className="px-3 pb-2 text-xs text-muted-foreground">{aiHint}</p>
          )}
        </CommandEmpty>

        <CommandGroup heading="Navegación">
          {NAV.map((n) => (
            <CommandItem
              key={n.href}
              value={`navegar ${n.label}`}
              onSelect={() => go(n.href)}
            >
              <span>{n.label}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {n.shortcut}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tareas">
          {tasks === null ? (
            <CommandItem disabled>Cargando…</CommandItem>
          ) : (
            tasks.slice(0, 50).map((t) => (
              <CommandItem
                key={t.id}
                value={`${t.id} ${t.title} ${t.owner_email ?? ""}`}
                onSelect={() => go(`/tasks/${t.id}`)}
              >
                <span className="font-mono text-[10px] text-muted-foreground mr-2">
                  {t.id}
                </span>
                <span className="truncate">{t.title}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {t.status}
                </span>
              </CommandItem>
            ))
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI">
          <CommandItem
            value="preguntar ai natural language"
            onSelect={askAi}
            disabled={askingAi || !query.trim()}
          >
            <span>Preguntar a la AI (gpt-5.2)</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              ⌘+↵
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
