"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToTask } from "../actions";

export function ReplyForm({ taskId }: { taskId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setMessage(null);
    startTransition(async () => {
      const res = await replyToTask({ taskId, body });
      if (res.ok) {
        setBody("");
        setMessage("Enviado.");
      } else {
        setMessage(`Error: ${res.error}`);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Responder en el thread… (text plain, se envía vía Gmail API)"
        rows={4}
        disabled={pending}
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          {message ?? "Atajo: ⌘+↵"}
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={pending || !body.trim()}
        >
          {pending ? "Enviando…" : "Reply"}
        </Button>
      </div>
    </form>
  );
}
