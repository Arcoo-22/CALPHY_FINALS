"use client";

// Lessons grouped by unit. `home` renders compact lesson rows (the /learn
// page); the default renders cards for /lessons.
import Link from "next/link";
import { UNITS, LESSON_BY_KEY } from "@/lib/lessons";
import { useUser } from "@/components/UserContext";
import { lessonStatus } from "@/lib/progress";

function RowStatus({ status, isNext }) {
  if (status === "Finished")
    return (
      <span className="row-status done">
        <i className="bi bi-check-circle-fill" aria-hidden="true" /> Done
      </span>
    );
  if (isNext) return <span className="row-status next">Up next</span>;
  return null;
}

export default function LessonGrid({ home = false, nextKey = null }) {
  const { progress } = useUser();

  return (
    <div
      className={`d-grid gap-3 gap-md-4 lesson-unit-grid ${home ? "home" : ""}`}
    >
      {UNITS.map((unit, ui) => {
        const doneCount = unit.lessons.filter(
          (key) => lessonStatus(progress, key) === "Finished",
        ).length;

        return (
          <div
            key={unit.id}
            className={`card-soft flat unit-card ${home ? "unit-card-home p-3 p-md-4" : "p-4"}`}
          >
            {home ? (
              <span className="unit-num-overlay" aria-hidden="true">
                {ui + 1}
              </span>
            ) : null}
            <div className="unit-card-heading d-flex align-items-center gap-3 mb-2">
              <span className="icon-tile">
                <i className={`bi ${unit.icon}`} aria-hidden="true" />
              </span>
              <div>
                <div className="unit-number">
                  Unit {ui + 1}
                  {home ? (
                    <span className="text-muted fw-semibold">
                      {" "}
                      · {doneCount}/{unit.lessons.length} done
                    </span>
                  ) : null}
                </div>
                <h2 className="fw-bold mb-0 h5">{unit.title}</h2>
              </div>
              {home ? null : (
                <span className="small text-muted ms-auto text-nowrap">
                  {doneCount}/{unit.lessons.length}
                </span>
              )}
            </div>

            {home ? (
              <div className="unit-lesson-list">
                {unit.lessons.map((key) => {
                  const lesson = LESSON_BY_KEY[key];
                  const status = lessonStatus(progress, key);
                  const isNext = key === nextKey;
                  return (
                    <Link
                      key={key}
                      href={`/lessons/${lesson.slug}`}
                      className={`unit-lesson-row ${isNext ? "is-next" : ""} ${status === "Finished" ? "is-done" : ""}`}
                      aria-current={isNext ? "step" : undefined}
                    >
                      <span className="row-icon" aria-hidden="true">
                        <i className={`bi ${lesson.icon}`} />
                      </span>
                      <span className="flex-grow-1 min-w-0">
                        <span className="row-num">Lesson {lesson.n}</span>
                        <span className="d-block">{lesson.title}</span>
                      </span>
                      <RowStatus status={status} isNext={isNext} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <>
                <p className="text-muted small mb-3">{unit.subtitle}</p>
                <div className="row g-3 row-cols-1 row-cols-md-2 row-cols-xl-4">
                  {unit.lessons.map((key) => {
                    const l = LESSON_BY_KEY[key];
                    const status = lessonStatus(progress, l.key);
                    return (
                      <div className="col" key={key}>
                        <Link
                          href={`/lessons/${l.slug}`}
                          className="lesson-card-link text-reset"
                        >
                          <div className="card-soft hover-card lesson-card p-3 h-100">
                            <span className="lesson-num">{l.n}</span>
                            <div className="lesson-card-content d-flex align-items-start gap-2">
                              <span className="lesson-icon icon-tile">
                                <i className={`bi ${l.icon}`} aria-hidden="true" />
                              </span>
                              <div className="lesson-card-copy">
                                <div className="lesson-title-link">
                                  {l.title}
                                </div>
                                <div className="lesson-card-tagline small text-muted mt-1">
                                  {l.tagline}
                                </div>
                              </div>
                            </div>
                            {status !== "NotStarted" && (
                              <div className="lesson-card-status mt-2">
                                {status === "Finished" ? (
                                  <span className="chip green">
                                    <i className="bi bi-check-circle-fill" />{" "}
                                    completed
                                  </span>
                                ) : (
                                  <span className="chip flame">
                                    <i className="bi bi-play-circle-fill" /> in
                                    progress
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
