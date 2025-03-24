import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import data from "./data.json";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  const user = (await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      tontines: true,
    },
  })) as unknown as User;

  // console.log("user", user);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards user={user} />
        <div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
