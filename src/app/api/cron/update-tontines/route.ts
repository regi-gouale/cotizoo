import { updateExpiredTontineStatus } from "@/lib/actions/update-tontine-status.action";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Vérification de la présence d'une clé API pour sécuriser la route
  const headersList = await headers();
  const apiKey = headersList.get("x-api-key");

  // Vérifier que l'API key est correcte (à compléter avec votre clé réelle dans les variables d'environnement)
  const validApiKey = process.env.CRON_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    // Mettre à jour les tontines expirées
    const result = await updateExpiredTontineStatus();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des tontines:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
