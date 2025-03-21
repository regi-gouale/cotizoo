import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
