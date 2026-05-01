"use client";

import { signOut } from "@/features/auth/actions";
import { PushToggle } from "@/features/push/push-toggle";
import { OfflineIndicator } from "./offline-indicator";
import { DensityToggle } from "./density-toggle";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNav } from "./sidebar-nav";
import { SidebarCollapseToggle } from "./sidebar-collapse-toggle";
import { NAV_ITEMS } from "./sidebar-nav-items";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export { NAV_ITEMS };

type SidebarProps = {
  userEmail: string;
};

export function SidebarContent({
  userEmail,
  onNavigate,
  forceExpanded,
}: SidebarProps & { onNavigate?: () => void; forceExpanded?: boolean }) {
  const { collapsed, mounted, toggle } = useSidebarCollapsed();
  const showCollapsed = !forceExpanded && mounted && collapsed;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "[") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between border-b py-3",
          showCollapsed ? "px-2" : "px-5 py-4",
        )}
      >
        {showCollapsed ? (
          <div
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            title="URPE Command Center"
          >
            U
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              URPE
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold tracking-tight">
              Command Center
            </p>
          </div>
        )}
        {!forceExpanded && <SidebarCollapseToggle />}
      </div>

      <SidebarNav onNavigate={onNavigate} forceExpanded={forceExpanded} />

      <div
        className={cn(
          "border-t text-xs",
          showCollapsed ? "px-2 py-3" : "px-5 py-3",
        )}
      >
        {showCollapsed ? (
          <CollapsedFooter userEmail={userEmail} />
        ) : (
          <ExpandedFooter userEmail={userEmail} />
        )}
      </div>
    </>
  );
}

function ExpandedFooter({ userEmail }: { userEmail: string }) {
  return (
    <>
      <OfflineIndicator />
      <p className="mt-2 truncate text-muted-foreground">{userEmail}</p>
      <div className="mt-2 flex flex-col gap-1">
        <ThemeToggle />
        <DensityToggle />
        <PushToggle />
        <a
          href="/settings/tokens"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Tokens API
        </a>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Salir
          </button>
        </form>
      </div>
    </>
  );
}

function CollapsedFooter({ userEmail }: { userEmail: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 font-mono text-[10px] text-muted-foreground"
            aria-label={userEmail}
          >
            {userEmail.slice(0, 2).toUpperCase()}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {userEmail}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Cerrar sesión"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
            </button>
          </form>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Cerrar sesión
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function Sidebar({ userEmail }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-(--sidebar-width) shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out">
      <SidebarContent userEmail={userEmail} />
    </aside>
  );
}
