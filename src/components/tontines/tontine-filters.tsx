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
  const showActive = !status.length || status.includes(TontineStatus.ACTIVE);
  const showSuspended =
    !status.length || status.includes(TontineStatus.SUSPENDED);
  const showCompleted =
    !status.length || status.includes(TontineStatus.COMPLETED);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback(
    (newFilters: TontineStatusFilters) => {
      const params = new URLSearchParams(searchParams);
      const statusFilters = [];

      if (newFilters.active) statusFilters.push(TontineStatus.ACTIVE);
      if (newFilters.suspended) statusFilters.push(TontineStatus.SUSPENDED);
      if (newFilters.completed) statusFilters.push(TontineStatus.COMPLETED);

      // Si tous les filtres sont activés ou aucun, on retire le paramètre status
      if (statusFilters.length === 3 || statusFilters.length === 0) {
        params.delete("status");
      } else {
        params.set("status", statusFilters.join(","));
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={showActive ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters({
            active: !showActive,
            suspended: showSuspended,
            completed: showCompleted,
          })
        }
      >
        En cours
      </Button>
      <Button
        variant={showSuspended ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters({
            active: showActive,
            suspended: !showSuspended,
            completed: showCompleted,
          })
        }
      >
        Suspendues
      </Button>
      <Button
        variant={showCompleted ? "default" : "outline"}
        size="sm"
        onClick={() =>
          updateFilters({
            active: showActive,
            suspended: showSuspended,
            completed: !showCompleted,
          })
        }
      >
        Terminées
      </Button>
      {status.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            updateFilters({ active: true, suspended: true, completed: true })
          }
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
