"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface Group { _id: string; name: string }

export default function Sidebar({ onSelectGroup }: { onSelectGroup?: (group: Group) => void }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:5000/groups", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGroups(res.data.groups)
    }
    fetchGroups()
  }, [])

  const handleSelect = (group: Group) => {
    setActiveGroup(group._id)
    onSelectGroup?.(group)
  }

  return (
    <div className="w-64 bg-zinc-900 h-screen flex flex-col p-4">
      <h2 className="text-lg font-bold mb-4 text-white">Nexora Groups</h2>
      <div className="flex-1 overflow-y-auto">
        {groups.map(group => (
          <button
            key={group._id}
            onClick={() => handleSelect(group)}
            className={`w-full text-left p-2 mb-2 rounded ${activeGroup === group._id ? "bg-indigo-600" : "bg-zinc-800"} text-white`}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  )
}
