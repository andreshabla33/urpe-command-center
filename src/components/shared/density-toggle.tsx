"use client";

import { useEffect, useState } from "react";

type Density = "comfortable" | "compact";

const STORAGE_KEY = "urpe-density";

function readStored(): Density {
  if (typeof window === "undefined") return "comfortable";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "compact" ? "compact" : "comfortable";
}

export function DensityToggle() {
  const [density, setDensity] = useState<Density>("comfortable");

  useEffect(() => {
    setDensity(readStored());
  }, []);

  function toggle() {
    const next: Density = density === "compact" ? "comfortable" : "compact";
    setDensity(next);
    document.documentElement.dataset.density = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs text-muted-foreground hover:text-foreground"
      title="Densidad de filas"
    >
      Densidad: {density === "compact" ? "compacta" : "cómoda"}
    </button>
  );
}
