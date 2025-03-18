import { SignInForm } from "@/components/auth/sign-in-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center font-title">
          Connectez-vous à votre compte
        </h1>
        <div className="w-full max-w-sm">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
