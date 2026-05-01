import { Bot, User, Webhook, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskCreator } from "../queries";

/**
 * Badge inline que indica de dónde vino la tarea (UI manual, API agente, cron,
 * webhook). Lee `creator.source` para distinguir.
 *
 * Tonos brand-restricted (gold/silver) + iconos lucide.
 */

type Props = {
  creator?: TaskCreator;
  variant?: "compact" | "full";
};

function classify(creator?: TaskCreator): {
  Icon: typeof Bot;
  label: string;
  tone: string;
  detail?: string;
} | null {
  if (!creator) return null;

  if (creator.source === "api_v1" && creator.via_token) {
    return {
      Icon: Bot,
      label: "API",
      tone: "bg-[var(--brand-gold)]/12 text-[var(--brand-gold)] ring-[var(--brand-gold)]/30",
      detail: creator.via_token,
    };
  }
  if (creator.source === "ui_create") {
    return {
      Icon: User,
      label: "UI",
      tone: "bg-[var(--brand-silver)]/10 text-[var(--brand-silver)] ring-[var(--brand-silver)]/25",
    };
  }
  if (creator.source && creator.source.startsWith("webhook")) {
    return {
      Icon: Webhook,
      label: creator.source.replace(/^webhook[_-]?/, "") || "webhook",
      tone: "bg-[var(--brand-bright-gold)]/12 text-[var(--brand-bright-gold)] ring-[var(--brand-bright-gold)]/30",
    };
  }
  if (
    creator.source === "PENDIENTES.md" ||
    (creator.actor === "n18@urpeailab.com" && !creator.via_token)
  ) {
    return {
      Icon: Workflow,
      label: "N18",
      tone: "bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] ring-[var(--brand-gold)]/25",
    };
  }
  return null;
}

export function CreatorBadge({ creator, variant = "compact" }: Props) {
  const c = classify(creator);
  if (!c) return null;
  const { Icon, label, tone, detail } = c;

  if (variant === "compact") {
    return (
      <span
        title={
          detail
            ? `Origen: ${label} (${detail})`
            : `Origen: ${label}`
        }
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ring-1 ring-inset",
          tone,
        )}
      >
        <Icon className="h-2.5 w-2.5" aria-hidden />
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ring-1 ring-inset",
        tone,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      <span>vía {label}</span>
      {detail && (
        <span className="opacity-80">·</span>
      )}
      {detail && <span>{detail}</span>}
    </span>
  );
}
