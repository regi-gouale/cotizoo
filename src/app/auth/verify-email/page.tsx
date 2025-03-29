// filepath: /Users/regigouale/GitHub/cotizoo/src/app/auth/verify-email/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { PageParams } from "@/types/next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage(props: PageParams) {
  const { token, error } = await props.searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté et qu'il n'y a pas de token
  if (session && !token) {
    redirect("/dashboard");
  }

  // Vérifier si un token est présent et s'il y a une erreur
  const hasToken = !!token;
  const hasError = !!error;

  // Si l'utilisateur a cliqué sur le lien dans l'email
  if (hasToken && !hasError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Email vérifié</CardTitle>
              <CardDescription>
                Votre adresse email a été vérifiée avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">
                Vous pouvez maintenant vous connecter et accéder à toutes les
                fonctionnalités de notre application.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth/signin">
                <Button>Se connecter</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // En cas d'erreur de vérification
  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Erreur de vérification
              </CardTitle>
              <CardDescription>
                Le lien de vérification est invalide ou a expiré.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">
                Veuillez demander un nouveau lien de vérification en vous
                connectant avec votre email et mot de passe.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/auth/signin">
                <Button>Se connecter</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Page par défaut pour demander une vérification d'email
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Vérification d'email
        </h1>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Vérifiez votre email</CardTitle>
            <CardDescription>
              Veuillez vérifier votre boîte de réception et cliquer sur le lien
              de vérification.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Un lien de vérification vous a été envoyé par email. Si vous ne le
              trouvez pas, vérifiez votre dossier de courriers indésirables.
            </p>
            <p className="text-sm text-muted-foreground">
              Si vous n'avez pas reçu d'email, vous pouvez demander un nouveau
              lien de vérification.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/signin">
              <Button variant="outline" className="mr-2">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/resend-verification">
              <Button>Renvoyer le lien</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
