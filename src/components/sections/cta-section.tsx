"use client";

import { CtaForm } from "@/components/forms/cta-form";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function CtaSectionFallback() {
  return (
    <section className="w-full px-4 my-12 font-sans">
      <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center">
        <div className="h-64 w-full max-w-md bg-muted/50 rounded-lg animate-pulse"></div>
      </div>
    </section>
  );
}

function CtaSectionContent() {
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

export function CtaSection() {
  return (
    <Suspense fallback={<CtaSectionFallback />}>
      <CtaSectionContent />
    </Suspense>
  );
}
