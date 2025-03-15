"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LeadSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
});

export type LeadActionResult = {
  success: boolean;
  isExisting: boolean;
  message: string;
};

export async function saveLead(
  data: z.infer<typeof LeadSchema>,
): Promise<LeadActionResult> {
  try {
    // Vérifier si le lead existe déjà
    const existingLead = await prisma.lead.findUnique({
      where: {
        email: data.email,
      },
    });

    // Si le lead existe déjà, retourner un message d'information
    if (existingLead) {
      return {
        success: true,
        isExisting: true,
        message: "Vous êtes déjà inscrit(e) à notre liste !",
      };
    }

    // Créer un nouveau lead
    await prisma.lead.create({
      data: {
        firstName: data.firstName,
        email: data.email,
      },
    });

    return {
      success: true,
      isExisting: false,
      message: "Votre inscription a bien été prise en compte !",
    };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du lead:", error);
    return {
      success: false,
      isExisting: false,
      message: "Une erreur est survenue lors de l'inscription",
    };
  }
}
