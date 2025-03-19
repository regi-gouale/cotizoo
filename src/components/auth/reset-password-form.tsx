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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordWithToken } from "@/lib/auth-client";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: ResetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    setIsLoading(true);

    try {
      const result = await resetPasswordWithToken(data.password, token);

      if (!result.error) {
        toast.success("Mot de passe réinitialisé avec succès");
        router.push("/auth/signin");
      } else {
        toast.error(result.error.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Nouveau mot de passe</CardTitle>
        <CardDescription>
          Veuillez choisir un nouveau mot de passe sécurisé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <CardFooter className="flex justify-center pt-6 px-0">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Réinitialisation en cours...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </CardFooter>
        </Form>
      </CardContent>
    </Card>
  );
}
