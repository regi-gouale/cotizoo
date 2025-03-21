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
import { Textarea } from "@/components/ui/textarea";
import { addCommentAction } from "@/lib/actions/ticket.action";
import { CommentFormSchema } from "@/types/ticket";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export function AddCommentForm(props: { ticketId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useZodForm({
    schema: CommentFormSchema,
    defaultValues: {
      content: "",
    },
  });

  // const mutation = useMutation({
  //   mutationFn: async (data: z.infer<typeof CommentFormSchema>) => {
  //     const result = await addCommentAction({
  //       ticketId: props.ticketId,
  //       content: data.content,
  //     });
  //     if (!result) throw new Error("Échec de l'ajout du commentaire");
  //     return resolveActionResult(Promise.resolve(result));
  //   },
  //   onError: (error) => toast.error(error.message),
  //   onSuccess: () => {
  //     toast.success("Commentaire ajouté");
  //     form.reset();
  //   },
  // });

  const onSubmit = async (data: z.infer<typeof CommentFormSchema>) => {
    // mutation.mutate(data);
    setIsLoading(true);
    const result = await addCommentAction({
      ticketId: props.ticketId,
      content: data.content,
    });
    setIsLoading(false);
    if (!result) {
      toast.error("Échec de l'ajout du commentaire");
    } else {
      toast.success("Commentaire ajouté");
      form.reset();
      router.refresh();
    }
  };

  return (
    <Form form={form} onSubmit={async (data) => onSubmit(data)}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ajouter un commentaire ou des informations supplémentaires..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
