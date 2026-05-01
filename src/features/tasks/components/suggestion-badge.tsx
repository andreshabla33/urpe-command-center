import { cn } from "@/lib/utils";
import type { AiSuggestion } from "../queries";

/**
 * Paleta brandbook: navy / gold / crimson / silver únicamente.
 * Cada acción mapea a un tono coherente con su intensidad operativa.
 */
const ACTION_TONE: Record<string, string> = {
  ping: "bg-[var(--brand-gold)]/12 text-[var(--brand-gold)] ring-[var(--brand-gold)]/35",
  escalate:
    "bg-[var(--brand-crimson)]/15 text-[var(--brand-crimson)] ring-[var(--brand-crimson)]/40",
  reassign:
    "bg-[var(--brand-bright-gold)]/15 text-[var(--brand-bright-gold)] ring-[var(--brand-bright-gold)]/40",
  split:
    "bg-[var(--brand-silver)]/12 text-[var(--brand-silver)] ring-[var(--brand-silver)]/30",
  close:
    "bg-[var(--brand-gold)]/22 text-[var(--brand-bright-gold)] ring-[var(--brand-gold)]/50",
  wait: "bg-[var(--brand-silver)]/8 text-[var(--brand-silver)]/70 ring-[var(--brand-silver)]/20",
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
      <span
        className="ai-shimmer pointer-events-none absolute inset-0"
        aria-hidden
      />
      <span className="relative" aria-hidden>
        ✦
      </span>
      <span className="relative">{suggestion.action}</span>
    </span>
  );
}
