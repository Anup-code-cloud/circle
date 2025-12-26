"use client"

interface GameBoardProps {
  gameState: any
  onAction: (action: any) => void
}

export default function GameBoard({ gameState, onAction }: GameBoardProps) {
  // Example: simple counter game
  const handleClick = () => {
    const newState = { count: (gameState.count || 0) + 1 }
    onAction(newState)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-2xl">Game Count: {gameState.count || 0}</div>
      <button className="bg-green-600 px-4 py-2 rounded" onClick={handleClick}>Increase</button>
    </div>
  )
}
