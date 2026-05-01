import { cn } from "@/lib/utils";

/**
 * Brandbook-restringido: 4 variantes de la paleta federal en lugar de rainbow.
 * Gold cálido / Gold brillante / Silver / Bone-translucent.
 * Las iniciales se distinguen por la posición en la paleta (hash determinista),
 * pero la composición visual queda austera.
 */
const PALETTE = [
  "bg-[var(--brand-gold)]/20 text-[var(--brand-bright-gold)]",
  "bg-[var(--brand-bright-gold)]/22 text-[var(--brand-bright-gold)]",
  "bg-[var(--brand-silver)]/18 text-[var(--brand-silver)]",
  "bg-[var(--brand-bone)]/12 text-[var(--brand-bone)]",
];

function hashToIndex(input: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

function initials(input: string): string {
  const local = input.split("@")[0] ?? input;
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

type Size = "xs" | "sm" | "md";

const SIZE: Record<Size, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
};

type Props = {
  email: string | null | undefined;
  size?: Size;
  className?: string;
  showRing?: boolean;
};

export function UserAvatar({ email, size = "sm", className, showRing }: Props) {
  if (!email) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          SIZE[size],
          className,
        )}
        aria-hidden
      >
        ·
      </span>
    );
  }

  const tone = PALETTE[hashToIndex(email, PALETTE.length)];
  const label = initials(email);

  return (
    <span
      title={email}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium",
        SIZE[size],
        tone,
        showRing && "ring-2 ring-background",
        className,
      )}
    >
      {label}
    </span>
  );
}
