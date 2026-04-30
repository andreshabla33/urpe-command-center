import "server-only";
import type { NextRequest } from "next/server";
import { serverEnv } from "@/lib/env-server";

export function isN18Authorized(request: NextRequest): boolean {
  const expected = serverEnv.N18_INGEST_TOKEN;
  if (!expected) return false;
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  return auth === `Bearer ${expected}`;
}
