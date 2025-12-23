const rooms = new Map() // roomId -> Set of sockets

export default async function callRoutes(app) {

  app.get("/ws/call", { websocket: true }, (connection, req) => {

    let currentRoom = null
    let userId = null

    connection.socket.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString())

        switch (data.type) {

          // 1️⃣ Join a room
          case "JOIN_ROOM":
            userId = data.userId
            currentRoom = data.roomId

            if (!rooms.has(currentRoom)) rooms.set(currentRoom, new Set())
            rooms.get(currentRoom).add(connection.socket)

            // Notify others
            rooms.get(currentRoom).forEach((socket) => {
              if (socket !== connection.socket) {
                socket.send(JSON.stringify({
                  type: "USER_JOINED",
                  userId
                }))
              }
            })
            break

          // 2️⃣ Forward SDP / ICE messages
          case "SDP_OFFER":
          case "SDP_ANSWER":
          case "ICE_CANDIDATE":
            if (currentRoom) {
              rooms.get(currentRoom).forEach((socket) => {
                if (socket !== connection.socket) {
                  socket.send(JSON.stringify(data))
                }
              })
            }
            break

          // 3️⃣ End call
          case "LEAVE_ROOM":
            if (currentRoom) {
              rooms.get(currentRoom).delete(connection.socket)
              rooms.get(currentRoom).forEach((socket) =>
                socket.send(JSON.stringify({ type: "USER_LEFT", userId }))
              )
              currentRoom = null
            }
            break
        }
      } catch (err) {
        console.error("Call WS Error:", err)
      }
    })

    connection.socket.on("close", () => {
      if (currentRoom) {
        rooms.get(currentRoom).delete(connection.socket)
        rooms.get(currentRoom).forEach((socket) =>
          socket.send(JSON.stringify({ type: "USER_LEFT", userId }))
        )
      }
    })
  })
}
