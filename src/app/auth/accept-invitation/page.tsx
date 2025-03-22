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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useParams();
  const token = searchParams.token;
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    } else {
      acceptInvitation();
    }
  }, [token, router]);

  const acceptInvitation = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await acceptInvitationAction({
        token: token.toString(),
        tontineId: searchParams.tontineId?.toString() ?? "",
      });

      if (response) {
        setIsAccepted(true);
        toast.success("Invitation acceptée avec succès");
      } else {
        toast.error("Erreur lors de l'acceptation de l'invitation");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAccepted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invitation Acceptée</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Vous avez accepté l'invitation avec succès. Vous pouvez maintenant
            vous connecter.
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accepter l'Invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>En acceptant cette invitation, vous rejoindrez la tontine.</p>
        {token}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={acceptInvitation} disabled={isLoading}>
          {isLoading ? "Chargement..." : "Accepter l'Invitation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
