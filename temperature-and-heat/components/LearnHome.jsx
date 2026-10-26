"use client";

// Main page for returning visitors: intro, next lesson, then lessons,
// simulations, quizzes and Calphy + video, each with a short opener.
import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import LessonGrid from "@/components/LessonGrid";
import SimPreviewStrip from "@/components/SimPreviewStrip";
import QuizCards from "@/components/QuizCards";
import CalphyMascot from "@/components/CalphyMascot";
import SectionHead from "@/components/SectionHead";
import VideoEmbed from "@/components/VideoEmbed";
import { LESSONS, UNITS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";
import { SIM_GROUPS } from "@/lib/simulations";
import { lessonStatus } from "@/lib/progress";
import { markVisited } from "@/lib/visit";

const SIM_COUNT = SIM_GROUPS.reduce((n, g) => n + g.sims.length, 0);

export default function LearnHome() {
  const { user, isLoggedIn, progress } = useUser();

  useEffect(() => {
    markVisited();
  }, []);

  const done = LESSONS.filter(
    (l) => lessonStatus(progress, l.key) === "Finished",
  ).length;
  const next =
    LESSONS.find((l) => lessonStatus(progress, l.key) === "Current") ||
    LESSONS.find((l) => lessonStatus(progress, l.key) !== "Finished");
  const started = LESSONS.some(
    (l) => lessonStatus(progress, l.key) !== "NotStarted",
  );

  return (
    <>
      <header className="learn-intro card-soft flat mb-4">
        <div className="learn-intro-copy">
          <span className="eyebrow learn-intro-eyebrow mb-2">
            {isLoggedIn
              ? `Welcome back, ${user.username}`
              : "Physics · Thermal physics"}
          </span>
          <h1 className="section-title learn-intro-title mb-2">
            Temperature <span className="gradient-text">&amp; Heat</span>
          </h1>
          <p className="learn-intro-sub mb-3">
            From thermometer scales to gas laws. Each lesson pairs a short read
            with a simulation you can drag and a quick check.
          </p>
          <p className="learn-intro-meta mb-3">
            {LESSONS.length} lessons · {SIM_COUNT} simulations ·{" "}
            {QUIZZES.length} quizzes
          </p>
          <div className="learn-intro-progress">
            <div
              className="progress-thin"
              role="progressbar"
              aria-label="Lessons done"
              aria-valuemin={0}
              aria-valuemax={LESSONS.length}
              aria-valuenow={done}
            >
              <div
                className="bar"
                style={{ width: `${(done / LESSONS.length) * 100}%` }}
              />
            </div>
            <span className="small fw-semibold text-nowrap">
              {done}/{LESSONS.length} lessons done
            </span>
          </div>
        </div>
        <div className="learn-intro-mascot d-none d-md-block" aria-hidden="true">
          <CalphyMascot size={120} />
        </div>
      </header>

      {next ? (
        <Link
          href={`/lessons/${next.slug}`}
          className="continue-card card-soft flat mb-4"
        >
          <span className="icon-tile" aria-hidden="true">
            <i className={`bi ${next.icon}`} />
          </span>
          <span className="flex-grow-1 min-w-0">
            <span className="continue-label">
              {started ? "Continue" : "Start here"} · Lesson {next.n}
            </span>
            <span className="continue-title">{next.title}</span>
          </span>
          <i className="bi bi-arrow-right continue-arrow" aria-hidden="true" />
        </Link>
      ) : (
        <div className="continue-card card-soft flat mb-4">
          <span className="icon-tile" aria-hidden="true">
            <i className="bi bi-check2-all" />
          </span>
          <span className="flex-grow-1">
            <span className="continue-label">All lessons done</span>
            <span className="continue-title">Test yourself in the quizzes</span>
          </span>
          <Link href="/quizzes" className="btn btn-flame btn-sm">
            Open quizzes
          </Link>
        </div>
      )}

      <section className="learn-section" aria-labelledby="lessons-title">
        <SectionHead
          id="lessons-title"
          icon="bi-signpost-split"
          tag="Browse by unit"
          title={
            <>
              {UNITS.length} units.{" "}
              <span className="gradient-text">One warm story.</span>
            </>
          }
          sub="Each unit builds on the last: what temperature is, how heat moves, how to count it, and what gases do when they get hot."
          actions={
            <Link href="/lessons" className="small fw-semibold">
              All lessons
            </Link>
          }
        />
        <LessonGrid home nextKey={next?.key} />
      </section>

      <SimPreviewStrip />

      <section className="learn-section" aria-labelledby="quiz-section-title">
        <SectionHead
          id="quiz-section-title"
          icon="bi-patch-question"
          tag="Check yourself"
          title={
            <>
              Quizzes that <span className="gradient-text">save your score</span>
            </>
          }
          sub="See the explanation after every answer. Your best score per quiz is kept on your dashboard."
          actions={
            <Link href="/dashboard" className="small fw-semibold">
              My dashboard
            </Link>
          }
        />
        <QuizCards />
      </section>

      <section className="learn-section" aria-labelledby="media-title">
        <SectionHead
          id="media-title"
          icon="bi-play-btn"
          tag="Watch & learn"
          title={
            <>
              See heat move in <span className="gradient-text">5 minutes</span>
            </>
          }
          sub="A short visual intro to conduction, convection and radiation. Every lesson ends with its own video."
        />
        <div className="learn-media">
          <div className="card-soft flat learn-mascot-card flex-column align-items-stretch">
            <div className="learn-mascot-body">
              <CalphyMascot size={104} />
              <h3 className="fw-bold h5 mb-1 mt-2">
                Meet <span className="gradient-text">Calphy</span>
              </h3>
              <p className="mb-0">
                Your flame study buddy. Calphy shows up in lessons and quizzes
                to cheer you on and flag the tricky parts.
              </p>
            </div>
            <div className="learn-save-note mt-auto">
              <i className="bi bi-cloud-check" aria-hidden="true" />
              {isLoggedIn ? (
                <span>
                  Your progress is saved to your account.{" "}
                  <Link href="/dashboard" className="fw-semibold">
                    See your dashboard
                  </Link>
                </span>
              ) : (
                <span>
                  Progress saves in this browser.{" "}
                  <Link href="/register" className="fw-semibold">
                    Create a free account
                  </Link>{" "}
                  to keep it on any device.
                </span>
              )}
            </div>
          </div>
          <div className="card-soft flat learn-video-card">
            <VideoEmbed
              id="Me60Ti0E_rY"
              title="Heat Transfer – Conduction, Convection and Radiation"
            />
          </div>
        </div>
      </section>
    </>
  );
}
