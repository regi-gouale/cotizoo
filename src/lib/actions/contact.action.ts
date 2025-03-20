"use server";

import { emailConfig, sendTemplateEmail } from "@/lib/email";
import { ContactFormSchema } from "@/lib/schemas/contact.schema";
import { z } from "zod";

export type ContactActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Action serveur pour envoyer un message de contact
 */
export async function sendContactMessage(
  data: z.infer<typeof ContactFormSchema>,
): Promise<ContactActionResult> {
  try {
    // Validation des données
    const validatedData = ContactFormSchema.parse(data);

    // Créer le template HTML pour le message
    const messageHtml = `
      <h2>Nouveau message de contact</h2>
      <p><strong>De :</strong> ${validatedData.name} (${validatedData.email})</p>
      <p><strong>Sujet :</strong> ${validatedData.subject}</p>
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #6366F1; background-color: #f9f9f9;">
        <h3>Message :</h3>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      </div>
      <p>Ce message a été envoyé depuis le formulaire de contact de {{siteName}}.</p>
    `;

    // Envoyer l'email à l'adresse de support configurée
    const result = await sendTemplateEmail(
      emailConfig.replyToEmail,
      `[Contact] ${validatedData.subject}`,
      messageHtml,
      {},
    );

    if (!result.success) {
      console.error(
        "Erreur lors de l'envoi du message de contact:",
        result.error,
      );
      return {
        success: false,
        error:
          "Impossible d'envoyer votre message. Veuillez réessayer plus tard.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Exception lors de l'envoi du message de contact:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
