import Link from "next/link";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { getTask, getTaskEvents } from "@/features/tasks/queries";
import { StatusBadge } from "@/features/tasks/components/status-badge";
import { PriorityBadge } from "@/features/tasks/components/priority-badge";
import { AgeBadge } from "@/features/tasks/components/age-badge";
import { SuggestionBadge } from "@/features/tasks/components/suggestion-badge";
import { TaskActions } from "@/features/tasks/components/task-actions";
import {
  getTaskEmails,
  isGmailConnected,
} from "@/features/integrations/gmail/queries";
import { EmailThread } from "@/features/integrations/gmail/components/email-thread";
import { ReplyForm } from "@/features/integrations/gmail/components/reply-form";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

const EVENT_LABEL: Record<string, string> = {
  created: "Creada",
  assigned: "Asignada",
  email_sent: "Email enviado",
  email_received: "Email recibido",
  comment: "Comentario",
  escalated: "Escalada",
  status_changed: "Cambio de status",
  closed: "Cerrada",
  n1_sent: "Followup N1",
  n2_sent: "Followup N2",
  n3_sent: "Followup N3",
  ping: "Ping manual",
  corrected: "Corrección",
  ai_suggestion: "Sugerencia AI",
  ai_categorized: "Categorización AI",
  ai_anomaly: "Anomalía AI",
  ai_eta: "ETA AI",
};

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;
  const task = await getTask(id);
  if (!task) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? "";

  const [events, emails, gmailConnected] = await Promise.all([
    getTaskEvents(id),
    getTaskEmails(id),
    userEmail ? isGmailConnected(userEmail) : Promise.resolve(false),
  ]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-6 pt-6 pb-4">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Lista
        </Link>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
          <h1 className="text-lg font-semibold tracking-tight">{task.title}</h1>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StatusBadge status={task.status ?? "backlog"} />
          <PriorityBadge priority={task.priority ?? "p2"} />
          <AgeBadge ageDays={task.age_days} />
          {task.suggestion && <SuggestionBadge suggestion={task.suggestion} />}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto px-6 py-5">
          {task.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          <h2 className="mt-8 mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Timeline
          </h2>
          <ol className="space-y-2">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3 border-l border-border pl-3">
                <div>
                  <p className="text-xs">
                    <span className="font-medium">
                      {EVENT_LABEL[e.event_type] ?? e.event_type}
                    </span>
                    {e.actor_email && (
                      <span className="ml-2 text-muted-foreground">
                        · {e.actor_email}
                      </span>
                    )}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {format(parseISO(e.timestamp), "yyyy-MM-dd HH:mm")} ·{" "}
                    {formatDistanceToNow(parseISO(e.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                  {e.event_type === "ai_suggestion" && e.metadata && (
                    <pre className="mt-1 whitespace-pre-wrap rounded bg-muted px-2 py-1 text-[11px]">
                      {JSON.stringify(e.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="w-80 shrink-0 border-l overflow-y-auto p-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
            Acciones
          </h3>
          <div className="mt-3">
            <TaskActions taskId={task.id ?? id} />
          </div>

          <h3 className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            Email thread ({emails.length})
          </h3>
          <div className="mt-3">
            <EmailThread emails={emails} />
          </div>
          {gmailConnected && emails.length > 0 && (
            <div className="mt-4">
              <ReplyForm taskId={task.id ?? id} />
            </div>
          )}
          {!gmailConnected && (
            <a
              href="/auth/google-integrations/start?provider=gmail"
              className="mt-4 inline-block text-[11px] text-muted-foreground hover:text-foreground"
            >
              Conectar Gmail →
            </a>
          )}

          <div className="mt-6 space-y-2 text-xs">
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-mono">{task.owner_email ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Creada por</p>
              <p className="font-mono">{task.created_by ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due</p>
              <p>{task.due_date ? format(parseISO(task.due_date), "yyyy-MM-dd HH:mm") : "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Eventos</p>
              <p className="font-mono tabular-nums">{task.event_count ?? 0}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
