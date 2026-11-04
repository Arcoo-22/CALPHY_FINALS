"use client";

// ============================================================
// Once per browser session, a guest who has started making progress is
// asked to log in or sign up so that progress is saved to their account.
// Dismissing it keeps them in guest mode until the next session.
// ============================================================
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "react-bootstrap";
import { useUser } from "@/components/UserContext";
import { hasProgress } from "@/lib/progress";

const SESSION_KEY = "calphy-save-prompt-shown";
const SHOW_DELAY_MS = 1200;
// auth pages already ask; quizzes shouldn't be interrupted mid-attempt
const QUIET_PATHS = ["/login", "/register", "/quizzes/"];

function alreadyShown() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return true; // storage blocked: never nag
  }
}

function markShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage blocked, nothing to remember */
  }
}

export default function SaveProgressPrompt() {
  const { authLoading, isLoggedIn, progress } = useUser();
  const pathname = usePathname() || "";
  const [show, setShow] = useState(false);

  const quiet = QUIET_PATHS.some((p) => pathname.startsWith(p));
  const eligible =
    !authLoading && !isLoggedIn && !quiet && hasProgress(progress);

  useEffect(() => {
    if (!eligible || alreadyShown()) return;
    const timer = window.setTimeout(() => {
      markShown();
      setShow(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [eligible]);

  const close = () => setShow(false);

  return (
    <Modal
      show={show && !isLoggedIn}
      onHide={close}
      centered
      contentClassName="save-prompt"
      aria-labelledby="save-prompt-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="save-prompt-title" className="h5 fw-bold">
          <i
            className="bi bi-cloud-check me-2"
            style={{ color: "var(--ember-text)" }}
            aria-hidden="true"
          />
          Save your progress
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You&apos;re learning as a guest, so your lessons and quiz scores are
        kept on this device only. Log in or create a free account to keep them
        on your dashboard wherever you sign in.
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-outline-ink" onClick={close}>
          Maybe later
        </button>
        <Link href="/register" className="btn btn-outline-ink" onClick={close}>
          Sign up
        </Link>
        <Link href="/login" className="btn btn-flame" onClick={close}>
          Log in
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
