import argon2 from "argon2";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? "NO_KEY_SET";
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const ENCRYPTED_VALUE_SEPARATOR = ":";

async function deriveKeyAndIv(
  secret: string,
  salt: Buffer
): Promise<{ key: Buffer; iv: Buffer }> {
  const key = await argon2.hash(secret, { salt });
  const keyBuffer = Buffer.from(key, "utf-8");
  const derivedKey = keyBuffer.subarray(0, KEY_LENGTH);
  const derivedIv = keyBuffer.subarray(KEY_LENGTH, KEY_LENGTH + IV_LENGTH);
  return { key: derivedKey, iv: derivedIv };
}

export async function encryptValue(value: string) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const { key, iv } = await deriveKeyAndIv(ENCRYPTION_KEY, salt);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}${ENCRYPTED_VALUE_SEPARATOR}${encrypted.toString(
    "hex"
  )}${ENCRYPTED_VALUE_SEPARATOR}${salt.toString("hex")}`;
}

export async function decryptValue(encryptedValue: string) {
  const [ivString, encryptedDataString, saltString] = encryptedValue.split(
    ENCRYPTED_VALUE_SEPARATOR
  );

  if (!ivString || !encryptedDataString || !saltString) {
    throw new Error("Invalid encrypted value");
  }

  const iv = Buffer.from(ivString, "hex");
  const encryptedText = Buffer.from(encryptedDataString, "hex");
  const salt = Buffer.from(saltString, "hex");
  const { key } = await deriveKeyAndIv(ENCRYPTION_KEY, salt);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
