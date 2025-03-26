"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TontineDetailsProps } from "./tontine-details-types";

type PlanningTabProps = {
  tontine: TontineDetailsProps["tontine"];
};

export function PlanningTab({ tontine }: PlanningTabProps) {
  const getUserFromId = (userId: string) => {
    const member = tontine.members.find((member) => member.id === userId);
    return member ? member.user : null;
  };

  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Planning des bénéficiaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tontine.beneficiaryOrder.map((memberId: string, index: number) => {
              const user = getUserFromId(memberId);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    {user ? (
                      <p className="font-medium">{user.name}</p>
                    ) : (
                      <p className="font-medium text-muted-foreground">
                        Utilisateur inconnu
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Bénéficiaire n°{index + 1}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
