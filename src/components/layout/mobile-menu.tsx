"use client";

import {
  LoginOrDashboardButton,
  type NavigationItem,
} from "@/components/layout/header";
import { NavigationItems } from "@/components/layout/navigation-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { CoinsIcon } from "lucide-react";
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
      <div>
        {/* <nav className="flex flex-col gap-4 mx-2">
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
        </nav> */}
        <NavigationItems
          items={navigationItems}
          className="flex flex-col mx-4 gap-6 md:hidden"
        />
        <Separator className="my-4" />
        {!isPending && <LoginOrDashboardButton />}
      </div>
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
