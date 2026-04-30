import {
  Bot,
  CalendarDays,
  Columns3,
  LineChart,
  ListChecks,
  Network,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  shortcut: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Lista", shortcut: "g+l", icon: ListChecks },
  { href: "/kanban", label: "Kanban", shortcut: "g+k", icon: Columns3 },
  { href: "/calendar", label: "Calendario", shortcut: "g+c", icon: CalendarDays },
  { href: "/graph", label: "Grafo", shortcut: "g+g", icon: Network },
  { href: "/analytics", label: "Analytics", shortcut: "g+a", icon: LineChart },
  { href: "/office", label: "Office", shortcut: "g+o", icon: Bot },
] as const;
