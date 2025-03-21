"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  _count: {
    comments: number;
  };
};

export function TicketList(props: { tickets: Ticket[] }) {
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status");
  const filteredTickets = activeStatus
    ? props.tickets.filter((ticket) => ticket.status === activeStatus)
    : props.tickets;

  return (
    <div className="space-y-4 gap-4">
      {filteredTickets.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground">
          Aucun ticket trouvé
        </div>
      ) : (
        filteredTickets.map((ticket) => (
          <Link
            href={`/dashboard/tickets/${ticket.id}`}
            key={ticket.id}
            className="my-2"
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer my-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                  <StatusBadge status={ticket.status} />
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  Créé par {ticket.user?.name || ticket.user?.email}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-0 text-xs text-muted-foreground">
                <span>
                  Créé il y a{" "}
                  {formatDistanceToNow(new Date(ticket.createdAt), {
                    locale: fr,
                  })}
                </span>
                <span>{ticket._count.comments} commentaires</span>
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "OPEN"
      ? "default"
      : status === "IN_PROGRESS"
        ? "secondary"
        : "outline";

  const label =
    status === "OPEN"
      ? "Ouvert"
      : status === "IN_PROGRESS"
        ? "En cours"
        : "Fermé";

  return <Badge variant={variant}>{label}</Badge>;
}
