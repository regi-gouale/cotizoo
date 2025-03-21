"use client";

import { GithubIcon } from "@/components/svg/github-icon";
import { GoogleIcon } from "@/components/svg/google-icon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export function SocialAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (data.error) {
      console.error(data.error);
      toast.error("Une erreur est survenue lors de la connexion avec Google");
    } else {
      toast.success("Connexion réussie avec Google");
    }
    setIsGoogleLoading(false);
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (data.error) {
      console.error(data.error);
      toast.error("Une erreur est survenue lors de la connexion avec GitHub");
    } else {
      toast.success("Connexion réussie avec GitHub");
    }
    setIsGithubLoading(false);
  };

  return (
    <div className="grid gap-4 w-full max-w-sm">
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading || isGithubLoading}
        onClick={handleGoogleSignIn}
      >
        {isGoogleLoading ? (
          <span className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Se connecter avec Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading || isGithubLoading}
        onClick={handleGithubSignIn}
      >
        {isGithubLoading ? (
          <span className="h-4 w-4 animate-spin" />
        ) : (
          <GithubIcon className="mr-2 h-4 w-4" />
        )}
        Se connecter avec GitHub
      </Button>
    </div>
  );
}
