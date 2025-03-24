"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Get breadcrumbs from the pathname
  // Example: "/dashboard/tontines/[:id]" => [{ name: "Tableau de bord", isActive: false }, { name: "Mes tontines", isActive: false }, { name: "Ma tontine", isActive: true }]
  const breadcrumbs = pathname
    .split("/")
    .filter((path) => path !== "")
    .map((path, index, arr) => {
      const isActive = index === arr.length - 1;
      const href = `/${arr.slice(0, index + 1).join("/")}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1);
      if (name === "Dashboard") {
        return {
          name: "Tableau de bord",
          href: "/dashboard",
          isActive,
        };
      }
      if (name === "Tontines") {
        return {
          name: "Mes tontines",
          href: "/dashboard/tontines",
          isActive,
        };
      }
      if (name === "Settings") {
        return {
          name: "Paramètres",
          href: "/dashboard/settings",
          isActive,
        };
      }
      if (name === "Notifications") {
        return {
          name: "Notifications",
          href: "/dashboard/notifications",
          isActive,
        };
      }
      if (name === "Profil") {
        return {
          name: "Mon profil",
          href: "/dashboard/settings/profil",
          isActive,
        };
      }
      if (name === "Messages") {
        return {
          name: "Mes messages",
          href: "/dashboard/messages",
          isActive,
        };
      }

      return {
        name,
        href,
        isActive,
      };
    });

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2); // Exemple: 2 notifications

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Déconnexion réussie");
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Breadcrumbs */}
        {/* Display the first breadcrumb as a link and add separator */}
        <h1 className="text-base font-medium">
          {breadcrumbs.map((b, index) => (
            <span key={index}>
              {b.isActive ? b.name : <Link href={b.href}>{b.name}</Link>}
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-muted-foreground">/</span>
              )}
            </span>
          ))}
        </h1>
        {/* <h1 className="text-base font-medium">
          {breadcrumbs.map((b) =>
            b.isActive ? (
              b.name
            ) : (
              <Link href={`/${b.name.toLowerCase()}`}>{b.name}</Link>
            ),
          )}
        </h1> */}

        <div className="flex ml-auto items-center gap-2">
          {/* Notification icon with badge */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="size-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 font-medium border-b">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-1 px-2 text-xs"
                >
                  Tout marquer comme lu
                </Button>
              </div>
              <div className="py-2">
                {notificationCount > 0 ? (
                  <>
                    <DropdownMenuItem className="py-2 cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Rappel de paiement</p>
                        <p className="text-sm text-muted-foreground">
                          Votre paiement pour la tontine "Famille" est dû demain
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Nouveau membre</p>
                        <p className="text-sm text-muted-foreground">
                          Jean Dupont a rejoint la tontine "Amis"
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="px-4 py-2 text-center text-muted-foreground">
                    Aucune notification
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link
                  href="/dashboard/notifications"
                  className="w-full text-center cursor-pointer"
                >
                  Voir toutes les notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown menu */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer bg-primary/10">
                {user.image ? (
                  <AvatarImage src={user.image} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {displayName}
              </div>
              {user.email && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {user.email}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings/profil"
                  className="w-full cursor-pointer"
                >
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="w-full cursor-pointer"
                >
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <div className="flex items-center">
                    <ButtonLoading className="mr-2" />
                    <span>Déconnexion...</span>
                  </div>
                ) : (
                  <span className="text-red-600">Déconnexion</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
}
