import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "../types";

const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  in_progress: "En curso",
  blocked: "Bloqueada",
  escalated: "Escalada",
  responded: "Respondida",
  done: "Completa",
  cancelled: "Cancelada",
};

const STATUS_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  backlog: "outline",
  in_progress: "secondary",
  blocked: "destructive",
  escalated: "destructive",
  responded: "default",
  done: "default",
  cancelled: "outline",
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as TaskStatus;
  return (
    <Badge variant={STATUS_VARIANT[s] ?? "outline"} className="font-mono text-[10px] uppercase tracking-wider">
      {STATUS_LABEL[s] ?? status}
    </Badge>
  );
}
