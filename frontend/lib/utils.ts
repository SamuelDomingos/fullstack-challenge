import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCurrency(value: string): bigint {
  if (!value) return 0n

  const cleanValue = value.replace(/\D/g, "")
  return BigInt(cleanValue)
}

export function numberToCurrency(value: bigint | string): string {
  const numericValue = Number(value)
  const isCents =
    typeof value === "bigint" ||
    (typeof value === "string" && !value.includes("."))
  const finalValue = isCents ? numericValue / 100 : numericValue

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finalValue)
}
