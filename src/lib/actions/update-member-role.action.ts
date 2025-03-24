"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateMemberRoleSchema = z.object({
  tontineId: z.string(),
  memberId: z.string(),
  newRole: z.enum(["ADMIN", "MEMBER"]),
});

export const updateMemberRole = authAction
  .schema(UpdateMemberRoleSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const { tontineId, memberId, newRole } = input;

    // Vérifier que l'utilisateur est administrateur de la tontine
    const userMembership = await prisma.userTontine.findFirst({
      where: {
        userId: ctx.user.id,
        tontineId,
        role: "ADMIN",
      },
    });

    if (!userMembership) {
      throw new Error(
        "Vous n'êtes pas autorisé à modifier le rôle des membres.",
      );
    }

    // Mettre à jour le rôle du membre
    await prisma.userTontine.update({
      where: {
        id: memberId,
      },
      data: {
        role: newRole,
      },
    });

    return { success: true };
  });
