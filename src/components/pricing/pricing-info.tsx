"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function PricingInfo(props: {}) {
  const [amount, setAmount] = useState<number>(750);

  const calculateFee = (value: number): { fee: number; percent: number } => {
    if (value < 1000) {
      return { fee: 10, percent: (10 / value) * 100 };
    }
    return { fee: value * 0.01, percent: 1 };
  };

  const { fee, percent } = calculateFee(amount);

  return (
    <div className="space-y-8 fonnt-sans w-full">
      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center font-title">
          Calcul des frais
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto px-2">
          Utilisez notre calculateur pour estimer les frais de votre collecte.
        </p>

        <div className="flex justify-center">
          <Card className="max-w-md mx-auto w-full">
            <CardHeader>
              <CardTitle className="font-title text-xl">
                Simulateur de frais
              </CardTitle>
              <CardDescription>
                Entrez le montant de votre collecte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant de la collecte (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Montant de la collecte:</span>
                  <span className="font-medium">{amount.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais:</span>
                  <span className="font-medium">
                    {fee.toFixed(2)}€ ({percent.toFixed(2)}%)
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Montant net:</span>
                  <span className="font-title text-primary">
                    {(amount - fee).toFixed(2)}€
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 flex flex-col items-center w-full">
        <h2 className="text-2xl font-bold text-center font-title">
          Exemples de calcul
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="font-title text-xl">
                Exemple 1: Petite collecte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Montant collecté:</span>
                  <span>500€</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais:</span>
                  <span>10€ (2%)</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Montant net:</span>
                  <span>490€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-title text-xl">
                Exemple 2: Grande collecte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Montant collecté:</span>
                  <span>2 500€</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais:</span>
                  <span>25€ (1%)</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Montant net:</span>
                  <span>2 475€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg mt-8 mx-2">
        <div className="flex flex-col items-center max-w-3xl mx-auto space-y-4 py-8">
          <h3 className="font-semibold mb-4 text-xl font-title">
            Remarque importante
          </h3>
          <p className="text-muted-foreground text-center">
            Nos frais sont transparents et sans surprises. Aucun autre frais
            caché n'est appliqué à votre collecte. Pour toute question
            concernant notre tarification, n'hésitez pas à contacter notre
            équipe.
          </p>
        </div>
      </div>
    </div>
  );
}
