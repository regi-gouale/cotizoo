import { TicketResponseForm } from "@/components/tickets/ticket-response-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Détail du ticket | Cotizoo",
  description: "Consultez les détails de votre ticket d'assistance",
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
  RESOLVED: { label: "Résolu", variant: "default" }, // Changed from "success" to "default"
  CLOSED: { label: "Fermé", variant: "outline" },
};

export default async function TicketDetailPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          Vous devez être connecté pour voir ce ticket
        </p>
      </div>
    );
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: params.ticketId,
      userId: session.user.id,
    },
    include: {
      contactMessages: true,
      ticketResponses: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  const statusConfig = statusLabels[ticket.status];
  const initialContactMessage = ticket.contactMessages[0];

  // Préparer les échanges du ticket dans l'ordre chronologique
  const allMessages = [
    ...ticket.contactMessages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      createdAt: msg.createdAt,
      isFromStaff: false,
      senderName: msg.name,
      senderEmail: msg.email,
    })),
    ...ticket.ticketResponses.map((resp) => ({
      id: resp.id,
      message: resp.message,
      createdAt: resp.createdAt,
      isFromStaff: resp.isFromStaff,
      senderName: resp.isFromStaff ? "Support Cotizoo" : "Vous",
      senderEmail: resp.isFromStaff
        ? "support@cotizoo.com"
        : initialContactMessage?.email || "",
    })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const isTicketOpen =
    ticket.status !== "CLOSED" && ticket.status !== "RESOLVED";

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {ticket.subject}
            </h1>
            <div className="text-sm text-muted-foreground">
              Ticket #{ticket.id.substring(0, 8)} • Créé le{" "}
              {format(new Date(ticket.createdAt), "dd MMMM yyyy 'à' HH:mm", {
                locale: fr,
              })}
            </div>
          </div>
          <Badge variant={statusConfig.variant} className="mt-2 md:mt-0">
            {statusConfig.label}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="space-y-6">
          {allMessages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                {message.isFromStaff ? (
                  <AvatarFallback className="bg-primary/20 text-primary">
                    SC
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${message.senderEmail}`}
                      alt={message.senderName}
                    />
                    <AvatarFallback>
                      {message.senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{message.senderName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(message.createdAt),
                        "dd MMM yyyy 'à' HH:mm",
                        { locale: fr },
                      )}
                    </p>
                  </div>
                  {message.isFromStaff && (
                    <Badge variant="outline" className="text-xs">
                      Support
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isTicketOpen && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Répondre au ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketResponseForm ticketId={ticket.id} />
            </CardContent>
          </Card>
        )}

        {!isTicketOpen && (
          <Card className="mt-6 border-dashed">
            <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
              <p>
                Ce ticket est{" "}
                {ticket.status === "RESOLVED" ? "résolu" : "fermé"}. Vous ne
                pouvez plus y répondre.
              </p>
              <p className="mt-2">
                Si vous avez besoin d'aide supplémentaire, veuillez créer un
                nouveau ticket.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
