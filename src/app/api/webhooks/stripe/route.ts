import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersSig = await headers();
  const sig = headersSig.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  // Gérer les événements pertinents
  switch (event.type) {
    case "setup_intent.succeeded":
      const setupIntent = event.data.object;
      console.log("SetupIntent réussi :", setupIntent);

      // Stocker le paymentMethodId pour l'utilisateur
      const customerId = setupIntent.customer as string;
      const paymentMethodId = setupIntent.payment_method as string;

      // Exemple avec Prisma :
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { stripePaymentMethodId: paymentMethodId },
      });

      break;

    case "setup_intent.canceled":
      console.log("SetupIntent annulé :", event.data.object);
      break;

    case "payment_method.attached":
      console.log("Moyen de paiement attaché :", event.data.object);
      break;

    default:
      console.log(`Événement non géré : ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
