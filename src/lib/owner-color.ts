const PALETTE = [
  { bar: "#0a1f44", swatch: "#0a1f44" },
  { bar: "#c5a572", swatch: "#c5a572" },
  { bar: "#5b6f8a", swatch: "#5b6f8a" },
  { bar: "#7d6a45", swatch: "#7d6a45" },
  { bar: "#3f5a7a", swatch: "#3f5a7a" },
  { bar: "#8a7440", swatch: "#8a7440" },
  { bar: "#264a73", swatch: "#264a73" },
  { bar: "#6b5e3f", swatch: "#6b5e3f" },
] as const;

export function ownerColor(email: string | null | undefined) {
  if (!email) return { bar: "var(--border)", swatch: "var(--muted-foreground)" };
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}
