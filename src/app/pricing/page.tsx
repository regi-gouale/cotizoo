import { PricingInfo } from "@/components/pricing/pricing-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Tarification | Cotizoo",
  description:
    "Découvrez notre grille tarifaire simple et transparente pour vos collectes.",
};

export default async function PricingPage() {
  return (
    <div className="container py-12 space-y-8 font-sans">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-title">
          Tarification simple et transparente
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2">
          Nous proposons une tarification claire basée sur le montant total de
          votre collecte.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-center justify-center">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-semibold font-title">
              Petites collectes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Pour les collectes inférieures à 1000€
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-5xl font-bold font-title text-primary">
                10€
              </span>
              <p className="text-muted-foreground">Frais fixes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-semibold font-title">
              Grandes collectes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Pour les collectes de 1000€ ou plus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-5xl font-bold font-title text-primary">
                1%
              </span>
              <p className="text-muted-foreground">Du montant total collecté</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PricingInfo />
    </div>
  );
}
