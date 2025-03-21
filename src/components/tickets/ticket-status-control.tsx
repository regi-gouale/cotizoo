"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTicketStatusAction } from "@/lib/actions/ticket.action";
import { TicketStatus } from "@/types/ticket";
import { useState } from "react";
import { toast } from "sonner";

type TicketStatusControlProps = {
  ticketId: string;
  currentStatus: string;
};

export function TicketStatusControl({
  ticketId,
  currentStatus,
}: TicketStatusControlProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onChange(status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
    if (status !== currentStatus) {
      setIsLoading(true);
      const result = await updateTicketStatusAction({
        ticketId,
        status,
      });
      setIsLoading(false);
      if (!result) toast.error("Échec de la mise à jour du statut");
      else toast.success("Statut du ticket mis à jour");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Statut:</span>
      <Select
        value={currentStatus}
        onValueChange={onChange}
        disabled={isLoading}
        defaultValue={currentStatus}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TicketStatus.OPEN}>Ouvert</SelectItem>
          <SelectItem value={TicketStatus.IN_PROGRESS}>En cours</SelectItem>
          <SelectItem value={TicketStatus.CLOSED}>Fermé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
