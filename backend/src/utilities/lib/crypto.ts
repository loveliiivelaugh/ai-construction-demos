// @utils/crypto.ts

import { Buffer } from "buffer";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(Bun.env.MEMORY_ENCRYPTION_KEY!, "hex"); // Must be 32 bytes

export function encrypt(text: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
  };
}

export function decrypt(encryptedData: string, ivHex: string, tagHex: string) {
  const decipher = createDecipheriv(algorithm, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
