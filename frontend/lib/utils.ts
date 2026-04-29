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
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) / 100)
}