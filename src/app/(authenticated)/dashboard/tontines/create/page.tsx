import { CreateTontineForm } from "@/components/tontines/create-tontine-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateTontinePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Rediriger vers la connexion si l'utilisateur n'est pas authentifié
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Créer une nouvelle tontine
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-lg">
          Définissez les paramètres de votre tontine. Une fois créée, vous
          pourrez inviter d'autres membres à la rejoindre.
        </p>
        <CreateTontineForm />
      </div>
    </div>
  );
}
