"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  linkTaskToCalendar,
  unlinkTaskFromCalendar,
} from "../actions";

type Props = {
  taskId: string;
  hasDueDate: boolean;
  initialEventId: string | null;
  initialHtmlLink: string | null;
};

export function CalendarLinkButton({
  taskId,
  hasDueDate,
  initialEventId,
  initialHtmlLink,
}: Props) {
  const [eventId, setEventId] = useState<string | null>(initialEventId);
  const [htmlLink, setHtmlLink] = useState<string | null>(initialHtmlLink);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onLink() {
    setError(null);
    startTransition(async () => {
      const res = await linkTaskToCalendar({ taskId });
      if (res.ok) {
        setEventId(res.event_id);
        setHtmlLink(res.html_link ?? null);
      } else {
        setError(res.error);
      }
    });
  }

  function onUnlink() {
    setError(null);
    startTransition(async () => {
      const res = await unlinkTaskFromCalendar({ taskId });
      if (res.ok) {
        setEventId(null);
        setHtmlLink(null);
      } else {
        setError(res.error);
      }
    });
  }

  if (eventId) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {htmlLink ? (
            <a
              href={htmlLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-foreground hover:underline"
            >
              📅 En Calendar
            </a>
          ) : (
            <span className="text-xs text-foreground">📅 Linkeado</span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onUnlink}
            disabled={pending}
          >
            {pending ? "…" : "Quitar"}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={onLink}
        disabled={pending || !hasDueDate}
        title={hasDueDate ? undefined : "Necesita due_date"}
      >
        {pending ? "Creando…" : "📅 Calendar"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
