"use client";

import { Button } from "@/components/ui/button";
import { TontineStatus } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type TontineStatusFilters = {
  active?: boolean;
  suspended?: boolean;
  completed?: boolean;
};

export function TontineFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Récupérer les filtres actifs depuis les paramètres URL
  const status = searchParams.get("status")?.split(",") || [];
  const showActive =
    status.length === 0 || status.includes(TontineStatus.ACTIVE);
  const showSuspended = status.includes(TontineStatus.SUSPENDED);
  const showCompleted = status.includes(TontineStatus.COMPLETED);
  const showAllStatuses = status.length === 0;

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback(
    (selectedStatus: TontineStatus | null) => {
      const params = new URLSearchParams(searchParams);

      // Si null, on retire le paramètre status pour afficher toutes les tontines
      if (selectedStatus === null) {
        params.delete("status");
      } else {
        // Sinon, on définit uniquement le statut sélectionné
        params.set("status", selectedStatus);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4 md:ml-10">
      <Button
        variant={showActive && !showAllStatuses ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters(
            showActive && !showAllStatuses ? null : TontineStatus.ACTIVE,
          )
        }
      >
        En cours
      </Button>
      <Button
        variant={showSuspended ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters(showSuspended ? null : TontineStatus.SUSPENDED)
        }
      >
        Suspendues
      </Button>
      <Button
        variant={showCompleted ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters(showCompleted ? null : TontineStatus.COMPLETED)
        }
      >
        Terminées
      </Button>
      {!showAllStatuses && (
        <Button variant="ghost" size="sm" onClick={() => updateFilters(null)}>
          Tout afficher
        </Button>
      )}
    </div>
  );
}
