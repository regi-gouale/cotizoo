import { TontineSettingsForm } from "@/components/tontines/tontine-settings-form";
import { TontineSuspendForm } from "@/components/tontines/tontine-suspend-form";
import { updateExpiredTontineStatus } from "@/lib/actions/update-tontine-status.action";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function TontineIdSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  // Vérifier et mettre à jour les tontines expirées
  await updateExpiredTontineStatus();

  // Récupération des données de la tontine
  const tontine = await prisma.tontine.findUnique({
    where: {
      id: params.id,
    },
    include: {
      members: {
        where: {
          userId: session.user.id,
          role: "ADMIN", // Vérifier que l'utilisateur est admin de cette tontine
        },
      },
    },
  });

  // Si la tontine n'existe pas ou si l'utilisateur n'est pas admin, rediriger
  if (!tontine || tontine.members.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres de la tontine</h1>
          <p className="text-muted-foreground">
            Modifiez les paramètres de votre tontine "{tontine.name}"
          </p>
        </div>

        <div className="grid gap-8">
          {/* Formulaire de modification */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations générales</h2>
            <TontineSettingsForm tontine={tontine} />
          </div>

          {/* Section pour les actions sensibles */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Actions sensibles</h2>
            <TontineSuspendForm tontine={tontine} />
          </div>
        </div>
      </div>
    </div>
  );
}
