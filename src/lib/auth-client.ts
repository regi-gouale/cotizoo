import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL, // the base url of your auth server
});

// Pour faciliter l'utilisation dans les composants
export const forgotPassword = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.forgetPassword({
    email,
    redirectTo: `${appUrl}/auth/reset-password`,
  });
};

export const resetPasswordWithToken = async (
  newPassword: string,
  token: string,
) => {
  return authClient.resetPassword({
    newPassword,
    token,
  });
};

export const sendVerificationEmail = async (email: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return authClient.sendVerificationEmail({
    email,
    callbackURL: `${appUrl}/auth/verify-email`,
  });
};
