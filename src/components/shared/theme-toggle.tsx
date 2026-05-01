"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "federal", label: "Federal", glyph: Shield },
  { id: "document", label: "Document", glyph: FileText },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-1">
      <p className="font-display text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Theme
      </p>
      <div className="flex gap-1">
        {THEMES.map((t) => {
          const active = mounted && theme === t.id;
          const Glyph = t.glyph;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              aria-pressed={active}
              title={t.label}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-inset ring-primary/40"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Glyph className="h-3 w-3" aria-hidden />
              <span className="sr-only">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
