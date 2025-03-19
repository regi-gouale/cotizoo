"use server";

import { auth } from "@/lib/auth";
import { sendTemplateEmail } from "@/lib/email";
import { getPasswordResetHtml } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import CryptoJS from "crypto-js";
import { z } from "zod";

const RequestSchema = z.object({
  email: z.string().email("Email invalide"),
});

type RequestResult = {
  success: boolean;
  error?: string;
};

/**
 * Génère un UUID v4 compatible
 * @returns {string} Un UUID v4
 */
function generateUUID(): string {
  // Générer des valeurs aléatoires en utilisant crypto-js
  const randomBytes = CryptoJS.lib.WordArray.random(16);
  const hexString = CryptoJS.enc.Hex.stringify(randomBytes);

  // Formater la chaîne sous forme d'UUID v4
  return [
    hexString.substring(0, 8),
    hexString.substring(8, 12),
    // Set les bits pour indiquer qu'il s'agit d'un UUID v4
    "4" + hexString.substring(13, 16),
    // Set les bits selon la spec UUID v4
    ((parseInt(hexString.substring(16, 17), 16) & 0x3) | 0x8).toString(16) +
      hexString.substring(17, 20),
    hexString.substring(20, 32),
  ].join("-");
}

export async function requestPasswordReset(
  data: z.infer<typeof RequestSchema>,
): Promise<RequestResult> {
  try {
    // Valider les données d'entrée
    const validatedData = RequestSchema.parse(data);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Si l'utilisateur n'existe pas, nous ne voulons pas révéler cette information
    // pour des raisons de sécurité, donc nous prétendons que tout s'est bien passé.
    if (!user) {
      return { success: true };
    }

    // Générer un token sécurisé avec crypto-js
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    const token = CryptoJS.enc.Hex.stringify(randomBytes);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expiration dans 1 heure

    // Stocker le token dans la base de données
    await prisma.verification.create({
      data: {
        id: generateUUID(),
        identifier: `reset-password:${user.id}`,
        value: token,
        expiresAt,
      },
    });

    // Construire l'URL de réinitialisation
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    // Envoyer l'email avec le lien de réinitialisation
    await sendTemplateEmail(
      user.email,
      "Réinitialisation de votre mot de passe",
      getPasswordResetHtml({ resetUrl }),
      {},
    );

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la demande de réinitialisation.",
    };
  }
}
