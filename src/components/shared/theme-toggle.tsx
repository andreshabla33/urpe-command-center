"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-foreground"
        aria-label="Tema"
      >
        Tema
      </button>
    );
  }

  const current = theme === "system" ? `sistema (${resolvedTheme})` : theme;
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
      aria-label="Cambiar tema"
      title={`Tema actual: ${current}. Click → ${next}`}
    >
      <span>Tema</span>
      <span className="font-mono text-[10px] capitalize">{current}</span>
    </button>
  );
}
