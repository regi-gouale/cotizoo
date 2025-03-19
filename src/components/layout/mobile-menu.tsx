"use client";

import { type NavigationItem } from "@/components/layout/header";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, CoinsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

type MobileMenuProps = {
  navigationItems: NavigationItem[];
  onClose: () => void;
};

function MobileMenuFallback() {
  return (
    <SheetContent side="right" className="w-full max-w-xs">
      <SheetHeader className="flex flex-row items-center gap-4 justify-between mt-4">
        <SheetTitle className="text-left font-mono text-primary flex items-center">
          cotiz
          <CoinsIcon className="ml-0.5 size-4 text-primary rotate-90" />
        </SheetTitle>
        <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div>
      </SheetHeader>
      <div className="flex flex-col gap-4 mx-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-full bg-muted rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    </SheetContent>
  );
}

function MobileMenuContent({ navigationItems, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/" && href.split("#")[1];
    return pathname.startsWith(href);
  };

  return (
    <SheetContent side="right" className="w-full max-w-xs">
      <SheetHeader className="flex flex-row items-center gap-4 justify-between mt-4">
        <SheetTitle className="text-left font-mono text-primary flex items-center">
          cotiz
          <CoinsIcon className="ml-0.5 size-4 text-primary rotate-90" />
        </SheetTitle>
        <ThemeToggle className="text-primary" />
      </SheetHeader>
      <nav className="flex flex-col gap-4 mx-2">
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
            onClick={onClose}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t border-border my-2 pt-2"></div>

        {!isPending && (
          <Button
            variant="ghost"
            asChild
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            className="justify-start px-2 transition-all duration-200"
            onClick={onClose}
          >
            <Link
              href={session ? "/dashboard" : "/auth/signin"}
              className="flex items-center gap-2"
            >
              {session ? "Tableau de bord" : "Connexion"}
              {isLoginHovered ? (
                <ArrowRight className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Link>
          </Button>
        )}

        <Button
          variant="default"
          asChild
          onMouseEnter={() => setIsContactHovered(true)}
          onMouseLeave={() => setIsContactHovered(false)}
          className="justify-start px-2 transition-all duration-200"
          onClick={onClose}
        >
          <Link href="/contact" className="flex items-center gap-2">
            Contacter notre équipe
            {isContactHovered ? (
              <ArrowRight className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Link>
        </Button>

        {/* <SignupModal className="bg-primary text-primary-foreground" /> */}
      </nav>
    </SheetContent>
  );
}

export function MobileMenu(props: MobileMenuProps) {
  return (
    <Suspense fallback={<MobileMenuFallback />}>
      <MobileMenuContent {...props} />
    </Suspense>
  );
}
