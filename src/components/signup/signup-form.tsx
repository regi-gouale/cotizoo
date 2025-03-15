"use client";

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";

const SignupSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
});

type SignupFormProps = {
  onSuccess?: () => void;
};

export function SignupForm(props: SignupFormProps) {
  const { onSuccess } = props;

  const form = useForm<z.infer<typeof SignupSchema>>({
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      // TODO: Implémenter l'appel API pour l'inscription
      console.log("Form data:", data);

      toast.success("Votre inscription a bien été prise en compte !");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
      console.error(error);
    }
  };

  return (
    <Form form={form} onSubmit={async (data) => onSubmit(data)}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
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
              <FormLabel>Email</FormLabel>
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

        <Button type="submit" className="w-full">
          Je m'inscris
        </Button>
      </div>
    </Form>
  );
}
