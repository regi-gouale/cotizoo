import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Rowdies, Lato, Montserrat } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cotizoo",
  description: "Bienvenue sur l'application Cotizoo",
};

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const rowdies = Rowdies({
  variable: "--font-rowdies",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          lato.variable,
          montserrat.variable,
          rowdies.variable,
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
