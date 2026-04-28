import { format, parseISO } from "date-fns";
import type { EmailRow } from "../queries";

export function EmailThread({ emails }: { emails: EmailRow[] }) {
  if (emails.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-muted-foreground">
        Sin emails vinculados a esta tarea todavía.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {emails.map((e) => (
        <li
          key={e.message_id}
          className={
            "rounded border p-3 text-xs " +
            (e.direction === "inbound"
              ? "bg-muted/40"
              : "bg-card border-l-4 border-l-primary")
          }
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-medium">
              {e.direction === "inbound" ? "↓ Recibido" : "↑ Enviado"}
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                {e.direction === "inbound"
                  ? e.from_email
                  : `→ ${e.to_email ?? ""}`}
              </span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {format(parseISO(e.sent_at), "MM-dd HH:mm")}
            </p>
          </div>
          {e.subject && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {e.subject}
            </p>
          )}
          {e.snippet && (
            <p className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed">
              {e.snippet}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
