// ============================================================
// Client-side progress store.
// Mirrors the DB JSONB shape exactly:
// { Progress: {Lesson1..9}, QuizProgress: {Quiz1..5}, QuizScores: {Quiz1..5} }
// Works offline (localStorage) and syncs to PostgreSQL when logged in.
// ============================================================
import { LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

export const LS_KEY = "calphy_progress";
export const PARENTS = ["Progress", "QuizProgress", "QuizScores"];

export function makeDefaultProgress() {
  const p = { Progress: {}, QuizProgress: {}, QuizScores: {} };
  LESSONS.forEach((l) => (p.Progress[l.key] = "NotStarted"));
  QUIZZES.forEach((q) => {
    p.QuizProgress[q.id] = "NotStarted";
    p.QuizScores[q.id] = 0;
  });
  return p;
}

export function readLocal() {
  if (typeof window === "undefined") return makeDefaultProgress();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return makeDefaultProgress();
    return mergeProgress(makeDefaultProgress(), JSON.parse(raw));
  } catch {
    return makeDefaultProgress();
  }
}

export function writeLocal(progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(progress));
  } catch {
    /* storage full / private mode, ignore */
  }
}

// incoming values override the base, missing keys keep the base
export function mergeProgress(base, incoming) {
  const out = JSON.parse(JSON.stringify(base));
  if (!incoming || typeof incoming !== "object") return out;
  PARENTS.forEach((parent) => {
    const inc = incoming[parent];
    if (inc && typeof inc === "object") {
      Object.keys(inc).forEach((child) => {
        if (inc[child] !== null && inc[child] !== undefined)
          out[parent][child] = inc[child];
      });
    }
  });
  return out;
}

// Update local storage and (best-effort) push to the server.
// Returns the updated local progress object.
export async function updateProgressLocal(
  parent,
  child,
  value,
  numeric = false,
  syncServer = false,
) {
  const current = readLocal();
  if (current[parent]) current[parent][child] = value;
  writeLocal(current);
  notifyProgress(current);
  if (syncServer) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent,
          child,
          value: numeric ? Number(value) : String(value),
          numeric,
        }),
      });
    } catch {
      /* offline or DB down, local copy still saved */
    }
  }
  return current;
}

export function markLesson(lessonKey, status, syncServer = false) {
  return updateProgressLocal("Progress", lessonKey, status, false, syncServer);
}

export function saveQuizScore(quizId, percent, syncServer = false) {
  // matches DB doc: QuizScores hold numbers, QuizProgress holds strings
  updateProgressLocal("QuizProgress", quizId, "Finished", false, syncServer);
  return updateProgressLocal("QuizScores", quizId, Math.round(percent), true, syncServer);
}

export function resetLocalProgress() {
  writeLocal(makeDefaultProgress());
  notifyProgress(readLocal());
}

export async function fetchServerProgress() {
  const res = await fetch("/api/progress", { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.progress || null;
}

// Pull DB progress and merge it over the local copy (DB wins).
export async function syncFromServer() {
  const server = await fetchServerProgress();
  if (!server) return readLocal();
  const merged = mergeProgress(readLocal(), server);
  writeLocal(merged);
  notifyProgress(merged);
  return merged;
}

function notifyProgress(progress) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("calphy:progress", { detail: progress }),
    );
  }
}

export function celebrate(score, total) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("calphy:quizdone", { detail: { score, total } }),
    );
  }
}

// convenience selectors
export const lessonStatus = (p, key) => p?.Progress?.[key] || "NotStarted";
export const quizScore = (p, id) => {
  const v = p?.QuizScores?.[id];
  return typeof v === "number" ? v : 0;
};
export const quizStatus = (p, id) => p?.QuizProgress?.[id] || "NotStarted";

export function overallPercent(p) {
  const lessons = LESSONS.filter(
    (l) => lessonStatus(p, l.key) === "Finished",
  ).length;
  const quizzes = QUIZZES.filter(
    (q) => quizStatus(p, q.id) === "Finished",
  ).length;
  return Math.round(
    ((lessons + quizzes) / (LESSONS.length + QUIZZES.length)) * 100,
  );
}
