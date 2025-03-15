import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CtaSection() {
  return (
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
                  Laissez-nous vos informations pour rejoindre la révolution des
                  tontines numériques
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
  );
}
