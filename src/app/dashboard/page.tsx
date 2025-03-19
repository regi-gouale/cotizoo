import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  console.log("session", session);
  if (!session) {
    console.error("No session found, redirecting to signin");
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
