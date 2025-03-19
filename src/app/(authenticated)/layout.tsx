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
          "--sidebar-width": "19rem",
        } as CSSProperties
      }
    >
      <DashboardSidebar />

      <SidebarInset className="w-full">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
