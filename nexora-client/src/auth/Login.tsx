"use client"

import { useState } from "react"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password })
      alert("JWT Token: " + res.data.token)
    } catch (err) {
      alert(err.response?.data?.error || "Login error")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-900 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input className="w-full mb-2 p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input className="w-full mb-2 p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <button className="w-full bg-indigo-600 p-2 rounded mt-2" onClick={handleLogin}>Login</button>
    </div>
  )
}
