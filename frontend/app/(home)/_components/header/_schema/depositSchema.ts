import * as z from "zod"

export const depositSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, { message: "O valor mínimo para depósito é R$ 0,01" })
    .max(1000000, { message: "O valor excede o limite permitido" }),
})

export type DepositFormValues = z.infer<typeof depositSchema>