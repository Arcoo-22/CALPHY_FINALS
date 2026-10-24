import Link from "next/link";
import { Container } from "react-bootstrap";
import QuizCards from "@/components/QuizCards";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Quizzes",
  description:
    "Auto-graded quizzes on temperature conversions, specific heat, heat transfer modes, latent heat and gas laws.",
};

export default function QuizzesIndexPage() {
  return (
    <div className="page-top-space">
      <section className="section-tight">
        <Container>
          <Reveal>
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb small mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Quizzes
                </li>
              </ol>
            </nav>
            <span className="eyebrow">
              <i className="bi bi-patch-question" /> Assessment
            </span>
            <h1 className="section-title">Quizzes</h1>
            <p className="section-sub mb-4">
              Five banks covering the whole module, temperature conversions (°C,
              °F, K), specific heat &amp; calorimetry calculations,
              heat-transfer identification, latent heat and gas laws. Instant
              explanations after every answer, so you can review the reasoning.
            </p>
          </Reveal>
          <QuizCards />

          <Reveal delay={100}>
            <div className="card-soft flat p-4 mt-4">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <i
                  className="bi bi-info-circle"
                  style={{ fontSize: "1.6rem", color: "var(--cool)" }}
                />
                <p
                  className="small text-muted mb-0 flex-grow-1"
                  style={{ minWidth: 240 }}
                >
                  <b className="text-dark">How scoring works:</b> your best
                  percentage per quiz is stored in
                  <code> user_progress → QuizScores</code> and the attempt in{" "}
                  <code>QuizProgress</code>. Guests: browser storage. Logged-in
                  users: PostgreSQL, synced from any device.
                </p>
                <Link href="/login" className="btn btn-outline-ink btn-sm">
                  Log in to sync
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
