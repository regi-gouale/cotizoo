import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

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

  if (!session?.user.id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          Vous devez être connecté pour voir vos tickets
        </p>
      </div>
    );
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
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
    },
  });

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Mes tickets
          </h1>
          <p className="text-muted-foreground">
            Suivez vos demandes d'assistance et vos échanges avec notre équipe
          </p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mb-2">Aucun ticket</h3>
            <p className="text-center text-muted-foreground mb-6">
              Vous n'avez pas encore créé de ticket d'assistance.
              <br />
              Vous pouvez nous contacter via la page de contact.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
            >
              Nous contacter
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const statusConfig = statusLabels[ticket.status];
            const latestMessage = ticket.contactMessages[0] || null;
            const latestResponse = ticket.ticketResponses[0] || null;
            const lastActivity =
              latestResponse?.createdAt ||
              latestMessage?.createdAt ||
              ticket.createdAt;

            return (
              <Card
                key={ticket.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="block"
                >
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="font-medium">
                          {ticket.subject}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Ticket #{ticket.id.substring(0, 8)} • Créé il y a{" "}
                          {formatDistanceToNow(new Date(ticket.createdAt), {
                            addSuffix: false,
                            locale: fr,
                          })}
                        </div>
                      </div>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-sm">
                      <span className="font-medium">Dernière activité :</span>{" "}
                      il y a{" "}
                      {formatDistanceToNow(new Date(lastActivity), {
                        addSuffix: false,
                        locale: fr,
                      })}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
