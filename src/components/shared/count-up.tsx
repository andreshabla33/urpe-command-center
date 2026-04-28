"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 600;

export function CountUp({
  value,
  className,
}: {
  value: number | string;
  className?: string;
}) {
  const [display, setDisplay] = useState<number | string>(
    typeof value === "number" ? 0 : value,
  );
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(value);
      return;
    }
    startedAt.current = performance.now();
    let rafId = 0;
    const step = (now: number) => {
      const start = startedAt.current ?? now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <span className={className}>{display}</span>;
}
