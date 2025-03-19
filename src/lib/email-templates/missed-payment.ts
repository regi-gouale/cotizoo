import { createEmailLayout } from "./index";

export function missedPaymentTemplate(variables: {
  tontineName: string;
  amount: string;
  dueDate: string;
}): string {
  const content = `
    <h2>Rappel de paiement</h2>
    <p>
      Bonjour,
    </p>
    <p>
      Ce message vous rappelle qu'un paiement pour votre tontine <strong>"${variables.tontineName}"</strong> est en attente.
    </p>
    <div style="background-color: #fff4f4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e53e3e;">
      <h3 style="margin-top: 0; color: #e53e3e;">Détails du paiement en attente</h3>
      <p><strong>Montant dû :</strong> ${variables.amount}</p>
      <p><strong>Date d'échéance :</strong> ${variables.dueDate}</p>
      <p><strong>Tontine :</strong> ${variables.tontineName}</p>
    </div>
    <p>
      Pour effectuer votre paiement et rester à jour avec vos obligations envers votre tontine, veuillez vous connecter à votre compte.
    </p>
    <p style="text-align: center;">
      <a class="button" href="{{siteUrl}}/dashboard/paiements">Effectuer mon paiement</a>
    </p>
    <p>
      Si vous avez déjà effectué ce paiement, veuillez nous excuser pour ce rappel et ignorer cet email.
    </p>
    <p>
      Si vous rencontrez des difficultés pour effectuer votre paiement, n'hésitez pas à contacter l'administrateur de votre tontine pour trouver une solution.
    </p>
    <p>
      Cordialement,<br>
      L'équipe {{siteName}}
    </p>
  `;

  return createEmailLayout(content);
}
