import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL, // the base url of your auth server
  plugins: [stripeClient({ subscription: true })],
});

export type AuthClientType = typeof authClient;

export const sendVerificationEmail = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.sendVerificationEmail({
    email,
    callbackURL: `${appUrl}/auth/verify-email`,
  });
};
