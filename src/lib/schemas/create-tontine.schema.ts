import { z } from "zod";

export const CreateTontineSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  type: z.enum(["ROTATIF", "INVESTISSEMENT", "PROJET"], {
    invalid_type_error: "Type de tontine invalide",
  }),
  frequency: z.string().min(1, "La fréquence est requise"),
  contribution: z.string().refine(
    async (val) => {
      try {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      } catch {
        return false;
      }
    },
    { message: "La contribution doit être un nombre positif" },
  ),
  startDate: z.date().or(
    z.string().refine(async (val) => !isNaN(Date.parse(val)), {
      message: "La date de début est requise",
    }),
  ),
  endDate: z.date().or(
    z.string().refine(async (val) => !isNaN(Date.parse(val)), {
      message: "La date de fin est requise",
    }),
  ),
  maxMembers: z
    .string()
    .or(z.number())
    .refine(
      async (val) => {
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        return !isNaN(num) && num > 1;
      },
      { message: "Le nombre de membres doit être supérieur à 1" },
    ),
  penaltyFee: z
    .string()
    .optional()
    .refine(
      async (val) => {
        if (!val) return true;
        try {
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0;
        } catch {
          return false;
        }
      },
      { message: "Les frais de pénalité doivent être un nombre positif" },
    ),
  allocationMethod: z
    .enum(["FIXED", "VOTE", "RANDOM", "ENCHERE"], {
      invalid_type_error: "Méthode d'allocation invalide",
    })
    .default("FIXED"),
  rules: z.string().optional(),
});
