import { GameContainer } from "./_components/game"
import { Header } from "./_components/header"
import { LeaderboardTable } from "./_components/LeaderboardTable"
import { gameService } from "./_services/game.service"
import { walletService } from "./_services/wallet.service"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options"

export default async function Page() {
  const session = await getServerSession(authOptions)
  const token = session?.user?.accessToken

  const [balance, history, leaderboard] = await Promise.all([
    token
      ? walletService.getBalance(token).catch(() => ({ balance: "0" }))
      : Promise.resolve({ balance: 0 }),
    gameService.getRoundHistory().catch(() => []),
    gameService.getLeaderboard().catch(() => []),
  ])
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header balance={balance.balance} />
      <main className="container mx-auto grid w-full grid-cols-1 items-start gap-6 p-4 lg:grid-cols-4">
        <div className="flex w-max flex-col gap-4 text-center lg:col-span-2">
          <GameContainer history={history} />
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <h3 className="relative z-10 bg-background px-4 text-xl font-bold tracking-widest text-muted-foreground uppercase">
              Top jogadores
            </h3>
          </div>
          <LeaderboardTable leaderboard={leaderboard} />
        </div>
      </main>
    </div>
  )
}
