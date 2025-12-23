import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  role: { type: String, default: "member" },
}, { timestamps: true })

export default mongoose.model("User", userSchema)
