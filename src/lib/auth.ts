import { sendTemplateEmail } from "@/lib/email";
import {
  getPasswordResetHtml,
  getRegistrationEmailHtml,
} from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { stripe as stripePlugin } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";

export class AuthError extends Error {}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendTemplateEmail(
        user.email,
        "Réinitialisation de votre mot de passe",
        getPasswordResetHtml({ resetUrl: url }),
        {},
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendTemplateEmail(
        user.email,
        "Vérification de votre adresse email",
        getRegistrationEmailHtml({
          name: user.name || "Utilisateur",
          confirmUrl: url,
        }),
        {},
      );
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/auth")) {
        const userId = ctx.context.session?.user.id;
        const email = ctx.context.session?.user.email;

        console.log("User ID:", userId);
        console.log("Email:", email);

        if (!userId || !email) return;

        const stripeCustomer = await stripe.customers.create({
          email,
        });

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: stripeCustomer.id },
        });
      }
    }),
  },
  plugins: [
    stripePlugin({
      stripeClient: stripe,
      createCustomerOnSignUp: true,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
    }),
  ],
});
