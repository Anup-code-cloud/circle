const sendMessage = async (text: string, fileUrl?: string) => {
  if (!ws.current || !group) return
  const content = encryptMessage(text || "") // encrypt text only
  ws.current.send(JSON.stringify({
    type: "MESSAGE",
    userId: localStorage.getItem("userId"),
    groupId: group._id,
    content,
    fileUrl // optional
  }))
}
