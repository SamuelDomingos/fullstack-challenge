"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Controller } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { useDepositForm } from "./_hooks/use-deposit-form"
import { numberToCurrency, parseCurrency } from "@/lib/utils"

export function HeaderActions() {
  const { form, handleDeposit } = useDepositForm()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="m-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary p-0 text-white hover:bg-primary/90"
        >
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106">
        <form onSubmit={form.handleSubmit(handleDeposit)}>
          <DialogHeader>
            <DialogTitle>Adicionar Fundos</DialogTitle>
            <DialogDescription>
              Insira o valor que deseja adicionar à sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Valor</FieldLabel>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      R$
                    </span>
                    
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder={numberToCurrency(0)}
                      autoComplete="off"
                      type="text"
                      value={field.value ? numberToCurrency(field.value) : ""}
                      onChange={(e) => {
                        const value = parseCurrency(e.target.value)
                        field.onChange(value)
                      }}
                      className="pl-10 font-mono"
                    />
                  </div>
                  <FieldDescription>
                    Insira o valor que deseja adicionar à sua conta.
                  </FieldDescription>

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Depositar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
