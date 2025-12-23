import Fastify from "fastify"
import websocket from "@fastify/websocket"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.js"
import chatRoutes from "./routes/chat.js"
import fileRoutes from "./routes/file.js"
import callRoutes from "./routes/call.js"
import gameRoutes from "./routes/game.js"

dotenv.config()

const app = Fastify({ logger: true })

await connectDB()

app.register(websocket)
app.register(authRoutes)
app.register(chatRoutes)
app.register(fileRoutes)
app.register(callRoutes)
app.register(gameRoutes)

app.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server running on ${process.env.PORT}`)
})
