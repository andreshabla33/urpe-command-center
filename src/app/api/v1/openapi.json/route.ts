import { NextResponse, type NextRequest } from "next/server";
import { buildOpenApiSpec } from "@/features/api/openapi-spec";

export async function GET(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("host") ?? "urpe-command-center.vercel.app";
  const serverUrl = `${proto}://${host}`;
  const spec = buildOpenApiSpec(serverUrl);
  return NextResponse.json(spec, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
