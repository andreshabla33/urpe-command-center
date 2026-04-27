import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { getTasks, type TaskRow } from "@/features/tasks/queries";
import { PriorityBadge } from "@/features/tasks/components/priority-badge";

type Props = {
  searchParams: Promise<{ month?: string }>;
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default async function CalendarPage({ searchParams }: Props) {
  const { month } = await searchParams;
  const today = new Date();
  const cursor = month ? parseISO(`${month}-01T00:00:00`) : today;

  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const tasks = await getTasks({});
  const tasksByDay = new Map<string, TaskRow[]>();
  for (const t of tasks) {
    if (!t.due_date) continue;
    const k = format(parseISO(t.due_date), "yyyy-MM-dd");
    const arr = tasksByDay.get(k) ?? [];
    arr.push(t);
    tasksByDay.set(k, arr);
  }

  const prev = format(subMonths(cursor, 1), "yyyy-MM");
  const next = format(addMonths(cursor, 1), "yyyy-MM");

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b px-6 pt-6 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {format(cursor, "MMMM yyyy")}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tareas por fecha de vencimiento.
          </p>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/calendar?month=${prev}`}
            className="rounded border px-2 py-1 hover:bg-muted"
          >
            ←
          </Link>
          <Link
            href="/calendar"
            className="rounded border px-2 py-1 hover:bg-muted"
          >
            Hoy
          </Link>
          <Link
            href={`/calendar?month=${next}`}
            className="rounded border px-2 py-1 hover:bg-muted"
          >
            →
          </Link>
        </nav>
      </header>

      <div className="grid grid-cols-7 border-b text-[10px] uppercase tracking-widest text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-1.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 grid-rows-6 overflow-hidden">
        {days.map((day) => {
          const k = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDay.get(k) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, today);
          return (
            <div
              key={k}
              className={
                "min-h-0 overflow-hidden border-b border-r p-1.5 " +
                (inMonth ? "bg-background" : "bg-muted/30") +
                (isToday ? " ring-1 ring-inset ring-primary" : "")
              }
            >
              <p
                className={
                  "font-mono text-[10px] tabular-nums " +
                  (inMonth ? "" : "text-muted-foreground")
                }
              >
                {format(day, "d")}
              </p>
              <div className="mt-1 flex flex-col gap-0.5">
                {dayTasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-1 truncate rounded bg-card px-1 py-0.5 text-[10px]"
                  >
                    <PriorityBadge priority={t.priority ?? "p2"} />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{dayTasks.length - 3}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
