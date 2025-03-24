"use server";

import { auth } from "@/lib/auth";
import { sendTemplateEmail } from "@/lib/email";
import { getTontineCreatedHtml } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { CreateTontineSchema } from "@/lib/schemas/create-tontine.schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TontineFrequency, TontineStatus, TontineType } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";

export type CreateTontineInput = z.infer<typeof CreateTontineSchema>;

// Fonction utilitaire pour obtenir le libellé d'un type de tontine
function getTontineTypeLabel(type: TontineType): string {
  const types = {
    ROTATIF: "Tontine Rotative",
    INVESTISSEMENT: "Tontine d'Investissement",
    PROJET: "Tontine de Projet",
  };
  return types[type] || type;
}

// Fonction utilitaire pour obtenir le libellé d'une fréquence
function getTontineFrequencyLabel(frequency: TontineFrequency): string {
  const frequencies = {
    WEEKLY: "Hebdomadaire",
    BIWEEKLY: "Bi-mensuelle",
    MONTHLY: "Mensuelle",
    QUARTERLY: "Trimestrielle",
    SEMIANNUAL: "Semestrielle",
    YEARLY: "Annuelle",
  };
  return frequencies[frequency] || frequency;
}

// Action sécurisée qui nécessite l'authentification
export async function createTontine(data: z.infer<typeof CreateTontineSchema>) {
  try {
    // Get the current authenticated user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour créer une tontine",
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
      : 5.0;

    // Convertir les dates si nécessaire
    const startDate =
      data.startDate instanceof Date
        ? data.startDate
        : new Date(data.startDate as string);
    const endDate =
      data.endDate instanceof Date
        ? data.endDate
        : new Date(data.endDate as string);

    // Créer la tontine
    const tontine = await prisma.tontine.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        contributionPerMember: contributionDecimal,
        startDate: startDate,
        endDate: endDate,
        maxMembers: maxMembersInt,
        status: TontineStatus.ACTIVE,
        penaltyFee: penaltyFeeDecimal,
        allocationMethod: data.allocationMethod,
        rules: data.rules,
        // Créer automatiquement un lien avec l'utilisateur créateur en tant qu'admin
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
        // Ajouter un historique de création
        historyLogs: {
          create: {
            action: "CREATION",
            userId: session.user.id,
            details: "Création de la tontine",
          },
        },
      },
    });

    // Envoi de l'email de confirmation au créateur
    const tontineUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tontines/${tontine.id}`;

    await sendTemplateEmail(
      session.user.email,
      `Confirmation de création de votre tontine "${tontine.name}"`,
      getTontineCreatedHtml({
        userName: session.user.name || "Utilisateur",
        tontineName: tontine.name,
        tontineType: getTontineTypeLabel(tontine.type),
        startDate: formatDate(tontine.startDate),
        endDate: formatDate(tontine.endDate),
        frequency: getTontineFrequencyLabel(tontine.frequency),
        contributionAmount: formatCurrency(tontine.contributionPerMember),
        maxMembers: tontine.maxMembers,
        tontineUrl: tontineUrl,
      }),
      {},
    );

    return {
      success: true,
      tontineId: tontine.id,
      data: tontine,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la tontine:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la tontine.",
    };
  }
}
