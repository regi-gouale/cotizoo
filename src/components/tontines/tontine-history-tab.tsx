"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { TontineDetailsProps } from "./tontine-details-types";
import { getHistoryActionLabel } from "./tontine-details-utils";

type HistoryTabProps = {
  tontine: TontineDetailsProps["tontine"];
};

export function HistoryTab({ tontine }: HistoryTabProps) {
  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Historique de la tontine</CardTitle>
        </CardHeader>
        <CardContent>
          {tontine.historyLogs.length > 0 ? (
            <div className="space-y-4">
              {tontine.historyLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 border rounded-md"
                >
                  <div className="rounded-full p-2 bg-muted flex-shrink-0">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {getHistoryActionLabel(log.action)}
                    </p>
                    {log.details && <p className="text-sm">{log.details}</p>}
                    <p className="text-sm text-muted-foreground">
                      {log.user ? `Par ${log.user.name} - ` : ""}
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun historique disponible
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Voir tout l'historique
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
