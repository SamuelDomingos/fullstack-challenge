import { useForm } from "react-hook-form"
import { BetFormData, betSchema } from "../_schemas/betSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { gameService } from "@/app/(home)/_services/game.service"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { numberToCurrency } from "@/lib/utils"

const useFormPanel = () => {
  const { data: session } = useSession()

  const form = useForm<BetFormData>({
    resolver: zodResolver(betSchema),
    defaultValues: {
      amount: 0,
      multiplier: 1,
    },
  })

  const onSubmit = async (data: BetFormData) => {
    console.log(data);
    
    const token = session?.user?.accessToken
    if (!token) {
      toast.error("Erro de autenticação")
      return
    }

    try {
      const bet = await gameService.createBet(token, data)
      toast.success(`Aposta de ${numberToCurrency(bet.amount)}x${bet.multiplier} criada!`)
    } catch (error: any) {
      toast.error(error.message || "Erro ao apostar")
      console.error("Erro ao apostar", error)
    }
  }

  return {
    form,
    onSubmit,
  }
}

export default useFormPanel
