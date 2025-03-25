"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"success" | "processing" | "error">(
    "processing",
  );

  useEffect(() => {
    const setupIntentId = searchParams.get("setup_intent");
    const setupIntentClientSecret = searchParams.get(
      "setup_intent_client_secret",
    );

    if (setupIntentId && setupIntentClientSecret) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          {status === "success" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Configuration réussie
              </CardTitle>
              <CardDescription>
                Votre moyen de paiement a été enregistré avec succès.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold">Erreur</CardTitle>
              <CardDescription>
                Une erreur est survenue lors de l'enregistrement de votre moyen
                de paiement.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-center">
            {status === "success"
              ? "Vous pouvez maintenant participer aux tontines avec prélèvements automatiques."
              : "Veuillez réessayer ou contacter notre support si le problème persiste."}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => router.push("/dashboard/settings")}
          >
            Retour aux paramètres
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
