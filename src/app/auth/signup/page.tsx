import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";
import { PageParams } from "@/types/next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage(props: PageParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { token: tokenParam, tontineId: tontineIdParam } =
    await props.searchParams;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  const tontineId = Array.isArray(tontineIdParam)
    ? tontineIdParam[0]
    : tontineIdParam;

  // Si l'utilisateur est connecté et qu'il a un token d'invitation
  if (session && token) {
    redirect(
      `/auth/accept-invitation?token=${token}&tontineId=${tontineId || ""}`,
    );
  }
  // Sinon, s'il est connecté normalement
  else if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center font-title">
          {token
            ? "Créez votre compte pour rejoindre la tontine"
            : "Créez votre compte"}
        </h1>
        <div className="w-full max-w-sm">
          <SignUpForm invitationToken={token} tontineId={tontineId} />
        </div>
      </div>
    </div>
  );
}
