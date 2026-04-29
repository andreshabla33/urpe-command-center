import { signOut } from "@/features/auth/actions";
import { PushToggle } from "@/features/push/push-toggle";
import { OfflineIndicator } from "./offline-indicator";
import { DensityToggle } from "./density-toggle";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNav } from "./sidebar-nav";
import { NAV_ITEMS } from "./sidebar-nav-items";

export { NAV_ITEMS };

type SidebarProps = {
  userEmail: string;
};

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
        <p className="mt-0.5 text-sm font-semibold tracking-tight">
          Command Center
        </p>
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="border-t px-5 py-3 text-xs">
        <OfflineIndicator />
        <p className="mt-2 truncate text-muted-foreground">{userEmail}</p>
        <div className="mt-2 flex flex-col gap-1">
          <ThemeToggle />
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
