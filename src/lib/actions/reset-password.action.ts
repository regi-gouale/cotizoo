"use server";

import { authClient } from "@/lib/auth-client";

export const resetPasswordWithToken = async (
  newPassword: string,
  token: string,
) => {
  return authClient.resetPassword({
    newPassword,
    token,
  });
};
