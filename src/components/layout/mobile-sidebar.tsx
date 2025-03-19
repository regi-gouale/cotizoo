"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { setOpenMobile } = useSidebar();

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setOpenMobile(value);
      }}
    >
      <SheetTrigger className="md:hidden">
        <button
          className="flex items-center justify-center p-2"
          aria-label="Menu"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <DashboardSidebar />
      </SheetContent>
    </Sheet>
  );
}
