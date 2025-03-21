import { AddCommentForm } from "@/components/tickets/add-comment-form";
import { TicketComments } from "@/components/tickets/ticket-comments";
import { TicketDetails } from "@/components/tickets/ticket-details";
import { TicketStatusControl } from "@/components/tickets/ticket-status-control";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessTicket } from "@/lib/ticket-utils";
import { TicketStatus, UserRole } from "@prisma/client";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

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

  if (!session) {
    return redirect("/login");
  }

  // Vérifier si l'utilisateur peut accéder au ticket
  const hasAccess = await canAccessTicket(session.user.id, params.ticketId);
  if (!hasAccess) {
    return notFound();
  }

  // Charger les données du ticket avec les commentaires
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: params.ticketId,
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

  // const where = isAdmin
  //   ? { id: params.ticketId }
  //   : { id: params.ticketId, userId: session.user.id };

  // const ticket = await prisma.ticket.findUnique({
  //   where,
  //   include: {
  //     contactMessages: true,
  //     ticketResponses: {
  //       orderBy: {
  //         createdAt: "asc",
  //       },
  //     },
  //   },
  // });

  // if (!ticket) {
  //   notFound();
  // }

  // const statusConfig = statusLabels[ticket.status];
  // const initialContactMessage = ticket.contactMessages[0];

  // // Préparer les échanges du ticket dans l'ordre chronologique
  // const allMessages = [
  //   ...ticket.contactMessages.map((msg) => ({
  //     id: msg.id,
  //     message: msg.message,
  //     createdAt: msg.createdAt,
  //     isFromStaff: false,
  //     senderName: msg.name,
  //     senderEmail: msg.email,
  //   })),
  //   ...ticket.ticketResponses.map((resp) => ({
  //     id: resp.id,
  //     message: resp.message,
  //     createdAt: resp.createdAt,
  //     isFromStaff: resp.isFromStaff,
  //     senderName: resp.isFromStaff ? "Support Cotizoo" : "Vous",
  //     senderEmail: resp.isFromStaff
  //       ? "support@cotizoo.com"
  //       : initialContactMessage?.email || "",
  //   })),
  // ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // const isTicketOpen =
  //   ticket.status !== "CLOSED" && ticket.status !== "RESOLVED";

  // return (
  //   <div className="container px-4 py-8 mx-auto max-w-4xl">
  //     <div className="flex flex-col space-y-4">
  //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
  //         <div>
  //           <h1 className="text-2xl font-bold tracking-tight mb-1">
  //             {ticket.subject}
  //           </h1>
  //           <div className="text-sm text-muted-foreground">
  //             Ticket #{ticket.id.substring(0, 8)} • Créé le{" "}
  //             {format(new Date(ticket.createdAt), "dd MMMM yyyy 'à' HH:mm", {
  //               locale: fr,
  //             })}
  //           </div>
  //         </div>
  //         <Badge variant={statusConfig.variant} className="mt-2 md:mt-0">
  //           {statusConfig.label}
  //         </Badge>
  //       </div>

  //       <Separator className="my-4" />

  //       <div className="space-y-6">
  //         {allMessages.map((message) => (
  //           <div key={message.id} className="flex gap-4">
  //             <Avatar className="h-10 w-10">
  //               {message.isFromStaff ? (
  //                 <AvatarFallback className="bg-primary/20 text-primary">
  //                   SC
  //                 </AvatarFallback>
  //               ) : (
  //                 <>
  //                   <AvatarImage
  //                     src={`https://avatar.vercel.sh/${message.senderEmail}`}
  //                     alt={message.senderName}
  //                   />
  //                   <AvatarFallback>
  //                     {message.senderName.charAt(0).toUpperCase()}
  //                   </AvatarFallback>
  //                 </>
  //               )}
  //             </Avatar>
  //             <div className="flex-1">
  //               <div className="flex items-start justify-between">
  //                 <div>
  //                   <p className="font-medium">{message.senderName}</p>
  //                   <p className="text-xs text-muted-foreground">
  //                     {format(
  //                       new Date(message.createdAt),
  //                       "dd MMM yyyy 'à' HH:mm",
  //                       { locale: fr },
  //                     )}
  //                   </p>
  //                 </div>
  //                 {message.isFromStaff && (
  //                   <Badge variant="outline" className="text-xs">
  //                     Support
  //                   </Badge>
  //                 )}
  //               </div>
  //               <div className="mt-2 text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
  //                 {message.message}
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {isTicketOpen && (
  //         <Card className="mt-6">
  //           <CardHeader>
  //             <CardTitle className="text-lg flex items-center gap-2">
  //               <MessageCircle className="h-5 w-5" />
  //               Répondre au ticket
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <TicketResponseForm ticketId={ticket.id} />
  //           </CardContent>
  //         </Card>
  //       )}

  //       {!isTicketOpen && (
  //         <Card className="mt-6 border-dashed">
  //           <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
  //             <p>
  //               Ce ticket est{" "}
  //               {ticket.status === "RESOLVED" ? "résolu" : "fermé"}. Vous ne
  //               pouvez plus y répondre.
  //             </p>
  //             <p className="mt-2">
  //               Si vous avez besoin d'aide supplémentaire, veuillez créer un
  //               nouveau ticket.
  //             </p>
  //           </CardContent>
  //         </Card>
  //       )}
  //     </div>
  //   </div>
  // );
}
