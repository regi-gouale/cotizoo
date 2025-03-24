"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { sendTemplateEmail } from "@/lib/email";
import { getTontineInvitationHtml } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, TontineRole } from "@prisma/client";
import { z } from "zod";

const InviteMemberSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email(),
  tontineId: z.string(),
});

export const inviteMember = authAction
  .schema(InviteMemberSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const token = crypto.randomUUID();
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invitation?token=${token}&tontineId=${input.tontineId}`;

    // Récupérer les informations sur la tontine
    const tontine = await prisma.tontine.findUnique({
      where: {
        id: input.tontineId,
      },
    });

    if (!tontine) {
      throw new Error("Tontine non trouvée");
    }

    const invitation = await prisma.invitation.create({
      data: {
        firstName: input.firstName,
        email: input.email,
        token,
        tontineId: input.tontineId,
        createdBy: ctx.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    const emailHtml = getTontineInvitationHtml({
      inviterName: ctx.user.name,
      guestName: input.firstName,
      tontineName: tontine.name,
      invitationUrl,
    });

    await sendTemplateEmail(
      input.email,
      `Invitation à rejoindre la tontine "${tontine.name}"`,
      emailHtml,
      {},
    );

    return invitation;
  });

export const acceptInvitationAction = authAction
  .schema(
    z.object({
      token: z.string(),
      tontineId: z.string(),
    }),
  )
  .action(async ({ parsedInput: input, ctx }) => {
    const invitation = await prisma.invitation.findUnique({
      where: {
        token: input.token,
      },
    });
    console.log("Invitation trouvée:", invitation);
    if (!invitation) {
      throw new Error("Invitation non trouvée");
    }

    if (invitation.expiresAt < new Date()) {
      throw new Error("L'invitation a expiré");
    }

    const tontine = await prisma.tontine.findUnique({
      where: {
        id: input.tontineId || invitation.tontineId,
      },
    });

    if (!tontine) {
      throw new Error("Tontine non trouvée");
    }

    // Vérifier si l'utilisateur est déjà membre de la tontine
    const existingMembership = await prisma.userTontine.findFirst({
      where: {
        userId: ctx.user.id,
        tontineId: tontine.id,
      },
    });

    if (!existingMembership) {
      // Création de la relation entre l'utilisateur et la tontine
      const member = await prisma.userTontine.create({
        data: {
          userId: ctx.user.id,
          tontineId: tontine.id,
          role: invitation.role || TontineRole.MEMBER,
        },
      });

      console.log("New member added:", member);
    }

    // Mise à jour du statut de l'invitation
    const invitationUpdate = await prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });
    console.log("Invitation updated:", invitationUpdate);

    return {
      success: true,
      tontineId: tontine.id,
    };
  });
