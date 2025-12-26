"use client"

import { useEffect, useRef } from "react"

interface VideoTileProps {
  stream: MediaStream
  isMe?: boolean
}

export default function VideoTile({ stream, isMe }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMe}
      className="w-48 h-36 rounded-lg bg-black"
    />
  )
}
