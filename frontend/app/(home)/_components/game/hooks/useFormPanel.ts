import { useForm } from "react-hook-form"
import { BetFormData, betSchema } from "../schemas/betSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { gameService } from "@/app/(home)/_services/game.service"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useGameStore } from "../store/game.store"
import { useEffect, useMemo, useState } from "react"

const useFormPanel = () => {
  const { data: session } = useSession()
  const [hasCashedOut, setHasCashedOut] = useState(false)

  const status = useGameStore((s) => s.status)
  const roundId = useGameStore((s) => s.roundId)

  console.log(status)

  const form = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      amount: 0n,
      multiplier: 1,
    },
  })

  const onSubmit = async (data: BetFormData) => {
    const token = session?.user?.accessToken
    if (!token) {
      toast.error("Erro de autenticação")
      return
    }

    try {
      if (status === "RUNNING") {
        await gameService.betCashout(token, roundId)
        toast.success("Cashout realizado com sucesso!")
        setHasCashedOut(true)
      } else {
        const response = await gameService.createBet(token, {
          amount: data.amount.toString(),
        })
        toast.success(response.message || "Aposta realizada com sucesso!")
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao apostar")
    }
  }

  const currentBet = form.watch("amount")
  const currentMultiplier = form.watch("multiplier")

  const potentialWin = useMemo(() => {
    return (Number(currentBet) * currentMultiplier) / 100
  }, [currentBet, currentMultiplier])

  const isButtonDisabled = status === "RUNNING" && hasCashedOut

  const buttonText = useMemo(() => {
    return status === "BETTING" ? "Apostar" : "Crashar"
  }, [status])

  useEffect(() => {
    if (status !== "RUNNING") {
      setHasCashedOut(false)
    }
  }, [status])

  return {
    form,
    onSubmit,
    potentialWin,
    isButtonDisabled,
    buttonText,
  }
}

export default useFormPanel
