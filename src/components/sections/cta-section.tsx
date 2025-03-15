"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CtaForm } from "../forms/cta-form";

export function CtaSection() {
  return (
    <section className="w-full px-4 my-12 font-sans" id="cta">
      <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center">
        <Card className="border-2 border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-sm bg-card/90 max-w-md">
          <CardContent className="pt-6">
            <CtaForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
