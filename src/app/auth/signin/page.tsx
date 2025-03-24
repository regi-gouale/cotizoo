import { SignInForm } from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { PageParams } from "@/types/next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SigninPage(
  //   {
  //   searchParams,
  // }: {
  //   searchParams: { [key: string]: string | string[] | undefined };
  // }
  props: PageParams,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const { searchParams } = props;
  const searchParams = await props.searchParams;
  // Si l'utilisateur est connecté et qu'il a un token d'invitation
  if (session && searchParams.token) {
    redirect(
      `/auth/accept-invitation?token=${searchParams.token}&tontineId=${searchParams.tontineId || ""}`,
    );
  }
  // Sinon, s'il est connecté normalement
  else if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Connectez-vous à votre compte
        </h1>

        <SignInForm
          invitationToken={
            Array.isArray(searchParams.token)
              ? searchParams.token[0]
              : searchParams.token
          }
          tontineId={
            Array.isArray(searchParams.tontineId)
              ? searchParams.tontineId[0]
              : searchParams.tontineId
          }
        />
      </div>
    </div>
  );
}
