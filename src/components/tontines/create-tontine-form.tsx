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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createTontine,
  CreateTontineInput,
} from "@/lib/actions/create-tontine.action";
import { CreateTontineSchema } from "@/lib/schemas/create-tontine.schema";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Create a client
const queryClient = new QueryClient();

export function CreateTontineForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <TontineFormContent />
    </QueryClientProvider>
  );
}

function TontineFormContent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: CreateTontineSchema,
    defaultValues: {
      name: "",
      description: "",
      type: "ROTATIF",
      frequency: "Mensuelle",
      contribution: "",
      startDate: "",
      endDate: "",
      maxMembers: "",
      penaltyFee: "5.0",
      allocationMethod: "FIXED",
      rules: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateTontineInput) => {
      const result = await createTontine(data);
      if (!result) {
        throw new Error("Résultat de l'action non disponible");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.success) {
        throw new Error(
          result.error || "Erreur lors de la création de la tontine",
        );
      }

      return result.tontineId;
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de la tontine");
      setIsLoading(false);
    },
    onSuccess: (tontineId) => {
      toast.success("Tontine créée avec succès !");
      router.push(`/tontines/${tontineId}`);
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateTontineSchema>) => {
    setIsLoading(true);
    mutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-center">
          Créer une nouvelle tontine
        </CardTitle>
        <CardDescription className="text-center">
          Configurez les paramètres de votre tontine ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la tontine</FormLabel>
                    <FormControl>
                      <Input placeholder="Ma tontine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Une description de cette tontine"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Paramètres de la tontine */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Paramètres de la tontine</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de tontine</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ROTATIF">Rotatif</SelectItem>
                            <SelectItem value="INVESTISSEMENT">
                              Investissement
                            </SelectItem>
                            <SelectItem value="PROJET">Projet</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fréquence</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une fréquence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hebdomadaire">
                              Hebdomadaire
                            </SelectItem>
                            <SelectItem value="Bi-mensuelle">
                              Bi-mensuelle
                            </SelectItem>
                            <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                            <SelectItem value="Trimestrielle">
                              Trimestrielle
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant de la contribution</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre maximum de membres</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="2"
                          placeholder="10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="penaltyFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frais de pénalité (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="5.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Méthode d'allocation</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FIXED">Fixe</SelectItem>
                            <SelectItem value="VOTE">Vote</SelectItem>
                            <SelectItem value="RANDOM">Aléatoire</SelectItem>
                            <SelectItem value="ENCHERE">Enchère</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Règles additionnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Règles additionnelles (optionnel)
              </h3>

              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Règles spécifiques pour cette tontine..."
                        className="min-h-[100px]"
                        {...field}
                      />
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
                    Création en cours...
                  </>
                ) : (
                  "Créer la tontine"
                )}
              </Button>
            </CardFooter>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
