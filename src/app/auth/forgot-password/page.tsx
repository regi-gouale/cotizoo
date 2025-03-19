import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Mot de passe oublié
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}