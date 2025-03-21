"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function TicketFilters(props: { isAdmin: boolean }) {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (status) {
      params.set("status", status);
      setActiveStatus(status);
    } else {
      params.delete("status");
    }

    router.push(`/dashboard/tickets?${params.toString()}`);
  };

  const createQueryString = (status: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    return params.toString();
  };

  return (
    <div className="flex space-x-2 mb-6">
      {/* <Button
        variant={!activeStatus ? "default" : "outline"}
        onClick={() => handleStatusChange(null)}
      >
        Tous
      </Button> */}
      <Button
        variant={activeStatus === "OPEN" ? "default" : "outline"}
        onClick={() => handleStatusChange("OPEN")}
      >
        Ouverts
      </Button>
      <Button
        variant={activeStatus === "IN_PROGRESS" ? "default" : "outline"}
        onClick={() => handleStatusChange("IN_PROGRESS")}
      >
        En cours
      </Button>
      <Button
        variant={activeStatus === "CLOSED" ? "default" : "outline"}
        onClick={() => handleStatusChange("CLOSED")}
      >
        Fermés
      </Button>
    </div>
  );
}
