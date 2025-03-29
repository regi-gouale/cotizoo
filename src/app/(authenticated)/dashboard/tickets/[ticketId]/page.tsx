import { AddCommentForm } from "@/components/tickets/add-comment-form";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { TicketDetails } from "@/components/tickets/ticket-details";
import { TicketStatusControl } from "@/components/tickets/ticket-status-control";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessTicket } from "@/lib/ticket-utils";
import { PageParams } from "@/types/next";
import { UserRole } from "@prisma/client";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Détail du ticket | Cotizoo",
  description: "Consultez les détails de votre ticket d'assistance",
};

type TicketPageProps = {
  params: {
    ticketId: string;
  };
};

export default async function TicketDetailPage(
  props: PageParams<{ ticketId: string }>,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect("/login");
  }

  // Vérifier si l'utilisateur peut accéder au ticket
  const hasAccess = await canAccessTicket(
    session.user.id,
    (await props.params).ticketId,
  );
  if (!hasAccess) {
    return notFound();
  }

  // Charger les données du ticket avec les commentaires
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: (await props.params).ticketId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    return notFound();
  }

  // Vérifier si l'utilisateur est admin
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });
  if (!user) {
    return notFound();
  }

  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  const isOwner = ticket.userId === session.user.id;

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>

          {isAdmin && (
            <TicketStatusControl
              ticketId={ticket.id}
              currentStatus={ticket.status}
            />
          )}
        </div>

        <div className="space-y-8">
          {ticket.user && (
            <TicketDetails
              ticket={{
                ...ticket,
                user: {
                  id: ticket.user.id,
                  name: ticket.user.name,
                  email: ticket.user.email,
                },
              }}
            />
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Commentaires</h2>
            <TicketComments comments={ticket.comments} />

            <div className="mt-6">
              <AddCommentForm ticketId={ticket.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
