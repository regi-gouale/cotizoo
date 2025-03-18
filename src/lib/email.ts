import { Resend } from "resend";

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Définir les types pour les paramètres d'email
type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

/**
 * Envoie un email en utilisant Resend
 * @param params Les paramètres de l'email
 * @returns Un objet contenant l'ID de l'email envoyé ou une erreur
 */
export async function sendEmail(params: SendEmailParams) {
  const { to, subject, html, from, cc, bcc, replyTo } = params;

  // Utiliser l'email par défaut si aucun n'est fourni
  const fromEmail =
    from || process.env.DEFAULT_FROM_EMAIL || "no-reply@cotizoo.com";

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      cc,
      bcc,
      replyTo,
    });

    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception lors de l'envoi de l'email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Une erreur inconnue est survenue"),
    };
  }
}

/**
 * Version simplifiée pour envoyer rapidement un email
 */
export async function sendSimpleEmail(
  to: string,
  subject: string,
  message: string,
) {
  return sendEmail({
    to,
    subject,
    html: `<div>${message}</div>`,
  });
}
