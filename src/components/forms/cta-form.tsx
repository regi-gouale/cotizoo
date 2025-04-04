"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";
import { saveLead } from "@/lib/actions/lead.action";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const CtaSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
});

type CtaFormProps = {
  className?: string;
  onSuccess?: () => void;
};

export function CtaForm(props: CtaFormProps) {
  const { className, onSuccess } = props;
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({
    schema: CtaSchema,
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CtaSchema>) => {
    setIsLoading(true);
    try {
      const result = await saveLead(data);

      if (result.success) {
        if (result.isExisting) {
          toast.info(result.message);
        } else {
          toast.success(result.message);
        }

        // Nettoyer le formulaire après soumission réussie
        form.reset({
          firstName: "",
          email: "",
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onSubmit={async (data) => onSubmit(data)}>
      <div className={cn("space-y-4", className)}>
        <div className="gap-y-4 text-left">
          <h3 className="font-semibold font-title text-xl text-center mb-4">
            🚀 Lancement imminent !
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Laissez-nous vos informations pour rejoindre la révolution des
            tontines numériques
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
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
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre.email@exemple.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <ButtonLoading className="mr-2" />
                Envoi en cours...
              </>
            ) : (
              "Commencer maintenant"
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          🔒 Vos informations sont en sécurité. Nous ne les partagerons jamais.
        </p>

        <div className="mt-2 py-2 px-3 bg-primary/10 rounded-md text-sm">
          <p className="font-medium text-primary">
            🎁 En bonus : Les 100 premiers inscrits recevront un guide gratuit
            sur les meilleures pratiques pour gérer vos tontines efficacement.
          </p>
        </div>
      </div>
    </Form>
  );
}
