"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";

const CtaSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
});

export function CtaSection() {
  const form = useZodForm({
    schema: CtaSchema,
    defaultValues: {
      firstName: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CtaSchema>) => {
    try {
      // TODO: Implémenter l'appel API pour l'inscription
      console.log("Form data:", data);
      toast.success("Votre inscription a bien été prise en compte !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
      console.error(error);
    }
  };

  return (
    <section className="w-full px-4 my-12" id="cta">
      <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center">
        <Card className="border-2 border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-sm bg-card/90 max-w-md">
          <CardContent className="pt-6">
            <Form form={form} onSubmit={async (data) => onSubmit(data)}>
              <div className="space-y-4">
                <div className="gap-y-2 text-left">
                  <h3 className="font-semibold font-title">
                    🚀 Lancement imminent !
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Laissez-nous vos informations pour rejoindre la révolution
                    des tontines numériques
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
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

                  <Button type="submit" className="w-full">
                    Je m'inscris
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  🔒 Vos informations sont en sécurité. Nous ne les partagerons
                  jamais.
                </p>

                <div className="mt-2 py-2 px-3 bg-primary/10 rounded-md text-sm">
                  <p className="font-medium text-primary">
                    🎁 En bonus : Les 100 premiers inscrits recevront un guide
                    gratuit sur les meilleures pratiques pour gérer vos tontines
                    efficacement.
                  </p>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
