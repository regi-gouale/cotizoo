"use client";

import { SignupModal } from "@/components/forms/cta-modal";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavigationItems } from "@/components/layout/navigation-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useScrollDetection } from "@/lib/hooks/use-scroll-detection";
import { cn } from "@/lib/utils";
import { CoinsIcon, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Déplaçons ce type dans un fichier de types pour le réutiliser
export type NavigationItem = {
  label: string;
  href: string;
};

// Déplaçons les éléments de navigation dans une constante exportée
export const navigationItems: NavigationItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Fonctionnalités", href: "/#features" },
  { label: "À propos", href: "/about" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollDetection(20);

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between mx-auto gap-x-2">
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
          <ThemeToggle className="hidden md:flex text-primary" />
          <Button
            asChild
            className="hidden md:flex transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
          >
            <SignupModal className="bg-primary text-primary-foreground hover:bg-primary/90" />
          </Button>

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
