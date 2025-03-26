"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateTontineSchema } from "@/lib/schemas/update-tontine.schema";
import { HistoryAction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { UpdateBeneficiaryOrderSchema } from "../schemas/update-beneficiary-order.schema";
import { authAction } from "./safe-actions";

export async function updateTontine(
  tontineId: string,
  data: z.infer<typeof UpdateTontineSchema>,
) {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour modifier une tontine",
      };
    }

    // Vérification que l'utilisateur est bien administrateur de cette tontine
    const userMembership = await prisma.userTontine.findFirst({
      where: {
        userId: session.user.id,
        tontineId: tontineId,
        role: "ADMIN",
      },
    });

    if (!userMembership) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à modifier cette tontine",
      };
    }

    // Récupérer la tontine actuelle pour comparaison
    const currentTontine = await prisma.tontine.findUnique({
      where: {
        id: tontineId,
      },
    });

    if (!currentTontine) {
      return {
        success: false,
        error: "Tontine introuvable",
      };
    }

    // Vérifier si la tontine est terminée
    if (currentTontine.status === "COMPLETED") {
      return {
        success: false,
        error: "Impossible de modifier une tontine terminée",
      };
    }

    // Convertir les valeurs string en types appropriés
    const contributionDecimal = parseFloat(data.contributionPerMember);
    const maxMembersInt =
      typeof data.maxMembers === "string"
        ? parseInt(data.maxMembers, 10)
        : data.maxMembers;
    const penaltyFeeDecimal = data.penaltyFee
      ? parseFloat(data.penaltyFee)
      : currentTontine.penaltyFee;

    // Convertir les dates si nécessaire
    const startDate =
      data.startDate instanceof Date
        ? data.startDate
        : new Date(data.startDate as string);
    const endDate =
      data.endDate instanceof Date
        ? data.endDate
        : new Date(data.endDate as string);

    // Valider que la date de début est avant la date de fin
    if (startDate >= endDate) {
      return {
        success: false,
        error: "La date de début doit être antérieure à la date de fin",
      };
    }

    // Vérifier que le nombre de membres n'est pas inférieur au nombre actuel
    const currentMembersCount = await prisma.userTontine.count({
      where: {
        tontineId: tontineId,
      },
    });

    if (maxMembersInt < currentMembersCount) {
      return {
        success: false,
        error: `Le nombre maximum de membres ne peut pas être inférieur au nombre actuel (${currentMembersCount})`,
      };
    }

    // Mettre à jour la tontine
    const updatedTontine = await prisma.tontine.update({
      where: {
        id: tontineId,
      },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        contributionPerMember: contributionDecimal,
        startDate: startDate,
        endDate: endDate,
        maxMembers: maxMembersInt,
        penaltyFee: penaltyFeeDecimal,
        allocationMethod: data.allocationMethod,
        rules: data.rules,
        // Ajouter un historique de modification
        historyLogs: {
          create: {
            action: "RULES_UPDATED",
            userId: session.user.id,
            details: `Paramètres de la tontine mis à jour par ${session.user.name}`,
          },
        },
      },
    });

    // Revalider les chemins pour que les changements soient visibles immédiatement
    revalidatePath(`/dashboard/tontines/${tontineId}`);
    revalidatePath(`/dashboard/tontines/${tontineId}/settings`);
    revalidatePath("/dashboard/tontines");

    return {
      success: true,
      data: updatedTontine,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tontine:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de la tontine.",
    };
  }
}

export const updateBeneficiaryOrder = authAction
  .schema(UpdateBeneficiaryOrderSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const tontine = await prisma.tontine.update({
      where: { id: input.tontineId },
      data: { beneficiariesOrder: input.beneficiaryOrder },
    });
    // Ajouter un historique de modification
    await prisma.tontineHistory.create({
      data: {
        tontineId: input.tontineId,
        action: HistoryAction.BENEFICIARY_ORDER,
        details: `Ordre des bénéficiaires mis à jour.`,
        userId: ctx.user.id,
      },
    });
    revalidatePath(`/dashboard/tontines/${input.tontineId}/settings`);
    return tontine;
  });
