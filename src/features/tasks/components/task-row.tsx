import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { AgeBadge } from "./age-badge";
import { SuggestionBadge } from "./suggestion-badge";
import { QuickStatusMenu } from "./quick-status-menu";
import type { TaskRow as TaskRowType } from "../queries";

export function TaskRow({ task }: { task: TaskRowType }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="group/row grid grid-cols-[60px_1fr_120px_180px_60px_60px_70px_24px] items-center gap-3 border-b px-4 py-(--row-py) hover:bg-muted/40"
    >
      <span className="font-mono text-[11px] text-muted-foreground truncate">
        {task.id}
      </span>
      <span className="truncate text-sm">{task.title}</span>
      <span className="truncate text-xs text-muted-foreground">
        {task.owner_email ?? "—"}
      </span>
      <StatusBadge status={task.status ?? "backlog"} />
      <AgeBadge ageDays={task.age_days} />
      <PriorityBadge priority={task.priority ?? "p2"} />
      {task.suggestion ? (
        <SuggestionBadge suggestion={task.suggestion} />
      ) : (
        <span aria-hidden />
      )}
      <QuickStatusMenu
        taskId={task.id ?? ""}
        currentStatus={task.status ?? "backlog"}
      />
    </Link>
  );
}
