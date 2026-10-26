"use client";

// ============================================================
// Dashboard, progress overview.
// Guest: browser storage. Logged in: synced from PostgreSQL.
// ============================================================
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { useUser } from "@/components/UserContext";
import ProgressRing from "@/components/ProgressRing";
import CalphyMascot from "@/components/CalphyMascot";
import Reveal from "@/components/Reveal";
import { LESSONS } from "@/lib/lessons";
import { QUIZZES, quizLabel } from "@/lib/quizzes";
import {
  lessonStatus,
  quizScore,
  quizStatus,
  overallPercent,
  resetLocalProgress,
} from "@/lib/progress";

export default function DashboardPage() {
  const { user, isLoggedIn, authLoading, progress, logout, refreshProgress } =
    useUser();
  const [dbStatus, setDbStatus] = useState(isLoggedIn ? "checking" : "guest");
  const [resettingDb, setResettingDb] = useState(false);
  const [dbResetMessage, setDbResetMessage] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isLoggedIn) {
        setDbStatus("guest");
        return;
      }
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (alive) setDbStatus(res.ok ? "online" : "offline");
      } catch {
        if (alive) setDbStatus("offline");
      }
    })();
    return () => {
      alive = false;
    };
  }, [isLoggedIn]);

  const lessonsDone = LESSONS.filter(
    (l) => lessonStatus(progress, l.key) === "Finished",
  ).length;
  const quizzesDone = QUIZZES.filter(
    (q) => quizStatus(progress, q.id) === "Finished",
  ).length;
  const quizScores = QUIZZES.map((q) => quizScore(progress, q.id));
  const avgScore = quizzesDone
    ? Math.round(
        quizScores.filter((s) => s > 0).reduce((a, b) => a + b, 0) /
          quizzesDone,
      )
    : 0;
  const overall = overallPercent(progress);

  const resetDatabaseProgress = async () => {
    if (
      !window.confirm(
        "Reset all progress in your account database? This affects your account on all devices.",
      )
    ) {
      return;
    }

    setResettingDb(true);
    setDbResetMessage("");
    try {
      const res = await fetch("/api/progress", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Could not reset database progress.");
      resetLocalProgress();
      await refreshProgress();
      setDbResetMessage("Account progress reset.");
    } catch (err) {
      setDbResetMessage(err.message || "Could not reset database progress.");
    } finally {
      setResettingDb(false);
    }
  };

  return (
    <div className="page-top-space">
      <section className="section-tight pb-5">
        <Container>
          {/* header */}
          <Reveal>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              {isLoggedIn ? (
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: 54,
                    height: 54,
                    fontSize: "1.4rem",
                    background: "var(--ember)",
                  }}
                >
                  {user.username[0].toUpperCase()}
                </span>
              ) : (
                <CalphyMascot size={54} mood="wave" />
              )}
              <div className="flex-grow-1">
                <h1 className="fw-bold h3 mb-1">
                  {authLoading
                    ? "Checking session…"
                    : isLoggedIn
                      ? `Hi, ${user.username}!`
                      : "Your progress"}
                </h1>
                <div className="d-flex flex-wrap gap-2">
                  <span
                    className={`badge-mode ${isLoggedIn ? "user" : "guest"}`}
                  >
                    {isLoggedIn ? "Saved to your account" : "Guest"}
                  </span>
                  {isLoggedIn && dbStatus === "offline" && (
                    <span
                      className="badge-mode guest"
                      style={{
                        background: "var(--bad-tint)",
                        color: "var(--bad)",
                        borderColor: "var(--bad)",
                      }}
                    >
                      Server unreachable, showing this browser&apos;s copy
                    </span>
                  )}
                </div>
              </div>
              <div className="dashboard-actions d-flex flex-wrap">
                {isLoggedIn ? (
                  <>
                    <button
                      className="btn btn-outline-ink btn-sm"
                      onClick={refreshProgress}
                    >
                      <i className="bi bi-arrow-repeat me-1" /> Re-sync
                    </button>
                    <button
                      className="btn btn-outline-ink btn-sm"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-1" /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn btn-flame btn-sm">
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="btn btn-outline-ink btn-sm"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Reveal>

          {!isLoggedIn && !authLoading && (
            <p className="small text-muted mb-4">
              Saved in this browser. Log in to keep it on any device.
            </p>
          )}

          {/* stat cards: three numbers on phones, the ring joins from md up */}
          <Row className="g-2 g-md-3 mb-4">
            <Col md={3} xs={4}>
              <Reveal className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num gradient-text">
                    {lessonsDone}/{LESSONS.length}
                  </div>
                  <div className="stat-label">lessons done</div>
                  <div className="progress-thin mt-2">
                    <div
                      className="bar"
                      style={{
                        width: `${(lessonsDone / LESSONS.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            </Col>
            <Col md={3} xs={4}>
              <Reveal delay={60} className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num gradient-text-cool">
                    {quizzesDone}/{QUIZZES.length}
                  </div>
                  <div className="stat-label">quizzes done</div>
                  <div className="progress-thin mt-2">
                    <div
                      className="bar cool"
                      style={{
                        width: `${(quizzesDone / QUIZZES.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            </Col>
            <Col md={3} xs={4}>
              <Reveal delay={120} className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num" style={{ color: "var(--good)" }}>
                    {avgScore}%
                  </div>
                  <div className="stat-label">avg. quiz score</div>
                  <div className="progress-thin mt-2">
                    <div
                      className="bar green"
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            </Col>
            <Col md={3} className="d-none d-md-block">
              <Reveal delay={180} className="h-100">
                <div className="card-soft stat-card h-100 d-flex align-items-center justify-content-center">
                  <ProgressRing value={overall} size={104} stroke={10}>
                    <span className="fw-bold" style={{ fontSize: "1.3rem" }}>
                      {overall}%
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: "0.68rem" }}
                    >
                      overall
                    </span>
                  </ProgressRing>
                </div>
              </Reveal>
            </Col>
          </Row>

          <Row className="g-4">
            {/* lessons checklist */}
            <Col lg={6}>
              <Reveal className="h-100">
                <div className="card-soft flat p-4 h-100">
                  <h2 className="fw-bold h5 mb-3">
                    <i
                      className="bi bi-list-check me-2"
                      style={{ color: "var(--ember-text)" }}
                    />
                    Lesson progress
                  </h2>
                  {LESSONS.map((l) => {
                    const st = lessonStatus(progress, l.key);
                    return (
                      <div className="lesson-check-row" key={l.key}>
                        {st === "Current" ? (
                          <Link
                            href={`/lessons/${l.slug}`}
                            className="check-dot current"
                            aria-label={`Continue Lesson ${l.n}: ${l.title}`}
                            title={`Continue Lesson ${l.n}`}
                          >
                            <i className="bi bi-play-fill" />
                          </Link>
                        ) : (
                          <span
                            className={`check-dot ${st === "Finished" ? "done" : ""}`}
                          >
                            {st === "Finished" ? (
                              <i className="bi bi-check-lg" />
                            ) : (
                              l.n
                            )}
                          </span>
                        )}
                        <div className="flex-grow-1">
                          <Link
                            href={`/lessons/${l.slug}`}
                            className="fw-semibold text-dark"
                          >
                            {l.title}
                          </Link>
                        </div>
                        {st !== "NotStarted" && (
                          <span
                            className={`lesson-status-tag chip ${st === "Finished" ? "green" : "flame"} d-none d-sm-inline-flex`}
                          >
                            {st === "Finished" ? "Done" : "In progress"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </Col>

            {/* quiz scores */}
            <Col lg={6}>
              <Reveal delay={80} className="h-100">
                <div className="card-soft flat p-4 h-100">
                  <h2 className="fw-bold h5 mb-3">
                    <i
                      className="bi bi-trophy me-2"
                      style={{ color: "var(--cool)" }}
                    />
                    Quiz scores
                  </h2>
                  {QUIZZES.map((q) => {
                    const sc = quizScore(progress, q.id);
                    const st = quizStatus(progress, q.id);
                    return (
                      <div className="mb-3" key={q.id}>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <Link
                            href={`/quizzes/${q.slug}`}
                            className="fw-semibold text-dark small"
                          >
                            {quizLabel(q.id)} · {q.title}
                          </Link>
                          <span
                            className="fw-bold small text-nowrap ms-2"
                            style={{
                              color:
                                sc >= 70
                                  ? "var(--good)"
                                  : sc > 0
                                    ? "var(--ember-text)"
                                    : "var(--muted)",
                            }}
                          >
                            {st === "Finished" ? `${sc}%` : "Not taken"}
                          </span>
                        </div>
                        <div className="progress-thin">
                          <div
                            className={`bar ${sc >= 70 ? "green" : "cool"}`}
                            style={{ width: `${st === "Finished" ? sc : 0}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-4">
                    {isLoggedIn && (
                      <button
                        className="btn btn-sm w-100 mt-2"
                        style={{
                          background: "rgba(239,68,68,.08)",
                          color: "var(--bad)",
                          border: "1px solid rgba(239,68,68,.3)",
                        }}
                        onClick={resetDatabaseProgress}
                        disabled={resettingDb}
                      >
                        <i className="bi bi-database-x me-1" />
                        {resettingDb
                          ? "Resetting account progress…"
                          : "Reset account progress"}
                      </button>
                    )}
                    <button
                      className="btn btn-sm w-100 mt-2"
                      style={{
                        background: "rgba(239,68,68,.08)",
                        color: "var(--bad)",
                        border: "1px solid rgba(239,68,68,.3)",
                      }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Reset all progress stored in THIS browser? (Database records are untouched.)",
                          )
                        ) {
                          resetLocalProgress();
                        }
                      }}
                    >
                      <i className="bi bi-trash3 me-1" /> Reset local progress
                    </button>
                    {dbResetMessage && (
                      <div
                        className={`small mt-2 ${dbResetMessage === "Account progress reset." ? "text-success" : "text-danger"}`}
                        role="status"
                        aria-live="polite"
                      >
                        {dbResetMessage}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
