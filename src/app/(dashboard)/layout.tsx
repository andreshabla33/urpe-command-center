import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { createClient } from "@/lib/supabase/server";
import { RealtimeProvider } from "@/features/events/realtime-provider";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { CommandPalette } from "@/components/shared/command-palette";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <RealtimeProvider>
      <KeyboardShortcuts />
      <CommandPalette />
      <div className="flex flex-1">
        <Sidebar userEmail={user.email ?? "—"} />
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </RealtimeProvider>
  );
}
