"use server";

import { emailTemplates } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

// Schéma de validation pour les données d'entrée
const EmailTestSchema = z.object({
  type: z.enum([
    "registration",
    "tontineInvitation",
    "passwordReset",
    "paymentNotification",
    "missedPayment",
  ]),
  to: z.string().email(),
  variables: z.record(z.string()),
});

export type EmailTestInput = z.infer<typeof EmailTestSchema>;

export async function sendTestEmail(input: EmailTestInput) {
  try {
    // Valider les données d'entrée
    const validatedData = EmailTestSchema.parse(input);

    // Préparation des données spécifiques au template
    let html = "";
    let subject = "";

    switch (validatedData.type) {
      case "registration":
        subject = "Confirmation d'inscription";
        html = emailTemplates.registration({
          name: validatedData.variables.name || "Utilisateur",
          confirmUrl:
            validatedData.variables.confirmUrl || "https://cotizoo.com/confirm",
        });
        break;

      case "tontineInvitation":
        subject = "Invitation à rejoindre une tontine";
        html = emailTemplates.tontineInvitation({
          inviterName: validatedData.variables.inviterName || "Un membre",
          tontineName: validatedData.variables.tontineName || "Ma tontine",
          invitationUrl:
            validatedData.variables.invitationUrl ||
            "https://cotizoo.com/invitation",
        });
        break;

      case "passwordReset":
        subject = "Réinitialisation de votre mot de passe";
        html = emailTemplates.passwordReset({
          resetUrl:
            validatedData.variables.resetUrl ||
            "https://cotizoo.com/reset-password",
        });
        break;

      case "paymentNotification":
        subject = "Confirmation de paiement";
        html = emailTemplates.paymentNotification({
          tontineName: validatedData.variables.tontineName || "Ma tontine",
          amount: validatedData.variables.amount || "500€",
          date: validatedData.variables.date || new Date().toLocaleDateString(),
          recipient: validatedData.variables.recipient,
        });
        break;

      case "missedPayment":
        subject = "Rappel de paiement en attente";
        html = emailTemplates.missedPayment({
          tontineName: validatedData.variables.tontineName || "Ma tontine",
          amount: validatedData.variables.amount || "500€",
          dueDate:
            validatedData.variables.dueDate || new Date().toLocaleDateString(),
        });
        break;
    }

    // Envoi de l'email
    const result = await sendEmail({
      to: validatedData.to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de test:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
