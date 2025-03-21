"use server";

import { auth } from "@/lib/auth";
import { sendTemplateEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const TicketReplySchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().min(5),
});

type TicketActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Action serveur pour qu'un utilisateur réponde à un ticket
 */
export async function replyToTicket(
  data: z.infer<typeof TicketReplySchema>,
): Promise<TicketActionResult> {
  try {
    // Validation des données
    const validatedData = TicketReplySchema.parse(data);

    // Récupération de la session utilisateur
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour répondre à ce ticket",
      };
    }

    // Vérifier que le ticket existe et appartient à l'utilisateur
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: validatedData.ticketId,
        userId: session.user.id,
      },
      include: {
        contactMessages: {
          take: 1,
        },
      },
    });

    if (!ticket) {
      return {
        success: false,
        error: "Ticket introuvable ou vous n'avez pas accès à ce ticket",
      };
    }

    // Vérifier que le ticket n'est pas fermé ou résolu
    if (ticket.status === "CLOSED" || ticket.status === "RESOLVED") {
      return {
        success: false,
        error:
          "Ce ticket est fermé ou résolu et ne peut plus recevoir de réponses",
      };
    }

    // Créer une nouvelle réponse de ticket
    const response = await prisma.ticketResponse.create({
      data: {
        message: validatedData.message,
        isFromStaff: false,
        ticketId: ticket.id,
      },
    });

    // Mettre à jour le statut du ticket
    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "WAITING_FOR_CUSTOMER",
        updatedAt: new Date(),
      },
    });

    // Préparer et envoyer un email pour notifier l'équipe de support
    const initialContactMessage = ticket.contactMessages[0];
    const userEmail = initialContactMessage?.email || "client";
    const userName = initialContactMessage?.name || "Client";

    const emailHtml = `
      <h2>Nouvelle réponse au ticket #${ticket.id.substring(0, 8)}</h2>
      <p><strong>De :</strong> ${userName} (${userEmail})</p>
      <p><strong>Sujet du ticket :</strong> ${ticket.subject}</p>
      <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #6366F1; background-color: #f9f9f9;">
        <h3>Message :</h3>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      </div>
      <p>Pour répondre à ce ticket, connectez-vous au <a href="{{siteUrl}}/admin/tickets/${ticket.id}">panneau d'administration</a>.</p>
    `;

    await sendTemplateEmail(
      "support@cotizoo.com",
      `[Ticket #${ticket.id.substring(0, 8)}] Nouvelle réponse: ${ticket.subject}`,
      emailHtml,
      {},
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Exception lors de la réponse au ticket:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}

/**
 * Action serveur pour mettre à jour le statut d'un ticket (fermer ou résoudre)
 */
export async function updateTicketStatus(
  ticketId: string,
  newStatus: "OPEN" | "RESOLVED" | "CLOSED",
): Promise<TicketActionResult> {
  try {
    // Récupération de la session utilisateur
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour mettre à jour ce ticket",
      };
    }

    // Vérifier que le ticket existe et appartient à l'utilisateur
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
        userId: session.user.id,
      },
    });

    if (!ticket) {
      return {
        success: false,
        error: "Ticket introuvable ou vous n'avez pas accès à ce ticket",
      };
    }

    // Mise à jour du statut du ticket
    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: newStatus,
        ...(newStatus === "CLOSED" || newStatus === "RESOLVED"
          ? { closedAt: new Date() }
          : {}),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Exception lors de la mise à jour du statut du ticket:",
      error,
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
}
