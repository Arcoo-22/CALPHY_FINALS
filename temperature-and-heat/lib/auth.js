// ============================================================
// Session helpers, simple cookie session for the school project.
// The cookie stores base64url({id, username, email}).
// ============================================================
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "calphy_user";

const sessionSecret =
  process.env.SESSION_SECRET || randomBytes(32).toString("hex");

function sign(payload) {
  return createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");
}

export function encodeSession(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id })).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(value) {
  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return null;
    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    )
      return null;
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (parsed && Number.isInteger(parsed.id) && parsed.id > 0)
      return { id: parsed.id };
    return null;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const c = cookieStore.get(SESSION_COOKIE);
  return c ? decodeSession(c.value) : null;
}

export async function setSession(user) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}
