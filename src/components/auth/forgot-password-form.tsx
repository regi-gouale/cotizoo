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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { forgotPassword } from "@/lib/auth-client";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useZodForm({
    schema: ForgotPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setIsLoading(true);

    try {
      const result = await forgotPassword(data.email);

      if (!result.error) {
        setIsSubmitted(true);
        toast.success("Instructions envoyées par e-mail");
      } else {
        toast.error(result.error.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email envoyé</CardTitle>
          <CardDescription>
            Si un compte existe avec cette adresse email, vous recevrez un lien
            pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Vérifiez votre boîte de réception et suivez les instructions dans
            l'email.
          </p>
          <p className="text-sm text-muted-foreground">
            Le lien expirera dans 1 heure.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/signin">
            <Button variant="outline">Retour à la connexion</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de réinitialisation
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
          </div>

          <CardFooter className="flex justify-between pt-6 px-0">
            <Link href="/auth/signin">
              <Button variant="ghost">Retour</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer les instructions"
              )}
            </Button>
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
}
