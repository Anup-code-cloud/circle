"use client"

import React from "react"

interface ChatHeaderProps {
  groupName: string
  onLeave?: () => void
  onCall?: () => void
}

export default function ChatHeader({ groupName, onLeave, onCall }: ChatHeaderProps) {
  return (
    <div className="h-16 bg-zinc-800 flex items-center justify-between px-4 border-b border-zinc-700">
      {/* Group info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
          {groupName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{groupName}</h2>
          <p className="text-sm text-zinc-400">Online</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onCall && (
          <button
            onClick={onCall}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
          >
            Call
          </button>
        )}
        {onLeave && (
          <button
            onClick={onLeave}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  )
}
