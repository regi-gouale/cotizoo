import { createEmailLayout } from "@/lib/email-templates/index";

type TontineCreatedTemplateVariables = {
  userName: string;
  tontineName: string;
  tontineType: string;
  startDate: string;
  endDate: string;
  frequency: string;
  contributionAmount: string;
  maxMembers: number;
  tontineUrl: string;
};

export function tontineCreatedTemplate(
  variables: TontineCreatedTemplateVariables,
): string {
  const content = `
    <h2>Confirmation de création de tontine</h2>
    <p>
      Bonjour ${variables.userName},
    </p>
    <p>
      Félicitations ! Votre tontine <strong>"${variables.tontineName}"</strong> a été créée avec succès sur {{siteName}}.
    </p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Détails de votre tontine</h3>
      <p><strong>Nom :</strong> ${variables.tontineName}</p>
      <p><strong>Type :</strong> ${variables.tontineType}</p>
      <p><strong>Date de début :</strong> ${variables.startDate}</p>
      <p><strong>Date de fin :</strong> ${variables.endDate}</p>
      <p><strong>Fréquence :</strong> ${variables.frequency}</p>
      <p><strong>Contribution par membre :</strong> ${variables.contributionAmount}</p>
      <p><strong>Nombre maximum de membres :</strong> ${variables.maxMembers}</p>
    </div>
    <p>
      Vous pouvez dès maintenant inviter des membres à rejoindre votre tontine et gérer les paramètres depuis votre espace personnel.
    </p>
    <p style="text-align: center;">
      <a class="button" href="${variables.tontineUrl}">Accéder à ma tontine</a>
    </p>
    <p>
      Si vous avez des questions concernant la gestion de votre tontine, n'hésitez pas à consulter notre centre d'aide ou à contacter notre service client.
    </p>
    <p>
      Cordialement,<br>
      L'équipe {{siteName}}
    </p>
  `;

  return createEmailLayout(content);
}
