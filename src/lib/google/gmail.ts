import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { vaultReadSecret } from "@/lib/supabase/vault";
import { refreshAccessToken } from "./oauth";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1";

export type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: GmailPayload;
  internalDate?: string;
};

export type GmailPayload = {
  headers?: { name: string; value: string }[];
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: GmailPayload[];
};

export type GmailHistoryItem = {
  id: string;
  messages?: { id: string; threadId: string }[];
  messagesAdded?: { message: { id: string; threadId: string } }[];
};

async function getAccessTokenFor(email: string): Promise<string> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("dim_person_integration")
    .select("vault_secret_id")
    .eq("email", email)
    .eq("provider", "gmail")
    .single();
  if (error || !data) {
    throw new Error(`No gmail integration for ${email}`);
  }
  const refreshToken = await vaultReadSecret(data.vault_secret_id);
  const { access_token } = await refreshAccessToken(refreshToken);
  return access_token;
}

async function gmailFetch<T>(
  email: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await getAccessTokenFor(email);
  const r = await fetch(`${GMAIL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Gmail API ${r.status} on ${path}: ${text}`);
  }
  return (await r.json()) as T;
}

export async function getMessage(
  account: string,
  messageId: string,
): Promise<GmailMessage> {
  return gmailFetch<GmailMessage>(
    account,
    `/users/me/messages/${messageId}?format=full`,
  );
}

export async function listHistory(
  account: string,
  startHistoryId: string,
): Promise<{ history?: GmailHistoryItem[]; historyId: string }> {
  return gmailFetch(
    account,
    `/users/me/history?startHistoryId=${startHistoryId}&historyTypes=messageAdded`,
  );
}

export async function startWatch(
  account: string,
  topicName: string,
): Promise<{ historyId: string; expiration: string }> {
  return gmailFetch(account, `/users/me/watch`, {
    method: "POST",
    body: JSON.stringify({
      topicName,
      labelIds: ["INBOX", "SENT"],
      labelFilterAction: "include",
    }),
  });
}

export async function stopWatch(account: string): Promise<void> {
  await gmailFetch(account, `/users/me/stop`, { method: "POST" });
}

export async function sendReply(input: {
  account: string;
  threadId: string;
  to: string;
  subject: string;
  body: string;
  inReplyToMessageId?: string;
}): Promise<{ id: string; threadId: string }> {
  const headers = [
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    `Content-Type: text/plain; charset=UTF-8`,
  ];
  if (input.inReplyToMessageId) {
    headers.push(`In-Reply-To: ${input.inReplyToMessageId}`);
    headers.push(`References: ${input.inReplyToMessageId}`);
  }
  const raw = `${headers.join("\r\n")}\r\n\r\n${input.body}`;
  const encoded = Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return gmailFetch<{ id: string; threadId: string }>(
    input.account,
    `/users/me/messages/send`,
    {
      method: "POST",
      body: JSON.stringify({
        raw: encoded,
        threadId: input.threadId,
      }),
    },
  );
}

export function extractHeader(
  payload: GmailPayload | undefined,
  name: string,
): string | undefined {
  return payload?.headers?.find(
    (h) => h.name.toLowerCase() === name.toLowerCase(),
  )?.value;
}

export function extractBody(payload: GmailPayload | undefined): string {
  if (!payload) return "";
  if (payload.body?.data) return decodeBase64Url(payload.body.data);
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
    for (const part of payload.parts) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }
  return "";
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf8");
}
