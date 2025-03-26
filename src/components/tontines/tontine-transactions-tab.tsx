"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TontineDetailsProps } from "./tontine-details-types";

type TransactionsTabProps = {
  tontine: TontineDetailsProps["tontine"];
};

export function TransactionsTab({ tontine }: TransactionsTabProps) {
  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {tontine.transactions.length > 0 ? (
            <div className="space-y-4">
              {tontine.transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.type === "COTISATION"
                        ? "Cotisation"
                        : "Redistribution"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        transaction.status === "COMPLETED"
                          ? "default"
                          : transaction.status === "PENDING"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {transaction.status === "COMPLETED"
                        ? "Complété"
                        : transaction.status === "PENDING"
                          ? "En attente"
                          : "Échoué"}
                    </Badge>
                    <p
                      className={`font-medium ${
                        transaction.type === "COTISATION"
                          ? "text-rose-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "COTISATION" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucune transaction enregistrée
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Voir toutes les transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
