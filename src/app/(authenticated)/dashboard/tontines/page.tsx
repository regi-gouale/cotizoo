import { TontineCards } from "@/components/tontines/tontines-list";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export default async function TontinesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const userTontines = await prisma.userTontine.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      tontine: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  const tontines = userTontines.map((userTontine) => ({
    ...userTontine.tontine,
    role: userTontine.role,
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* <h1 className="text-3xl font-bold">Mes tontines</h1>
        <Button asChild>
          <Link href="/dashboard/tontines/create">Créer une tontine</Link>
        </Button> */}
      </div>

      <TontineCards tontines={tontines} />
    </div>
  );
}
