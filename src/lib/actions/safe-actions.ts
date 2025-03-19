import { auth, AuthError } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { type User } from "@prisma/client";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

export class ActionError extends Error {}

type handleServerError = (e: Error) => string;

const handleServerError: handleServerError = (e) => {
  if (e instanceof ActionError) {
    logger.info("[DEV] - Action Error", e.message);
    return e.message;
  }

  if (e instanceof AuthError) {
    logger.info("[DEV] - Auth Error", e.message);
    return e.message;
  }

  logger.info("[DEV] - Unknown Error", e);

  return "An unexpected error occurred.";
};

export const action = createSafeActionClient({
  handleServerError,
});

const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new ActionError("Session not found!");
  }

  const user = session.user;

  if (!user) {
    throw new ActionError("User not found in session!");
  }

  if (!user.id || !user.email) {
    throw new ActionError("Session is not valid!");
  }

  return user as User;
};

export const authAction = createSafeActionClient({
  handleServerError,
}).use(async ({ next }) => {
  const user = await getUser();

  return next({
    ctx: {
      user: user as User,
    },
  });
});
