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
import {
  AllocationMethod,
  TontineFrequency,
  TontineType,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Create a client
// const queryClient = new QueryClient();

// export function CreateTontineForm() {
//   return (
//     // <QueryClientProvider client={queryClient}>
//     <TontineFormContent />
//     // </QueryClientProvider>
//   );
// }

// function TontineFormContent() {
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const form = useZodForm({
//     schema: CreateTontineSchema,
//     defaultValues: {
//       name: "",
//       description: "",
//       type: "ROTATIF",
//       frequency: "Mensuelle",
//       contribution: "",
//       startDate: "",
//       endDate: "",
//       maxMembers: "",
//       penaltyFee: "5.0",
//       allocationMethod: "FIXED",
//       rules: "",
//     },
//   });

//   // const mutation = useMutation({
//   //   mutationFn: async (data: CreateTontineInput) => {
//   //     const result = await createTontine(data);
//   //     if (!result) {
//   //       throw new Error("Résultat de l'action non disponible");
//   //     }

//   //     if (result.error) {
//   //       throw new Error(result.error);
//   //     }

//   //     if (!result.success) {
//   //       throw new Error(
//   //         result.error || "Erreur lors de la création de la tontine",
//   //       );
//   //     }

//   //     return result.tontineId;
//   //   },
//   //   onError: (error) => {
//   //     console.error(error);
//   //     toast.error("Une erreur est survenue lors de la création de la tontine");
//   //     setIsLoading(false);
//   //   },
//   //   onSuccess: (tontineId) => {
//   //     toast.success("Tontine créée avec succès !");
//   //     router.push(`/tontines/${tontineId}`);
//   //     setIsLoading(false);
//   //   },
//   // });

//   const onSubmit = async (data: z.infer<typeof CreateTontineSchema>) => {
//     setIsLoading(true);
//     // mutation.mutate(data);
//     toast.info("Création de la tontine en cours...");
//     console.log("Form data:", data);
//     try {
//       const result = await createTontine(data);
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//       toast.error("Une erreur est survenue lors de la création de la tontine");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-3xl">
//       <CardHeader>
//         <CardTitle className="text-center">
//           Créer une nouvelle tontine
//         </CardTitle>
//         <CardDescription className="text-center">
//           Configurez les paramètres de votre tontine ci-dessous
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
//           <div className="space-y-6">
//             {/* Informations générales */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Informations générales</h3>

//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nom de la tontine</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Ma tontine" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Une description de cette tontine"
//                         className="min-h-[100px]"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Paramètres de la tontine */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Paramètres de la tontine</h3>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Type de tontine</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Sélectionner un type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="ROTATIF">Rotatif</SelectItem>
//                             <SelectItem value="INVESTISSEMENT">
//                               Investissement
//                             </SelectItem>
//                             <SelectItem value="PROJET">Projet</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="frequency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Fréquence</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Sélectionner une fréquence" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Hebdomadaire">
//                               Hebdomadaire
//                             </SelectItem>
//                             <SelectItem value="Bi-mensuelle">
//                               Bi-mensuelle
//                             </SelectItem>
//                             <SelectItem value="Mensuelle">Mensuelle</SelectItem>
//                             <SelectItem value="Trimestrielle">
//                               Trimestrielle
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="contribution"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Montant de la contribution</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           placeholder="0.00"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="maxMembers"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Nombre maximum de membres</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="2"
//                           placeholder="10"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="startDate"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Date de début</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="date"
//                           {...field}
//                           value={
//                             field.value instanceof Date
//                               ? field.value.toISOString().split("T")[0]
//                               : field.value
//                           }
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="penaltyFee"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Frais de pénalité (%)</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="0"
//                           step="0.1"
//                           placeholder="5.0"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="allocationMethod"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Méthode d'allocation</FormLabel>
//                       <FormControl>
//                         <Select
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Sélectionner une méthode" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="FIXED">Fixe</SelectItem>
//                             <SelectItem value="VOTE">Vote</SelectItem>
//                             <SelectItem value="RANDOM">Aléatoire</SelectItem>
//                             <SelectItem value="ENCHERE">Enchère</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Règles additionnelles */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">
//                 Règles additionnelles (optionnel)
//               </h3>

//               <FormField
//                 control={form.control}
//                 name="rules"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Règles spécifiques pour cette tontine..."
//                         className="min-h-[100px]"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <CardFooter className="flex justify-end pt-6 px-0">
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="hover:cursor-pointer"
//               >
//                 {isLoading ? (
//                   <>
//                     <ButtonLoading className="mr-2" />
//                     Création en cours...
//                   </>
//                 ) : (
//                   "Créer la tontine"
//                 )}
//               </Button>
//             </CardFooter>
//           </div>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

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
    // console.log("Form data:", data);

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
    console.log(result);
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
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
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
