"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonLoading } from "@/components/ui/loading";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { BellIcon, CoinsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardHeader(props: {
  user: { name?: string | null; email?: string | null };
}) {
  const router = useRouter();
  const { user } = props;
  const displayName = user.name || user.email?.split("@")[0] || "Utilisateur";

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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <Link
              href="/dashboard"
              className="font-bold text-xl font-mono flex items-center text-primary"
            >
              cotiz
              <CoinsIcon className="ml-0.5 size-4 text-primary rotate-90" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full flex items-center justify-center bg-primary/10"
              >
                <span className="font-medium text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </Button>
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
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
