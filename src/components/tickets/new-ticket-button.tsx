"use client";

import { NewTicketForm } from "@/components/tickets/new-ticket-form";
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

export function NewTicketButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nouveau ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau ticket</DialogTitle>
          <DialogDescription>
            Décrivez votre problème ou votre demande. Notre équipe y répondra
            dès que possible.
          </DialogDescription>
        </DialogHeader>
        <NewTicketForm />
      </DialogContent>
    </Dialog>
  );
}
