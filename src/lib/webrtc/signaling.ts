export function createPeerConnection(onTrack: (stream: MediaStream) => void) {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  })

  pc.ontrack = (event) => {
    onTrack(event.streams[0])
  }

  return pc
}

export async function getLocalStream(audio = true, video = true) {
  return await navigator.mediaDevices.getUserMedia({ audio, video })
}
