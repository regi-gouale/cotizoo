import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
    <div className="flex h-screen flex-col md:flex-row">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden ">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
