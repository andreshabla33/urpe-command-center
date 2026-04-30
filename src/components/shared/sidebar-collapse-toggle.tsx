"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";

export function SidebarCollapseToggle() {
  const { collapsed, toggle, mounted } = useSidebarCollapsed();
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const label = collapsed ? "Expandir sidebar" : "Colapsar sidebar";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggle}
          aria-label={label}
          aria-pressed={mounted ? collapsed : undefined}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={6}>
        {label}{" "}
        <kbd className="ml-1 rounded bg-background/20 px-1 font-mono text-[10px]">
          [
        </kbd>
      </TooltipContent>
    </Tooltip>
  );
}
