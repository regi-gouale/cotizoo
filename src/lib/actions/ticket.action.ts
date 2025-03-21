"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import {
  CommentFormSchema,
  TicketFormSchema,
  UpdateTicketStatusSchema,
} from "@/types/ticket";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createTicketAction = authAction
  .schema(TicketFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const ticket = await prisma.ticket.create({
      data: {
        subject: input.title,
        description: input.description,
        userId: ctx.user.id,
      },
    });

    revalidatePath("/tickets");
    return ticket;
  });

export const addCommentAction = authAction
  .schema(
    CommentFormSchema.extend({
      ticketId: z.string(),
    }),
  )
  .action(async ({ parsedInput: input, ctx }) => {
    // Vérifier si l'utilisateur a accès au ticket
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: input.ticketId,
      },
    });

    if (!ticket) {
      throw new Error("Ticket introuvable");
    }

    // Vérifier si l'utilisateur est admin ou propriétaire du ticket
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        role: true,
      },
    });

    const isAllowed =
      user?.role === UserRole.ADMIN || ticket.userId === ctx.user.id;

    if (!isAllowed) {
      throw new Error("Vous n'avez pas les droits pour commenter ce ticket");
    }

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        ticketId: input.ticketId,
        userId: ctx.user.id,
      },
    });

    revalidatePath(`/tickets/${input.ticketId}`);
    return comment;
  });

export const updateTicketStatusAction = authAction
  .schema(
    UpdateTicketStatusSchema.extend({
      ticketId: z.string(),
    }),
  )
  .action(async ({ parsedInput: input, ctx }) => {
    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        role: true,
      },
    });

    if (user?.role !== UserRole.ADMIN) {
      throw new Error(
        "Seuls les administrateurs peuvent modifier le statut d'un ticket",
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: input.ticketId,
      },
      data: {
        status: input.status,
        closedAt: input.status === "CLOSED" ? new Date() : null,
      },
    });

    revalidatePath(`/tickets/${input.ticketId}`);
    return updatedTicket;
  });
