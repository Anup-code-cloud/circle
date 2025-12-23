import Game from "../models/Game.js"

const gameRooms = new Map() // roomId -> Set of sockets

export default async function gameRoutes(app) {

  app.get("/ws/game", { websocket: true }, (connection, req) => {
    let currentRoom = null
    let userId = null

    connection.socket.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString())
        switch (data.type) {

          // 1️⃣ Join / Matchmaking
          case "JOIN_GAME":
            userId = data.userId
            currentRoom = data.roomId

            if (!gameRooms.has(currentRoom)) gameRooms.set(currentRoom, new Set())
            gameRooms.get(currentRoom).add(connection.socket)

            // Notify other players
            gameRooms.get(currentRoom).forEach((socket) => {
              if (socket !== connection.socket) {
                socket.send(JSON.stringify({ type: "PLAYER_JOINED", userId }))
              }
            })

            break

          // 2️⃣ Game state update
          case "GAME_STATE":
            if (currentRoom) {
              gameRooms.get(currentRoom).forEach((socket) => {
                if (socket !== connection.socket) {
                  socket.send(JSON.stringify({ type: "GAME_STATE", state: data.state }))
                }
              })
            }
            break

          // 3️⃣ End game
          case "END_GAME":
            if (currentRoom) {
              gameRooms.get(currentRoom).forEach((socket) =>
                socket.send(JSON.stringify({ type: "GAME_ENDED", winner: data.winner }))
              )
              gameRooms.get(currentRoom).clear()
            }
            break
        }

      } catch (err) {
        console.error("Game WS Error:", err)
      }
    })

    connection.socket.on("close", () => {
      if (currentRoom) {
        gameRooms.get(currentRoom).delete(connection.socket)
        gameRooms.get(currentRoom).forEach((socket) =>
          socket.send(JSON.stringify({ type: "PLAYER_LEFT", userId }))
        )
      }
    })
  })
}
