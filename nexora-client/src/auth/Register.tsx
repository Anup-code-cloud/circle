"use client"

import { useState } from "react"
import axios from "axios"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name, email, password, inviteCode
      })
      alert("Registered! JWT: " + res.data.token)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Error")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-900 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <input className="w-full mb-2 p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
      <input className="w-full mb-2 p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input className="w-full mb-2 p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <input className="w-full mb-2 p-2 rounded" placeholder="Invite Code" value={inviteCode} onChange={e=>setInviteCode(e.target.value)}/>
      <button className="w-full bg-indigo-600 p-2 rounded mt-2" onClick={handleRegister}>Register</button>
    </div>
  )
}
