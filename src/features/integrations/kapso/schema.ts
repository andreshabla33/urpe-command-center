import { z } from "zod";

const stringish = z.union([z.string(), z.number()]).transform((v) => String(v));

export const KapsoMessagePayloadSchema = z
  .object({
    event: z.string().optional(),
    type: z.string().optional(),
    direction: z.enum(["inbound", "outbound"]).optional(),
    timestamp: z.string().optional(),
    created_at: z.string().optional(),
    message: z
      .object({
        id: stringish.optional(),
        body: z.string().optional(),
        text: z.string().optional(),
        type: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        media_url: z.string().optional(),
      })
      .partial()
      .optional(),
    contact: z
      .object({
        phone: z.string().optional(),
        wa_id: z.string().optional(),
        name: z.string().optional(),
      })
      .partial()
      .optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    id: stringish.optional(),
    message_id: stringish.optional(),
    raw: z.unknown().optional(),
  })
  .passthrough();
export type KapsoMessagePayload = z.infer<typeof KapsoMessagePayloadSchema>;

export type NormalizedKapsoMessage = {
  message_id: string;
  direction: "inbound" | "outbound";
  from_phone: string;
  to_phone: string;
  body: string;
  contact_name: string | null;
  timestamp: string;
};

export function normalizeKapsoPayload(
  raw: KapsoMessagePayload,
): NormalizedKapsoMessage | null {
  const messageId =
    raw.message_id ?? raw.id ?? raw.message?.id ?? "";
  if (!messageId) return null;

  const body =
    raw.message?.body ?? raw.message?.text ?? raw.body ?? raw.text ?? "";
  const from = raw.message?.from ?? raw.from ?? raw.contact?.phone ?? raw.contact?.wa_id ?? "";
  const to = raw.message?.to ?? raw.to ?? "";

  const direction: "inbound" | "outbound" =
    raw.direction === "outbound"
      ? "outbound"
      : raw.direction === "inbound"
        ? "inbound"
        : "inbound";

  const timestamp =
    raw.timestamp ?? raw.created_at ?? new Date().toISOString();

  return {
    message_id: String(messageId),
    direction,
    from_phone: from,
    to_phone: to,
    body,
    contact_name: raw.contact?.name ?? null,
    timestamp,
  };
}
