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
import { ButtonLoading } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { replyToTicket } from "@/lib/actions/tickets.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const TicketReplySchema = z.object({
  message: z
    .string()
    .min(5, "Votre message doit contenir au moins 5 caractères"),
});

type TicketReplyValues = z.infer<typeof TicketReplySchema>;

export function TicketResponseForm(props: { ticketId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useZodForm({
    schema: TicketReplySchema,
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: TicketReplyValues) => {
    setIsLoading(true);
    try {
      const result = await replyToTicket({
        ticketId: props.ticketId,
        message: data.message,
      });

      if (result.success) {
        toast.success("Votre réponse a été envoyée");
        form.reset();
        router.refresh();
      } else {
        toast.error(
          result.error ||
            "Une erreur est survenue lors de l'envoi de votre réponse",
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre réponse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onSubmit={async (values) => await onSubmit(values)}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Écrivez votre message ici..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <ButtonLoading className="mr-2" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma réponse"
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
