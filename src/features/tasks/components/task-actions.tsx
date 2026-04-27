"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { categorizeTask, pingTask } from "../actions";

export function TaskActions({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onPing() {
    setMessage(null);
    startTransition(async () => {
      const res = await pingTask({ taskId });
      setMessage(res.ok ? "Ping registrado" : `Error: ${res.error}`);
    });
  }

  function onCategorize() {
    setMessage(null);
    startTransition(async () => {
      const res = await categorizeTask({ taskId });
      if (res.ok) {
        setMessage(`Categorizada · ${res.priority} · ${res.category}`);
      } else {
        setMessage(`Error: ${res.error}`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="default" onClick={onPing} disabled={isPending}>
          Ping
        </Button>
        <Button size="sm" variant="outline" onClick={onCategorize} disabled={isPending}>
          Categorizar (AI)
        </Button>
      </div>
      {message && (
        <p className="text-xs text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
