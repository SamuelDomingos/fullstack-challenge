"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { GameEvents } from "../_interfaces/gameEvents"
import { useGameStore } from "../_store/game.store"
import { Bet } from "@/app/(home)/_types/Game"

export const useGameWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  const {
    isConnected,
    multiplier,
    bettingTimer,
    gameCrashed,
    setConnected,
    setMultiplier,
    setBettingTimer,
    setGameCrashed,
    setBets,
    setStatus,
  } = useGameStore()

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_KONG_URL}`, {
      path: '/games/socket.io',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket"],
      upgrade: false,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("✅ Conectado ao Game WebSocket")
      setConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("❌ Desconectado do Game WebSocket")
      setConnected(false)
    })

    socket.on("betting_timer", (data: GameEvents["betting_timer"]) => {
      setBettingTimer(data.secondsLeft)
      setStatus("BETTING")
      setGameCrashed(null)
    })

    socket.on("multiplier_update", (data: GameEvents["multiplier_update"]) => {
      setMultiplier(Number(data.multiplier))
      setStatus("RUNNING")
      setGameCrashed(null)
    })

    socket.on("game_crash", (data: GameEvents["game_crash"]) => {
      setGameCrashed(Number(data.crashPoint))
      setStatus("CRASHED")
    })

    socket.on("bets_update", (data: Bet[]) => {
      setBets(data)
    })

    socket.on("round_started", () => {
      setMultiplier(1)
      setStatus("RUNNING")
      setGameCrashed(null)
    })


    socket.on("error", (error) => {
      console.error("❌ Erro no WebSocket:", error)
    })

    return () => {
      socket.disconnect()
    }
  }, [setConnected, setMultiplier, setBettingTimer, setGameCrashed])

  const emit = useCallback(
    <K extends keyof GameEvents>(event: K, data: GameEvents[K]) => {
      socketRef.current?.emit(event, data)
    },
    []
  )

  return {
    socketRef,
    isConnected,
    multiplier,
    bettingTimer,
    gameCrashed,
    emit,
  }
}
