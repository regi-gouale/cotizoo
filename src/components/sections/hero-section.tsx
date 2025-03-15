"use client";

import { CircleSvg } from "@/components/svg/circle-svg";
import { CoinsIcon } from "lucide-react";
import { SignupModal } from "../forms/cta-modal";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
    <div className="relative isolate flex flex-col overflow-hidden">
      {/* Background Elements - Coins */}
      <div className="absolute inset-0 -z-10">
        {/* Top left coin */}
        <CoinsIcon className="absolute top-10 left-10 text-primary w-20 h-20 animate-float-slow" />
        {/* Top right coin */}
        <CoinsIcon className="absolute top-20 right-40 text-primary w-16 h-16 rotate-12 animate-float-slow-reverse" />
        {/* Bottom left coin */}
        <CoinsIcon className="absolute bottom-20 left-1/4 text-primary w-24 h-24 rotate-45 animate-float" />
        {/* Bottom right coin */}
        <CoinsIcon className="absolute bottom-40 right-10 text-primary w-20 h-20 -rotate-12 animate-float-slow" />
        {/* Middle coin */}
        <CoinsIcon className="absolute top-1/2 left-20 text-primary w-16 h-16 rotate-24 animate-float-reverse" />
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      </div>

      <main className="w-full px-4" id="hero">
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
              <span className="underline font-extrabold text-primary px-2 pb-0.5 rounded-md">
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
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            <Button
              asChild
              className="hover:shadow-md hover:translate-y-[-2px] hover:scale-110"
            >
              <SignupModal
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                triggerText="Je réjoins la communauté"
              />
            </Button>
            <Button
              variant="ghost"
              className="font-bold text-primary hover:text-primary/90 hover:scale-110"
              asChild
            >
              <a href="/about">En savoir plus</a>
            </Button>
          </div>
          {/* Brand */}
          <div className="mb-4 gap-y-4">
            <p className="text-sm text-muted-foreground italic">
              La gestion de votre tontine, simple comme un jeu d'enfant !
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
