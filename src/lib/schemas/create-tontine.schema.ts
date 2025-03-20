import {
  AllocationMethod,
  TontineFrequency,
  TontineType,
} from "@prisma/client";
import { z } from "zod";

export const CreateTontineSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  type: z.nativeEnum(TontineType, {
    errorMap: () => ({ message: "Type de tontine invalide" }),
  }),
  frequency: z.nativeEnum(TontineFrequency, {
    errorMap: () => ({ message: "Fréquence invalide" }),
  }),
  contributionPerMember: z.string().refine(
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

  maxMembers: z.string().refine(
    async (val) => {
      try {
        const num = parseInt(val);
        return !isNaN(num) && num > 1;
      } catch {
        return false;
      }
    },
    {
      message: "Le nombre maximum de membres doit être un nombre supérieur à 1",
    },
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
  allocationMethod: z.nativeEnum(AllocationMethod),
  rules: z.string().optional(),
});
