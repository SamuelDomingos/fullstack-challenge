import { apiFetch } from "@/lib/api"
import { LeaderboardItem, RoundHistoryItem } from "../_types/Game"

export const gameService = {
  async getRoundHistory(): Promise<RoundHistoryItem[]> {
    return apiFetch<RoundHistoryItem[]>("/games/rounds/history")
  },

  async getLeaderboard(): Promise<LeaderboardItem[]> {
    return apiFetch<LeaderboardItem[]>("/games/leaderboard")
  },

  async createBet(token: string, data: { amount: number; multiplier: number }) {
    return apiFetch("/games/bet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    })
  },
}
