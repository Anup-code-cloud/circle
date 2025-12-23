import bcrypt from "bcrypt"
import User from "../models/User.js"
import Group from "../models/Group.js"
import { generateToken } from "../utils/jwt.js"

export default async function authRoutes(app) {

  app.post("/auth/register", async (req, res) => {
    const { name, email, password, inviteCode } = req.body

    const group = await Group.findOne({ inviteCode })
    if (!group) return res.code(400).send({ error: "Invalid invite code" })

    if (group.members.length >= group.maxMembers)
      return res.code(403).send({ error: "Group full" })

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashed,
      groupId: group._id
    })

    group.members.push(user._id)
    await group.save()

    const token = generateToken({ id: user._id })

    res.send({ token, user })
  })

}
