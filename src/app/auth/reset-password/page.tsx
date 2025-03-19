import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  if (!token) {
    redirect("/auth/forgot-password");
  }

  // Vérifier si le token est valide (sans révéler d'informations sensibles)
  const verification = await prisma.verification.findFirst({
    where: {
      value: token,
      expiresAt: { gt: new Date() },
    },
  });

  const isTokenValid = !!verification;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Réinitialiser votre mot de passe
        </h1>
        {isTokenValid ? (
          <>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Veuillez choisir un nouveau mot de passe pour votre compte.
            </p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <div className="w-full max-w-md text-center space-y-4">
            <p className="text-red-500">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <a
              href="/auth/forgot-password"
              className="text-primary hover:underline"
            >
              Demander un nouveau lien de réinitialisation
            </a>
          </div>
        )}
      </div>
    </div>
  );
}