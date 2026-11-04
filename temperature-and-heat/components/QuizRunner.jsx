"use client";

// ============================================================
// QuizRunner, form-style quiz:
//   every question on one page, no feedback until the form is submitted,
//   questions and MC options reshuffled on every attempt,
//   numeric entry with tolerance,
//   after submitting: score ring, then each question with the learner's
//   answer, the correct answer and the explanation,
//   saves to progress (localStorage + PostgreSQL when logged in),
//   a passing score finishes the quiz's lesson and links to the next step,
//   fires calphy:quizdone so the mascot celebrates.
// ============================================================
import { useEffect, useState } from "react";
import Link from "next/link";
import ProgressRing from "@/components/ProgressRing";
import { saveQuizScore, completeLessons, celebrate } from "@/lib/progress";
import { PASS_PERCENT } from "@/lib/quizzes";
import { LESSON_BY_KEY } from "@/lib/lessons";
import { useUser } from "@/components/UserContext";

// Fisher–Yates over indices: position → original index
function shuffledIndices(n) {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

const sameOrder = (a, b) => !!b && a.every((v, i) => v === b[i]);

// A fresh attempt: random question order (never a repeat of the last one
// when there is more than one possible order) and random MC option orders.
function makeAttempt(quiz, prev) {
  let questionOrder = shuffledIndices(quiz.questions.length);
  for (let tries = 0; tries < 5 && sameOrder(questionOrder, prev?.questionOrder); tries++)
    questionOrder = shuffledIndices(quiz.questions.length);
  const optionOrders = quiz.questions.map((q) =>
    q.type === "mc" ? shuffledIndices(q.options.length) : null,
  );
  return { questionOrder, optionOrders };
}

const parseNumber = (text) => parseFloat(String(text).replace(/,/g, ""));

const isAnswered = (q, answer) =>
  q.type === "mc" ? answer !== undefined : !Number.isNaN(parseNumber(answer ?? ""));

const isCorrect = (q, answer) =>
  q.type === "mc"
    ? answer === q.a
    : Math.abs(parseNumber(answer) - q.answer) <= (q.tol ?? 0.01);

const formatCorrect = (q) =>
  q.type === "mc"
    ? q.options[q.a]
    : `${q.answer.toLocaleString()} ${q.unit}${q.tol ? ` (±${q.tol} accepted)` : ""}`;

export default function QuizRunner({ quiz, next: nextStep }) {
  const { isLoggedIn } = useUser();
  // null until mounted: Math.random can't run during SSR without a hydration mismatch
  const [attempt, setAttempt] = useState(null);
  // keyed by original question index: MC → original option index, numeric → text
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showMissing, setShowMissing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempt(makeAttempt(quiz));
  }, [quiz]);

  const total = quiz.questions.length;
  const answeredCount = quiz.questions.filter((q, i) =>
    isAnswered(q, answers[i]),
  ).length;
  const score = quiz.questions.filter((q, i) => isCorrect(q, answers[i])).length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= PASS_PERCENT;

  // before the handlers: the React Compiler reads attempt for their memo keys
  if (!attempt) {
    return (
      <div
        className="card-soft flat p-4 p-md-5 text-center text-muted"
        style={{ maxWidth: 760, margin: "0 auto" }}
      >
        <span className="spinner-border spinner-border-sm me-2" />
        Shuffling questions…
      </div>
    );
  }

  const setAnswer = (qIndex, value) =>
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));

  const submit = (e) => {
    e.preventDefault();
    const firstMissing = attempt.questionOrder.find(
      (qi) => !isAnswered(quiz.questions[qi], answers[qi]),
    );
    if (firstMissing !== undefined) {
      setShowMissing(true);
      document
        .getElementById(`quiz-q-${firstMissing}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitted(true);
    saveQuizScore(quiz.id, pct, isLoggedIn);
    if (passed) completeLessons(quiz.lessons, isLoggedIn);
    celebrate(score, total);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAttempt((prev) => makeAttempt(quiz, prev));
    setAnswers({});
    setSubmitted(false);
    setShowMissing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {submitted ? (
        <ResultSummary
          quiz={quiz}
          score={score}
          total={total}
          pct={pct}
          passed={passed}
          isLoggedIn={isLoggedIn}
          nextStep={nextStep}
          onRestart={restart}
        />
      ) : (
        <div className="card-soft flat p-3 p-md-4 mb-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <span className="chip flame">
              <i className={`bi ${quiz.icon}`} /> {quiz.title}
            </span>
            <span className="text-muted small fw-semibold">
              {answeredCount} of {total} answered
            </span>
          </div>
          <div className="progress-thin">
            <div
              className="bar"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
          <p className="small text-muted mb-0 mt-2">
            Answer every question, then submit. Your score and the correct
            answers appear after you submit.
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        {attempt.questionOrder.map((qi, pos) => (
          <QuestionCard
            key={qi}
            n={pos + 1}
            qIndex={qi}
            q={quiz.questions[qi]}
            optionOrder={attempt.optionOrders[qi]}
            answer={answers[qi]}
            onAnswer={(value) => setAnswer(qi, value)}
            submitted={submitted}
            missing={showMissing && !isAnswered(quiz.questions[qi], answers[qi])}
          />
        ))}

        {!submitted && (
          <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
            <button type="submit" className="btn btn-flame">
              <i className="bi bi-send me-1" /> Submit answers
            </button>
            {showMissing && answeredCount < total && (
              <span
                className="small fw-semibold"
                role="alert"
                style={{ color: "var(--bad)" }}
              >
                {total - answeredCount} question
                {total - answeredCount === 1 ? " is" : "s are"} still unanswered.
              </span>
            )}
          </div>
        )}
      </form>

      {submitted && (
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
          <button type="button" className="btn btn-flame" onClick={restart}>
            <i className="bi bi-arrow-counterclockwise me-1" /> Retake quiz
          </button>
          <Link href="/quizzes" className="btn btn-outline-ink">
            <i className="bi bi-grid me-1" /> All quizzes
          </Link>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ n, qIndex, q, optionOrder, answer, onAnswer, submitted, missing }) {
  const promptId = `quiz-q-${qIndex}-prompt`;
  const correct = submitted && isCorrect(q, answer);
  const state = submitted
    ? correct
      ? "is-correct"
      : "is-wrong"
    : missing
      ? "is-missing"
      : "";

  return (
    <fieldset id={`quiz-q-${qIndex}`} className={`card-soft flat quiz-question ${state}`}>
      <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
        <legend id={promptId} className="quiz-prompt">
          <span className="quiz-num">{n}.</span> {q.prompt}
        </legend>
        {submitted && (
          <span className={`quiz-mark ${correct ? "good" : "bad"}`}>
            <i
              className={`bi ${correct ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}
              aria-hidden="true"
            />
            {correct ? "1/1" : "0/1"}
          </span>
        )}
      </div>

      {q.type === "mc" ? (
        <div className="d-grid gap-2" role="radiogroup" aria-labelledby={promptId}>
          {optionOrder.map((origIdx, pos) => {
            let cls = "quiz-option";
            if (submitted) {
              if (origIdx === q.a) cls += " correct";
              else if (origIdx === answer) cls += " incorrect";
            } else if (origIdx === answer) cls += " selected";
            return (
              <button
                key={origIdx}
                type="button"
                role="radio"
                aria-checked={origIdx === answer}
                className={cls}
                disabled={submitted}
                onClick={() => onAnswer(origIdx)}
              >
                <span className="opt-key">{String.fromCharCode(65 + pos)}</span>
                {q.options[origIdx]}
                {submitted && origIdx === q.a && (
                  <i className="bi bi-check-circle-fill ms-auto" aria-label="Correct answer" />
                )}
                {submitted && origIdx === answer && origIdx !== q.a && (
                  <i className="bi bi-x-circle-fill ms-auto" aria-label="Your answer" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <input
            className={`form-control-calphy ${submitted ? (correct ? "is-correct" : "is-wrong") : ""}`}
            style={{ maxWidth: 240 }}
            type="text"
            placeholder="Your answer"
            aria-labelledby={promptId}
            value={answer ?? ""}
            disabled={submitted}
            onChange={(e) => onAnswer(e.target.value)}
          />
          <span className="text-muted fw-semibold">{q.unit}</span>
        </div>
      )}

      {missing && (
        <div className="small fw-semibold mt-2" style={{ color: "var(--bad)" }}>
          This question needs an answer.
        </div>
      )}

      {submitted && (
        <div className={`quiz-feedback ${correct ? "good" : "bad"}`}>
          {!correct && (
            <div className="mb-1">
              Correct answer: <b>{formatCorrect(q)}</b>
            </div>
          )}
          {q.explain}
        </div>
      )}
    </fieldset>
  );
}

function ResultSummary({ quiz, score, total, pct, passed, isLoggedIn, nextStep, onRestart }) {
  const lessonNames = quiz.lessons
    .map((key) => `Lesson ${LESSON_BY_KEY[key].n}`)
    .join(" & ");
  const verdict =
    pct >= 90
      ? { icon: "bi-trophy-fill", text: "Outstanding! You've mastered this topic.", color: "var(--good)" }
      : pct >= 70
        ? { icon: "bi-award-fill", text: "Great job! A quick review and you'll hit 100%.", color: "var(--ember-text)" }
        : pct >= 50
          ? { icon: "bi-arrow-repeat", text: "Good start. Check the answers below and retry.", color: "var(--ember-text)" }
          : { icon: "bi-book", text: "Time to re-read the lesson and play with the simulation. You've got this!", color: "var(--bad)" };

  return (
    <div className="card-soft flat p-4 p-md-5 text-center mb-3">
      <div className="d-flex justify-content-center mb-3">
        <ProgressRing value={pct} size={160}>
          <span className="score-num gradient-text">{pct}%</span>
          <span className="text-muted small fw-semibold">
            {score}/{total} correct
          </span>
        </ProgressRing>
      </div>
      <h3 className="fw-bold mb-1">
        <i className={`bi ${verdict.icon} me-2`} style={{ color: verdict.color }} />
        {quiz.title} complete!
      </h3>
      <p className="text-muted mb-2">{verdict.text}</p>
      <p className="small fw-semibold mb-3">
        {passed ? (
          <span style={{ color: "var(--good)" }}>
            <i className="bi bi-check-circle-fill me-1" />
            {quiz.final ? "Final exam passed" : `${lessonNames} marked complete`}
          </span>
        ) : (
          <span className="text-muted">
            Score {PASS_PERCENT}% or higher to{" "}
            {quiz.final ? "pass the final exam" : `complete ${lessonNames}`}
          </span>
        )}
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {isLoggedIn ? (
          <span className="chip green">
            <i className="bi bi-database-check" />
            Score saved to your account
          </span>
        ) : (
          <Link href="/login" className="chip cool" style={{ cursor: "pointer" }}>
            <i className="bi bi-cloud-arrow-up" /> Log in to sync scores
          </Link>
        )}
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-2">
        <Link
          href={nextStep ? nextStep.href : "/dashboard"}
          className={`btn ${passed ? "btn-flame" : "btn-outline-ink"}`}
        >
          {nextStep ? nextStep.label : "Go to dashboard"}{" "}
          <i className="bi bi-arrow-right ms-1" />
        </Link>
        <button
          type="button"
          className={`btn ${passed ? "btn-outline-ink" : "btn-flame"}`}
          onClick={onRestart}
        >
          <i className="bi bi-arrow-counterclockwise me-1" /> Retake quiz
        </button>
        {nextStep && (
          <Link href="/dashboard" className="btn btn-ink">
            <i className="bi bi-graph-up-arrow me-1" /> Dashboard
          </Link>
        )}
      </div>
      <p className="small text-muted mt-3 mb-0">
        Scroll down to review each question.
      </p>
    </div>
  );
}
