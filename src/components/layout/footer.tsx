"use client";

import { CoinsIcon } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t p-6 md:p-8 flex flex-col items-center gap-4 text-sm text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row max-w-6xl">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm text-muted-foreground flex items-center font-sans gap-1">
            &copy; {currentYear} <span className="font-mono">cotiz</span>
            <span className="font-mono">
              <CoinsIcon className="size-3 rotate-90" />
            </span>
            <span className="font-sans">. Tous droits réservés.</span>
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
