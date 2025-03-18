import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Créez votre compte
        </h1>
        <SignUpForm />
      </div>
    </div>
  );
}
