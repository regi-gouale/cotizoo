"use client";

import { SignupModal } from "../signup/signup-modal";
import { Button } from "../ui/button";

export function CtaButtons() {
  return (
    <div className="flex gap-x-4">
      {/* <Button className="bg-primary hover:bg-primary/90">
              Réserver mon accès
            </Button> */}
      <SignupModal
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        triggerText="Réserver mon accès"
      />
      <Button variant="ghost" className="text-primary hover:text-primary/90">
        En savoir plus
      </Button>
    </div>
  );
}
