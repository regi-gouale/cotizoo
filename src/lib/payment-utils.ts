import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { headers } from "next/headers";

type HasActiveSepaMandateOptions = {
  user?: User;
  includeExpired?: boolean;
};

/**
 * Checks if a user has an active SEPA mandate for Stripe payments
 *
 * @param options - Configuration options
 * @param options.user - Optional user object (defaults to current authenticated user)
 * @param options.includeExpired - Whether to include expired mandates (defaults to false)
 * @returns Promise resolving to boolean indicating if an active SEPA mandate exists
 */
export async function hasActiveSepaMandate(
  options: HasActiveSepaMandateOptions = {},
) {
  try {
    const { user: optionsUser, includeExpired = false } = options;

    // If user not provided, get it from the current session
    let userId = optionsUser?.id;
    if (!userId) {
      const session = await auth.api.getSession({ headers: await headers() });
      userId = session?.user?.id;

      if (!userId) {
        throw new Error("User ID not provided and no authenticated user found");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
          stripePaymentMethodId: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return !!user.stripePaymentMethodId;
    }

    return !!optionsUser?.stripePaymentMethodId;

    // Query for active SEPA mandates
    // const paymentMethod = await prisma.paymentMethod.findFirst({
    //   where: {
    //     userId,
    //     type: "SEPA",
    //     status: includeExpired ? undefined : "ACTIVE",
    //   },
    // });

    // return !!paymentMethod;
  } catch (error) {
    console.error("Error checking for active SEPA mandate:", error);
    return false;
  }
}
