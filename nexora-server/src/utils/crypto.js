import crypto from "crypto"

// Generate RSA key pair (per user)
export function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  })
  return { publicKey, privateKey }
}

// AES encrypt message with session key
export function aesEncrypt(message, key) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(message, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return { iv: iv.toString("hex"), encrypted: encrypted.toString("hex"), tag: tag.toString("hex") }
}

// AES decrypt message
export function aesDecrypt(encryptedData, key) {
  const iv = Buffer.from(encryptedData.iv, "hex")
  const encrypted = Buffer.from(encryptedData.encrypted, "hex")
  const tag = Buffer.from(encryptedData.tag, "hex")
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(encrypted, null, "utf8") + decipher.final("utf8")
}

// RSA encrypt/decrypt session key
export function rsaEncryptKey(aesKey, publicKey) {
  return crypto.publicEncrypt(publicKey, aesKey).toString("hex")
}

export function rsaDecryptKey(encryptedKeyHex, privateKey) {
  const encryptedKey = Buffer.from(encryptedKeyHex, "hex")
  return crypto.privateDecrypt(privateKey, encryptedKey)
}
