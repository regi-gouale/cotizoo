import { authClient } from "@/lib/auth-client";

export const sendVerificationEmail = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.sendVerificationEmail({
    email,
    callbackURL: `${appUrl}/auth/verify-email`,
  });
};
