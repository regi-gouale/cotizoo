"use client";

import { IconPlus } from "@tabler/icons-react";

import { DashboardItems } from "@/components/dashboard/dashboard-items";
import { SidebarSubNavItem } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DollarSignIcon } from "lucide-react";
import Link from "next/link";

export function NavMain({ items }: { items: SidebarSubNavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link
                href="/dashboard/tontines/create"
                className="flex items-center gap-2"
              >
                <IconPlus className="size-4" />
                <span>Créer une tontine</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <DollarSignIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <DashboardItems items={items} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
