// ============================================================
// PostgreSQL connection, matches the groupmate's schema:
//   database : db_users
//   table    : tbl_users (id, username, password, email, user_progress JSONB)
//   view     : getAllUsers
// ============================================================
import pg from "pg";

const { Pool } = pg;

let pool = null;

export function getPool() {
  if (!pool) {
    pool = process.env.DATABASE_URL
      ? new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 5,
          connectionTimeoutMillis: 4000,
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
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

export const DB_ERROR_MESSAGE =
  "Database not reachable. Make sure PostgreSQL is running and the db_users database exists (see db/setup.sql).";

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
    "SELECT username, email, user_progress FROM tbl_users WHERE (username = $1 OR email = $2) AND password = $3;",
    [username, email, password],
  );
  return res.rows;
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
  const res = await query(
    "UPDATE tbl_users SET password = $1 WHERE id = $2;",
    [newPassword, id],
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
