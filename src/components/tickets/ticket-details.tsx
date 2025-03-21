import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// type TicketDetailsProps = {
//   ticket: {
//     id: string;
//     subject: string;
//     description: string | null;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
//     closedAt: Date | null;
//     user: {
//       name: string | null;
//       email: string | null;
//     };
//   };
// };

type TicketDetailsProps = {
  ticket: {
    id: string;
    subject: string;
    description: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    user: {
      name: string | null;
      email: string | null;
      id: string;
    };
  };
};

export function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={ticket.status} />
            <div className="text-sm text-muted-foreground">
              Créé le{" "}
              {format(new Date(ticket.createdAt), "dd MMMM yyyy à HH:mm", {
                locale: fr,
              })}
              par {ticket.user.name || ticket.user.email}
            </div>
            {ticket.closedAt && (
              <div className="text-sm text-muted-foreground">
                Fermé le{" "}
                {format(new Date(ticket.closedAt), "dd MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </div>
            )}
          </div>

          <div className="whitespace-pre-wrap">{ticket.description}</div>
        </div>
      </CardContent>
    </Card>
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
