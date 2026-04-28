import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env-server";
import { verifyGithubSignature } from "@/features/integrations/github/verify";
import { processGithubEvent } from "@/features/integrations/github/handler";

export async function POST(request: NextRequest) {
  if (!serverEnv.GITHUB_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "webhook_not_configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyGithubSignature(rawBody, signature, serverEnv.GITHUB_WEBHOOK_SECRET)) {
    return NextResponse.json(
      { ok: false, error: "invalid_signature" },
      { status: 401 },
    );
  }

  const eventType = request.headers.get("x-github-event") ?? "unknown";

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  try {
    const result = await processGithubEvent(eventType, payload);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
