import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Récupérer l'utilisateur connecté
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Vérifier si l'utilisateur a déjà un customer Stripe
    let stripeCustomerId = session.user.stripeCustomerId;
    if (!stripeCustomerId) {
      // Créer un client Stripe si inexistant
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: session.user.id },
      });

      stripeCustomerId = customer.id;

      // Mettre à jour l'utilisateur avec son ID Stripe
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }
    // Créer un SetupIntent pour le prélèvement SEPA
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["sepa_debit"],
    });
    // Renvoyer le client_secret du SetupIntent
    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
