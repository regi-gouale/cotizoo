"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TontineStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Met à jour le statut des tontines dont la date de fin est dépassée
 * @returns Le nombre de tontines mises à jour
 */
export async function updateExpiredTontineStatus() {
  try {
    const now = new Date();

    // Trouver toutes les tontines actives dont la date de fin est dépassée
    const expiredTontines = await prisma.tontine.findMany({
      where: {
        status: TontineStatus.ACTIVE,
        endDate: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
    });

    if (expiredTontines.length === 0) {
      return {
        success: true,
        updatedCount: 0,
        message: "Aucune tontine expirée à mettre à jour.",
      };
    }

    // Mettre à jour le statut des tontines expirées
    const updatePromises = expiredTontines.map(async (tontine) => {
      // Mettre à jour le statut de la tontine
      await prisma.tontine.update({
        where: {
          id: tontine.id,
        },
        data: {
          status: TontineStatus.COMPLETED,
          // Ajouter un historique pour cette action
          historyLogs: {
            create: {
              action: "RULES_UPDATED",
              details:
                "La tontine a été automatiquement marquée comme terminée car sa date de fin est dépassée.",
            },
          },
        },
      });

      return tontine.id;
    });

    // Exécuter toutes les mises à jour en parallèle
    const updatedTontineIds = await Promise.all(updatePromises);

    // Revalider les chemins pour que les changements soient visibles immédiatement
    // revalidatePath("/dashboard/tontines");
    updatedTontineIds.forEach((id) => {
      revalidatePath(`/dashboard/tontines/${id}`);
    });

    return {
      success: true,
      updatedCount: updatedTontineIds.length,
      message: `${updatedTontineIds.length} tontine(s) ont été marquées comme terminées.`,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des tontines expirées:",
      error,
    );
    return {
      success: false,
      updatedCount: 0,
      message: "Une erreur est survenue lors de la mise à jour des tontines.",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Met à jour le statut d'une tontine spécifique
 * @param input Les données de mise à jour
 * @returns Le résultat de la mise à jour
 */
export async function updateTontineStatus(input: {
  id: string;
  status: TontineStatus;
  reason?: string;
}) {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour modifier le statut d'une tontine",
      };
    }

    // Vérification que l'utilisateur est bien administrateur de cette tontine
    const userMembership = await prisma.userTontine.findFirst({
      where: {
        userId: session.user.id,
        tontineId: input.id,
        role: "ADMIN",
      },
    });

    if (!userMembership) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à modifier le statut de cette tontine",
      };
    }

    // Récupérer la tontine actuelle
    const currentTontine = await prisma.tontine.findUnique({
      where: { id: input.id },
    });

    if (!currentTontine) {
      return {
        success: false,
        error: "Tontine introuvable",
      };
    }

    // Vérifier si la tontine est déjà terminée
    if (currentTontine.status === TontineStatus.COMPLETED) {
      return {
        success: false,
        error: "Impossible de modifier le statut d'une tontine terminée",
      };
    }

    // Préparer les détails de l'action
    let details = "";
    if (input.status === TontineStatus.SUSPENDED) {
      details = `La tontine a été suspendue. Raison : ${input.reason || "Non spécifiée"}`;
    } else if (input.status === TontineStatus.ACTIVE) {
      details = "La tontine a été réactivée.";
    }

    // Mettre à jour le statut de la tontine
    const updatedTontine = await prisma.tontine.update({
      where: { id: input.id },
      data: {
        status: input.status,
        historyLogs: {
          create: {
            action: "RULES_UPDATED",
            userId: session.user.id,
            details,
          },
        },
      },
    });

    // Revalider les chemins pour que les changements soient visibles immédiatement
    revalidatePath(`/dashboard/tontines/${input.id}`);
    revalidatePath(`/dashboard/tontines/${input.id}/settings`);
    revalidatePath("/dashboard/tontines");

    return {
      success: true,
      data: updatedTontine,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du statut.",
    };
  }
}
