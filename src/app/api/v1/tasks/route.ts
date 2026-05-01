import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { withApi } from "@/features/api/with-api";
import {
  badRequest,
  conflict,
  created,
  notFound,
  ok,
  serverError,
} from "@/features/api/responses";
import { CreateTaskBodySchema, TasksQuerySchema } from "@/features/api/schema";
import { emitEventViaApi } from "@/features/api/events";
import {
  checkIdempotency,
  storeIdempotentResponse,
} from "@/features/api/idempotency";

// ============================================================
// POST /api/v1/tasks  — create task + emit fact_event(created)
// ============================================================

export const POST = withApi(
  { scopes: ["tasks.create"] },
  async ({ request, token }) => {
    const idempotencyKey = request.headers.get("idempotency-key");
    const bodyText = await request.text();

    const idem = await checkIdempotency({
      key: idempotencyKey,
      ownerEmail: token.ownerEmail,
      bodyText,
    });
    if (idem?.kind === "cached") {
      return NextResponse.json(idem.body as object, { status: idem.status });
    }
    if (idem?.kind === "conflict") {
      return conflict(
        "Idempotency-Key already used with different body",
        { existing_request_hash: idem.existingHash },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      return badRequest("Invalid JSON body");
    }
    const body = CreateTaskBodySchema.safeParse(parsed);
    if (!body.success) return badRequest("Validation failed", body.error.issues);

    const supabase = createServiceRoleClient();
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("dim_task")
      .select("id")
      .eq("id", body.data.id)
      .maybeSingle();
    if (existing) return conflict(`Task ${body.data.id} already exists`);

    const { error: insertErr } = await supabase.from("dim_task").insert({
      id: body.data.id,
      title: body.data.title,
      description: body.data.description ?? null,
      owner_email: body.data.owner_email,
      created_by: token.ownerEmail,
      created_at: now,
      due_date: body.data.due_date ?? null,
      status: "backlog",
      priority: body.data.priority,
      project_id: body.data.project_id ?? null,
      metadata: { ...body.data.metadata, source: "api_v1" },
    });
    if (insertErr) return serverError(insertErr.message);

    const eventResult = await emitEventViaApi({
      token,
      taskId: body.data.id,
      eventType: "created",
      timestamp: now,
      metadata: {
        owner_email: body.data.owner_email,
        priority: body.data.priority,
      },
    });
    if (!eventResult.ok) return serverError(eventResult.error);

    void supabase.rpc("refresh_mv_task_current_state");

    const responseBody = {
      ok: true,
      task: {
        id: body.data.id,
        title: body.data.title,
        owner_email: body.data.owner_email,
        status: "backlog",
        priority: body.data.priority,
      },
      event_id: eventResult.event_id || null,
    };

    await storeIdempotentResponse({
      key: idempotencyKey,
      ownerEmail: token.ownerEmail,
      bodyText,
      responseStatus: 201,
      responseBody,
    });

    return created(responseBody, token);
  },
);

// ============================================================
// GET /api/v1/tasks  — list tasks (filtered by visibility)
// ============================================================

export const GET = withApi(
  { scopes: ["tasks.read"] },
  async ({ request, token }) => {
    const url = request.nextUrl;
    const query = TasksQuerySchema.safeParse({
      owner: url.searchParams.get("owner") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      project: url.searchParams.get("project") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      age: url.searchParams.get("age") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      offset: url.searchParams.get("offset") ?? undefined,
    });
    if (!query.success) return badRequest("Invalid query params", query.error.issues);

    const supabase = createServiceRoleClient();
    let q = supabase
      .from("mv_task_current_state")
      .select("*", { count: "exact" })
      .order("age_days", { ascending: false, nullsFirst: false });

    // Visibility filter — non-admin sólo ve sus tareas
    const isPrivileged =
      token.ownerRole === "admin" || token.ownerRole === "liderazgo";
    if (!isPrivileged) {
      q = q.or(
        `owner_email.eq.${token.ownerEmail},created_by.eq.${token.ownerEmail}`,
      );
    }

    if (query.data.owner) q = q.eq("owner_email", query.data.owner);
    if (query.data.status) q = q.eq("status", query.data.status);
    if (query.data.project) q = q.eq("project_id", query.data.project);
    if (query.data.q) {
      const escaped = query.data.q.replace(/[%_]/g, (c) => `\\${c}`);
      q = q.or(
        `title.ilike.%${escaped}%,description.ilike.%${escaped}%,id.ilike.%${escaped}%`,
      );
    }
    if (query.data.age === "7d") q = q.gte("age_days", 7);
    if (query.data.age === "30d") q = q.gte("age_days", 30);

    q = q.range(query.data.offset, query.data.offset + query.data.limit - 1);

    const { data, error, count } = await q;
    if (error) return serverError(error.message);

    return ok(
      {
        data: data ?? [],
        pagination: {
          total: count ?? 0,
          limit: query.data.limit,
          offset: query.data.offset,
        },
      },
      token,
    );
  },
);

// avoid "lint: imports unused"
void notFound;
