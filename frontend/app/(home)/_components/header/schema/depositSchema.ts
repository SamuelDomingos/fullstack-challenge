import * as z from "zod"

export const depositSchema = z.object({
  amountInCents: z.coerce
    .string()
    .min(0n, { message: "O valor mínimo para depósito é R$ 0,01" })
    .max(100000n, { message: "O valor excede o limite permitido" }),
})

export type DepositFormValues = z.infer<typeof depositSchema>