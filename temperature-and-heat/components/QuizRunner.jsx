"use client";

// ============================================================
// QuizRunner, full quiz flow:
//   shuffled MC options + numeric entry with tolerance,
//   per-question feedback with explanations, score ring,
//   saves to progress (localStorage + PostgreSQL when logged in),
//   fires calphy:quizdone so the mascot celebrates.
// ============================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import ProgressRing from "@/components/ProgressRing";
import { saveQuizScore, celebrate } from "@/lib/progress";
import { useUser } from "@/components/UserContext";

function shuffleWithKey(arr, key) {
  const idx = arr.map((_, i) => i);
  let seed = 2166136261;
  for (const character of key) {
    seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  }
  for (let i = idx.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx; // position → original index
}

export default function QuizRunner({ quiz }) {
  const { isLoggedIn } = useUser();
  const [round, setRound] = useState(0); // bump to reshuffle
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null); // original option index (mc)
  const [numInput, setNumInput] = useState("");
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState([]); // {correct:boolean}
  const [finished, setFinished] = useState(false);

  // per-round shuffled option order for each MC question
  const orders = useMemo(
    () =>
      quiz.questions.map((q, questionIndex) =>
        q.type === "mc"
          ? shuffleWithKey(q.options, `${quiz.id}:${round}:${questionIndex}`)
          : null,
      ),
    [quiz, round],
  );

  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const score = results.filter((r) => r.correct).length;

  const grade = (correct) => {
    setLocked(true);
    const nextResults = [...results, { correct }];
    setResults(nextResults);
    if (idx + 1 >= total) {
      const finalScore = nextResults.filter((r) => r.correct).length;
      const pct = Math.round((finalScore / total) * 100);
      setTimeout(() => {
        setFinished(true);
        saveQuizScore(quiz.id, pct, isLoggedIn);
        celebrate(finalScore, total);
      }, 650);
    }
  };

  const chooseMc = (origIdx) => {
    if (locked) return;
    setSelected(origIdx);
    grade(origIdx === q.a);
  };

  const submitNumeric = () => {
    if (locked || numInput.trim() === "") return;
    const val = parseFloat(numInput.replace(/,/g, ""));
    if (isNaN(val)) return;
    grade(Math.abs(val - q.answer) <= (q.tol ?? 0.01));
  };

  const next = () => {
    setIdx(idx + 1);
    setSelected(null);
    setNumInput("");
    setLocked(false);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIdx(0);
    setSelected(null);
    setNumInput("");
    setLocked(false);
    setResults([]);
    setFinished(false);
  };

  // ---------------- finished screen ----------------
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const verdict =
      pct >= 90
        ? {
            icon: "bi-trophy-fill",
            text: "Outstanding! You've mastered this topic.",
            color: "var(--good)",
          }
        : pct >= 70
          ? {
              icon: "bi-award-fill",
              text: "Great job! A quick review and you'll hit 100%.",
              color: "var(--ember-text)",
            }
          : pct >= 50
            ? {
                icon: "bi-arrow-repeat",
                text: "Good start. Revisit the lesson examples and retry.",
                color: "var(--ember-text)",
              }
            : {
                icon: "bi-book",
                text: "Time to re-read the lesson and play with the simulation. You've got this!",
                color: "var(--bad)",
              };

    return (
      <div
        className="card-soft flat p-4 p-md-5 text-center"
        style={{ maxWidth: 620, margin: "0 auto" }}
      >
        <div className="d-flex justify-content-center mb-3">
          <ProgressRing value={pct} size={160}>
            <span className="score-num gradient-text">{pct}%</span>
            <span className="text-muted small fw-semibold">
              {score}/{total} correct
            </span>
          </ProgressRing>
        </div>
        <h3 className="fw-bold mb-1">
          <i
            className={`bi ${verdict.icon} me-2`}
            style={{ color: verdict.color }}
          />
          {quiz.title} complete!
        </h3>
        <p className="text-muted mb-4">{verdict.text}</p>

        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          <span className="chip green">
            <i className="bi bi-database-check" />
            {isLoggedIn
              ? "Score saved to your account (PostgreSQL)"
              : "Score saved in this browser (guest)"}
          </span>
          {!isLoggedIn && (
            <Link
              href="/login"
              className="chip cool"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-cloud-arrow-up" /> Log in to sync scores
            </Link>
          )}
        </div>

        {/* per-question review */}
        <div className="d-flex flex-wrap justify-content-center gap-1 mb-4">
          {results.map((r, i) => (
            <span
              key={i}
              title={`Question ${i + 1}: ${r.correct ? "correct" : "incorrect"}`}
              className="rounded-2 d-inline-flex align-items-center justify-content-center"
              style={{
                width: 26,
                height: 26,
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "var(--surface)",
                background: r.correct ? "var(--good)" : "var(--bad)",
              }}
              aria-label={`Question ${i + 1}: ${r.correct ? "correct" : "incorrect"}`}
            >
              <i
                className={`bi ${r.correct ? "bi-check" : "bi-x"}`}
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
        <div className="d-flex justify-content-center gap-3 small text-muted mb-4">
          <span>
            <i
              className="bi bi-check-circle-fill me-1"
              style={{ color: "var(--good)" }}
            />
            Correct
          </span>
          <span>
            <i
              className="bi bi-x-circle-fill me-1"
              style={{ color: "var(--bad)" }}
            />
            Review
          </span>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button className="btn btn-flame" onClick={restart}>
            <i className="bi bi-arrow-counterclockwise me-1" /> Retake quiz
          </button>
          <Link href="/quizzes" className="btn btn-outline-ink">
            <i className="bi bi-grid me-1" /> All quizzes
          </Link>
          <Link href="/dashboard" className="btn btn-ink">
            <i className="bi bi-graph-up-arrow me-1" /> Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- question screen ----------------
  const pctDone = Math.round((idx / total) * 100);
  return (
    <div
      className="card-soft flat p-4 p-md-5"
      style={{ maxWidth: 760, margin: "0 auto" }}
    >
      {/* header */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="chip flame">
          <i className={`bi ${quiz.icon}`} /> {quiz.title}
        </span>
        <span className="text-muted small fw-semibold">
          Question {idx + 1} of {total} · score {score}
        </span>
      </div>
      <div className="progress-thin mb-4">
        <div className="bar" style={{ width: `${pctDone}%` }} />
      </div>

      <h4 className="fw-bold mb-4" style={{ lineHeight: 1.4 }}>
        {q.prompt}
      </h4>

      {q.type === "mc" ? (
        <div className="d-grid gap-2">
          {orders[idx].map((origIdx, pos) => {
            let cls = "quiz-option";
            if (locked) {
              if (origIdx === q.a) cls += " correct";
              else if (origIdx === selected) cls += " incorrect";
            } else if (origIdx === selected) cls += " selected";
            return (
              <button
                key={pos}
                className={cls}
                disabled={locked}
                onClick={() => chooseMc(origIdx)}
              >
                <span className="opt-key">{String.fromCharCode(65 + pos)}</span>
                {q.options[origIdx]}
                {locked && origIdx === q.a && (
                  <i className="bi bi-check-circle-fill ms-auto" />
                )}
                {locked && origIdx === selected && origIdx !== q.a && (
                  <i className="bi bi-x-circle-fill ms-auto" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <input
              className="form-control-calphy"
              style={{ maxWidth: 240 }}
              type="text"
              inputMode="decimal"
              placeholder="Your answer"
              value={numInput}
              disabled={locked}
              onChange={(e) => setNumInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !locked && submitNumeric()}
            />
            <span className="text-muted fw-semibold">{q.unit}</span>
            {!locked && (
              <button
                className="btn btn-flame btn-sm"
                onClick={submitNumeric}
                disabled={numInput.trim() === ""}
              >
                Check <i className="bi bi-arrow-right ms-1" />
              </button>
            )}
          </div>
          {locked && (
            <div className="mt-2 small text-muted">
              Correct answer:{" "}
              <b style={{ color: "var(--good)" }}>
                {q.answer.toLocaleString()} {q.unit}
              </b>
              {q.tol ? <span className="ms-1">(±{q.tol} accepted)</span> : null}
            </div>
          )}
        </div>
      )}

      {/* feedback */}
      {locked && (
        <>
          <div
            className={`quiz-feedback ${
              q.type === "mc"
                ? selected === q.a
                : Math.abs(parseFloat(numInput.replace(/,/g, "")) - q.answer) <=
                    (q.tol ?? 0.01)
                  ? "good"
                  : "bad"
            }`}
          >
            <b>
              <i
                className={`bi ${
                  (
                    q.type === "mc"
                      ? selected === q.a
                      : Math.abs(
                          parseFloat(numInput.replace(/,/g, "")) - q.answer,
                        ) <= (q.tol ?? 0.01)
                  )
                    ? "bi-check-circle-fill"
                    : "bi-info-circle-fill"
                } me-2`}
              />
              {(
                q.type === "mc"
                  ? selected === q.a
                  : Math.abs(
                      parseFloat(numInput.replace(/,/g, "")) - q.answer,
                    ) <= (q.tol ?? 0.01)
              )
                ? "Correct!"
                : "Not quite."}
            </b>{" "}
            {q.explain}
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-ink" onClick={next}>
              {idx + 1 >= total ? "See my score" : "Next question"}{" "}
              <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
