import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  state: { type: Object, default: {} },
  status: { type: String, enum: ["waiting", "playing", "ended"], default: "waiting" },
}, { timestamps: true })

export default mongoose.model("Game", gameSchema)
