import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { serverEnv } from "@/lib/env-server";
import { processGmailNotification } from "@/features/integrations/gmail/sync";

const PubSubPayloadSchema = z.object({
  message: z.object({
    data: z.string().min(1),
    messageId: z.string().optional(),
    publishTime: z.string().optional(),
  }),
  subscription: z.string().optional(),
});

const NotificationDataSchema = z.object({
  emailAddress: z.string().email(),
  historyId: z.union([z.string(), z.number()]).transform((v) => String(v)),
});

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (
    !serverEnv.GMAIL_PUBSUB_VERIFICATION_TOKEN ||
    token !== serverEnv.GMAIL_PUBSUB_VERIFICATION_TOKEN
  ) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = PubSubPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_pubsub_payload" },
      { status: 400 },
    );
  }

  const decoded = Buffer.from(parsed.data.message.data, "base64").toString("utf8");
  let dataObj: unknown;
  try {
    dataObj = JSON.parse(decoded);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_inner_data" },
      { status: 400 },
    );
  }
  const dataParsed = NotificationDataSchema.safeParse(dataObj);
  if (!dataParsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_notification_data" },
      { status: 400 },
    );
  }

  const result = await processGmailNotification(dataParsed.data);
  return NextResponse.json({ ok: true, ...result });
}
