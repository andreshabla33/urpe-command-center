export function normalizePhone(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/[^\d]/g, "");
}

export function phoneSuffix(input: string, length = 10): string {
  const norm = normalizePhone(input);
  return norm.slice(-length);
}
