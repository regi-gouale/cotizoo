import { ActionError } from "@/lib/actions/safe-actions";

/**
 * Résout le résultat d'une action serveur.
 * Soit renvoie le résultat si l'action a réussi, soit lance une erreur si l'action a échoué.
 */
export async function resolveActionResult<T>(
  actionPromise: Promise<{
    data?: T;
    serverError?: string;
    validationError?: any;
  }>,
): Promise<T> {
  const result = await actionPromise;

  if (result.validationError) {
    throw new ActionError(
      "Erreur de validation des données",
      result.validationError,
    );
  }

  if (result.serverError) {
    throw new ActionError(result.serverError);
  }

  return result.data as T;
}
