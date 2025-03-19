import { createEmailLayout } from "@/lib/email-templates/index";

export function paymentNotificationTemplate(variables: {
  tontineName: string;
  amount: string;
  date: string;
  recipient?: string;
}): string {
  const content = `
    <h2>Confirmation de paiement</h2>
    <p>
      Bonjour,
    </p>
    <p>
      Nous vous confirmons le traitement d'un paiement pour votre tontine <strong>"${variables.tontineName}"</strong>.
    </p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Détails du paiement</h3>
      <p><strong>Montant :</strong> ${variables.amount}</p>
      <p><strong>Date :</strong> ${variables.date}</p>
      ${variables.recipient ? `<p><strong>Bénéficiaire :</strong> ${variables.recipient}</p>` : ""}
      <p><strong>Tontine :</strong> ${variables.tontineName}</p>
    </div>
    <p>
      Vous pouvez consulter l'historique complet de vos paiements en vous connectant à votre compte sur {{siteName}}.
    </p>
    <p style="text-align: center;">
      <a class="button" href="{{siteUrl}}/dashboard">Accéder à mon compte</a>
    </p>
    <p>
      Si vous avez des questions concernant ce paiement, n'hésitez pas à contacter l'administrateur de votre tontine ou notre service client.
    </p>
    <p>
      Cordialement,<br>
      L'équipe {{siteName}}
    </p>
  `;

  return createEmailLayout(content);
}
