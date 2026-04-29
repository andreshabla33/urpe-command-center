import Link from "next/link";
import { getStuckSuggestions, type TaskRow } from "../queries";
import { SuggestionActionButtons } from "./suggestion-action-buttons";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";

const ACTION_LABEL: Record<string, string> = {
  ping: "Pingear owner",
  escalate: "Escalar",
  reassign: "Reasignar",
  split: "Dividir",
  close: "Cerrar",
  wait: "Esperar",
};

const ACTION_TONE: Record<string, string> = {
  ping: "text-blue-700 dark:text-blue-300",
  escalate: "text-rose-700 dark:text-rose-300",
  reassign: "text-violet-700 dark:text-violet-300",
  split: "text-cyan-700 dark:text-cyan-300",
  close: "text-emerald-700 dark:text-emerald-300",
  wait: "text-muted-foreground",
};

const ACTION_GLYPH: Record<string, string> = {
  ping: "✦",
  escalate: "▲",
  reassign: "↻",
  split: "⫶",
  close: "✓",
  wait: "·",
};

export async function SuggestionsBar() {
  const tasks = await getStuckSuggestions(5);
  if (tasks.length === 0) return null;

  return (
    <section className="border-b bg-muted/20 px-4 sm:px-6 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="ai-shimmer relative inline-flex h-5 items-center rounded px-2 text-[10px] font-mono uppercase tracking-widest text-primary">
            <span className="relative">AI</span>
          </span>
          <h2 className="text-xs font-medium text-foreground">
            {tasks.length === 1
              ? "1 sugerencia accionable"
              : `${tasks.length} sugerencias accionables`}
          </h2>
        </div>
        <span className="hidden text-[10px] text-muted-foreground sm:inline">
          Generadas por N18 · ordenadas por confianza
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tasks.map((t) => (
          <SuggestionCard key={t.id ?? ""} task={t} />
        ))}
      </div>
    </section>
  );
}

function SuggestionCard({ task }: { task: TaskRow }) {
  const s = task.suggestion;
  if (!s || !task.id) return null;
  const tone = ACTION_TONE[s.action] ?? ACTION_TONE.wait;
  const label = ACTION_LABEL[s.action] ?? s.action;
  const glyph = ACTION_GLYPH[s.action] ?? "·";
  const conf = Math.round(s.confidence * 100);

  return (
    <div className="group flex flex-col rounded-md border border-border/70 bg-card p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-shadow hover:shadow-[0_2px_8px_rgb(0_0_0/0.06)]">
      <div className="flex items-center gap-2">
        <span className={cn("font-mono text-xs leading-none", tone)} aria-hidden>
          {glyph}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-widest",
            tone,
          )}
        >
          {label}
        </span>
        <span
          className="ml-auto rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-muted-foreground"
          title="Confianza del modelo"
        >
          {conf}%
        </span>
      </div>

      <Link
        href={`/tasks/${task.id}`}
        className="mt-1.5 line-clamp-1 text-sm font-medium text-foreground hover:text-primary"
      >
        {task.title}
      </Link>

      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
        {s.reason}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <UserAvatar email={task.owner_email} size="xs" />
        <span className="truncate">{task.owner_email ?? "—"}</span>
        <span className="ml-auto font-mono tabular-nums">
          {task.age_days != null ? `${Math.floor(task.age_days)}d` : ""}
        </span>
      </div>

      <SuggestionActionButtons
        taskId={task.id}
        suggestion={s}
        variant="bar"
      />
    </div>
  );
}
