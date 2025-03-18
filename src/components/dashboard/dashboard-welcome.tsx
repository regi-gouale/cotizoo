"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardWelcome(props: {
  user: { name?: string | null; email?: string | null };
}) {
  const { user } = props;
  const displayName = user.name || user.email || "utilisateur";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Bienvenue sur votre tableau de bord</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Bonjour, <span className="font-medium">{displayName}</span> ! Voici un
          aperçu de vos activités récentes et statistiques.
        </p>
      </CardContent>
    </Card>
  );
}
