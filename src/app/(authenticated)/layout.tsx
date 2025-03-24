import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CSSProperties } from "react";

export const metadata = {
  title: {
    default: "Tableau de bord - cotizoo",
    template: "%s | cotizoo",
  },
  description: "Tableau de bord de votre compte cotizoo.",
  keywords: ["cotizoo", "tableau de bord", "compte"],
  authors: [{ name: "Équipe Cotizoo" }],
  creator: "Cotizoo",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user || null;

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          "--footer-height": "calc(var(--spacing) * 10)",
        } as CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="w-full">
        <DashboardHeader />
        <main className="flex flex-1 flex-col overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
