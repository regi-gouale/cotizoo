"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type SetupFormProps = {
  clientSecret: string;
};

export function PaymentSetup({ clientSecret }: SetupFormProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Paramètres de paiement
          </h1>
          <p className="text-muted-foreground mt-2">
            Configurez vos informations bancaires pour les prélèvements
            automatiques.
          </p>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configuration du mandat SEPA</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SetupPaymentForm />
            </Elements>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Comprendre le mandat SEPA</h2>
            <p className="text-muted-foreground mt-2">
              Le mandat SEPA (Single Euro Payments Area) est une autorisation
              que vous donnez à Cotizoo pour débiter votre compte bancaire. Cela
              nous permet de prélever automatiquement vos cotisations aux
              échéances prévues.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Sécurité de vos informations bancaires
            </h2>
            <p className="text-muted-foreground mt-2">
              Vos informations bancaires sont sécurisées et cryptées par notre
              partenaire Stripe. Cotizoo ne stocke pas directement vos
              informations de carte ou votre IBAN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetupPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/settings/payment/success`,
      },
    });

    if (error) {
      setMessage(error.message || "Une erreur est survenue.");
      setLoading(false);
    }
    // La redirection sera gérée par Stripe si la configuration est réussie
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement className="mb-4" />

      {message && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Traitement..." : "Enregistrer le moyen de paiement"}
      </Button>
    </form>
  );
}
