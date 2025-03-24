"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { acceptInvitationAction } from "@/lib/actions/invite-member.action";
import { authClient } from "@/lib/auth-client";
import { PageParams } from "@/types/next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AcceptInvitationPage(props: PageParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") as string;
  const tontineId = searchParams.get("tontineId") as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Si l'utilisateur est connecté, on peut accepter automatiquement l'invitation
    if (session && !isPending && !isAccepted) {
      acceptInvitation();
    }
  }, [token, session, isPending, router, isAccepted]);

  const acceptInvitation = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await acceptInvitationAction({
        token: token,
        tontineId: tontineId,
      });

      if (response) {
        setIsAccepted(true);
        toast.success("Invitation acceptée avec succès");

        // Si l'utilisateur est connecté, le rediriger vers la page de détail de la tontine
        if (session) {
          // Attendre un peu pour que le toast soit visible
          setTimeout(() => {
            router.push(`/dashboard/tontines/${response.data?.tontineId}`);
          }, 1500);
        }
      } else {
        toast.error("Erreur lors de l'acceptation de l'invitation");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'utilisateur n'est pas connecté mais que l'invitation a été acceptée
  if (isAccepted && !session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invitation Acceptée</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Vous avez accepté l'invitation avec succès. Connectez-vous pour
            accéder à votre tontine.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/auth/signin")}>
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Si l'utilisateur n'est pas connecté et doit accepter l'invitation manuellement
  if (!session && !isPending) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Accepter l'Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Pour rejoindre cette tontine, vous devez d'abord vous connecter ou
            créer un compte.
          </p>
          <p className="mb-4">
            Après votre connexion, l'invitation sera automatiquement acceptée.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() =>
              router.push(`/auth/signin?token=${token}&tontineId=${tontineId}`)
            }
            variant="default"
          >
            Se connecter
          </Button>
          <Button
            onClick={() =>
              router.push(`/auth/signup?token=${token}&tontineId=${tontineId}`)
            }
            variant="outline"
          >
            Créer un compte
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // En attente ou en cours d'acceptation
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {isLoading ? "Traitement en cours..." : "Accepter l'Invitation"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p>Vérification de votre session...</p>
        ) : (
          <p>En acceptant cette invitation, vous rejoindrez la tontine.</p>
        )}
      </CardContent>
      {!isPending && !session && (
        <CardFooter className="flex justify-center">
          <Button onClick={acceptInvitation} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Accepter l'Invitation"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
