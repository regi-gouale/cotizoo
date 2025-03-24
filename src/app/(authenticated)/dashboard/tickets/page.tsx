import { NewTicketButton } from "@/components/tickets/new-ticket-button";
import { TicketFilters } from "@/components/tickets/ticket-filters";
import { TicketList } from "@/components/tickets/ticket-list";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketStatus, UserRole } from "@prisma/client";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mes tickets | Cotizoo",
  description: "Consultez et suivez vos demandes d'assistance",
};

const statusLabels: Record<
  TicketStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  OPEN: { label: "Ouvert", variant: "default" },
  IN_PROGRESS: { label: "En cours", variant: "secondary" },
  WAITING_FOR_CUSTOMER: { label: "En attente de réponse", variant: "outline" },
  RESOLVED: { label: "Résolu", variant: "default" },
  CLOSED: { label: "Fermé", variant: "outline" },
};

export default async function TicketsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          Vous devez être connecté pour voir vos tickets
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return notFound();
  }

  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  // Filtrer les tickets selon le rôle de l'utilisateur
  // Si l'utilisateur est admin, il peut voir tous les tickets
  // Sinon, il ne peut voir que ses propres tickets
  const where = isAdmin ? {} : { userId: session.user.id };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: {
      updatedAt: "desc", // Uncommented to order by updatedAt
      // status: "asc",
    },
    include: {
      contactMessages: {
        take: 1,
      },
      ticketResponses: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
      user: true,
      _count: {
        select: {
          ticketResponses: true,
          contactMessages: true,
        },
      },
    },
  });

  return (
    <div className="container py-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="flex flex-wrap items-center gap-2">
          <NewTicketButton />
        </div>
      </div>

      <TicketFilters isAdmin={isAdmin} />

      <TicketList tickets={tickets as any} />
    </div>
  );
}
