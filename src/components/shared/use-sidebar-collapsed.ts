"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "urpe-sidebar-collapsed";

function readDataset(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.sidebar === "collapsed";
}

export function useSidebarCollapsed(): {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  toggle: () => void;
  mounted: boolean;
} {
  const [collapsed, setCollapsedState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCollapsedState(readDataset());
    setMounted(true);

    const obs = new MutationObserver(() => {
      setCollapsedState(readDataset());
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar"],
    });
    return () => obs.disconnect();
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    if (next) {
      document.documentElement.dataset.sidebar = "collapsed";
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    } else {
      delete document.documentElement.dataset.sidebar;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!readDataset());
  }, [setCollapsed]);

  return { collapsed, setCollapsed, toggle, mounted };
}
