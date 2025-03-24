import { TontineDetails } from "@/components/tontines/tontine-details";
import { updateExpiredTontineStatus } from "@/lib/actions/update-tontine-status.action";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TontineStatus } from "@prisma/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function TontinePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  // Vérifier et mettre à jour les tontines expirées
  await updateExpiredTontineStatus();

  // Récupération des données de la tontine avec les membres et l'historique
  const tontine = await prisma.tontine.findUnique({
    where: {
      id: await params.id,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      historyLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      transactions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!tontine) {
    notFound();
  }

  // Vérifier si l'utilisateur est membre de cette tontine
  const userMembership = tontine.members.find(
    (member) => member.userId === session.user.id,
  );

  if (!userMembership) {
    notFound();
  }

  // Récupérer le rôle de l'utilisateur
  const userRole = userMembership.role;

  // Calculer les statistiques
  const totalMembers = tontine.members.length;
  const remainingSlots = tontine.maxMembers - totalMembers;
  const contributions = tontine.transactions.filter(
    (tx) => tx.type === "COTISATION" && tx.status === "COMPLETED",
  );
  const totalContributed = contributions.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );
  const redistributions = tontine.transactions.filter(
    (tx) => tx.type === "REDISTRIBUTION" && tx.status === "COMPLETED",
  );
  const totalRedistributed = redistributions.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  // Prochaine date de contribution en fonction de la fréquence
  const nextContributionDate = getNextContributionDate(tontine);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <TontineDetails
        tontine={tontine}
        userRole={userRole}
        statistics={{
          totalMembers,
          remainingSlots,
          totalContributed,
          totalRedistributed,
          nextContributionDate,
        }}
      />
    </div>
  );
}

function getNextContributionDate(tontine: any) {
  const today = new Date();
  const startDate = new Date(tontine.startDate);

  // Si la tontine est terminée, retourner null
  if (
    tontine.status === TontineStatus.COMPLETED ||
    new Date(tontine.endDate) < today
  ) {
    return null;
  }

  // Calculer la prochaine échéance en fonction de la fréquence
  let nextDue = new Date(startDate);

  while (nextDue <= today) {
    switch (tontine.frequency) {
      case "WEEKLY":
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case "BIWEEKLY":
        nextDue.setDate(nextDue.getDate() + 14);
        break;
      case "MONTHLY":
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case "QUARTERLY":
        nextDue.setMonth(nextDue.getMonth() + 3);
        break;
      case "SEMIANNUAL":
        nextDue.setMonth(nextDue.getMonth() + 6);
        break;
      case "YEARLY":
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
    }
  }

  return nextDue;
}
