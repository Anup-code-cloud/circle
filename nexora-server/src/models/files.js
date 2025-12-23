import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  originalName: String,
  storageName: String,
  size: Number,
  mimetype: String
}, { timestamps: true })

export default mongoose.model("File", fileSchema)
