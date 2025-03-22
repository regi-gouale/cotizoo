"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { sendTemplateEmail } from "@/lib/email";
import { getTontineInvitationHtml } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
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
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invitation?token=${token}`;

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
      tontineName: "Nom de la Tontine", // Remplacer par le nom réel de la tontine
      invitationUrl,
    });

    await sendTemplateEmail(
      input.email,
      "Invitation à rejoindre une tontine",
      emailHtml,
      {},
    );

    return invitation;
  });
