"use client";

import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui/loading";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type SignInFormProps = {
  invitationToken?: string;
  tontineId?: string;
};

export function SignInForm({ invitationToken, tontineId }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: SignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          // Rediriger vers la page d'invitation si un token est fourni, sinon vers le tableau de bord
          callbackURL: invitationToken
            ? `/auth/accept-invitation?token=${invitationToken}&tontineId=${tontineId || ""}`
            : "/dashboard",
        },
        {
          onRequest: () => {
            // Déjà géré par setIsLoading
          },
          onSuccess: () => {
            toast.success("Connexion réussie!");
          },
          onError: (ctx) => {
            // Gestion spécifique pour l'email non vérifié (status 403)
            if (
              ctx.error.status === 403 &&
              ctx.error.message.toLowerCase().includes("email")
            ) {
              toast.error(
                "Veuillez vérifier votre adresse email avant de vous connecter",
              );
              // Rediriger vers la page de renvoi de vérification d'email
              router.push(`/auth/resend-verification`);
            } else {
              toast.error(ctx.error.message || "Identifiants incorrects");
            }
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Se connecter</CardTitle>
        <CardDescription>
          {invitationToken
            ? "Connectez-vous pour accepter l'invitation à la tontine"
            : "Connectez-vous pour accéder à votre tableau de bord"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:underline"
            >
              Mot de passe oublié?
            </Link>
          </div>

          <CardFooter className="flex justify-end pt-6 px-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </CardFooter>
        </Form>
        <SocialAuthButtons
          invitationToken={invitationToken}
          tontineId={tontineId}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-sm text-center w-full">
          Pas encore de compte?{" "}
          <Link
            href={
              invitationToken
                ? `/auth/signup?token=${invitationToken}&tontineId=${tontineId || ""}`
                : "/auth/signup"
            }
            className="text-primary hover:underline"
          >
            Créer un compte
          </Link>
        </div>
        <div className="text-xs text-center text-muted-foreground w-full">
          <Link href="/auth/resend-verification" className="hover:underline">
            Renvoyer l'email de vérification
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
