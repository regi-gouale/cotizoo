// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   useZodForm,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { TicketFormSchema } from "@/types/ticket";
// import { useRouter } from "next/navigation";
// import { z } from "zod";

// export function NewTicketForm(props: { onSuccess: () => void }) {
//   const router = useRouter();

//   const form = useZodForm({
//     schema: TicketFormSchema,
//     defaultValues: {
//       title: "",
//       description: "",
//     },
//   });

//   // const mutation = useMutation({
//   //   mutationFn: async (data: z.infer<typeof TicketFormSchema>) => {
//   //     const result = await createTicketAction(data);
//   //     if (!result) throw new Error("Échec de la création du ticket");
//   //     return resolveActionResult(Promise.resolve(result));
//   //   },
//   //   onError: (error) => toast.error(error.message),
//   //   onSuccess: (result) => {
//   //     toast.success("Ticket créé avec succès");
//   //     props.onSuccess();
//   //     router.push(`/tickets/${result.id}`);
//   //   },
//   // });

//   const onSubmit = async (data: z.infer<typeof TicketFormSchema>) => {
//     // mutation.mutate(data);
//   };

//   return (
//     <Form form={form} onSubmit={async (data) => onSubmit(data)}>
//       <div className="space-y-4">
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Titre</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="Résumé de votre demande" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea
//                   {...field}
//                   placeholder="Décrivez votre problème ou votre demande en détail"
//                   className="min-h-[120px]"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             // disabled={mutation.isPending}
//           >
//             {/* {mutation.isPending ? "Création..." : "Créer le ticket"} */}
//             Créer le ticket
//           </Button>
//         </div>
//       </div>
//     </Form>
//   );
// }

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
import { ButtonLoading } from "@/components/ui/loading";
import { createTicketAction } from "@/lib/actions/ticket.action";
import { TicketFormSchema } from "@/types/ticket";
import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function NewTicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketReference, setTicketReference] = useState<string | null>(null);

  const form = useZodForm({
    schema: TicketFormSchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof TicketFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await createTicketAction(data);

      if (result) {
        toast.success("Votre message a bien été envoyé");
        setIsSuccess(true);
        form.reset();

        if (result.data?.id) {
          setTicketId(result.data.id);
          setTicketReference(result.data.id.substring(0, 8));
        }
      } else {
        toast.error("Une erreur est survenue lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  const copyTicketReference = () => {
    if (ticketReference) {
      navigator.clipboard.writeText(ticketReference);
      toast.success("Référence copiée dans le presse-papier");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-primary/10 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="mb-4">
          Merci de nous avoir contacté. Notre équipe vous répondra dans les plus
          brefs délais.
        </p>

        {ticketReference && (
          <div className="mb-6 mt-4 p-4 bg-background rounded-lg border border-border">
            <h4 className="font-medium text-lg mb-1">
              Référence de votre ticket
            </h4>
            <div className="flex items-center justify-center gap-2 mt-2">
              <code className="bg-muted px-3 py-1 rounded text-lg font-mono">
                #{ticketReference}
              </code>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={copyTicketReference}
                title="Copier la référence"
              >
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Conservez cette référence pour suivre votre demande
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setIsSuccess(false)}>
            Envoyer un autre message
          </Button>

          {ticketId && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/tickets/${ticketId}`}>
                Suivre mon ticket
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Sujet</FormLabel>
                <FormControl>
                  <Input placeholder="Votre sujet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Décrivez votre problème ou votre demande"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <ButtonLoading className="mr-2" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer le message"
          )}
        </Button>
      </div>
    </Form>
  );
}
