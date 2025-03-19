import { Resend } from "resend";

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration email depuis les variables d'environnement
export const emailConfig = {
  fromEmail: process.env.EMAIL_FROM || "no-reply@cotizoo.com",
  fromName: process.env.EMAIL_FROM_NAME || "Régi de Cotizoo",
  replyToEmail: process.env.EMAIL_REPLY_TO || "support@cotizoo.com",
  siteName: process.env.SITE_NAME || "cotizoo",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://cotizoo.com",
};

// Définir les types pour les paramètres d'email
type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  text?: string;
};

/**
 * Envoie un email en utilisant Resend
 * @param params Les paramètres de l'email
 * @returns Un objet contenant l'ID de l'email envoyé ou une erreur
 */
export async function sendEmail(params: SendEmailParams) {
  const { to, subject, html, from, fromName, cc, bcc, replyTo, text } = params;

  // Utiliser l'email par défaut si aucun n'est fourni
  const fromEmail = from || emailConfig.fromEmail;
  const senderName = fromName || emailConfig.fromName;
  const replyToEmail = replyTo || emailConfig.replyToEmail;

  try {
    const { data, error } = await resend.emails.send({
      from: `${senderName} <${fromEmail}>`,
      to,
      subject,
      html,
      cc,
      bcc,
      replyTo: replyToEmail,
      text,
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

// Types pour les variables des templates
export type TemplateVariables = Record<
  string,
  string | number | boolean | undefined | null
>;

/**
 * Génère un email HTML depuis un template avec des variables
 */
export function renderTemplate(
  template: string,
  variables: TemplateVariables,
): string {
  let renderedTemplate = template;

  // Remplacer toutes les variables dans le template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    renderedTemplate = renderedTemplate.replace(regex, String(value ?? ""));
  });

  // Remplacer les variables globales
  renderedTemplate = renderedTemplate.replace(
    /{{siteName}}/g,
    emailConfig.siteName,
  );
  renderedTemplate = renderedTemplate.replace(
    /{{siteUrl}}/g,
    emailConfig.siteUrl,
  );

  return renderedTemplate;
}

/**
 * Envoie un email à partir d'un template et de variables
 */
export async function sendTemplateEmail(
  to: string | string[],
  subject: string,
  templateHtml: string,
  variables: TemplateVariables,
) {
  const html = renderTemplate(templateHtml, variables);

  return sendEmail({
    to,
    subject,
    html,
  });
}
