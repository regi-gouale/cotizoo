"use client";

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
    </div>
  );
}
