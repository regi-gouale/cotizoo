"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

type SidebarNavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const sidebarNavItems: SidebarNavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
  {
    label: "Mes tontines",
    href: "/dashboard/tontines",
    icon: <HomeIcon className="size-4" />,
  },
  {
    label: "Paiements",
    href: "/dashboard/paiements",
    icon: <CreditCardIcon className="size-4" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <BellIcon className="size-4" />,
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
    icon: <UsersIcon className="size-4" />,
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: <SettingsIcon className="size-4" />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = authClient;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary font-mono">
              cotizoo
            </span>
          </Link>
          <SidebarTrigger className="ml-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  size="lg"
                  tooltip={item.label}
                >
                  <Link href={item.href} className="flex w-full gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100/20"
            onClick={handleSignOut}
          >
            <LogOutIcon className="size-4 mr-2" />
            Déconnexion
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
