"use client"

import { CrashGraph } from "./crash-graph"
import { BetPanel } from "./bet-panel"
import { BetList } from "./bet-list"
import { RoundHistory } from "../roundHistory"
import { RoundHistoryItem } from "../../_types/Game"
import { useGameWebSocket } from "./hooks/useGameWebSocket"

export function GameContainer({ history }: { history: RoundHistoryItem[] }) {
  useGameWebSocket()

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-[2fr_4fr_1.2fr]">
      <div className="flex h-full flex-col gap-4">
        <BetPanel />
        <div className="min-h-0 flex-1">
          <BetList />
        </div>
      </div>

      <div className="h-full">
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-muted/30">
          <CrashGraph history={history} />
        </div>
      </div>

      <div className="h-full min-h-0">
        <RoundHistory history={history} />
      </div>
    </div>
  )
}