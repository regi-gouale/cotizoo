import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, error } = await authClient.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    redirect("/auth/signin");
  } else if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader user={session.user} />
      <main className="flex-1 py-6">{children}</main>
    </div>
  );
}
