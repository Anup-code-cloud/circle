"use client"

interface CallControlsProps {
  onLeave: () => void
  onToggleMic: () => void
  onToggleCam: () => void
}

export default function CallControls({ onLeave, onToggleMic, onToggleCam }: CallControlsProps) {
  return (
    <div className="flex gap-4 mt-2">
      <button className="bg-red-600 px-4 py-2 rounded" onClick={onLeave}>Leave</button>
      <button className="bg-yellow-600 px-4 py-2 rounded" onClick={onToggleMic}>Mic</button>
      <button className="bg-green-600 px-4 py-2 rounded" onClick={onToggleCam}>Cam</button>
    </div>
  )
}
