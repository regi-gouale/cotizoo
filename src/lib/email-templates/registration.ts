import { createEmailLayout } from "./index";

export function registrationTemplate(variables: {
  name: string;
  confirmUrl: string;
}): string {
  const content = `
    <h2>Bienvenue sur {{siteName}}, ${variables.name} !</h2>
    <p>
      Merci de vous être inscrit sur {{siteName}}, la plateforme qui simplifie la gestion de vos tontines.
    </p>
    <p>
      Pour confirmer votre adresse email et commencer à utiliser nos services, veuillez cliquer sur le bouton ci-dessous :
    </p>
    <p style="text-align: center;">
      <a class="button" href="${variables.confirmUrl}">Confirmer mon compte</a>
    </p>
    <p>
      Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :
      <br>
      <a href="${variables.confirmUrl}">${variables.confirmUrl}</a>
    </p>
    <p>
      Ce lien est valable pendant 24 heures. Passé ce délai, vous devrez demander un nouveau lien de confirmation.
    </p>
    <p>
      Si vous n'avez pas créé de compte sur {{siteName}}, vous pouvez ignorer cet email.
    </p>
    <p>
      À très bientôt sur {{siteName}} !
    </p>
    <p>
      L'équipe {{siteName}}
    </p>
  `;

  return createEmailLayout(content);
}
