import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCurrency(value: string): number {
  if (!value) return 0

  const cleanValue = value.replace(/\D/g, "")

  return Number(cleanValue)
}

export function numberToCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value/ 200)
}
