"use client";

// Interactive "Check your understanding" mini-quiz embedded in lessons.
import { useMemo, useState } from "react";

export default function MiniQuiz({ items }) {
  const [answers, setAnswers] = useState({}); // idx → chosen option index
  const total = items.length;
  const answered = Object.keys(answers).length;
  const correct = useMemo(
    () =>
      Object.entries(answers).filter(([i, v]) => items[Number(i)].a === v)
        .length,
    [answers, items],
  );

  return (
    <div className="card-soft flat p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h4 className="fw-bold mb-0">
          <i className="bi bi-patch-check me-2 text-warning" />
          Check your understanding
        </h4>
        <span className="chip cool">
          {answered}/{total} answered
          {answered === total ? ` · ${correct} correct` : ""}
        </span>
      </div>

      {items.map((item, qi) => {
        const chosen = answers[qi];
        const done = chosen !== undefined;
        return (
          <div key={qi} className="mb-4">
            <p className="fw-semibold mb-2">
              {qi + 1}. {item.q}
            </p>
            <div className="row g-2">
              {item.options.map((opt, oi) => {
                let cls = "quiz-option";
                if (done) {
                  if (oi === item.a) cls += " correct";
                  else if (oi === chosen) cls += " incorrect";
                }
                return (
                  <div className="col-md-6" key={oi}>
                    <button
                      className={cls}
                      disabled={done}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    >
                      <span className="opt-key">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  </div>
                );
              })}
            </div>
            {done && (
              <div
                className={`quiz-feedback ${chosen === item.a ? "good" : "bad"}`}
              >
                <i
                  className={`bi ${chosen === item.a ? "bi-check-circle-fill" : "bi-lightbulb-fill"} me-2`}
                />
                {item.explain}
              </div>
            )}
          </div>
        );
      })}

      {answered > 0 && (
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-ink btn-sm"
            onClick={() => setAnswers({})}
          >
            <i className="bi bi-arrow-counterclockwise me-1" /> Retry
          </button>
          {answered === total && (
            <span
              className="fw-bold"
              style={{
                color: correct === total ? "var(--good)" : "var(--ember-text)",
              }}
            >
              {correct === total
                ? "Perfect! You nailed every check, take the full quiz for a saved score! 🎉"
                : `${correct}/${total} correct, review the explanations, then retry or take the full quiz.`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
