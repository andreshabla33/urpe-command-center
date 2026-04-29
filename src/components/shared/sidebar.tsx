import Link from "next/link";
import { signOut } from "@/features/auth/actions";
import { PushToggle } from "@/features/push/push-toggle";
import { OfflineIndicator } from "./offline-indicator";
import { DensityToggle } from "./density-toggle";

type SidebarProps = {
  userEmail: string;
};

export const NAV_ITEMS = [
  { href: "/", label: "Lista", shortcut: "g+l" },
  { href: "/kanban", label: "Kanban", shortcut: "g+k" },
  { href: "/calendar", label: "Calendario", shortcut: "g+c" },
  { href: "/graph", label: "Grafo", shortcut: "g+g" },
  { href: "/analytics", label: "Analytics", shortcut: "g+a" },
] as const;

export function SidebarContent({
  userEmail,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
  return (
    <>
      <div className="border-b px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          URPE
        </p>
        <p className="mt-0.5 text-sm font-semibold">Command Center</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.shortcut}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t px-5 py-3 text-xs">
        <OfflineIndicator />
        <p className="mt-2 truncate text-muted-foreground">{userEmail}</p>
        <div className="mt-2 flex flex-col gap-1">
          <DensityToggle />
          <PushToggle />
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ userEmail }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <SidebarContent userEmail={userEmail} />
    </aside>
  );
}
