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
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/actions/contact.action";
import {
  ContactFormSchema,
  ContactFormValues,
} from "@/lib/schemas/contact.schema";
import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketReference, setTicketReference] = useState<string | null>(null);

  const form = useZodForm({
    schema: ContactFormSchema,
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    try {
      const result = await sendContactMessage(data);

      if (result.success) {
        toast.success("Votre message a bien été envoyé");
        setIsSuccess(true);
        form.reset();

        if (result.ticketId) {
          setTicketId(result.ticketId);
          setTicketReference(result.ticketId.substring(0, 8));
        }
      } else {
        if (result.ticketId) {
          setTicketId(result.ticketId);
          setTicketReference(result.ticketId.substring(0, 8));
          toast.info(
            "Votre demande a été enregistrée mais nous n'avons pas pu envoyer l'email de confirmation",
          );
          setIsSuccess(true);
        } else {
          toast.error(
            result.error ||
              "Une erreur est survenue lors de l'envoi du message",
          );
        }
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
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
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet</FormLabel>
              <FormControl>
                <Input placeholder="Sujet de votre message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Votre message..."
                  className="min-h-[150px]"
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
            "Envoyer le message"
          )}
        </Button>
      </div>
    </Form>
  );
}
