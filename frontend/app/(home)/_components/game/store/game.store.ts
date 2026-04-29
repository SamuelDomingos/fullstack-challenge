import { Bet } from "@/app/(home)/_types/Game"
import { create } from "zustand"

type GameState = {
  multiplier: number
  bettingTimer: number
  gameCrashed: number | null
  isConnected: boolean
  bets: Bet[]
  roundId: string

  status: "BETTING" | "RUNNING" | "CRASHED"

  setMultiplier: (v: number) => void
  setBettingTimer: (v: number) => void
  setGameCrashed: (v: number | null) => void
  setConnected: (v: boolean) => void
  setBets: (v: Bet[]) => void
  setRoundId: (v: string) => void
  setStatus: (v: "BETTING" | "RUNNING" | "CRASHED") => void
}

export const useGameStore = create<GameState>((set, get) => ({
  isConnected: false,
  multiplier: 1.0,
  bettingTimer: 50,
  gameCrashed: null,
  bets: [],
  roundId: "",
  status: "BETTING",

  setConnected: (v) => set({ isConnected: v }),
  setMultiplier: (v) => set({ multiplier: v }),
  setBettingTimer: (v) => {
    set({ bettingTimer: v })
    if (v > 0) set({ status: "BETTING" })
  },
  setGameCrashed: (v) => set({ gameCrashed: v }),
  setBets: (v) => set({ bets: v }),
  setRoundId: (v) => set({ roundId: v }),
  setStatus: (v) => set({ status: v }),
}))