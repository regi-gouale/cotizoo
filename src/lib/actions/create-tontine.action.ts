"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateTontineSchema } from "@/lib/schemas/create-tontine.schema";
import { Tontine } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";

export type CreateTontineInput = z.infer<typeof CreateTontineSchema>;

type CreateTontineResult = {
  success: boolean;
  error?: string;
  tontineId?: string;
  data?: Tontine; // Remplacez par le type de votre modèle Tontine
};

// Action sécurisée qui nécessite l'authentification
export async function createTontine(
  data: z.infer<typeof CreateTontineSchema>,
): Promise<CreateTontineResult> {
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
    const contributionDecimal = parseFloat(data.contribution);
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
        contribution: contributionDecimal,
        startDate: startDate,
        endDate: endDate,
        maxMembers: maxMembersInt,
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
