import { createEmailLayout } from "@/lib/email-templates/index";

export function tontineInvitationTemplate(variables: {
  inviterName: string;
  tontineName: string;
  invitationUrl: string;
}): string {
  const content = `
    <h2>Invitation à rejoindre une tontine</h2>
    <p>
      Bonjour,
    </p>
    <p>
      <strong>${variables.inviterName}</strong> vous invite à rejoindre la tontine <strong>"${variables.tontineName}"</strong> sur {{siteName}}.
    </p>
    <p>
      {{siteName}} est une plateforme qui simplifie la gestion des tontines, permettant de :
    </p>
    <ul>
      <li>Suivre facilement les contributions</li>
      <li>Gérer les tours de versement</li>
      <li>Recevoir des notifications de paiement</li>
      <li>Visualiser l'historique des transactions</li>
    </ul>
    <p>
      Pour rejoindre cette tontine, cliquez sur le bouton ci-dessous :
    </p>
    <p style="text-align: center;">
      <a class="button" href="${variables.invitationUrl}">Rejoindre la tontine</a>
    </p>
    <p>
      Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :
      <br>
      <a href="${variables.invitationUrl}">${variables.invitationUrl}</a>
    </p>
    <p>
      Cette invitation est valable pendant 7 jours. Passé ce délai, vous devrez demander une nouvelle invitation.
    </p>
    <p>
      À très bientôt sur {{siteName}} !
    </p>
  `;

  return createEmailLayout(content);
}
