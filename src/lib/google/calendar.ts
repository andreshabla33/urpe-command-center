import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { vaultReadSecret } from "@/lib/supabase/vault";
import { refreshAccessToken } from "./oauth";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const DEFAULT_DURATION_MINUTES = 30;

export type CalendarEvent = {
  id: string;
  htmlLink?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; timeZone?: string };
  end?: { dateTime?: string; timeZone?: string };
};

async function getAccessTokenFor(email: string): Promise<string> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("dim_person_integration")
    .select("vault_secret_id")
    .eq("email", email)
    .eq("provider", "calendar")
    .single();
  if (error || !data) {
    throw new Error(`No calendar integration for ${email}`);
  }
  const refreshToken = await vaultReadSecret(data.vault_secret_id);
  const { access_token } = await refreshAccessToken(refreshToken);
  return access_token;
}

async function calendarFetch<T>(
  email: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await getAccessTokenFor(email);
  const r = await fetch(`${CALENDAR_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Calendar API ${r.status} on ${path}: ${text}`);
  }
  if (r.status === 204) return undefined as T;
  return (await r.json()) as T;
}

export async function createCalendarEvent(input: {
  account: string;
  summary: string;
  description: string;
  startIso: string;
  durationMinutes?: number;
}): Promise<CalendarEvent> {
  const start = new Date(input.startIso);
  const end = new Date(
    start.getTime() +
      (input.durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60_000,
  );
  return calendarFetch<CalendarEvent>(
    input.account,
    "/calendars/primary/events",
    {
      method: "POST",
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: start.toISOString(), timeZone: "UTC" },
        end: { dateTime: end.toISOString(), timeZone: "UTC" },
      }),
    },
  );
}

export async function deleteCalendarEvent(
  account: string,
  eventId: string,
): Promise<void> {
  await calendarFetch<void>(
    account,
    `/calendars/primary/events/${eventId}`,
    { method: "DELETE" },
  );
}
