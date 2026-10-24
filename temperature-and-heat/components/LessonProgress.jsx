"use client";

// ============================================================
// LessonProgressControls, marks the lesson "Current" on first
// visit, offers "Mark as complete", and shows prev/next links.
// ============================================================
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/UserContext";
import { lessonStatus, markLesson } from "@/lib/progress";

export function LessonTracker({ lessonKey }) {
  const did = useRef(false);
  const { progress, isLoggedIn } = useUser();
  useEffect(() => {
    if (did.current) return;
    did.current = true;
    if (lessonStatus(progress, lessonKey) === "NotStarted") {
      markLesson(lessonKey, "Current", isLoggedIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export function MarkCompleteButton({ lessonKey }) {
  const { progress, isLoggedIn } = useUser();
  const status = lessonStatus(progress, lessonKey);
  const [celebrating, setCelebrating] = useState(false);

  const onClick = async () => {
    if (status === "Finished") return;
    await markLesson(lessonKey, "Finished", isLoggedIn);
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 2400);
  };

  return (
    <div className="d-flex flex-wrap align-items-center gap-2">
      {celebrating &&
        Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="confetti-piece"
            aria-hidden="true"
            style={{
              left: `${(index * 37) % 100}%`,
              width: `${6 + (index % 3) * 2}px`,
              height: `${8 + (index % 4) * 2}px`,
              backgroundColor: [
                "var(--ember)",
                "var(--flame-glow)",
                "var(--cool)",
              ][index % 3],
              animationDuration: `${1.8 + (index % 4) * 0.14}s`,
              animationDelay: `${(index % 6) * 0.06}s`,
            }}
          />
        ))}
      <button
        className={status === "Finished" ? "btn btn-cool" : "btn btn-flame"}
        onClick={onClick}
        disabled={status === "Finished"}
      >
        {status === "Finished" ? (
          <>
            <i className="bi bi-check-circle-fill me-1" /> Lesson completed
          </>
        ) : (
          <>
            <i className="bi bi-flag-fill me-1" /> Mark lesson as complete
          </>
        )}
      </button>
      <span className={`badge-mode ${isLoggedIn ? "user" : "guest"}`}>
        {isLoggedIn ? "saved to your account" : "saved in this browser (guest)"}
      </span>
    </div>
  );
}
