"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  BellIcon,
  CoinsIcon,
  CreditCardIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { toast } from "sonner";
import { DashboardItems } from "../dashboard/dashboard-items";

export type SidebarNavItem = {
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
    label: "Tickets",
    href: "/dashboard/tickets",
    icon: <MessageSquareTextIcon className="size-4" />,
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: <SettingsIcon className="size-4" />,
  },
];

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = authClient;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary font-mono flex items-center">
            cotiz
            <CoinsIcon className="ml-0.5 size-4 text-primary rotate-90" />
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="flex-1 ml-4">
          <DashboardItems items={sidebarNavItems} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="destructive"
          className="w-full justify-center"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
