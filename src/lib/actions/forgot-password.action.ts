"use server";

import { authClient } from "@/lib/auth-client";

// Pour faciliter l'utilisation dans les composants
export const forgotPassword = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.forgetPassword({
    email,
    redirectTo: `${appUrl}/auth/reset-password`,
  });
};
