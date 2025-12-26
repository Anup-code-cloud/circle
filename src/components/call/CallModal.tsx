"use client"

import { useEffect, useRef, useState } from "react"
import VideoTile from "./VideoTile"
import CallControls from "./CallControls"
import { createPeerConnection, getLocalStream } from "@/webrtc/signaling"

interface CallModalProps {
  groupId: string
  onClose: () => void
}

export default function CallModal({ groupId, onClose }: CallModalProps) {
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({})
  const localStreamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const pcsRef = useRef<{ [id: string]: RTCPeerConnection }>({})

  useEffect(() => {
    let isMounted = true
    const userId = localStorage.getItem("userId") || Math.random().toString(36).substr(2, 9)

    const initCall = async () => {
      try {
        localStreamRef.current = await getLocalStream()

        wsRef.current = new WebSocket("ws://localhost:5000/ws/call")

        wsRef.current.onopen = () => {
          wsRef.current?.send(JSON.stringify({ type: "JOIN_ROOM", userId, roomId: groupId }))
        }

        wsRef.current.onmessage = async (msg) => {
          if (!isMounted) return
          const data = JSON.parse(msg.data)
          const otherUserId = data.userId

          switch (data.type) {
            case "USER_JOINED": {
              const pc = createPeerConnection((stream) => {
                setPeers((prev) => ({ ...prev, [otherUserId]: stream }))
              })
              localStreamRef.current?.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current!))
              pcsRef.current[otherUserId] = pc

              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              wsRef.current?.send(JSON.stringify({ type: "SDP_OFFER", userId, sdp: offer, target: otherUserId }))
              break
            }

            case "SDP_OFFER": {
              const pc2 = createPeerConnection((stream) => {
                setPeers((prev) => ({ ...prev, [otherUserId]: stream }))
              })
              localStreamRef.current?.getTracks().forEach((track) => pc2.addTrack(track, localStreamRef.current!))
              pcsRef.current[otherUserId] = pc2

              await pc2.setRemoteDescription(data.sdp)
              const answer = await pc2.createAnswer()
              await pc2.setLocalDescription(answer)
              wsRef.current?.send(JSON.stringify({ type: "SDP_ANSWER", sdp: answer, target: otherUserId }))
              break
            }

            case "SDP_ANSWER": {
              await pcsRef.current[otherUserId]?.setRemoteDescription(data.sdp)
              break
            }

            case "ICE_CANDIDATE": {
              pcsRef.current[otherUserId]?.addIceCandidate(data.candidate)
              break
            }

            case "USER_LEFT": {
              pcsRef.current[otherUserId]?.close()
              delete pcsRef.current[otherUserId]
              setPeers((prev) => {
                const copy = { ...prev }
                delete copy[otherUserId]
                return copy
              })
              break
            }
          }
        }
      } catch (err) {
        console.error("Error initializing call:", err)
      }
    }

    initCall()

    return () => {
      isMounted = false
      wsRef.current?.close()
      localStreamRef.current?.getTracks().forEach((track) => track.stop())
      Object.values(pcsRef.current).forEach((pc) => pc.close())
    }
  }, [groupId])

  const handleLeave = () => onClose()
  const handleToggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
  }
  const handleToggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
      <div className="flex flex-wrap gap-4 justify-center">
        {localStreamRef.current && <VideoTile key="local" stream={localStreamRef.current} isMe />}
        {Object.entries(peers).map(([id, stream]) => (
          <VideoTile key={id} stream={stream} />
        ))}
      </div>
      <CallControls onLeave={handleLeave} onToggleMic={handleToggleMic} onToggleCam={handleToggleCam} />
    </div>
  )
}
