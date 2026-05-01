"use client";

import { useState } from "react";
import Image from "next/image";
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

      <div className="flex items-center gap-2">
        <Image
          src="/brand/v4-mark-only.jpg"
          alt="URPE"
          width={28}
          height={28}
          className="h-7 w-7 rounded shrink-0"
          priority
        />
        <div className="flex flex-col items-start leading-none">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            URPE
          </span>
          <span className="h-display mt-0.5 text-[11px] uppercase tracking-[0.04em] text-sidebar-foreground">
            Command Center
          </span>
        </div>
      </div>
    </header>
  );
}
