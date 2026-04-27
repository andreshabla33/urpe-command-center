// Edge Function: suggest-action
// Recorre tareas atascadas y genera una sugerencia (ping/escalate/...) por cada una,
// guardándola como fact_event con event_type='ai_suggestion'.
// Se ejecuta por pg_cron o vía HTTP POST manual.
//
// Idempotencia: para una misma (task_id, ai_suggestion, día_de_hoy), no inserta
// dos veces gracias al constraint fact_event_replay_unique sobre
// (task_id, event_type, timestamp, actor_email). Trunco timestamp al día.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { z } from "https://esm.sh/zod@4.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;

const REASONING_MODEL = "anthropic/claude-opus-4.7";
const ACTOR_EMAIL = "n18@urpeailab.com";
const STUCK_AGE_DAYS = 3;
const MAX_TASKS_PER_RUN = 20;

const SuggestionSchema = z.object({
  action: z.enum(["ping", "escalate", "reassign", "split", "close", "wait"]),
  reason: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1),
  ping_recipients: z.array(z.string().email()).optional(),
});

const SYSTEM_PROMPT = `Eres N18, asistente operativo del URPE Command Center.
Recibirás una tarea atascada del ecosistema URPE y su historia reciente de eventos.
Debes recomendar UNA acción concreta para desatorarla.

Acciones permitidas:
- "ping": enviar un follow-up suave al owner
- "escalate": escalar al sponsor / supervisor
- "reassign": reasignar a otra persona del equipo
- "split": romper la tarea en sub-tareas
- "close": cerrar (ya no aplica)
- "wait": no hacer nada todavía (con razón)

Devuelve JSON estricto:
{
  "action": "ping|escalate|reassign|split|close|wait",
  "reason": "1-2 frases en español, concretas, sin meta-comentarios",
  "confidence": 0.0-1.0,
  "ping_recipients": ["email", ...]
}

Reglas:
- Si la tarea lleva > 7 días sin respuesta inbound → considera "escalate"
- Si hay 3 followups sin respuesta → "escalate"
- Si owner es agente IA y no hay actividad reciente → "ping"
- No inventes emails: usa los que aparezcan en la historia.`;

async function callLLM(userPrompt: string): Promise<unknown> {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://urpe-command.vercel.app",
      "X-Title": "URPE Command Center",
    },
    body: JSON.stringify({
      model: REASONING_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 400,
    }),
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}

function todayKeyUtc(): string {
  return new Date().toISOString().slice(0, 10) + "T00:00:00.000+00:00";
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") ?? `${MAX_TASKS_PER_RUN}`, 10) || MAX_TASKS_PER_RUN,
      MAX_TASKS_PER_RUN,
    );
    const minAge = force ? 0 : STUCK_AGE_DAYS;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: tasks, error } = await supabase
      .from("mv_task_current_state")
      .select(
        "id,title,description,owner_email,status,priority,age_days,event_count,escalation_count,last_inbound_at,last_outbound_at,created_at",
      )
      .in("status", ["in_progress", "blocked", "escalated"])
      .gte("age_days", minAge)
      .order("age_days", { ascending: false })
      .limit(limit);

    if (error) throw error;
    if (!tasks || tasks.length === 0) {
      return Response.json({ ok: true, evaluated: 0 });
    }

    const ts = todayKeyUtc();
    let written = 0;
    const errors: { taskId: string; error: string }[] = [];

    for (const task of tasks) {
      try {
        const { data: events } = await supabase
          .from("fact_event")
          .select("event_type,actor_email,timestamp,metadata")
          .eq("task_id", task.id)
          .order("timestamp", { ascending: false })
          .limit(15);

        const ctx = JSON.stringify({ task, recent_events: events ?? [] }, null, 2);
        const raw = await callLLM(ctx);
        const suggestion = SuggestionSchema.parse(raw);

        const { error: insertErr } = await supabase.from("fact_event").upsert(
          {
            task_id: task.id,
            event_type: "ai_suggestion",
            actor_email: ACTOR_EMAIL,
            timestamp: ts,
            metadata: suggestion,
          },
          {
            onConflict: "task_id,event_type,timestamp,actor_email",
            ignoreDuplicates: true,
          },
        );
        if (insertErr) throw insertErr;
        written++;
      } catch (e) {
        errors.push({ taskId: task.id ?? "?", error: String(e) });
      }
    }

    return Response.json({ ok: true, evaluated: tasks.length, written, errors });
  } catch (e) {
    return Response.json(
      { ok: false, error: String(e) },
      { status: 500 },
    );
  }
});
