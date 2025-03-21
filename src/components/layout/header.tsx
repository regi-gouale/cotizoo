"use client";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavigationItems } from "@/components/layout/navigation-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useScrollDetection } from "@/hooks/use-scroll-detection";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, CoinsIcon, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

// Déplaçons ce type dans un fichier de types pour le réutiliser
export type NavigationItem = {
  label: string;
  href: string;
};

// Déplaçons les éléments de navigation dans une constante exportée
export const navigationItems: NavigationItem[] = [
  // { label: "Accueil", href: "/" },
  { label: "Fonctionnalités", href: "/#features" },
  { label: "Tarification", href: "/pricing" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function HeaderFallback() {
  return (
    <header className="sticky top-0 w-full border-b z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto gap-x-2 max-w-6xl px-4">
        <div className="flex items-center gap-6">
          <BrandLogo />
        </div>
        <div className="hidden md:flex gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-16 bg-muted rounded-md animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 bg-muted rounded-md animate-pulse hidden md:block"></div>
          <div className="h-9 w-32 bg-primary/30 rounded-md animate-pulse hidden md:block"></div>
          <div className="h-9 w-9 bg-muted rounded-md animate-pulse md:hidden"></div>
        </div>
      </div>
    </header>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 ml-2 group">
      <span className="text-3xl font-bold text-primary font-mono transition-all duration-300 group-hover:scale-105 group-hover:text-primary/90 flex">
        cotiz
        <CoinsIcon className="ml-0.5 size-8 text-primary rotate-90" />
      </span>
    </Link>
  );
}

export function LoginOrDashboardButton() {
  const { data: session, isPending } = authClient.useSession();
  const [isHovered, setIsHovered] = useState(false);

  if (isPending) {
    return (
      <Button variant="ghost" disabled className="animate-pulse">
        Chargement...
      </Button>
    );
  }

  if (session) {
    return (
      <Button
        variant="link"
        asChild
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="transition-all duration-200 font-semibold font-title"
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          Tableau de bord
          {isHovered ? (
            <ArrowRight className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-all duration-200"
    >
      <Link href="/auth/signin" className="flex items-center gap-2">
        Connexion
        {isHovered ? (
          <ArrowRight className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </Link>
    </Button>
  );
}

function HeaderContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollDetection(20);

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between mx-auto gap-x-2 max-w-6xl px-4">
        <div className="flex items-center gap-6">
          <BrandLogo />
        </div>
        <div>
          <NavigationItems
            items={navigationItems}
            className="hidden gap-6 md:flex"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <LoginOrDashboardButton />
            {/* <ContactButton /> */}
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ouvrir le menu"
                className="transition-all duration-200 hover:bg-primary/10 active:scale-95"
              >
                {isMobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </Button>
            </SheetTrigger>
            <MobileMenu
              navigationItems={navigationItems}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent />
    </Suspense>
  );
}
