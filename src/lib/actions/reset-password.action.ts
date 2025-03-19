"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type ResetResult = {
  success: boolean;
  error?: string;
};

export async function resetPassword(
  data: z.infer<typeof ResetPasswordSchema>
): Promise<ResetResult> {
  try {
    // Valider les données d'entrée
    const { token, password } = ResetPasswordSchema.parse(data);

    // Vérifier si le token est valide et n'a pas expiré
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return {
        success: false,
        error: "Ce lien de réinitialisation est invalide ou a expiré.",
      };
    }

    // Extraire l'ID utilisateur du champ identifier (au format "reset-password:userId")
    const userId = verification.identifier.split(":")[1];

    if (!userId) {
      return { success: false, error: "Token de réinitialisation invalide." };
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    // Trouver le compte de type email/password
    const emailAccount = user.accounts.find(
      (account) => account.providerId === "email"
    );

    if (!emailAccount) {
      return {
        success: false,
        error: "Ce compte ne peut pas réinitialiser son mot de passe.",
      };
    }

    // Mettre à jour le mot de passe en utilisant better-auth
    await auth.api.updateAccount({
      accountId: emailAccount.id,
      hashedPassword: await auth.api.hashPassword(password),
    });

    // Supprimer le token de réinitialisation
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la réinitialisation.",
    };
  }
}