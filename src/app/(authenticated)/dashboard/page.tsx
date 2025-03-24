import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import data from "./data.json";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
