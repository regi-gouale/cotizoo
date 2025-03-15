"use client";

import { SignupModal } from "@/components/forms/cta-modal";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CoinsIcon, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Fonctionnalités", href: "/#features" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/" && href.split("#")[1];
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        isScrolled && "shadow-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between mx-auto gap-x-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 ml-2 group">
            <span className="text-3xl font-bold text-primary font-mono transition-all duration-300 group-hover:scale-105 group-hover:text-primary/90 flex">
              cotiz
              <CoinsIcon className="ml-0.5 size-8 text-primary rotate-90" />
            </span>
          </Link>
        </div>
        <div>
          <nav className="hidden gap-6 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 px-2 rounded-md font-title",
                  isActive(item.href)
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transform after:origin-bottom after:scale-x-100 after:transition-transform"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transform after:origin-bottom after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
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
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader className="flex flex-row items-center gap-4 justify-between mt-4">
                <SheetTitle className="text-left font-mono text-primary">
                  Cotizoo
                </SheetTitle>
                <ThemeToggle className="text-primary" />
              </SheetHeader>
              <nav className="flex flex-col gap-4 mx-2 mt-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-base font-medium transition-all duration-200 px-2 py-2 rounded-md font-title",
                      isActive(item.href)
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}

                <SignupModal className="bg-primary text-primary-foreground" />
                {/* <Button
                  asChild
                  className="mt-6 w-full transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                >
                  <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>
                    Je m'inscris
                  </Link>
                </Button> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
