"use server";

import { prisma } from "@/lib/prisma";
import { TontineStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/dashboard/tontines");
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
