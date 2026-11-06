import { NextResponse } from "next/server";
import { query, DB_ERROR_MESSAGE, upgradeStoredProgress } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { hashPassword, verifyPassword, isLegacyPlaintext } from "@/lib/passwords";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const identifier = (body.identifier || "").trim();
  const password = body.password || "";
  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Enter your username/email and password." },
      { status: 400 },
    );
  }

  try {
    const res = await query(
      `SELECT id, username, password, user_progress
       FROM tbl_users
       WHERE username = $1 OR email = $1`,
      [identifier],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 },
      );
    }

    const row = res.rows[0];
    const passwordValid = verifyPassword(password, row.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 },
      );
    }

    // Seamless auto-upgrade: if this was an existing account with plaintext, upgrade to hash
    if (isLegacyPlaintext(row.password)) {
      try {
        const upgradedHash = hashPassword(password);
        await query("UPDATE tbl_users SET password = $1 WHERE id = $2", [
          upgradedHash,
          row.id,
        ]);
      } catch (upgradeErr) {
        console.error("[password upgrade]", upgradeErr.message);
      }
    }

    await setSession({ id: row.id });
    return NextResponse.json({
      ok: true,
      user: { id: row.id, username: row.username },
      progress: await upgradeStoredProgress(row.id, row.user_progress),
    });
  } catch (err) {
    console.error("[login]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}
