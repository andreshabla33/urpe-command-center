"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";

export function MobileNav({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex md:hidden items-center justify-between border-b bg-sidebar px-4 py-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Abrir menú"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-64 flex-col bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Navegación</SheetTitle>
          <SidebarContent
            userEmail={userEmail}
            onNavigate={() => setOpen(false)}
            forceExpanded
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col items-end leading-tight">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          URPE
        </span>
        <span className="text-xs font-semibold">Command Center</span>
      </div>
    </header>
  );
}
