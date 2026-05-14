"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_GROUPS, type NavItem } from "./sidebar-nav-items";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";
import { cn } from "@/lib/utils";

type Props = {
  onNavigate?: () => void;
  forceExpanded?: boolean;
};

export function SidebarNav({ onNavigate, forceExpanded }: Props) {
  const pathname = usePathname();
  const { collapsed, mounted } = useSidebarCollapsed();
  const showCollapsed = !forceExpanded && mounted && collapsed;

  return (
    <nav className={cn("flex-1 py-4", showCollapsed ? "px-2" : "px-3")}>
      <div className="space-y-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            {!showCollapsed && (
              <p className="px-3 pb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {group.label}
              </p>
            )}
            {showCollapsed && gi > 0 && (
              <div className="mx-1 mb-2 h-px bg-border/60" aria-hidden />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      isActive={isActive}
                      collapsed={showCollapsed}
                      onNavigate={onNavigate}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

type NavLinkProps = {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

function NavLink({ item, isActive, collapsed, onNavigate }: NavLinkProps) {
  const Icon = item.icon;

  const linkClass = cn(
    "group/link flex items-center rounded-md text-sm transition-colors",
    collapsed
      ? "h-9 w-9 justify-center"
      : "justify-between gap-2 px-3 py-1.5",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
  );

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={linkClass}
    >
      {collapsed ? (
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <>
          <span className="flex min-w-0 items-center gap-2">
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span className="truncate">{item.label}</span>
          </span>
          <span
            className={cn(
              "shrink-0 font-mono text-[10px]",
              isActive
                ? "text-sidebar-accent-foreground/70"
                : "text-muted-foreground",
            )}
          >
            {item.shortcut}
          </span>
        </>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
        <span>{item.label}</span>
        <kbd className="rounded bg-background/20 px-1 font-mono text-[10px]">
          {item.shortcut}
        </kbd>
      </TooltipContent>
    </Tooltip>
  );
}
