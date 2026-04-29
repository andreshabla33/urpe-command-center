import Link from "next/link";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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
import { isCalendarConnected } from "@/features/integrations/calendar/queries";
import { CalendarLinkButton } from "@/features/integrations/calendar/components/calendar-link-button";
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

  const [events, emails, gmailConnected, calendarConnected] = await Promise.all([
    getTaskEvents(id),
    getTaskEmails(id),
    userEmail ? isGmailConnected(userEmail) : Promise.resolve(false),
    userEmail ? isCalendarConnected(userEmail) : Promise.resolve(false),
  ]);

  const taskMetadata = (task.metadata as Record<string, unknown> | null) ?? {};
  const calendarEventId =
    typeof taskMetadata.calendar_event_id === "string"
      ? taskMetadata.calendar_event_id
      : null;
  const calendarHtmlLink =
    typeof taskMetadata.calendar_html_link === "string"
      ? taskMetadata.calendar_html_link
      : null;

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Lista
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-muted-foreground">{task.id}</span>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">{task.title}</h1>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StatusBadge status={task.status ?? "backlog"} />
          <PriorityBadge priority={task.priority ?? "p2"} />
          <AgeBadge ageDays={task.age_days} createdAt={task.created_at} />
          {task.suggestion && <SuggestionBadge suggestion={task.suggestion} />}
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        <section className="flex-1 md:overflow-y-auto px-4 sm:px-6 py-5">
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
                    {format(parseISO(e.timestamp), "d MMM yyyy, HH:mm", {
                      locale: es,
                    })}{" "}
                    ·{" "}
                    {formatDistanceToNow(parseISO(e.timestamp), {
                      addSuffix: true,
                      locale: es,
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

        <aside className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l md:overflow-y-auto p-4">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
            Acciones
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            <TaskActions taskId={task.id ?? id} />
            {calendarConnected ? (
              <CalendarLinkButton
                taskId={task.id ?? id}
                hasDueDate={!!task.due_date}
                initialEventId={calendarEventId}
                initialHtmlLink={calendarHtmlLink}
              />
            ) : (
              <a
                href="/auth/google-integrations/start?provider=calendar"
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Conectar Calendar →
              </a>
            )}
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
              <p className="text-muted-foreground">Creada el</p>
              <p>
                {task.created_at
                  ? format(parseISO(task.created_at), "d MMM yyyy, HH:mm", {
                      locale: es,
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Vence</p>
              <p>
                {task.due_date
                  ? format(parseISO(task.due_date), "d MMM yyyy, HH:mm", {
                      locale: es,
                    })
                  : "—"}
              </p>
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
