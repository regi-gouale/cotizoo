import { TontineFilters } from "@/components/tontines/tontine-filters";
import { TontineCards } from "@/components/tontines/tontines-list";
import { updateExpiredTontineStatus } from "@/lib/actions/update-tontine-status.action";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageParams } from "@/types/next";
import { TontineStatus } from "@prisma/client";
import { headers } from "next/headers";

export default async function TontinesPage(props: PageParams) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  // Vérifier et mettre à jour les tontines expirées
  await updateExpiredTontineStatus();

  const searchParams = await props.searchParams;

  // Récupérer les statuts filtrés depuis les paramètres de recherche
  const statusParam =
    typeof searchParams.status === "string" ? searchParams.status : undefined;
  const statusFilters = statusParam
    ? (statusParam.split(",") as TontineStatus[])
    : undefined;

  // Construire la requête avec filtres si spécifiés
  const userTontines = await prisma.userTontine.findMany({
    where: {
      userId: session.user.id,
      tontine: statusFilters
        ? {
            status: {
              in: statusFilters,
            },
          }
        : undefined,
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Mes tontines</h1>
        </div>
        <TontineFilters />
      </div>

      <TontineCards tontines={tontines} />
    </div>
  );
}
