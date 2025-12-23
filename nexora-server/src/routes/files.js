import fs from "fs"
import path from "path"
import File from "../models/File.js"
import { randomUUID } from "crypto"

export default async function fileRoutes(app) {

  app.register(import("@fastify/multipart"))

  // POST /upload
  app.post("/upload", async (req, res) => {
    const mp = await req.file() // single file

    // Validate file size (max 10 MB)
    if (mp.file.truncated) return res.code(400).send({ error: "File too large" })

    const storageName = `${Date.now()}-${randomUUID()}-${mp.filename}`
    const uploadPath = path.join("uploads", storageName)

    // Ensure uploads folder exists
    fs.mkdirSync("uploads", { recursive: true })

    const writeStream = fs.createWriteStream(uploadPath)
    await mp.file.pipe(writeStream)

    // Save metadata to DB
    const fileDoc = await File.create({
      groupId: req.body.groupId,
      uploader: req.body.userId,
      originalName: mp.filename,
      storageName,
      size: mp.file.size,
      mimetype: mp.mimetype
    })

    res.send({ message: "File uploaded", file: fileDoc })
  })

  // GET /files/:fileId
  app.get("/files/:fileId", async (req, res) => {
    const fileDoc = await File.findById(req.params.fileId)
    if (!fileDoc) return res.code(404).send({ error: "File not found" })

    const filePath = path.join("uploads", fileDoc.storageName)
    res.sendFile(filePath)
  })
}
