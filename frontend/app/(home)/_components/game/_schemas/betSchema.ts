import { z } from "zod"

 export const betSchema = z.object({
    amount: z.number()
      .min(100, "A aposta mínima é de R$ 1,00") // 100 centavos
      .max(100000, "A aposta máxima é de R$ 1.000,00"), // 100.000 centavos
    multiplier: z.number().min(1),
  });

export type BetFormData = z.infer<typeof betSchema>