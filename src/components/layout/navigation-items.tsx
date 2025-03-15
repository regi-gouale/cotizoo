"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { type NavigationItem } from "./header";

type NavigationItemsProps = {
  items: NavigationItem[];
  className?: string;
};

function NavigationItemsFallback({ className }: { className?: string }) {
  return (
    <nav className={className}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-6 w-16 bg-muted rounded-md animate-pulse mx-2"
        ></div>
      ))}
    </nav>
  );
}

function NavigationItemsContent({ items, className }: NavigationItemsProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/" && href.split("#")[1];
    return pathname.startsWith(href);
  };

  return (
    <nav className={className}>
      {items.map((item) => (
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
  );
}

export function NavigationItems(props: NavigationItemsProps) {
  return (
    <Suspense
      fallback={<NavigationItemsFallback className={props.className} />}
    >
      <NavigationItemsContent {...props} />
    </Suspense>
  );
}
