// Example using AES symmetric encryption for simplicity
import CryptoJS from "crypto-js"

const SECRET_KEY = "supersecretkey123" // Replace with per-user key management

export function encryptMessage(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export function decryptMessage(cipher: string): string {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
