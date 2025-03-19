import { Header } from "@/components/layout/header";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default:
      "cotizoo - La gestion de votre tontine, simple comme un jeu d'enfant !",
    template: "%s | cotizoo",
  },
  description: "Cotizoo vous aide à gérer votre entreprise efficacement.",
  keywords: ["cotizoo", "entreprise", "gestion", "plateforme"],
  authors: [{ name: "Équipe Cotizoo" }],
  creator: "Cotizoo",
};

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full mx-auto">
      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export default MarketingLayout;
