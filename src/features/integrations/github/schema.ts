import { z } from "zod";

const Author = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  username: z.string().optional(),
});

export const PushEventSchema = z.object({
  repository: z
    .object({ full_name: z.string(), html_url: z.string().url() })
    .optional(),
  pusher: z
    .object({ email: z.string().optional(), name: z.string().optional() })
    .optional(),
  commits: z
    .array(
      z.object({
        id: z.string(),
        message: z.string(),
        url: z.string().url(),
        timestamp: z.string(),
        author: Author.optional(),
      }),
    )
    .default([]),
});
export type PushEvent = z.infer<typeof PushEventSchema>;

export const PullRequestEventSchema = z.object({
  action: z.string(),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    body: z.string().nullable().optional(),
    html_url: z.string().url(),
    state: z.string(),
    merged: z.boolean().optional(),
    user: z
      .object({
        login: z.string(),
        email: z.string().optional(),
      })
      .optional(),
    updated_at: z.string(),
  }),
  repository: z
    .object({ full_name: z.string(), html_url: z.string().url() })
    .optional(),
});
export type PullRequestEvent = z.infer<typeof PullRequestEventSchema>;

export const IssuesEventSchema = z.object({
  action: z.string(),
  issue: z.object({
    number: z.number(),
    title: z.string(),
    body: z.string().nullable().optional(),
    html_url: z.string().url(),
    state: z.string(),
    user: z
      .object({
        login: z.string(),
        email: z.string().optional(),
      })
      .optional(),
    updated_at: z.string(),
  }),
  repository: z
    .object({ full_name: z.string(), html_url: z.string().url() })
    .optional(),
});
export type IssuesEvent = z.infer<typeof IssuesEventSchema>;
