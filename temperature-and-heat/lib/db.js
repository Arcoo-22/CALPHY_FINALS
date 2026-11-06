// ============================================================
// PostgreSQL connection, matches the groupmate's schema:
//   database : db_users
//   table    : tbl_users (id, username, password, email, user_progress JSONB)
//   view     : getAllUsers
// ============================================================
import pg from "pg";
import { toProgressDto, isLegacyQuizLayout } from "@/lib/progress";
import { hashPassword, verifyPassword } from "@/lib/passwords";

const { Pool } = pg;

let pool = globalThis.pgPool || null;

export function getPool() {
  if (!pool) {
    const isCloud =
      process.env.DATABASE_URL?.includes("neon.tech") ||
      process.env.DATABASE_URL?.includes("sslmode=require") ||
      process.env.NODE_ENV === "production";

    pool = process.env.DATABASE_URL
      ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: isCloud ? { rejectUnauthorized: false } : undefined,
          max: 5,
          connectionTimeoutMillis: 5000,
        })
      : new Pool({
          host: process.env.PGHOST || "localhost",
          port: Number(process.env.PGPORT || 5432),
          database: process.env.PGDATABASE || "db_users",
          user: process.env.PGUSER || "postgres",
          password: process.env.PGPASSWORD || "postgres",
          max: 5,
          connectionTimeoutMillis: 4000,
        });
    pool.on("error", (err) =>
      console.error("[pg] idle client error:", err.message),
    );

    if (process.env.NODE_ENV !== "production") {
      globalThis.pgPool = pool;
    }
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

export const DB_ERROR_MESSAGE =
  "Database not reachable. Make sure PostgreSQL is running and the db_users database exists (see db/setup.sql).";

// Old five-quiz records are rewritten once, so later single-key updates
// (POST /api/progress) don't land on a record that still reads as old.
export async function upgradeStoredProgress(userId, stored) {
  const progress = toProgressDto(stored);
  if (isLegacyQuizLayout(stored)) {
    try {
      await query(
        "UPDATE tbl_users SET user_progress = $2::jsonb WHERE id = $1",
        [userId, JSON.stringify(progress)],
      );
    } catch (err) {
      console.error("[progress upgrade]", err.message);
    }
  }
  return progress;
}

// Default user_progress JSONB, same shape as the documentation example
export function defaultProgress(lessonKeys, quizIds) {
  const Progress = {};
  lessonKeys.forEach((k) => (Progress[k] = "NotStarted"));
  const QuizProgress = {};
  const QuizScores = {};
  quizIds.forEach((q) => {
    QuizProgress[q] = "NotStarted";
    QuizScores[q] = 0;
  });
  return { Progress, QuizProgress, QuizScores };
}

// ============================================================
// Query helpers from the groupmate's db.js (PR #7), ported to node-postgres:
// $n placeholders instead of ?, and the shared pool stays open between
// queries. Each returns the result rows.
// ============================================================

// Assumes the getAllUsers view exists; see the PostgreSQL documentation.
export async function getAllUsers() {
  const res = await query("SELECT * FROM getAllUsers;");
  return res.rows;
}

export async function getUserById(id) {
  const res = await query(
    "SELECT username, email FROM tbl_users WHERE id = $1;",
    [id],
  );
  return res.rows;
}

export async function getUserByUsername(username) {
  const res = await query(
    "SELECT username, email FROM tbl_users WHERE username = $1;",
    [username],
  );
  return res.rows;
}

export async function login(username, password, email) {
  const res = await query(
    "SELECT username, email, password, user_progress FROM tbl_users WHERE (username = $1 OR email = $2);",
    [username, email],
  );
  if (res.rows.length === 0) return [];
  const row = res.rows[0];
  if (!verifyPassword(password, row.password)) return [];
  return [{ username: row.username, email: row.email, user_progress: row.user_progress }];
}

export async function getUserProgress(id) {
  const res = await query(
    "SELECT user_progress FROM tbl_users WHERE id = $1;",
    [id],
  );
  return res.rows;
}

export async function changeUsername(id, newUsername) {
  const res = await query(
    "UPDATE tbl_users SET username = $1 WHERE id = $2;",
    [newUsername, id],
  );
  return res.rows;
}

export async function changePassword(id, newPassword) {
  const hashedPassword = hashPassword(newPassword);
  const res = await query(
    "UPDATE tbl_users SET password = $1 WHERE id = $2;",
    [hashedPassword, id],
  );
  return res.rows;
}

export async function changeEmail(id, newEmail) {
  const res = await query("UPDATE tbl_users SET email = $1 WHERE id = $2;", [
    newEmail,
    id,
  ]);
  return res.rows;
}

// user_progress[parent][child] = newProgress. PostgreSQL can't bind a
// placeholder inside a subscript path, so this uses jsonb_set. newProgress is
// any JSON-serialisable value ("Finished", 85, ...).
export async function updateUserProgress(
  id,
  parentProgress,
  childProgress,
  newProgress,
) {
  const res = await query(
    "UPDATE tbl_users SET user_progress = jsonb_set(user_progress, ARRAY[$1, $2]::text[], $3::jsonb) WHERE id = $4;",
    [parentProgress, childProgress, JSON.stringify(newProgress), id],
  );
  return res.rows;
}
