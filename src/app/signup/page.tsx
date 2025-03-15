import { SignupModal } from "@/components/forms/cta-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-background rounded-lg shadow-md p-8 border border-border">
        <h1 className="text-3xl font-bold mb-6 text-center font-title">
          Créer votre compte
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Rejoignez Cotizoo et commencez à gérer vos tontines simplement et en
          toute sécurité.
        </p>

        <div className="flex flex-col items-center gap-4">
          <SignupModal
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            triggerText="S'inscrire avec un email"
          />

          <div className="relative w-full my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                ou
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" disabled>
            S'inscrire avec Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
