"use client";

import { type SidebarSubNavItem } from "@/components/layout/dashboard-sidebar";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type DashboardItemsProps = {
  items: SidebarSubNavItem[];
  className?: string;
};

function DashboardItemsFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-6 w-16 bg-muted rounded-md animate-pulse mx-2"
        ></div>
      ))}
    </div>
  );
}
function DashboardItemsContent({ items, className }: DashboardItemsProps) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className={className}>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            size="lg"
            tooltip={item.label}
            className={cn(
              className,
              isActive(item.href)
                ? "bg-muted/30 text-foreground"
                : "text-muted-foreground",
              "group flex items-center gap-4 rounded-md text-sm font-medium transition-colors hover:bg-muted/30 hover:text-foreground",
            )}
          >
            <Link href={item.href} className="flex w-full gap-4">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </div>
  );
}

export function DashboardItems(props: DashboardItemsProps) {
  return (
    <Suspense fallback={<DashboardItemsFallback className={props.className} />}>
      <DashboardItemsContent {...props} />
    </Suspense>
  );
}
