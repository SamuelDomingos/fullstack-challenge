"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Eye } from "lucide-react"
import { useGameStore } from "./store/game.store"

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export function BetList() {
  const { bets } = useGameStore();
  
  const totalAmount = bets.reduce((acc, bet) => acc + (bet.amount || 0), 0);

  return (
    <Card className="rounded-4xl border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-5 fill-primary text-accent" />
            Jogadores
          </CardTitle>
          <div className="flex items-center -space-x-2 hover:space-x-1">
            <span className="mr-1">{bets.length}</span>
            {bets.slice(0, 3).map((bet, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Avatar
                    size="sm"
                    className="ring-background transition-all duration-300 ease-in-out"
                  >
                    <AvatarImage src={bet.user} alt={bet.user} />
                    <AvatarFallback className="text-xs">
                      {bet.user?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{bet.user}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        <Separator className="mt-2" />
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs tracking-wider text-muted-foreground uppercase">
            Total Bet
          </span>
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5">
            <span className="text-lg font-medium tracking-wider text-muted-foreground uppercase">
              R$
            </span>
            <Separator orientation="vertical" />
            <span className="text-sm font-bold text-primary">
              {formatMoney(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
