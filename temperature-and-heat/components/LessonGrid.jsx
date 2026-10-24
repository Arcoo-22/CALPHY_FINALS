"use client";

// Lesson cards grid grouped by unit, with live progress dots.
import Link from "next/link";
import { UNITS, LESSON_BY_KEY } from "@/lib/lessons";
import { useUser } from "@/components/UserContext";
import { lessonStatus } from "@/lib/progress";
import Reveal from "@/components/Reveal";

export default function LessonGrid({ compact = false, home = false }) {
  const { progress } = useUser();
  const nextUnitIndex = UNITS.findIndex((unit) =>
    unit.lessons.some((key) => lessonStatus(progress, key) !== "Finished"),
  );
  const orderedUnits =
    home && nextUnitIndex > 0
      ? [
          UNITS[nextUnitIndex],
          ...UNITS.filter((_, index) => index !== nextUnitIndex),
        ]
      : UNITS;

  return (
    <div className="d-grid gap-4 lesson-unit-grid">
      {orderedUnits.map((unit, ui) => {
        const complete = unit.lessons.every(
          (key) => lessonStatus(progress, key) === "Finished",
        );
        const featuredLessonKey =
          unit.lessons.find(
            (key) => lessonStatus(progress, key) !== "Finished",
          ) || unit.lessons[0];
        return (
          <Reveal key={unit.id} delay={ui * 60}>
            <div
              className={`card-soft flat unit-card p-4 ${home ? (ui === 0 ? "unit-featured" : `unit-rail-row ${complete ? "completed" : ""}`) : ""}`}
            >
              {home && ui > 0 ? (
                <span className="unit-rail-tick" aria-hidden="true" />
              ) : null}
              <div className="unit-card-heading d-flex align-items-center gap-3 mb-3">
                <span
                  className="icon-tile"
                  style={{
                    background: "var(--ember-tint)",
                    color: "var(--ember-text)",
                  }}
                >
                  <i className={`bi ${unit.icon}`} />
                </span>
                <div>
                  <div
                    className="eyebrow mb-0"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Unit {UNITS.indexOf(unit) + 1}
                  </div>
                  <h3 className="fw-bold mb-0 h5">{unit.title}</h3>
                </div>
                <span className="small text-muted ms-auto d-none d-sm-inline-flex">
                  {unit.lessons.length} lessons
                </span>
              </div>
              {(!home || ui === 0) && (
                <p className="text-muted small mb-3">{unit.subtitle}</p>
              )}

              {home && ui > 0 ? (
                <div className="unit-lesson-list">
                  {unit.lessons.map((key) => {
                    const lesson = LESSON_BY_KEY[key];
                    return (
                      <Link
                        key={key}
                        href={`/lessons/${lesson.slug}`}
                        className="unit-lesson-row"
                      >
                        <span className="lesson-num">{lesson.n}</span>
                        <span>{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`row g-3 ${compact ? (home ? "row-cols-1" : "row-cols-1 row-cols-md-2") : "row-cols-1 row-cols-md-2 row-cols-xl-4"}`}
                >
                  {unit.lessons.map((key, li) => {
                    const l = LESSON_BY_KEY[key];
                    const status = lessonStatus(progress, l.key);
                    const isFeaturedLesson = l.key === featuredLessonKey;
                    if (home && !isFeaturedLesson) {
                      return (
                        <div className="col" key={key}>
                          <Link
                            href={`/lessons/${l.slug}`}
                            className="unit-lesson-row"
                          >
                            <span className="lesson-num">{l.n}</span>
                            <span>{l.title}</span>
                          </Link>
                        </div>
                      );
                    }
                    return (
                      <div className="col" key={key}>
                        <Link
                          href={`/lessons/${l.slug}`}
                          className="lesson-card-link text-reset"
                        >
                          <div
                            className={`card-soft hover-card lesson-card p-3 h-100 ${home && isFeaturedLesson ? "lesson-next" : home && ui > 0 ? "lesson-compact" : ""}`}
                          >
                            <span className="lesson-num">{l.n}</span>
                            <div className="lesson-card-content d-flex align-items-start gap-2">
                              <span
                                className="lesson-icon d-inline-flex align-items-center justify-content-center rounded-3"
                                style={{
                                  width: 38,
                                  height: 38,
                                  background: "var(--ember-tint)",
                                  color: "var(--ember-text)",
                                  fontSize: "1.15rem",
                                }}
                              >
                                <i className={`bi ${l.icon}`} />
                              </span>
                              <div className="lesson-card-copy">
                                <div className="lesson-title-link">
                                  {l.title}
                                </div>
                                {(!home || isFeaturedLesson) && (
                                  <div
                                    className="small text-muted mt-1"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {l.tagline}
                                  </div>
                                )}
                              </div>
                            </div>
                            {(!home || isFeaturedLesson) && (
                              <div className="lesson-card-status d-flex align-items-center gap-2 mt-3">
                                {status === "Finished" ? (
                                  <span className="chip green">
                                    <i className="bi bi-check-circle-fill" />{" "}
                                    completed
                                  </span>
                                ) : status === "Current" ? (
                                  <span className="chip flame">
                                    <i className="bi bi-play-circle-fill" /> in
                                    progress
                                  </span>
                                ) : (
                                  <span className="chip">not started</span>
                                )}
                                <span
                                  className="lesson-card-arrow"
                                  aria-hidden="true"
                                >
                                  <i className="bi bi-arrow-right" />
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
