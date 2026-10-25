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
                      : "Your progress (guest)"}
                </h1>
                <div className="d-flex flex-wrap gap-2">
                  <span
                    className={`badge-mode ${isLoggedIn ? "user" : "guest"}`}
                  >
                    {isLoggedIn ? "Synced account" : "Guest mode"}
                  </span>
                  {isLoggedIn && (
                    <span
                      className={`badge-mode ${dbStatus === "online" ? "user" : dbStatus === "offline" ? "guest" : "guest"}`}
                      style={
                        dbStatus === "offline"
                          ? {
                              background: "rgba(239,68,68,.1)",
                              color: "var(--bad)",
                              borderColor: "rgba(239,68,68,.35)",
                            }
                          : undefined
                      }
                    >
                      {dbStatus === "online"
                        ? "Connected to server"
                        : dbStatus === "offline"
                          ? "Server unreachable, using local copy"
                          : "checking connection"}
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

          {!isLoggedIn && (
            <Reveal delay={40}>
              <div className="quiz-feedback good mb-4">
                <i className="bi bi-info-circle-fill me-2" />
                You&apos;re exploring as a <b>guest</b>, everything you do is
                saved in this browser.
                <Link href="/login" className="fw-bold ms-1">
                  Log in
                </Link>{" "}
                to sync.
              </div>
            </Reveal>
          )}

          {/* stat cards */}
          <Row className="g-3 mb-4">
            <Col md={3} xs={6}>
              <Reveal className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num gradient-text">
                    {lessonsDone}/{LESSONS.length}
                  </div>
                  <div className="stat-label">lessons completed</div>
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
            <Col md={3} xs={6}>
              <Reveal delay={60} className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num gradient-text-cool">
                    {quizzesDone}/{QUIZZES.length}
                  </div>
                  <div className="stat-label">quizzes finished</div>
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
            <Col md={3} xs={6}>
              <Reveal delay={120} className="h-100">
                <div className="card-soft stat-card h-100">
                  <div className="stat-num" style={{ color: "var(--good)" }}>
                    {avgScore}%
                  </div>
                  <div className="stat-label">average quiz score</div>
                  <div className="progress-thin mt-2">
                    <div
                      className="bar green"
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            </Col>
            <Col md={3} xs={6}>
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
                            Lesson {l.n}: {l.title}
                          </Link>
                          <div className="small text-muted">{l.tagline}</div>
                        </div>
                        <span
                          className={`lesson-status-tag chip ${st === "Finished" ? "green" : st === "Current" ? "flame" : ""} d-none d-sm-inline-flex`}
                        >
                          {st === "Finished"
                            ? "Done"
                            : st === "Current"
                              ? "In progress"
                              : "New"}
                        </span>
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
                            className="fw-bold small"
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
