"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SignupForm } from "./signup-form";
import { toast } from "sonner";

type SignupModalProps = {
  triggerText?: string;
  className?: string;
};

export function SignupModal(props: SignupModalProps) {
  const { triggerText = "Je m'inscris", className } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscription</DialogTitle>
          <DialogDescription>
            Inscrivez-vous pour rejoindre Cotizoo et bénéficier de nos services.
          </DialogDescription>
        </DialogHeader>
        <SignupForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
