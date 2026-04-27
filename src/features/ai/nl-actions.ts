"use server";

import { z } from "zod";
import { chat, OPENROUTER_MODELS } from "@/lib/openrouter/client";

const NL_SYSTEM = `Eres el parser de comandos del URPE Command Center.
Recibes texto natural en español y devuelves JSON estricto:
{
  "action": "navigate" | "open_task" | "filter" | "unknown",
  "target": string | null,
  "filters": { "owner": string | null, "status": string | null, "age": string | null }
}

Reglas:
- "ir a kanban" / "kanban" → {action: "navigate", target: "/kanban"}
- "calendario" / "abrir calendario" → {action: "navigate", target: "/calendar"}
- "grafo" → {action: "navigate", target: "/graph"}
- "lista" / "tareas" / "inicio" → {action: "navigate", target: "/"}
- "ver tarea X" / "abrir URPE-IS-022" → {action: "open_task", target: "URPE-IS-022"}
- "tareas de jesus" / "tareas atascadas" → {action: "filter", filters: {owner: "...", age: "7d", status: null}}
- Si no entiendes → {action: "unknown"}`;

const NlResponseSchema = z.object({
  action: z.enum(["navigate", "open_task", "filter", "unknown"]),
  target: z.string().nullable().optional(),
  filters: z
    .object({
      owner: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
      age: z.string().nullable().optional(),
    })
    .optional(),
});
export type NlResponse = z.infer<typeof NlResponseSchema>;

export async function parseNlCommand(text: string): Promise<NlResponse> {
  const trimmed = text.trim();
  if (trimmed.length < 2) return { action: "unknown" };

  try {
    const raw = await chat({
      model: OPENROUTER_MODELS.fast,
      messages: [
        { role: "system", content: NL_SYSTEM },
        { role: "user", content: trimmed },
      ],
      response_format: { type: "json_object" },
      temperature: 0.0,
      max_tokens: 150,
    });
    return NlResponseSchema.parse(JSON.parse(raw));
  } catch {
    return { action: "unknown" };
  }
}
