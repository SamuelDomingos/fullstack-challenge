import { apiFetch } from "@/lib/api"
import { LeaderboardItem, RoundHistoryItem, Bet } from "../_types/Game"

export const gameService = {
  async getRoundHistory(): Promise<RoundHistoryItem[]> {
    return apiFetch<RoundHistoryItem[]>("/games/rounds/history")
  },

  async getLeaderboard(): Promise<LeaderboardItem[]> {
    return apiFetch<LeaderboardItem[]>("/games/leaderboard")
  },

  async createBet(
    token: string,
    data: { amount: string; multiplier?: number }
  ): Promise<{ message: string; data: Bet }> {
    return await apiFetch("/games/bet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: data.amount,
      }),
    })
  },

  async betCashout(
    token: string,
    roundId: string
  ): Promise<{ message: string; data: Bet }> {
    return await apiFetch("/games/bet/cashout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roundId }),
    })
  },
}
