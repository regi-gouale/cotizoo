import { CircleSvg } from "@/components/svg/circle-svg";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/layout/grid-background";
import { GradientBackground } from "@/components/layout/gradient-background";

export function HeroSection() {
  return (
    <div className="relative isolate flex flex-col">
      <GridBackground />
      <GradientBackground />
      <section className="w-full px-4" id="hero">
        <div className="container mx-auto flex flex-col items-center text-center gap-y-10 h-[calc(100vh-4rem)] justify-center">
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
    </div>
  );
}
