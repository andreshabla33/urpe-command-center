import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env-server";
import { KapsoMessagePayloadSchema } from "@/features/integrations/kapso/schema";
import { processKapsoEvent } from "@/features/integrations/kapso/handler";

function verify(request: NextRequest): boolean {
  const expected = serverEnv.KAPSO_WEBHOOK_SECRET;
  if (!expected) return false;

  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get("token");
  if (tokenFromQuery && tokenFromQuery === expected) return true;

  const headerCandidates = [
    "x-kapso-signature",
    "x-kapso-secret",
    "x-webhook-secret",
    "authorization",
  ];
  for (const name of headerCandidates) {
    const value = request.headers.get(name);
    if (!value) continue;
    if (value === expected) return true;
    if (value === `Bearer ${expected}`) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!serverEnv.KAPSO_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "webhook_not_configured" },
      { status: 503 },
    );
  }
  if (!verify(request)) {
    return NextResponse.json(
      { ok: false, error: "invalid_signature" },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = KapsoMessagePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_payload",
        details: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  try {
    const result = await processKapsoEvent(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
