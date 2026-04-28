const TASK_ID_REGEX = /\b([A-Z]{2,}(?:-[A-Z0-9]+){2,})\b/g;

export function extractTaskIds(text: string | null | undefined): string[] {
  if (!text) return [];
  const matches = text.match(TASK_ID_REGEX) ?? [];
  return Array.from(new Set(matches));
}
