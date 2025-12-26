export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === localStorage.getItem("userId")

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`p-2 rounded-lg max-w-xs ${isMe ? "bg-indigo-600 text-white" : "bg-zinc-800 text-white"}`}>
        {message.content && <div>{message.content}</div>}
        {message.fileUrl && (
          <a
            href={`http://localhost:5000/files/${message.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-300 hover:underline mt-1 block"
          >
            📎 Download File
          </a>
        )}
      </div>
    </div>
  )
}
