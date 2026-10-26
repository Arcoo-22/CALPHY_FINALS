import { NextResponse } from "next/server";
import { query, DB_ERROR_MESSAGE, defaultProgress } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

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

  const username = (body.username || "").trim();
  const password = body.password || "";
  const email = (body.email || "").trim().toLowerCase();

  if (!username || !password || !email) {
    return NextResponse.json(
      { error: "Username, password and email are all required." },
      { status: 400 },
    );
  }
  if (username.length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters." },
      { status: 400 },
    );
  }
  if (password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const existing = await query(
      "SELECT id FROM tbl_users WHERE username = $1 OR email = $2",
      [username, email],
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "That username or email is already taken." },
        { status: 409 },
      );
    }

    const progress = defaultProgress(
      LESSONS.map((l) => l.key),
      QUIZZES.map((q) => q.id),
    );

    const inserted = await query(
      `INSERT INTO tbl_users (username, password, email, user_progress)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING id`,
      [username, password, email, JSON.stringify(progress)],
    );

    const id = inserted.rows[0].id;
    await setSession({ id });
    return NextResponse.json({ ok: true, user: { id, username }, progress });
  } catch (err) {
    console.error("[register]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}
