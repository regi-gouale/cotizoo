"use client";

import { InviteMemberForm } from "@/components/tontines/invite-member-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type SignupModalProps = {
  triggerText?: string;
  className?: string;
  tontineId: string;
};

export function TontineMemberInviteModal(props: SignupModalProps) {
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
          <DialogTitle className="sr-only">Inscription</DialogTitle>
        </DialogHeader>
        <InviteMemberForm
          onSuccess={handleSuccess}
          tontineId={props.tontineId}
        />
      </DialogContent>
    </Dialog>
  );
}
