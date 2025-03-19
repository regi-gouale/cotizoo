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
import { sendVerificationEmail } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const ResendVerificationSchema = z.object({
  email: z.string().email("Email invalide"),
});

export function ResendVerificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useZodForm({
    schema: ResendVerificationSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResendVerificationSchema>) => {
    setIsLoading(true);

    try {
      const result = await sendVerificationEmail(data.email);

      if (!result.error) {
        setIsSubmitted(true);
        toast.success("Lien de vérification envoyé");
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
            pour vérifier votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Vérifiez votre boîte de réception et suivez les instructions dans
            l'email. Si vous ne trouvez pas l'email, vérifiez votre dossier de
            spam.
          </p>
          <p className="text-sm text-muted-foreground">
            Le lien expirera dans 24 heures.
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
        <CardTitle className="text-center">Vérification d'email</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de vérification
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
                      placeholder="exemple@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <CardFooter className="flex justify-end pt-6 px-0">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien"
              )}
            </Button>
          </CardFooter>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-sm text-center w-full">
          <Link href="/auth/signin" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
