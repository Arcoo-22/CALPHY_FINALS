import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 32;

/**
 * Hashes a plaintext password using scrypt with a unique random salt.
 * Format: scrypt$<salt_hex>$<derived_key_hex>
 */
export function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string.");
  }
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against the stored password value.
 * Supports:
 *   1. Modern scrypt hashes (scrypt$<salt>$<hash>)
 *   2. Legacy plaintext passwords (seamless fallback so existing accounts still work)
 */
export function verifyPassword(password, storedPassword) {
  if (!password || !storedPassword) return false;

  // 1. Scrypt hash verification
  if (typeof storedPassword === "string" && storedPassword.startsWith("scrypt$")) {
    const parts = storedPassword.split("$");
    if (parts.length === 3) {
      const [, salt, hash] = parts;
      try {
        const expectedBuffer = Buffer.from(hash, "hex");
        const derivedKey = scryptSync(password, salt, KEY_LENGTH);
        if (
          expectedBuffer.length === derivedKey.length &&
          timingSafeEqual(expectedBuffer, derivedKey)
        ) {
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  // 2. Seamless fallback: matches legacy plaintext passwords
  return storedPassword === password;
}

/**
 * Checks whether a stored password is still in legacy plaintext format
 * so it can be automatically rehashed and upgraded in the database.
 */
export function isLegacyPlaintext(storedPassword) {
  return typeof storedPassword === "string" && !storedPassword.startsWith("scrypt$");
}
