// Edge Function: daily-summary
// Genera un resumen ejecutivo del estado del ecosistema URPE con Claude Opus 4.7
// y lo guarda en daily_summary. Si hay RESEND_API_KEY, además lo manda por email
// a dau@urpeailab.com.
// Idempotente: una entrada por date_key (constraint unique).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const REASONING_MODEL = "anthropic/claude-opus-4.7";
const RECIPIENT = "dau@urpeailab.com";

const SYSTEM_PROMPT = `Eres N18, asistente ejecutivo del URPE Command Center.
Recibes un snapshot del estado del ecosistema URPE y produces un resumen
ejecutivo en Markdown para Diego (dau@urpeailab.com).

Estructura obligatoria:

## Resumen
[2-3 frases con la foto general del día]

## Atascos críticos
[Lista de tasks con > 3 días sin movimiento o escaladas, máx 5]

## Equipo
[Saturación: quién tiene más carga; quién no tiene tareas]

## Acciones recomendadas
[Top 3 acciones concretas, con responsable y fecha sugerida]

Reglas:
- Conciso. No saludes, no firmes, no agregues meta-comentarios.
- Usa task_id en formato \`URPE-IS-022\`.
- Si no hay atascos, dilo claro.
- Salida es Markdown puro listo para email.`;

async function callLLM(snapshot: string): Promise<string> {
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
        { role: "user", content: snapshot },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    }),
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function sendEmail(subject: string, markdown: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "URPE Command Center <urpe@urpeailab.com>",
      to: [RECIPIENT],
      subject,
      text: markdown,
    }),
  });
  return r.ok;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const today = new Date().toISOString().slice(0, 10);

    const { data: existing } = await supabase
      .from("daily_summary")
      .select("id")
      .eq("date_key", today)
      .maybeSingle();
    if (existing) {
      return Response.json({ ok: true, skipped: true, reason: "already_generated_today" });
    }

    const { data: tasks } = await supabase
      .from("mv_task_current_state")
      .select(
        "id,title,owner_email,status,priority,age_days,event_count,escalation_count,last_inbound_at,last_outbound_at",
      );
    const { data: latestSuggestions } = await supabase
      .from("fact_event")
      .select("task_id, metadata, timestamp")
      .eq("event_type", "ai_suggestion")
      .order("timestamp", { ascending: false })
      .limit(50);

    const metrics = {
      total: tasks?.length ?? 0,
      active: (tasks ?? []).filter((t) =>
        ["backlog", "in_progress", "blocked", "escalated"].includes(t.status ?? ""),
      ).length,
      stuck_7d: (tasks ?? []).filter(
        (t) =>
          ["in_progress", "blocked", "escalated"].includes(t.status ?? "") &&
          (t.age_days ?? 0) >= 7,
      ).length,
      p0_active: (tasks ?? []).filter(
        (t) =>
          t.priority === "p0" &&
          ["backlog", "in_progress", "blocked", "escalated"].includes(t.status ?? ""),
      ).length,
    };

    const snapshot = JSON.stringify(
      {
        today,
        metrics,
        active_tasks: (tasks ?? []).filter((t) =>
          ["backlog", "in_progress", "blocked", "escalated"].includes(t.status ?? ""),
        ),
        latest_suggestions: latestSuggestions,
      },
      null,
      2,
    );

    const content_md = await callLLM(snapshot);
    const subject = `URPE Command Center · resumen ${today}`;
    const sent = await sendEmail(subject, content_md);

    const { error } = await supabase.from("daily_summary").insert({
      date_key: today,
      content_md,
      metrics,
      email_sent_at: sent ? new Date().toISOString() : null,
    });
    if (error) throw error;

    return Response.json({
      ok: true,
      date_key: today,
      email_sent: sent,
      metrics,
    });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
});
