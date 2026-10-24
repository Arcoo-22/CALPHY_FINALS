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
