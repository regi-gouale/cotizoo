import { SignInForm } from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("session", session);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Connectez-vous à votre compte
        </h1>
        <SignInForm />
      </div>
    </div>
  );
}
