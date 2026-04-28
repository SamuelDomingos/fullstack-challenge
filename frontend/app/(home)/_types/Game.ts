export interface RoundHistoryItem {
  id: string
  crashPoint: number
  status: string
}

export interface LeaderboardItem {
  name: string
  avatar: string
  amount: number
  payout: number
}

export interface Bet {
  id: string
  userId: string
  amount: number
  roundId: string
  multiplierAtCashout: number | null
  status: "PENDING" | "WON" | "LOST"
  createdAt: string
}

export interface Round {
  id: string
  status: "WAITING" | "RUNNING" | "FINISHED"
  currentMultiplier: number
  startTime?: string
  endTime?: string
}

export interface GameState {
  activeRound: Round | null
  userBets: Bet[]
}
