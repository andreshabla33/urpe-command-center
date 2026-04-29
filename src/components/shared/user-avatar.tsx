import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-violet-500/20 text-violet-700 dark:text-violet-300",
  "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  "bg-rose-500/20 text-rose-700 dark:text-rose-300",
  "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
  "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300",
  "bg-orange-500/20 text-orange-700 dark:text-orange-300",
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
