import { NextResponse } from "next/server";
import { query, DB_ERROR_MESSAGE } from "@/lib/db";
import { setSession } from "@/lib/auth";

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
    // Login Check, matches the project documentation query:
    // SELECT id FROM tbl_users WHERE (username = '?' OR email = '?') AND password = '?'
    const res = await query(
      `SELECT id, username
       FROM tbl_users
       WHERE (username = $1 OR email = $1) AND password = $2`,
      [identifier, password],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid username/email or password." },
        { status: 401 },
      );
    }

    const row = res.rows[0];
    await setSession({ id: row.id });
    return NextResponse.json({
      ok: true,
      user: { id: row.id, username: row.username },
    });
  } catch (err) {
    console.error("[login]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}
