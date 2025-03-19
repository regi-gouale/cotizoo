import { createEmailLayout } from "@/lib/email-templates/index";

export function passwordResetTemplate(variables: { resetUrl: string }): string {
  const content = `
    <h2>Réinitialisation de votre mot de passe</h2>
    <p>
      Bonjour,
    </p>
    <p>
      Vous avez récemment demandé à réinitialiser votre mot de passe sur {{siteName}}. 
      Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
    </p>
    <p style="text-align: center;">
      <a class="button" href="${variables.resetUrl}">Réinitialiser mon mot de passe</a>
    </p>
    <p>
      Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :
      <br>
      <a href="${variables.resetUrl}">${variables.resetUrl}</a>
    </p>
    <p>
      Ce lien est valable pendant 1 heure. Passé ce délai, vous devrez demander un nouveau lien de réinitialisation.
    </p>
    <p>
      Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email ou nous contacter pour sécuriser votre compte.
    </p>
    <p>
      L'équipe {{siteName}}
    </p>
  `;

  return createEmailLayout(content);
}
