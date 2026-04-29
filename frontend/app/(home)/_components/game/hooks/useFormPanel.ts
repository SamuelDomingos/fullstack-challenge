import { useForm } from "react-hook-form"
import { BetFormData, betSchema } from "../schemas/betSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { gameService } from "@/app/(home)/_services/game.service"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useGameStore } from "../store/game.store"
import { useEffect, useMemo, useState } from "react"
import { numberToCurrency } from "@/lib/utils"

const useFormPanel = () => {
  const { data: session } = useSession()
  const [hasCashedOut, setHasCashedOut] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const status = useGameStore((s) => s.status)
  const roundId = useGameStore((s) => s.roundId)

  const form = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      amount: 0n,
      multiplierAtCashout: 1,
    },
  })

  const currentBet = form.watch("amount")
  const currentMultiplier = form.watch("multiplierAtCashout")

  const potentialWin = useMemo(() => {
    return (Number(currentBet) * currentMultiplier) / 100
  }, [currentBet, currentMultiplier])

const resultCents = (currentBet * BigInt(Math.floor(currentMultiplier * 100))) / 100n;

  const onSubmit = async () => {
    const token = session?.user?.accessToken
    if (!token) {
      setShowAuthModal(true)
      return
    }

    try {
      if (status === "RUNNING") {
        const result = await gameService.betCashout(token, roundId)
        console.log(result)

        toast.success(`Saque de ${numberToCurrency(result.result)}!`)
        setHasCashedOut(true)
      } else {
        await gameService.createBet(token, {
          amount: resultCents.toString(),
        })
        toast.success(`Aposta de ${numberToCurrency(resultCents)} realizada com sucesso!`)
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao apostar")
    }
  }

  const isButtonDisabled = status === "RUNNING" && hasCashedOut

  const buttonText = useMemo(() => {
    return status === "BETTING" ? "Apostar" : "Sacar"
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
    showAuthModal,
    setShowAuthModal,
  }
}

export default useFormPanel
