import { sendTemplateEmail } from "@/lib/email";
import {
  getPasswordResetHtml,
  getRegistrationEmailHtml,
} from "@/lib/email-templates";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

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
});
