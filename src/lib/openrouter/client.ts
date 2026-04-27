import "server-only";
import { serverEnv } from "@/lib/env-server";

export const OPENROUTER_MODELS = {
  reasoning: "anthropic/claude-opus-4.7",
  fast: "openai/gpt-5.2",
} as const;

export const EMBEDDING_MODEL = "openai/text-embedding-3-large" as const;
export const EMBEDDING_DIMS = 3072;

export type OpenRouterModel =
  (typeof OPENROUTER_MODELS)[keyof typeof OPENROUTER_MODELS];

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type ChatOptions = {
  model: OpenRouterModel;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
};

const BASE = "https://openrouter.ai/api/v1";

const HEADERS = {
  "Content-Type": "application/json",
  "HTTP-Referer": "https://urpe-command.vercel.app",
  "X-Title": "URPE Command Center",
};

export async function chat(options: ChatOptions): Promise<string> {
  const response = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${serverEnv.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter chat error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message.content ?? "";
}

export async function embed(input: string | string[]): Promise<number[][]> {
  const response = await fetch(`${BASE}/embeddings`, {
    method: "POST",
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${serverEnv.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: Array.isArray(input) ? input : [input],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter embed error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    data: { embedding: number[] }[];
  };
  return data.data.map((d) => d.embedding);
}
