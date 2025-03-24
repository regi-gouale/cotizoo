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
import { inviteMember } from "@/lib/actions/invite-member.action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const InviteMemberSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
});

type InviteMemberFormProps = {
  className?: string;
  onSuccess?: () => void;
  tontineId: string;
};

export function InviteMemberForm(props: InviteMemberFormProps) {
  const { className, onSuccess } = props;
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({
    schema: InviteMemberSchema,
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof InviteMemberSchema>) => {
    setIsLoading(true);
    try {
      const result = await inviteMember({
        ...data,
        tontineId: props.tontineId,
      });

      if (!result) {
        toast.error("L'invitation n'a pas pu être envoyée");
      } else {
        toast.success("Invitation envoyée avec succès !");
        onSuccess?.();
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
            Inviter une personne à rejoindre la tontine
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            🎉 Invitez un ami à rejoindre votre tontine et commencez à profiter
            des avantages ensemble ! Remplissez le formulaire ci-dessous pour
            lui envoyer une invitation.
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
            Vous avez des questions ?{" "}
            <Link
              href="mailto:contact@tontine.com"
              className="text-primary underline"
            >
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
}
