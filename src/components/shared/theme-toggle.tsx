"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "light", label: "Cálido", glyph: "☀" },
  { id: "dark", label: "Oscuro", glyph: "☾" },
  { id: "white", label: "Blanco", glyph: "○" },
  { id: "mocha", label: "Moka", glyph: "☕" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        Tema
      </p>
      <div className="flex gap-1">
        {THEMES.map((t) => {
          const active = mounted && theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              aria-pressed={active}
              title={t.label}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded text-xs leading-none transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-inset ring-primary/30"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <span aria-hidden>{t.glyph}</span>
              <span className="sr-only">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
