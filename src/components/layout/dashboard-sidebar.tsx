"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  BanknoteIcon,
  BellIcon,
  CircleDollarSignIcon,
  CoinsIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { toast } from "sonner";
import { NavMain } from "../nav-main";
import { NavDocuments } from "../nav-documents";
import { NavSecondary } from "../nav-secondary";
import { NavUser } from "../nav-user";

export type SidebarSubNavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type UserSidebarNavItem = {
  label: string;
  email: string;
  avatar: string;
};

export type sidebarNavItems = {
  user: UserSidebarNavItem;
  navMain: SidebarSubNavItem[];
  navSecondary: SidebarSubNavItem[];
  documents: SidebarSubNavItem[];
};

const sidebarNavItems: SidebarSubNavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
  {
    label: "Mes tontines",
    href: "/dashboard/tontines",
    icon: <CircleDollarSignIcon className="size-4" />,
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

const navMainItems: SidebarSubNavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
  {
    label: "Mes tontines",
    href: "/dashboard/tontines",
    icon: <CircleDollarSignIcon className="size-4" />,
  },
  {
    label: "Mes paiements",
    href: "/dashboard/paiements",
    icon: <CreditCardIcon className="size-4" />,
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquareTextIcon className="size-4" />,
  },
];

const navSecondaryItems: SidebarSubNavItem[] = [
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: <SettingsIcon className="size-4" />,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: <BellIcon className="size-4" />,
  },
  {
    label: "Besoins d'aide",
    href: "/dashboard/help",
    icon: <HelpCircleIcon className="size-4" />,
  },
];

const documentItems: SidebarSubNavItem[] = [
  {
    label: "Données bancaires",
    href: "/dashboard/bank-data",
    icon: <BanknoteIcon className="size-4" />,
  },
];

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return null; // or a loading spinner
  }
  if (error) {
    toast.error("Erreur lors de la récupération de la session");
    return null; // or an error message
  }
  if (!session) {
    toast.error("Session non trouvée");
    router.push("/auth/signin");
    redirect("/auth/signin");
  }
  const user = session.user || null;
  if (!user) {
    toast.error("Utilisateur non trouvé");
    router.push("/auth/signin");
    redirect("/auth/signin");
  }

  const userData: UserSidebarNavItem = {
    label: user.name,
    email: user.email,
    avatar: user.image || "",
  };

  const data = {
    user: userData,
    navMain: navMainItems,
    navSecondary: navSecondaryItems,
    documents: documentItems,
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Déconnexion réussie");
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <CoinsIcon className="!size-5 rotate-90 ml-4" />
                <span className="text-xl font-semibold font-mono">cotizoo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
