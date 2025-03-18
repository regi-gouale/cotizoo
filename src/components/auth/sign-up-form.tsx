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
import { ButtonLoading } from "@/components/ui/loading";
import { authClient } from "@/lib/auth-client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SocialAuthButtons } from "./social-auth-buttons";

const SignUpSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

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
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            // Déjà géré par setIsLoading
          },
          onSuccess: () => {
            toast.success(
              "Inscription réussie! Veuillez vérifier votre email.",
            );
            form.reset();
            // redirect("/dashboard");
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
        <CardTitle className="font-title text-center">
          Créer un compte
        </CardTitle>
        <CardDescription>
          Inscrivez-vous pour accéder à votre tableau de bord
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialAuthButtons />
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
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-sm text-center w-full">
          Vous avez déjà un compte?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
