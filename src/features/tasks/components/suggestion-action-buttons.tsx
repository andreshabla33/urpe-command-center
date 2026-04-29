"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { applySuggestion, dismissSuggestion } from "../actions";
import type { AiSuggestion } from "../queries";
import { cn } from "@/lib/utils";

type Props = {
  taskId: string;
  suggestion: AiSuggestion;
  variant?: "bar" | "inline";
};

export function SuggestionActionButtons({ taskId, suggestion, variant = "bar" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onApply() {
    startTransition(async () => {
      if (suggestion.action === "reassign" || suggestion.action === "split") {
        router.push(`/tasks/${taskId}`);
        return;
      }
      const res = await applySuggestion({
        taskId,
        action: suggestion.action as
          | "ping"
          | "escalate"
          | "reassign"
          | "split"
          | "close"
          | "wait",
        suggestionTs: suggestion.generated_at,
        payload:
          suggestion.action === "ping"
            ? { recipients: suggestion.ping_recipients ?? [] }
            : undefined,
      });
      if (res.ok) router.refresh();
      else console.error("applySuggestion error", res.error);
    });
  }

  function onDismiss() {
    startTransition(async () => {
      const res = await dismissSuggestion({
        taskId,
        suggestionTs: suggestion.generated_at,
      });
      if (res.ok) router.refresh();
    });
  }

  const applyLabel =
    suggestion.action === "reassign" || suggestion.action === "split"
      ? "Abrir tarea"
      : pending
        ? "Aplicando…"
        : "Aplicar";

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        variant === "bar" && "mt-2",
        variant === "inline" && "ml-2",
      )}
    >
      <button
        type="button"
        onClick={onApply}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {applyLabel}
      </button>
      <button
        type="button"
        onClick={onDismiss}
        disabled={pending}
        className="inline-flex items-center rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        Descartar
      </button>
    </div>
  );
}
