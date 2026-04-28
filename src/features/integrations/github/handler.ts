import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { extractTaskIds } from "./parser";
import {
  IssuesEventSchema,
  PullRequestEventSchema,
  PushEventSchema,
} from "./schema";

type EventInsert = {
  task_id: string;
  event_type: "comment";
  actor_email: string | null;
  timestamp: string;
  metadata: Record<string, unknown>;
};

export type GithubProcessResult = {
  events_emitted: number;
  task_ids: string[];
  ignored_reason?: string;
};

export async function processGithubEvent(
  eventType: string,
  payload: unknown,
): Promise<GithubProcessResult> {
  const inserts: EventInsert[] = [];

  switch (eventType) {
    case "ping":
      return { events_emitted: 0, task_ids: [], ignored_reason: "ping" };

    case "push": {
      const parsed = PushEventSchema.safeParse(payload);
      if (!parsed.success) {
        return { events_emitted: 0, task_ids: [], ignored_reason: "invalid_push_payload" };
      }
      for (const commit of parsed.data.commits) {
        const taskIds = extractTaskIds(commit.message);
        for (const taskId of taskIds) {
          inserts.push({
            task_id: taskId,
            event_type: "comment",
            actor_email: commit.author?.email ?? null,
            timestamp: new Date(commit.timestamp).toISOString(),
            metadata: {
              source: "github",
              kind: "push",
              repository: parsed.data.repository?.full_name ?? null,
              commit_sha: commit.id,
              url: commit.url,
              message: commit.message,
              author_username: commit.author?.username ?? null,
            },
          });
        }
      }
      break;
    }

    case "pull_request": {
      const parsed = PullRequestEventSchema.safeParse(payload);
      if (!parsed.success) {
        return { events_emitted: 0, task_ids: [], ignored_reason: "invalid_pr_payload" };
      }
      const ids = [
        ...extractTaskIds(parsed.data.pull_request.title),
        ...extractTaskIds(parsed.data.pull_request.body ?? null),
      ];
      const unique = Array.from(new Set(ids));
      for (const taskId of unique) {
        inserts.push({
          task_id: taskId,
          event_type: "comment",
          actor_email: parsed.data.pull_request.user?.email ?? null,
          timestamp: new Date(parsed.data.pull_request.updated_at).toISOString(),
          metadata: {
            source: "github",
            kind: "pull_request",
            action: parsed.data.action,
            number: parsed.data.pull_request.number,
            title: parsed.data.pull_request.title,
            url: parsed.data.pull_request.html_url,
            state: parsed.data.pull_request.state,
            merged: parsed.data.pull_request.merged ?? false,
            repository: parsed.data.repository?.full_name ?? null,
            user: parsed.data.pull_request.user?.login ?? null,
          },
        });
      }
      break;
    }

    case "issues": {
      const parsed = IssuesEventSchema.safeParse(payload);
      if (!parsed.success) {
        return { events_emitted: 0, task_ids: [], ignored_reason: "invalid_issue_payload" };
      }
      const ids = [
        ...extractTaskIds(parsed.data.issue.title),
        ...extractTaskIds(parsed.data.issue.body ?? null),
      ];
      const unique = Array.from(new Set(ids));
      for (const taskId of unique) {
        inserts.push({
          task_id: taskId,
          event_type: "comment",
          actor_email: parsed.data.issue.user?.email ?? null,
          timestamp: new Date(parsed.data.issue.updated_at).toISOString(),
          metadata: {
            source: "github",
            kind: "issue",
            action: parsed.data.action,
            number: parsed.data.issue.number,
            title: parsed.data.issue.title,
            url: parsed.data.issue.html_url,
            state: parsed.data.issue.state,
            repository: parsed.data.repository?.full_name ?? null,
            user: parsed.data.issue.user?.login ?? null,
          },
        });
      }
      break;
    }

    default:
      return { events_emitted: 0, task_ids: [], ignored_reason: `unsupported_event_${eventType}` };
  }

  if (inserts.length === 0) {
    return { events_emitted: 0, task_ids: [] };
  }

  const supabase = createServiceRoleClient();
  const validInserts = await filterToExistingTasks(inserts);
  if (validInserts.length === 0) {
    return { events_emitted: 0, task_ids: [], ignored_reason: "no_matching_tasks" };
  }

  const { error } = await supabase.from("fact_event").upsert(validInserts, {
    onConflict: "task_id,event_type,timestamp,actor_email",
    ignoreDuplicates: true,
  });
  if (error) throw error;

  await supabase.rpc("refresh_mv_task_current_state");

  return {
    events_emitted: validInserts.length,
    task_ids: Array.from(new Set(validInserts.map((i) => i.task_id))),
  };
}

async function filterToExistingTasks(events: EventInsert[]): Promise<EventInsert[]> {
  const supabase = createServiceRoleClient();
  const ids = Array.from(new Set(events.map((e) => e.task_id)));
  const { data } = await supabase.from("dim_task").select("id").in("id", ids);
  const existing = new Set((data ?? []).map((r) => r.id));
  return events.filter((e) => existing.has(e.task_id));
}
