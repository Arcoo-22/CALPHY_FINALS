"use client";

// Quiz hub cards with saved scores.
import Link from "next/link";
import { QUIZZES, quizLabel } from "@/lib/quizzes";
import { useUser } from "@/components/UserContext";
import { quizScore, quizStatus } from "@/lib/progress";
import Reveal from "@/components/Reveal";

export default function QuizCards() {
  const { progress } = useUser();

  return (
    <div className="row g-3">
      {QUIZZES.map((q, i) => {
        const score = quizScore(progress, q.id);
        const status = quizStatus(progress, q.id);
        return (
          <div className="col-md-6 col-xl-4" key={q.id}>
            <Reveal delay={i * 60} className="h-100">
              <Link
                href={`/quizzes/${q.slug}`}
                className="text-reset h-100 d-block"
              >
                <div className="card-soft hover-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span
                      className="icon-tile"
                      style={{
                        background: "var(--ember-tint)",
                        color: "var(--ember-text)",
                      }}
                    >
                      <i className={`bi ${q.icon}`} />
                    </span>
                    <div>
                      <h3 className="fw-bold h5 mb-0">{q.title}</h3>
                      <div className="small text-muted">
                        {q.questions.length} questions · auto-graded
                      </div>
                    </div>
                  </div>
                  <p className="text-muted small flex-grow-1">
                    {q.description}
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {status === "Finished" ? (
                      <>
                        <span className="chip green">
                          <i className="bi bi-trophy" /> best: {score}%
                        </span>
                        <span className="chip">retake any time</span>
                      </>
                    ) : (
                      <span className="chip flame">
                        <i className="bi bi-play-circle" /> Start quiz
                      </span>
                    )}
                    <span
                      className="ms-auto small fw-bold"
                      style={{ color: "var(--ember-text)" }}
                    >
                      {quizLabel(q.id)} <i className="bi bi-arrow-right" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
