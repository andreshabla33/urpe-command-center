import { cn } from "@/lib/utils";
import type { AiSuggestion } from "../queries";

const ACTION_TONE: Record<string, string> = {
  ping: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  escalate: "bg-red-500/15 text-red-600 dark:text-red-400",
  reassign: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  split: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  close: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  wait: "bg-muted text-muted-foreground",
};

export function SuggestionBadge({ suggestion }: { suggestion: AiSuggestion }) {
  const tone = ACTION_TONE[suggestion.action] ?? ACTION_TONE.wait;
  return (
    <span
      title={`${suggestion.reason} (${Math.round(suggestion.confidence * 100)}%)`}
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tabular-nums",
        tone,
      )}
    >
      <span aria-hidden>·</span>
      {suggestion.action}
    </span>
  );
}
