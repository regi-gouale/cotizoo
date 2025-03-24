"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLoading } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { updateTontineStatus } from "@/lib/actions/update-tontine-status.action";
import { TontineStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TontineSuspendFormProps = {
  tontine: {
    id: string;
    name: string;
    status: TontineStatus;
  };
};

export function TontineSuspendForm({ tontine }: TontineSuspendFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const isSuspended = tontine.status === TontineStatus.SUSPENDED;
  const isCompleted = tontine.status === TontineStatus.COMPLETED;

  const handleStatusChange = async (status: TontineStatus) => {
    setIsLoading(true);

    try {
      const result = await updateTontineStatus({
        id: tontine.id,
        status,
        reason,
      });

      if (!result.success) {
        toast.error(
          result.error ||
            "Une erreur est survenue lors de la mise à jour du statut",
        );
        setIsLoading(false);
        return;
      }

      if (status === TontineStatus.SUSPENDED) {
        toast.success("La tontine a été suspendue avec succès");
      } else if (status === TontineStatus.ACTIVE) {
        toast.success("La tontine a été réactivée avec succès");
      }

      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour du statut");
      console.error(error);
    } finally {
      setIsLoading(false);
      setReason("");
    }
  };

  // Si la tontine est déjà terminée, afficher un message différent
  if (isCompleted) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Tontine terminée</CardTitle>
          <CardDescription>
            Cette tontine est terminée et ne peut plus être modifiée.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            Lorsqu'une tontine est marquée comme terminée, son statut ne peut
            plus être modifié. Les données sont conservées à des fins
            d'archivage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isSuspended ? "border-destructive" : ""}>
      <CardHeader>
        <CardTitle>
          {isSuspended ? "Réactiver la tontine" : "Suspendre la tontine"}
        </CardTitle>
        <CardDescription>
          {isSuspended
            ? "La tontine est actuellement suspendue. Vous pouvez la réactiver ci-dessous."
            : "Suspendre temporairement cette tontine empêchera toute opération de paiement ou collecte."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            {isSuspended ? (
              <p>
                La réactivation permettra de reprendre les opérations normales
                de la tontine, y compris les prélèvements et les distributions.
              </p>
            ) : (
              <p>
                La suspension est généralement utilisée en cas de problème
                nécessitant une investigation, ou lors d'une maintenance
                planifiée. Tous les membres seront notifiés.
              </p>
            )}
          </div>

          {!isSuspended && (
            <div>
              <label
                htmlFor="suspendReason"
                className="block text-sm font-medium mb-1"
              >
                Raison de la suspension
              </label>
              <Textarea
                id="suspendReason"
                placeholder="Veuillez indiquer la raison de la suspension..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={isSuspended ? "default" : "destructive"}
              className="w-full"
              disabled={isLoading || (!reason && !isSuspended)}
            >
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  {isSuspended
                    ? "Réactivation en cours..."
                    : "Suspension en cours..."}
                </>
              ) : isSuspended ? (
                "Réactiver la tontine"
              ) : (
                "Suspendre la tontine"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isSuspended
                  ? "Êtes-vous sûr de vouloir réactiver cette tontine ?"
                  : "Êtes-vous sûr de vouloir suspendre cette tontine ?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isSuspended
                  ? "Cette action réactivera la tontine et permettra la reprise des opérations."
                  : "Cette action suspendra temporairement la tontine et bloquera toutes les opérations de paiement et collecte. Tous les membres seront notifiés."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleStatusChange(
                    isSuspended
                      ? TontineStatus.ACTIVE
                      : TontineStatus.SUSPENDED,
                  )
                }
                className={
                  isSuspended
                    ? ""
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                }
              >
                {isSuspended ? "Oui, réactiver" : "Oui, suspendre"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
