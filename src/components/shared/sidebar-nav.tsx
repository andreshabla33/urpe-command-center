"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./sidebar-nav-items";

type Props = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={
                  "flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors " +
                  (isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")
                }
              >
                <span>{item.label}</span>
                <span
                  className={
                    "font-mono text-[10px] " +
                    (isActive ? "text-sidebar-accent-foreground/70" : "text-muted-foreground")
                  }
                >
                  {item.shortcut}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
