import Message from "../models/Message.js"

const onlineUsers = new Map() // userId -> socket

export default async function chatRoutes(app) {
  app.get("/ws/chat", { websocket: true }, (connection, req) => {

    connection.socket.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString())

        // 1️⃣ User joins
        if (data.type === "JOIN") {
          onlineUsers.set(data.userId, connection.socket)
          return
        }

        // 2️⃣ New message
        if (data.type === "MESSAGE") {
          const message = await Message.create({
            sender: data.userId,
            groupId: data.groupId,
            content: data.content
          })

          // broadcast to group
          onlineUsers.forEach((socket) => {
            socket.send(JSON.stringify({
              type: "NEW_MESSAGE",
              message
            }))
          })
        }

      } catch (err) {
        console.error("WS Error:", err)
      }
    })

    connection.socket.on("close", () => {
      onlineUsers.forEach((socket, userId) => {
        if (socket === connection.socket) {
          onlineUsers.delete(userId)
        }
      })
    })
  })
}
