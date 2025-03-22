"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tontine, TontineRole, TontineStatus } from "@prisma/client";
import { CalendarIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

type TontineWithRole = Tontine & {
  role: TontineRole;
};

type TontinesListProps = {
  tontines: TontineWithRole[];
};

export function TontineCards(props: TontinesListProps) {
  const { tontines } = props;

  if (tontines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Vous ne participez à aucune tontine pour le moment.
        </p>
      </div>
    );
  }

  // Calculer la prochaine échéance en fonction de la date actuelle et de la fréquence
  const calculateNextDueDate = (tontine: Tontine) => {
    const today = new Date();
    const startDate = new Date(tontine.startDate);

    // Si la tontine est terminée, retourner null
    if (tontine.status === "COMPLETED" || new Date(tontine.endDate) < today) {
      return null;
    }

    // Calculer la prochaine échéance en fonction de la fréquence
    let nextDue = new Date(startDate);

    while (nextDue <= today) {
      switch (tontine.frequency) {
        case "WEEKLY":
          nextDue.setDate(nextDue.getDate() + 7);
          break;
        case "BIWEEKLY":
          nextDue.setDate(nextDue.getDate() + 14);
          break;
        case "MONTHLY":
          nextDue.setMonth(nextDue.getMonth() + 1);
          break;
        case "QUARTERLY":
          nextDue.setMonth(nextDue.getMonth() + 3);
          break;
        case "SEMIANNUAL":
          nextDue.setMonth(nextDue.getMonth() + 6);
          break;
        case "YEARLY":
          nextDue.setFullYear(nextDue.getFullYear() + 1);
          break;
      }
    }

    return nextDue;
  };

  const getStatusBadge = (status: TontineStatus, endDate: Date) => {
    const isExpired = new Date(endDate) < new Date();

    if (status === "COMPLETED" || isExpired) {
      return (
        <Badge variant="outline" className="bg-gray-100">
          Terminée
        </Badge>
      );
    }

    if (status === "SUSPENDED") {
      return <Badge variant="destructive">Suspendue</Badge>;
    }

    return (
      <Badge variant="default" className="bg-green-500">
        En cours
      </Badge>
    );
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {tontines.map((tontine) => {
        const nextDueDate = calculateNextDueDate(tontine);

        return (
          <Link href={`/dashboard/tontines/${tontine.id}`} key={tontine.id}>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
                    {tontine.name}
                  </CardTitle>
                  {getStatusBadge(tontine.status, tontine.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {tontine.description}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(Number(tontine.contributionPerMember))}
                      </span>
                    </div>

                    {tontine.role === "ADMIN" && (
                      <div className="flex items-right justify-end gap-2">
                        <Badge variant="secondary" className="h-6">
                          Admin
                        </Badge>
                      </div>
                    )}

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {nextDueDate ? (
                          <span className="text-sm text-muted-foreground">
                            Prochaine échéance: {formatDate(nextDueDate)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Aucune échéance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
