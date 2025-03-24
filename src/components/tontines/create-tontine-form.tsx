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
import { createTontine } from "@/lib/actions/create-tontine.action";
import { CreateTontineSchema } from "@/lib/schemas/create-tontine.schema";
import { cn } from "@/lib/utils";
import {
  AllocationMethod,
  TontineFrequency,
  TontineType,
} from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const tontineTypes = [
  { label: "Rotatif", value: TontineType.ROTATIF },
  { label: "Investissement", value: TontineType.INVESTISSEMENT },
  { label: "Projet", value: TontineType.PROJET },
];

const tontineFrequencies = [
  { label: "Hebdomadaire", value: TontineFrequency.WEEKLY },
  { label: "Bi-mensuelle", value: TontineFrequency.BIWEEKLY },
  { label: "Mensuelle", value: TontineFrequency.MONTHLY },
  { label: "Trimestrielle", value: TontineFrequency.QUARTERLY },
  { label: "Semestrielle", value: TontineFrequency.SEMIANNUAL },
  { label: "Annuelle", value: TontineFrequency.YEARLY },
];
const allocationMethods = [
  { label: "Fixe", value: AllocationMethod.FIXED },
  { label: "Vote", value: AllocationMethod.VOTE },
  { label: "Aléatoire", value: AllocationMethod.RANDOM },
  { label: "Enchère", value: AllocationMethod.ENCHERE },
];

export function CreateTontineForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: CreateTontineSchema,
    defaultValues: {
      name: "",
      description: "",
      type: TontineType.ROTATIF,
      frequency: TontineFrequency.MONTHLY,
      contributionPerMember: "0",
      startDate: new Date(),
      endDate: new Date(),
      maxMembers: "2",
      penaltyFee: "5.0",
      allocationMethod: AllocationMethod.FIXED,
      rules: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateTontineSchema>) => {
    setIsLoading(true);
    toast.info("Création de la tontine en cours...");

    const result = await createTontine(data);
    if (!result) {
      toast.error("Une erreur est survenue lors de la création de la tontine");
      setIsLoading(false);
      return;
    }
    if (!result.success) {
      toast.error(result.error || "Erreur lors de la création de la tontine");
      setIsLoading(false);
      return;
    }

    toast.success("Tontine créée avec succès !");
    router.push(`/dashboard/tontines/${result.tontineId}`);
    setIsLoading(false);
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
                            {tontineTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
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
                            {tontineFrequencies.map((frequency) => (
                              <SelectItem
                                key={frequency.value}
                                value={frequency.value}
                              >
                                {frequency.label}
                              </SelectItem>
                            ))}
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
                  name="contributionPerMember"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contribution par personne</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="50.00"
                          placeholder="50.00 €"
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

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value instanceof Date
                                ? field.value
                                : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date("2100-01-01")
                            }
                            locale={fr}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", {
                                  locale: fr,
                                })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value instanceof Date
                                ? field.value
                                : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) =>
                              // Date should be after start date + 1 month
                              date <=
                                (form.getValues("startDate") instanceof Date
                                  ? new Date(
                                      new Date(
                                        form.getValues("startDate"),
                                      ).setMonth(
                                        new Date(
                                          form.getValues("startDate"),
                                        ).getMonth() + 1,
                                      ),
                                    )
                                  : new Date()) || date > new Date("2100-01-01")
                            }
                            locale={fr}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                      <FormLabel>Pénalité de retard (%)</FormLabel>
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
                            {allocationMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.label}
                              </SelectItem>
                            ))}
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
              <Button
                type="submit"
                disabled={isLoading}
                className="hover:cursor-pointer"
              >
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
