"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export function DashboardHeader(props: {
  user: { name?: string | null; email?: string | null };
}) {
  const { user } = props;
  const displayName = user.name || user.email?.split("@")[0] || "Utilisateur";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold text-xl">
            Cotizoo
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/projects"
              className="text-sm hover:text-primary"
            >
              Projets
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm hover:text-primary"
            >
              Paramètres
            </Link>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative rounded-full h-8 w-8 flex items-center justify-center"
            >
              <span className="font-medium text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium">{displayName}</div>
            {user.email && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {user.email}
              </div>
            )}
            <DropdownMenuSeparator />
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
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
