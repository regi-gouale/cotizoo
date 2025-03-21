"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

export function TontinesList(props: TontinesListProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tontines.map((tontine) => {
        const nextDueDate = calculateNextDueDate(tontine);

        return (
          <Link href={`/dashboard/tontines/${tontine.id}`} key={tontine.id}>
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{tontine.name}</h3>
                  {getStatusBadge(tontine.status, tontine.endDate)}
                </div>
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
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-6">
                          Admin
                        </Badge>
                      </div>
                    )}

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {nextDueDate ? (
                          <span className="text-sm">
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
