import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// export const setupIntents = async (customerId: string) => {
//   const setupIntent = await stripe.setupIntents.create({
//     payment_method_types: ["sepa_debit"],
//     customer: customerId,
//   });

//   return setupIntent;
// };

// export const clientSecret = async (setupIntentId: string) => {
//   const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
//   return setupIntent.client_secret;
// };
