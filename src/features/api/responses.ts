import "server-only";
import { NextResponse } from "next/server";
import type { ResolvedToken } from "./auth";

type Json = Record<string, unknown>;

/**
 * Headers convencionales que cada response API expone para correlación
 * y auditoría (presente cuando token resolvió OK).
 */
function authHeaders(token?: ResolvedToken): Record<string, string> {
  if (!token) return {};
  return {
    "X-Acting-As": token.ownerEmail,
    "X-Token-Name": token.tokenName,
    "X-Token-Hash-Prefix": token.tokenHashPrefix,
  };
}

export function ok<T extends Json>(body: T, token?: ResolvedToken) {
  return NextResponse.json(
    { ok: true, ...body },
    { status: 200, headers: authHeaders(token) },
  );
}

export function created<T extends Json>(body: T, token?: ResolvedToken) {
  return NextResponse.json(
    { ok: true, ...body },
    { status: 201, headers: authHeaders(token) },
  );
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: "validation_failed", message, details },
    { status: 400 },
  );
}

export function unauthorized(message = "Bearer token missing or invalid") {
  return NextResponse.json(
    { ok: false, error: "unauthorized", message },
    { status: 401 },
  );
}

export function forbidden(message: string, requiredScopes?: string[]) {
  return NextResponse.json(
    {
      ok: false,
      error: "forbidden",
      message,
      required_scopes: requiredScopes,
    },
    { status: 403 },
  );
}

export function notFound(resource: string) {
  return NextResponse.json(
    { ok: false, error: "not_found", message: `${resource} not found` },
    { status: 404 },
  );
}

export function conflict(message: string, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: "conflict", message, details },
    { status: 409 },
  );
}

export function tooManyRequests(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      ok: false,
      error: "rate_limit_exceeded",
      retry_after_seconds: retryAfterSeconds,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}

export function serverError(message = "Internal server error") {
  return NextResponse.json(
    { ok: false, error: "server_error", message },
    { status: 500 },
  );
}

export function endpointNotConfigured() {
  return NextResponse.json(
    { ok: false, error: "endpoint_not_configured" },
    { status: 503 },
  );
}
