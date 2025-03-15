"use client";

import { CoinsIcon } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t p-6 md:p-8 flex flex-col items-center gap-4 text-sm text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm text-muted-foreground flex items-center font-bold">
            &copy; {currentYear} cotiz
            <span>
              <CoinsIcon className="size-3 rotate-90" />
            </span>
            . Tous droits réservés.
          </p>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/mentions-legales" className="hover:text-foreground">
            Mentions légales
          </Link>
          <Link
            href="/politique-confidentialite"
            className="hover:text-foreground"
          >
            Politique de confidentialité
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
