"use client"

import { useState } from "react"
import axios from "axios"

interface MessageInputProps {
  onSend: (text: string, fileUrl?: string) => void
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSend = async () => {
    let fileUrl: string | undefined

    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", localStorage.getItem("userId")!)
      formData.append("groupId", "GROUP_ID_PLACEHOLDER") // Replace dynamically

      const token = localStorage.getItem("token")
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      fileUrl = res.data.file._id
      setFile(null)
    }

    if (text.trim() || fileUrl) {
      onSend(text.trim(), fileUrl)
      setText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="p-2 border-t border-zinc-800 flex items-center gap-2">
      <input
        type="file"
        className="text-sm text-white"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 p-2 rounded bg-zinc-900 text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className="ml-2 bg-indigo-600 px-4 rounded" onClick={handleSend}>Send</button>
    </div>
  )
}
