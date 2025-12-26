"use client"

import { useEffect, useRef, useState } from "react"
import GameBoard from "./GameBoard"

interface GameRoomProps {
  group: { _id: string; name: string } | null
}

export default function GameRoom({ group }: GameRoomProps) {
  const [players, setPlayers] = useState<string[]>([])
  const [gameState, setGameState] = useState<any>({})
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!group) return

    ws.current = new WebSocket("ws://localhost:5000/ws/game")

    ws.current.onopen = () => {
      console.log("Game WS connected")
      ws.current?.send(JSON.stringify({ type: "JOIN_GAME", userId: localStorage.getItem("userId"), roomId: group._id }))
    }

    ws.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      switch (data.type) {
        case "PLAYER_JOINED":
          setPlayers(prev => [...prev, data.userId])
          break
        case "PLAYER_LEFT":
          setPlayers(prev => prev.filter(p => p !== data.userId))
          break
        case "GAME_STATE":
          setGameState(data.state)
          break
        case "GAME_ENDED":
          alert(`Game ended! Winner: ${data.winner}`)
          setGameState({})
          setPlayers([])
          break
      }
    }

    return () => {
      ws.current?.close()
    }
  }, [group])

  const sendGameAction = (action: any) => {
    if (!ws.current) return
    ws.current.send(JSON.stringify({ type: "GAME_STATE", state: action }))
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Players in Room:</h2>
        <div className="flex gap-2 mt-2">
          {players.map(p => (
            <span key={p} className="bg-indigo-600 px-2 py-1 rounded">{p}</span>
          ))}
        </div>
      </div>

      <GameBoard gameState={gameState} onAction={sendGameAction} />
    </div>
  )
}
