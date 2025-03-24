import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

export const sendVerificationEmail = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.sendVerificationEmail({
    email,
    callbackURL: `${appUrl}/auth/verify-email`,
  });
};
