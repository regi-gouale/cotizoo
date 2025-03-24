import { z } from "zod";

export const UpdateBeneficiaryOrderSchema = z
  .object({
    tontineId: z.string(),
    beneficiaryOrder: z.array(z.string()),
  })
  .strict();
