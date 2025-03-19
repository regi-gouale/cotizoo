import { missedPaymentTemplate } from "@/lib/email-templates/missed-payment";
import { passwordResetTemplate } from "@/lib/email-templates/password-reset";
import { paymentNotificationTemplate } from "@/lib/email-templates/payment-notification";
import { registrationTemplate } from "@/lib/email-templates/registration";
import { tontineInvitationTemplate } from "@/lib/email-templates/tontine-invitation";

// Templates d'emails disponibles
export const emailTemplates = {
  registration: registrationTemplate,
  tontineInvitation: tontineInvitationTemplate,
  passwordReset: passwordResetTemplate,
  paymentNotification: paymentNotificationTemplate,
  missedPayment: missedPaymentTemplate,
};

// Fonctions pour envoyer les emails avec les templates
export function getRegistrationEmailHtml(variables: {
  name: string;
  confirmUrl: string;
}): string {
  return registrationTemplate(variables);
}

export function getTontineInvitationHtml(variables: {
  inviterName: string;
  tontineName: string;
  invitationUrl: string;
}): string {
  return tontineInvitationTemplate(variables);
}

export function getPasswordResetHtml(variables: { resetUrl: string }): string {
  return passwordResetTemplate(variables);
}

export function getPaymentNotificationHtml(variables: {
  tontineName: string;
  amount: string;
  date: string;
  recipient?: string;
}): string {
  return paymentNotificationTemplate(variables);
}

export function getMissedPaymentHtml(variables: {
  tontineName: string;
  amount: string;
  dueDate: string;
}): string {
  return missedPaymentTemplate(variables);
}

// Helper pour créer un layout HTML commun
export function createEmailLayout(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{{siteName}}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 20px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        .content {
          padding: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #6366F1;
          color: white !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        a {
          color: #6366F1;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>{{siteName}}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>
            &copy; ${new Date().getFullYear()} {{siteName}} - Tous droits réservés<br>
            <a href="{{siteUrl}}">{{siteUrl}}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
