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
import { updateTontine } from "@/lib/actions/update-tontine.action";
import { UpdateTontineSchema } from "@/lib/schemas/update-tontine.schema";
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

// Options pour les types de tontines
const tontineTypes = [
  { label: "Rotatif", value: TontineType.ROTATIF },
  { label: "Investissement", value: TontineType.INVESTISSEMENT },
  { label: "Projet", value: TontineType.PROJET },
];

// Options pour les fréquences
const tontineFrequencies = [
  { label: "Hebdomadaire", value: TontineFrequency.WEEKLY },
  { label: "Bi-mensuelle", value: TontineFrequency.BIWEEKLY },
  { label: "Mensuelle", value: TontineFrequency.MONTHLY },
  { label: "Trimestrielle", value: TontineFrequency.QUARTERLY },
  { label: "Semestrielle", value: TontineFrequency.SEMIANNUAL },
  { label: "Annuelle", value: TontineFrequency.YEARLY },
];

// Options pour les méthodes d'allocation
const allocationMethods = [
  { label: "Fixe", value: AllocationMethod.FIXED },
  { label: "Vote", value: AllocationMethod.VOTE },
  { label: "Aléatoire", value: AllocationMethod.RANDOM },
  { label: "Enchère", value: AllocationMethod.ENCHERE },
];

// Définir le type pour les propriétés du composant
type TontineSettingsFormProps = {
  tontine: {
    id: string;
    name: string;
    description: string;
    type: TontineType;
    frequency: TontineFrequency;
    contributionPerMember: number | null;
    maxMembers: number;
    startDate: Date;
    endDate: Date;
    penaltyFee: number | null;
    allocationMethod: AllocationMethod;
    rules: string | null;
  };
};

export function TontineSettingsForm({ tontine }: TontineSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialiser le formulaire avec les valeurs actuelles de la tontine
  const form = useZodForm({
    schema: UpdateTontineSchema,
    defaultValues: {
      name: tontine.name,
      description: tontine.description,
      type: tontine.type,
      frequency: tontine.frequency,
      contributionPerMember: tontine.contributionPerMember
        ? tontine.contributionPerMember.toString()
        : "0.0",
      startDate: tontine.startDate,
      endDate: tontine.endDate,
      maxMembers: tontine.maxMembers.toString(),
      penaltyFee: tontine.penaltyFee ? tontine.penaltyFee.toString() : "0.0",
      allocationMethod: tontine.allocationMethod,
      rules: tontine.rules || "",
    },
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = async (data: z.infer<typeof UpdateTontineSchema>) => {
    setIsLoading(true);
    toast.info("Mise à jour de la tontine en cours...");

    try {
      const result = await updateTontine(tontine.id, data);

      if (!result.success) {
        toast.error(
          result.error || "Erreur lors de la mise à jour de la tontine",
        );
        setIsLoading(false);
        return;
      }

      toast.success("La tontine a été mise à jour avec succès");
      router.refresh();
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la mise à jour de la tontine",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier la tontine</CardTitle>
        <CardDescription>
          Vous pouvez modifier les informations générales de votre tontine ici.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
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
                    Mise à jour en cours...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </CardFooter>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
