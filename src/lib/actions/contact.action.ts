"use server";

import { auth } from "@/lib/auth";
import { emailConfig, sendTemplateEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { ContactFormSchema } from "@/lib/schemas/contact.schema";
import { headers } from "next/headers";
import { z } from "zod";

export type ContactActionResult = {
  success: boolean;
  error?: string;
  ticketId?: string;
};

/**
 * Action serveur pour enregistrer un message de contact et l'envoyer par email
 */
export async function sendContactMessage(
  data: z.infer<typeof ContactFormSchema>,
): Promise<ContactActionResult> {
  try {
    // Validation des données
    const validatedData = ContactFormSchema.parse(data);

    // Récupération des informations du header pour tracking
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      undefined;

    // Récupération de la session utilisateur si connecté
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user.id;

    // Enregistrement du message dans la base de données
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        ipAddress,
        userAgent,
        userId: userId || undefined,
        status: "NEW",
      },
    });

    // Créer automatiquement un ticket pour le message de contact
    const ticket = await prisma.ticket.create({
      data: {
        subject: `[Contact] ${validatedData.subject}`,
        status: "OPEN",
        priority: "NORMAL",
        userId: userId || undefined,
        contactMessages: {
          connect: {
            id: contactMessage.id,
          },
        },
      },
    });

    // Mettre à jour le message de contact avec l'ID du ticket
    await prisma.contactMessage.update({
      where: {
        id: contactMessage.id,
      },
      data: {
        ticketId: ticket.id,
        status: "CONVERTED_TO_TICKET",
      },
    });

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
      <p>Un ticket a été créé automatiquement avec l'ID: <strong>${ticket.id}</strong></p>
    `;

    // Envoyer l'email à l'adresse de support configurée
    const result = await sendTemplateEmail(
      emailConfig.replyToEmail,
      `[Ticket #${ticket.id.substring(0, 8)}] ${validatedData.subject}`,
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
          "Impossible d'envoyer votre message. Votre demande a bien été enregistrée, nous vous contacterons bientôt.",
        ticketId: ticket.id,
      };
    }

    return {
      success: true,
      ticketId: ticket.id,
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
