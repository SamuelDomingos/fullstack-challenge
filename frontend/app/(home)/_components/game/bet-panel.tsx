import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { Compass, X } from "lucide-react"
import useFormPanel from "./_hooks/useFormPanel"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useGameStore } from "./_store/game.store"
import { NumericFormat } from "react-number-format"
import { useMemo } from "react"

const APOSTA_BUTTONS = ["1/2", "2x", "Max"]
const MULTIPLICADOR_BUTTONS = ["1/2", "2x", "10x"]

export function BetPanel() {
  const status = useGameStore((s) => s.status)

  const isButtonDisabled = useMemo(() => {
    return status !== "BETTING"
  }, [status])

  const buttonText = useMemo(() => {
    return status === "BETTING" ? "Apostar" : "Apostas Encerradas"
  }, [status])

  const { form, onSubmit } = useFormPanel()
  const currentBet = form.watch("amount")
  const currentMultiplier = form.watch("multiplier")
  const potentialWin = useMemo(() => {
    return (currentBet * currentMultiplier) / 100
  }, [currentBet, currentMultiplier])

  return (
    <Card className="rounded-4xl border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Compass className="size-5 fill-primary text-accent" />
          Manual
        </CardTitle>
        <Separator className="mt-2" />
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Aposta</FieldLabel>

                  <div className="flex items-center rounded-full border border-border bg-muted px-3 py-1">
                    <span className="text-xs text-muted-foreground">R$</span>
                    <Separator orientation="vertical" className="mx-2" />

                    <NumericFormat
                      id={field.name}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix=""
                      decimalScale={2}
                      fixedDecimalScale
                      value={field.value ? field.value / 100 : ""}
                      onValueChange={(values) => {
                        const floatValue = values.floatValue

                        if (floatValue === undefined) {
                          field.onChange(0)
                        } else {
                          field.onChange(Math.round(floatValue * 100))
                        }
                      }}
                      aria-invalid={fieldState.invalid}
                      className="border-none bg-transparent! p-0 text-sm font-bold text-primary focus-visible:ring-0"
                    />

                    <div className="ml-auto flex gap-1">
                      {APOSTA_BUTTONS.map((button) => (
                        <Button
                          key={button}
                          type="button"
                          size="sm"
                          className="rounded-xl px-2 py-1 text-xs"
                          onClick={() => {
                            const value = form.getValues("amount") || 0
                            const MAX_BET = 1000
                            if (button === "1/2") {
                              form.setValue("amount", Math.max(0, value / 2))
                            }

                            if (button === "2x") {
                              form.setValue(
                                "amount",
                                Math.min(MAX_BET, value * 2)
                              )
                            }

                            if (button === "Max") {
                              form.setValue("amount", MAX_BET)
                            }
                          }}
                        >
                          {button}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              name="multiplier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Multiplicador</FieldLabel>

                  <div className="flex items-center rounded-full border border-border bg-muted px-3 py-1">
                    <span className="text-xs text-muted-foreground">×</span>

                    <Separator orientation="vertical" className="mx-2" />

                    <Input
                      id={field.name}
                      value={field.value ?? 1}
                      onChange={(e) => {
                        const value = Number(e.target.value)

                        field.onChange(Number.isFinite(value) ? value : 1)
                      }}
                      aria-invalid={fieldState.invalid}
                      className="border-none bg-transparent! p-0 text-sm font-bold text-primary focus-visible:ring-0"
                    />

                    <div className="ml-auto flex gap-1">
                      {MULTIPLICADOR_BUTTONS.map((button) => (
                        <Button
                          key={button}
                          type="button"
                          size="sm"
                          className="rounded-xl px-2 py-1 text-xs"
                          onClick={() => {
                            const value = form.getValues("multiplier") || 1

                            const MAX_MULTIPLIER = 10

                            if (button === "1/2") {
                              form.setValue(
                                "multiplier",
                                Math.max(0, value / 2)
                              )
                            }

                            if (button === "2x") {
                              form.setValue(
                                "multiplier",
                                Math.min(MAX_MULTIPLIER, value * 2)
                              )
                            }

                            if (button === "Max") {
                              form.setValue("multiplier", MAX_MULTIPLIER)
                            }
                          }}
                        >
                          {button}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
            <span>Ganho Potencial:</span>
            <span className="text-sm font-bold text-primary">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(potentialWin)}
            </span>
          </div>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={`mt-2 h-12 w-full rounded-full text-lg font-bold ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {buttonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
