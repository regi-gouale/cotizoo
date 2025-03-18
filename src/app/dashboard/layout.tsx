import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen flex flex-col">
      <DashboardHeader user={user} />
      <main className="flex-1 py-6">{children}</main>
    </div>
  );
}
