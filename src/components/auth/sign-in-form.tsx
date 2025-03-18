"use client";

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
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

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
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            // Déjà géré par setIsLoading
          },
          onSuccess: () => {
            toast.success("Connexion réussie!");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Identifiants incorrects");
          },
        },
      );
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Se connecter</CardTitle>
        <CardDescription>
          Connectez-vous pour accéder à votre tableau de bord
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
              href="/auth/reset-password"
              className="text-primary hover:underline"
            >
              Mot de passe oublié?
            </Link>
          </div>

          <CardFooter className="flex justify-end pt-6 px-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-sm text-center w-full">
          Pas encore de compte?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Créer un compte
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
