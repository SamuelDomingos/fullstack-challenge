import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FuzzyText from "@/components/ui/fuzzy-text"
import { useGameStore } from "./store/game.store"
import { RoundHistoryItem } from "../../_types/Game"

export function CrashGraph({ history }: { history?: RoundHistoryItem[] }) {
  const multiplier = useGameStore((s) => s.multiplier)
  const bettingTimer = useGameStore((s) => s.bettingTimer)
  const gameCrashed = useGameStore((s) => s.gameCrashed)
  const status = useGameStore((s) => s.status)
  
  const graphData = useMemo(() => {
    const data = []

    for (let i = 0; i <= multiplier * 10; i++) {
      const time = i / 10
      const value = Math.exp(time / 3)

      data.push({
        time,
        value: Number(value.toFixed(2)),
      })
    }

    return data
  }, [multiplier])

  const multiplierClassName = useMemo(() => {
    const baseClass = "text-7xl font-black tracking-tighter tabular-nums transition-all duration-150 md:text-8xl"
    
    if (status === "CRASHED") {
      return `${baseClass} scale-110 text-destructive`
    }
    
    if (status === "RUNNING") {
      return `${baseClass} text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.4)]`
    }
    
    return `${baseClass} text-muted-foreground`
  }, [status])

  const statusClassName = useMemo(() => {
    const baseClass = "mt-2 text-xs font-bold tracking-widest uppercase"
    
    if (status === "CRASHED") {
      return `${baseClass} text-destructive`
    }
    
    return `${baseClass} text-muted-foreground`
  }, [status])

  const statusContent = useMemo(() => {
    if (status === "BETTING") {
      return (
        <span className="flex items-center justify-center gap-1">
          Inicia em{" "}
          <span className="text-sm text-primary">
            {bettingTimer}s
          </span>
        </span>
      )
    }

    if (status === "RUNNING") {
      return "Sobe o Multiplicador!"
    }

    if (status === "CRASHED") {
      return (
        <FuzzyText
          fontSize="0.875rem"
          color="red"
          baseIntensity={0.1}
          hoverIntensity={0.5}
          enableHover
        >
          CRASHED!
        </FuzzyText>
      )
    }
    
    return null
  }, [status, bettingTimer])

  return (
    <Card className="h-full w-full overflow-hidden border-none bg-transparent shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          {Array.isArray(history) && history.slice(-5).map((point, i) => (
            <Badge
              key={i}
              variant="outline"
              className={`px-2 py-0.5 text-[10px] font-bold ${
                point.crashPoint > 2
                  ? "border-primary/70 bg-primary/70 text-white"
                  : "border-secondary bg-secondary text-white"
              }`}
            >
              {point.crashPoint.toFixed(2)}x
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-full overflow-hidden p-0">
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <div className={multiplierClassName}>
                {status === "CRASHED" ? (
                  <FuzzyText
                    fontSize="6rem"
                    color="red"
                    baseIntensity={0.1}
                    hoverIntensity={0.5}
                    enableHover
                  >
                    {Number(gameCrashed).toFixed(2)}x
                  </FuzzyText>
                ) : (
                  `${multiplier.toFixed(2)}x`
                )}
              </div>

              <div className={statusClassName}>
                {statusContent}
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{ top: 40, right: 30, left: 40, bottom: 20 }}
            >
              <defs>
                <linearGradient id="crashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(100,116,139,0.1)"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="rgba(100,116,139,0.5)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="rgba(100,116,139,0.4)"
                fontSize={12}
                domain={[1, Math.max(multiplier + 1, 5)]}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={4}
                dot={false}
                isAnimationActive={false}
                fill="url(#crashGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}