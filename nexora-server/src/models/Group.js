import mongoose from "mongoose"

const groupSchema = new mongoose.Schema({
  name: String,
  inviteCode: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  maxMembers: { type: Number, default: 20 }
})

export default mongoose.model("Group", groupSchema)
