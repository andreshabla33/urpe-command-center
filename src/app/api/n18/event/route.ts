import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env-server";
import { isN18Authorized } from "@/features/n18/auth";
import { N18EventInputSchema } from "@/features/n18/schema";
import { ingestN18Events } from "@/features/n18/handler";

export async function POST(request: NextRequest) {
  if (!serverEnv.N18_INGEST_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "endpoint_not_configured" },
      { status: 503 },
    );
  }
  if (!isN18Authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = N18EventInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_input", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const result = await ingestN18Events([parsed.data]);
  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, deduped: result.deduped > 0 },
    { status: result.deduped > 0 ? 200 : 201 },
  );
}
