"use client"

import { useRouter } from "next/navigation"
import { MessageCircle, Phone, Gamepad2, Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const cards = [
    {
      title: "Chat",
      desc: "Secure group & private messaging",
      icon: <MessageCircle size={32} />,
      path: "/chat",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Call",
      desc: "Audio & video calls with screen sharing",
      icon: <Phone size={32} />,
      path: "/call",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Game",
      desc: "Play multiplayer games together",
      icon: <Gamepad2 size={32} />,
      path: "/game",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Crypto",
      desc: "End-to-end encrypted communication",
      icon: <Shield size={32} />,
      path: "/crypto",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <div className="min-h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to Nexora 🚀</h1>
        <p className="text-zinc-400 mt-2">
          Secure communication • Calls • Games • Privacy-first
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => router.push(card.path)}
            className={`rounded-xl p-6 text-left transition-all shadow-lg ${card.color}`}
          >
            <div className="mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-sm text-white/80 mt-1">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-sm text-zinc-500">
        <p>🔐 End-to-End Encrypted • 🧠 AI Moderation Ready • ⚡ Real-time</p>
      </div>
    </div>
  )
}
