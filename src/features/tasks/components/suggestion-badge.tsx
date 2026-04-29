import { cn } from "@/lib/utils";
import type { AiSuggestion } from "../queries";

const ACTION_TONE: Record<string, string> = {
  ping: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300 dark:bg-blue-500/15",
  escalate: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300 dark:bg-rose-500/15",
  reassign: "bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300 dark:bg-violet-500/15",
  split: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:text-cyan-300 dark:bg-cyan-500/15",
  close: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:bg-emerald-500/15",
  wait: "bg-muted/60 text-muted-foreground ring-border",
};

export function SuggestionBadge({ suggestion }: { suggestion: AiSuggestion }) {
  const tone = ACTION_TONE[suggestion.action] ?? ACTION_TONE.wait;
  return (
    <span
      title={`${suggestion.reason} (${Math.round(suggestion.confidence * 100)}%)`}
      className={cn(
        "relative inline-flex items-center gap-1 overflow-hidden rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tabular-nums ring-1 ring-inset",
        tone,
      )}
    >
      <span className="ai-shimmer pointer-events-none absolute inset-0" aria-hidden />
      <span className="relative" aria-hidden>
        ✦
      </span>
      <span className="relative">{suggestion.action}</span>
    </span>
  );
}
