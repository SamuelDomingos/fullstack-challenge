
import { Bet } from "@/app/(home)/_types/Game"
import { create } from "zustand"

type GameState = {
  multiplier: number
  bettingTimer: number
  gameCrashed: number | null
  isConnected: boolean
  bets: Bet[]
  status: "BETTING" | "RUNNING" | "CRASHED"

  setMultiplier: (v: number) => void
  setBettingTimer: (v: number) => void
  setGameCrashed: (v: number | null) => void
  setConnected: (v: boolean) => void
  setBets: (v: Bet[]) => void
  setStatus: (v: "BETTING" | "RUNNING" | "CRASHED") => void
}

export const useGameStore = create<GameState>((set) => ({
  isConnected: false,
  multiplier: 1.00,
  bettingTimer: 50,
  gameCrashed: null,
  bets: [],
  status: "BETTING",

  setConnected: (v) => set({ isConnected: v }),
  setMultiplier: (v) => set({ multiplier: v }),
  setBettingTimer: (v) => set({ bettingTimer: v }),
  setGameCrashed: (v) => set({ gameCrashed: v }),
  setBets: (v) => set({ bets: v }),
  setStatus: (v) => set({ status: v }),
}))