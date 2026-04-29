import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { AgeBadge } from "./age-badge";
import { SuggestionBadge } from "./suggestion-badge";
import { QuickStatusMenu } from "./quick-status-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { TaskRow as TaskRowType } from "../queries";

export function TaskRow({ task }: { task: TaskRowType }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="group/row relative grid grid-cols-[60px_1fr_180px_180px_110px_60px_70px_24px] items-center gap-3 border-b px-4 py-(--row-py) transition-colors hover:bg-accent/40 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary before:opacity-0 before:transition-opacity hover:before:opacity-100"
    >
      <span className="font-mono text-[11px] text-muted-foreground/80 truncate">
        {task.id}
      </span>
      <span className="truncate text-sm font-medium text-foreground">
        {task.title}
      </span>
      <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
        <UserAvatar email={task.owner_email} size="xs" />
        <span className="truncate">{task.owner_email ?? "—"}</span>
      </span>
      <StatusBadge status={task.status ?? "backlog"} />
      <AgeBadge ageDays={task.age_days} createdAt={task.created_at} />
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
