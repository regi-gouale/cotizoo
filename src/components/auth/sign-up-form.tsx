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

const SignUpSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type SignUpFormProps = {
  invitationToken?: string;
  tontineId?: string;
};

export function SignUpForm({ invitationToken, tontineId }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: SignUpSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);

    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          // Rediriger vers la page d'invitation si un token est fourni, sinon vers le dashboard
          callbackURL: invitationToken
            ? `/auth/accept-invitation?token=${invitationToken}&tontineId=${tontineId || ""}`
            : "/dashboard",
        },
        {
          onRequest: () => {
            // Déjà géré par setIsLoading
          },
          onSuccess: () => {
            toast.success(
              "Inscription réussie! Veuillez vérifier votre email pour activer votre compte.",
            );
            form.reset();
            // Rediriger vers la page d'attente de vérification
            router.push(`/auth/verify-email`);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Créer un compte</CardTitle>
        <CardDescription>
          {invitationToken
            ? "Inscrivez-vous pour accepter l'invitation à la tontine"
            : "Inscrivez-vous pour accéder à votre tableau de bord"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <div className="mt-2 text-sm text-muted-foreground">
            En vous inscrivant, vous recevrez un email de vérification pour
            activer votre compte.
          </div>
          <CardFooter className="flex justify-end pt-6 px-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
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
          Vous avez déjà un compte?{" "}
          <Link
            href={
              invitationToken
                ? `/auth/signin?token=${invitationToken}&tontineId=${tontineId || ""}`
                : "/auth/signin"
            }
            className="text-primary hover:underline"
          >
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
