"use client";

import { PaymentSetup } from "@/components/payment/setup-payment-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function PaymentSetupPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/setup-intent", { method: "POST" });

        if (!response.ok) {
          throw new Error("Erreur lors de la création du SetupIntent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetupIntent();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-600">Erreur: {error}</p>
          <p className="mt-2">
            Veuillez réessayer plus tard ou contacter l'assistance.
          </p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <p>Impossible d'initialiser le système de paiement.</p>
      </div>
    );
  }

  return <PaymentSetup clientSecret={clientSecret} />;
}
