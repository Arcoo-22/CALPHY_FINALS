import { NextResponse } from "next/server";
import { query, DB_ERROR_MESSAGE, defaultProgress } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PARENTS } from "@/lib/progress";
import { LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

const lessonKeys = new Set(LESSONS.map((lesson) => lesson.key));
const quizIds = new Set(QUIZZES.map((quiz) => quiz.id));
const statuses = new Set(["NotStarted", "Current", "Finished"]);

function isAllowedProgressEntry(parent, child, value, numeric) {
  if (parent === "Progress")
    return lessonKeys.has(child) && !numeric && statuses.has(value);
  if (parent === "QuizProgress")
    return quizIds.has(child) && !numeric && statuses.has(value);
  return (
    quizIds.has(child) &&
    numeric &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 100
  );
}

function toProgressDto(progress) {
  const dto = { Progress: {}, QuizProgress: {}, QuizScores: {} };
  LESSONS.forEach(({ key }) => {
    const value = progress?.Progress?.[key];
    dto.Progress[key] = statuses.has(value) ? value : "NotStarted";
  });
  QUIZZES.forEach(({ id }) => {
    const status = progress?.QuizProgress?.[id];
    const score = Number(progress?.QuizScores?.[id]);
    dto.QuizProgress[id] = statuses.has(status) ? status : "NotStarted";
    dto.QuizScores[id] =
      Number.isFinite(score) && score >= 0 && score <= 100 ? score : 0;
  });
  return dto;
}

// GET /api/progress                → full user_progress (their "Get User Progress" query)
// GET /api/progress?parent=&child= → single value (their "Get Specific User Progress" query)
export async function GET(req) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const id = session?.id;
  if (!id)
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const parent = searchParams.get("parent");
  const child = searchParams.get("child");

  if (
    (parent && !child) ||
    (!parent && child) ||
    (parent && !PARENTS.includes(parent))
  ) {
    return NextResponse.json(
      { error: "Invalid progress request." },
      { status: 400 },
    );
  }
  if (
    parent &&
    child &&
    !isAllowedProgressEntry(
      parent,
      child,
      parent === "QuizScores" ? 0 : "NotStarted",
      parent === "QuizScores",
    )
  ) {
    return NextResponse.json(
      { error: "Invalid progress request." },
      { status: 400 },
    );
  }

  try {
    if (parent && child) {
      // Retrieve the text inside the JSON element  →  user_progress -> 'PARENT' ->> 'CHILD'
      const res = await query(
        `SELECT user_progress -> $2 ->> $3 AS value
         FROM tbl_users
         WHERE id = $1`,
        [id, parent, child],
      );
      if (res.rows.length === 0)
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      return NextResponse.json({ value: res.rows[0].value });
    }

    const res = await query(
      `SELECT user_progress FROM tbl_users WHERE id = $1`,
      [id],
    );
    if (res.rows.length === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({
      progress: toProgressDto(res.rows[0].user_progress),
    });
  } catch (err) {
    console.error("[progress GET]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}

// POST /api/progress { parent, child, value, numeric? }
// JSONB-safe equivalent of the documented
//   UPDATE tbl_users SET user_progress['PARENT']['CHILD'] = '"newVal"'::jsonb WHERE id = ?
// (PostgreSQL needs jsonb_set for nested updates; table/columns are unchanged.)
export async function POST(req) {
  const session = await getSession();
  if (!session?.id)
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { parent, child, value, numeric } = body;
  if (!PARENTS.includes(parent)) {
    return NextResponse.json(
      { error: `parent must be one of: ${PARENTS.join(", ")}` },
      { status: 400 },
    );
  }
  if (!child || value === undefined || value === null) {
    return NextResponse.json(
      { error: "child and value are required." },
      { status: 400 },
    );
  }
  if (!isAllowedProgressEntry(parent, child, value, Boolean(numeric))) {
    return NextResponse.json(
      { error: "Invalid progress update." },
      { status: 400 },
    );
  }

  const valueExpr = numeric
    ? "to_jsonb(CAST($4 AS NUMERIC))"
    : "to_jsonb(CAST($4 AS TEXT))";

  try {
    const res = await query(
      `UPDATE tbl_users
       SET user_progress = jsonb_set(
             jsonb_set(
               COALESCE(user_progress, '{}'::jsonb),
               ARRAY[$2]::text[],
               COALESCE(user_progress -> $2, '{}'::jsonb),
               true
             ),
             ARRAY[$2, $3]::text[],
             ${valueExpr},
             true
           )
       WHERE id = $1
       RETURNING user_progress`,
      [session.id, parent, child, String(value)],
    );
    if (res.rows.length === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[progress POST]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session?.id)
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  try {
    const res = await query(
      `UPDATE tbl_users
       SET user_progress = $2::jsonb
       WHERE id = $1
       RETURNING id`,
      [session.id, JSON.stringify(defaultProgress(
        LESSONS.map(({ key }) => key),
        QUIZZES.map(({ id }) => id),
      ))],
    );
    if (res.rows.length === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[progress DELETE]", err.message);
    return NextResponse.json({ error: DB_ERROR_MESSAGE }, { status: 503 });
  }
}
