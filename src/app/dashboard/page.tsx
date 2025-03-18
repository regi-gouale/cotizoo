import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { data: session, error } = await authClient.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    redirect("/auth/signin");
  } else if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid gap-6">
        <DashboardWelcome user={session.user} />
        <DashboardStats />
      </div>
    </div>
  );
}
