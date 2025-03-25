// "use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { hasActiveSepaMandate } from "@/lib/payment-utils";
import { User } from "@prisma/client";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export async function SepaReminderBanner({ user }: { user: User }) {
  // Si l'utilisateur a déjà configuré un mandat SEPA, ne pas afficher la bannière
  if (await hasActiveSepaMandate({ user })) {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <CreditCard className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">
        Prélèvements automatiques non configurés
      </AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-700">
        <div>
          Pour faciliter les paiements de vos cotisations, configurez un mandat
          SEPA pour activer les prélèvements automatiques.
        </div>
        <Button
          asChild
          variant="outline"
          className="border-amber-600 hover:bg-amber-100 text-amber-800"
        >
          <Link href="/dashboard/settings/payment">Configurer maintenant</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
