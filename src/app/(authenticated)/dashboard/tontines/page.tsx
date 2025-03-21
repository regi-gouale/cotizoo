import { TontinesList } from "@/components/tontines/tontines-list";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";

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
    <div className="container py-6 space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes tontines</h1>
        <Button asChild>
          <Link href="/dashboard/tontines/create">Créer une tontine</Link>
        </Button>
      </div>

      <TontinesList tontines={tontines} />
    </div>
  );
}
