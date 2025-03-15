import { CircleSvg } from "@/components/svg/circle-svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-background to-primary/10 font-sans">
      {/* Hero Section */}
      <section className="w-full px-4" id="hero">
        <div className="container mx-auto flex flex-col items-center text-center gap-y-10  h-[calc(100vh-4rem)] justify-center">
          {/* Main Title with Image */}
          <div className="flex items-center gap-y-6 md:gap-y-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-3xl font-title">
              Gérez vos tontines en toute{" "}
              <span className="relative inline-block items-center">
                <span className="font-black">simplicité</span>
                <CircleSvg className="absolute inset-0 fill-primary" />
              </span>
              , avec une solution{" "}
              <span className="underline font-extrabold text-primary bg-gradient-to-b from-muted/50 to-muted px-2 pb-0.5 rounded-md">
                tout-en-un
              </span>
              , sécurisée et intuitive.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Dites adieu aux complications et bonjour à une gestion de tontines
            moderne, transparente et sans stress.
          </p>
          {/* Call To Action Button */}
          <div className="flex gap-x-4">
            <Button className="bg-primary hover:bg-primary/90">
              Réserver mon accès
            </Button>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/90"
            >
              En savoir plus
            </Button>
          </div>
          {/* Brand */}
          <div className="mb-4 gap-y-4">
            <p className="text-sm text-muted-foreground italic">
              La gestion de votre tontine, simple comme un jeu d'enfant !
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 my-12" id="cta">
        <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center">
          <Card className="border-2 border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-sm bg-card/90 max-w-xl">
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="gap-y-2 text-left">
                  <h3 className="font-semibold font-title">
                    🚀 Lancement imminent !
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Laissez-nous vos informations pour rejoindre la révolution
                    des tontines numériques
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Input
                    type="text"
                    placeholder="Votre prénom"
                    className="w-full"
                  />
                  <div className="flex gap-x-2">
                    <Input
                      type="email"
                      placeholder="Votre email"
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Je m'inscris
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  🔒 Vos informations sont en sécurité. Nous ne les partagerons
                  jamais.
                </p>

                <div className="mt-2 py-2 px-3 bg-primary/10 rounded-md text-sm">
                  <p className="font-medium text-primary">
                    🎁 En bonus : Les 100 premiers inscrits recevront un guide
                    gratuit sur les meilleures pratiques pour gérer vos tontines
                    efficacement.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full px-4" id="features">
        <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center my-12">
          <h2 className="text-2xl font-bold mb-6 font-title">
            Notre application révolutionnaire vous offre tout ce dont vous avez
            besoin :
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <FeatureItem
              title="Automatisation intelligente"
              description="Plus besoin de calculs manuels ou de suivi fastidieux. Gestion automatique des fonds."
            />
            <FeatureItem
              title="Sécurité renforcée"
              description="Vos fonds sont protégés grâce à un compte séquestre et des technologies de pointe."
            />
            <FeatureItem
              title="Assurance intégrée"
              description="Protégez vos investissements avec une assurance qui couvre les imprévus."
            />
            <FeatureItem
              title="Tableau de bord intuitif"
              description="Suivez en temps réel l'état de vos tontines dans une interface simple."
            />
            <FeatureItem
              title="Flexibilité totale"
              description="Configurez vos tontines selon vos besoins : durée, montant, fréquence et plus encore."
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem(props: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-x-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:scale-105 duration-500 ${props.className || ""}`}
    >
      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-medium font-title">{props.title}</h3>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}
