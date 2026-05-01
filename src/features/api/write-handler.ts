import "server-only";
import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { withApi } from "./with-api";
import {
  badRequest,
  conflict,
  created,
  notFound,
  serverError,
} from "./responses";
import { emitEventViaApi, fetchTaskExists } from "./events";
import { checkIdempotency, storeIdempotentResponse } from "./idempotency";
import type { ApiScope } from "./scopes";
import type { ResolvedToken } from "./auth";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type EventResult = {
  eventType: string;
  metadata: Record<string, unknown>;
  /**
   * Side-effects opcionales antes de emitir el evento. Ej. para transitions
   * actualiza dim_task.status. Devuelve `null` o lanza error para abortar.
   */
  sideEffect?: () => Promise<{ error: string } | null>;
};

/**
 * Factory genérico para endpoints POST que emiten un fact_event sobre una tarea.
 *
 * Estructura común:
 * - Idempotency-Key check
 * - Body parse con Zod
 * - Verifica que dim_task[:id] exista (FK guard)
 * - Llama al `compute` para derivar event_type + metadata + side effects
 * - Emite fact_event vía emitEventViaApi
 * - Devuelve 201 (nuevo) o 200 (deduped)
 */
export function makeEventEndpoint<TBody>(opts: {
  scopes: ApiScope[];
  bodySchema: ZodSchema<TBody>;
  compute: (args: {
    body: TBody;
    taskId: string;
    token: ResolvedToken;
  }) => EventResult | Promise<EventResult>;
}) {
  return withApi(
    { scopes: opts.scopes },
    async ({ request, token, ctx }) => {
      const params = await (
        ctx as { params?: Promise<{ id?: string }> }
      ).params;
      const taskId = params?.id;
      if (!taskId) return badRequest("Missing task id in path");

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
      const body = opts.bodySchema.safeParse(parsed);
      if (!body.success) return badRequest("Validation failed", body.error.issues);

      const exists = await fetchTaskExists(taskId);
      if (!exists) return notFound(`Task ${taskId}`);

      const computed = await opts.compute({ body: body.data, taskId, token });

      if (computed.sideEffect) {
        const sideErr = await computed.sideEffect();
        if (sideErr) return serverError(sideErr.error);
      }

      const eventResult = await emitEventViaApi({
        token,
        taskId,
        eventType: computed.eventType,
        metadata: computed.metadata,
      });
      if (!eventResult.ok) return serverError(eventResult.error);

      const supabase = createServiceRoleClient();
      void supabase.rpc("refresh_mv_task_current_state");

      const responseBody = {
        ok: true,
        deduped: eventResult.deduped,
        event_id: eventResult.event_id || null,
      };

      await storeIdempotentResponse({
        key: idempotencyKey,
        ownerEmail: token.ownerEmail,
        bodyText,
        responseStatus: eventResult.deduped ? 200 : 201,
        responseBody,
      });

      return eventResult.deduped
        ? NextResponse.json(responseBody, { status: 200 })
        : created(responseBody, token);
    },
  );
}

