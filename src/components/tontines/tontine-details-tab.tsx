"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  TontineDetailsProps,
  allocationMethods,
  tontineFrequencies,
  tontineTypes,
} from "./tontine-details-types";

type TontineDetailsTabProps = {
  tontine: TontineDetailsProps["tontine"];
  statistics: TontineDetailsProps["statistics"];
};

export function TontineDetailsTab({
  tontine,
  statistics,
}: TontineDetailsTabProps) {
  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Type de tontine</h3>
                <p>{tontineTypes[tontine.type]}</p>
              </div>
              <div>
                <h3 className="font-medium">Fréquence</h3>
                <p>{tontineFrequencies[tontine.frequency]}</p>
              </div>
              <div>
                <h3 className="font-medium">Méthode d'allocation</h3>
                <p>{allocationMethods[tontine.allocationMethod]}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Date de début</h3>
                <p>{formatDate(tontine.startDate)}</p>
              </div>
              <div>
                <h3 className="font-medium">Date de fin</h3>
                <p>{formatDate(tontine.endDate)}</p>
              </div>
              <div>
                <h3 className="font-medium">Pénalité de retard</h3>
                <p>{tontine.penaltyFee}%</p>
              </div>
            </div>
          </div>
          {tontine.rules && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Règles additionnelles</h3>
              <p className="text-sm whitespace-pre-wrap">{tontine.rules}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Résumé financier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Total des cotisations</h3>
                <p className="text-xl">
                  {formatCurrency(statistics.totalContributed)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Total redistribué</h3>
                <p className="text-xl">
                  {formatCurrency(statistics.totalRedistributed)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Cotisation individuelle</h3>
                <p className="text-xl">
                  {formatCurrency(tontine.contributionPerMember)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Reste à collecter</h3>
                <p className="text-xl">
                  {formatCurrency(
                    tontine.contributionPerMember * tontine.maxMembers -
                      statistics.totalContributed,
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle size={14} />
            <span>Les montants affichés sont mis à jour quotidiennement</span>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prélèvements automatiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Prochaine date de prélèvement</h3>
                  <p className="text-lg">
                    {calculateNextPaymentDate(
                      tontine.frequency,
                      tontine.startDate,
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Cotisations programmées</h3>
                  <p className="text-lg">
                    {
                      tontine.transactions.filter(
                        (t: any) =>
                          t.type === "COTISATION" && t.status === "PENDING",
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Cotisations réussies</h3>
                  <p className="text-lg text-green-600">
                    {
                      tontine.transactions.filter(
                        (t: any) =>
                          t.type === "COTISATION" && t.status === "COMPLETED",
                      ).length
                    }
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Cotisations en échec</h3>
                  <p className="text-lg text-rose-600">
                    {
                      tontine.transactions.filter(
                        (t: any) =>
                          t.type === "COTISATION" && t.status === "FAILED",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-2">
                États de paiement des membres
              </h3>
              <div className="space-y-3 mt-3">
                {tontine.members &&
                  tontine.members.map((userTontine: any) => {
                    // Calcul du statut de paiement pour chaque membre
                    const userTransactions = tontine.transactions.filter(
                      (t: any) =>
                        t.userId === userTontine.userId &&
                        t.type === "COTISATION",
                    );

                    const completedPayments = userTransactions.filter(
                      (t: any) => t.status === "COMPLETED",
                    ).length;

                    const pendingPayments = userTransactions.filter(
                      (t: any) => t.status === "PENDING",
                    ).length;

                    const failedPayments = userTransactions.filter(
                      (t: any) => t.status === "FAILED",
                    ).length;

                    const totalPaid = userTransactions
                      .filter((t: any) => t.status === "COMPLETED")
                      .reduce((sum: number, t: any) => sum + t.amount, 0);

                    return (
                      <div
                        key={userTontine.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {userTontine.user.name || userTontine.user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {completedPayments} cotisations effectuées
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {pendingPayments > 0 && (
                            <Badge variant="outline">
                              {pendingPayments} en attente
                            </Badge>
                          )}

                          {failedPayments > 0 && (
                            <Badge variant="destructive">
                              {failedPayments} en échec
                            </Badge>
                          )}

                          <p className="font-medium text-green-600">
                            {formatCurrency(totalPaid)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Calcule et formate la prochaine date de prélèvement
 */
function calculateNextPaymentDate(frequency: string, startDate: Date) {
  const now = new Date();
  let nextDate = new Date(startDate);

  // Ajuster la date selon la fréquence
  switch (frequency) {
    case "WEEKLY":
      // Trouver le prochain jour de la semaine correspondant à la date de départ
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      break;

    case "BIWEEKLY":
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 14);
      }
      break;

    case "MONTHLY":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;

    case "QUARTERLY":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 3);
      }
      break;

    case "SEMIANNUAL":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 6);
      }
      break;

    case "YEARLY":
      while (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;

    default:
      return "Non définie";
  }

  return formatDate(nextDate);
}
