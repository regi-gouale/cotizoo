import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function canAccessTicket(userId: string, ticketId: string) {
  // Vérifier si l'utilisateur est admin
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (user?.role === UserRole.ADMIN) {
    return true;
  }

  // Sinon, vérifier si l'utilisateur est le créateur du ticket
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    select: {
      userId: true,
    },
  });

  return ticket?.userId === userId;
}
