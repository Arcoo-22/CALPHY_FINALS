import Link from "next/link";
import { Container } from "react-bootstrap";
import QuizCards from "@/components/QuizCards";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Quizzes",
  description:
    "Auto-graded quizzes: one for each of the nine lessons, plus a final exam covering every topic.",
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
                  <Link href="/learn">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Quizzes
                </li>
              </ol>
            </nav>
            <h1 className="section-title">Quizzes</h1>
            <p className="section-sub mb-4">
              One quiz per lesson, then a final exam on everything. You see the
              explanation after each answer, and your best score is kept.
            </p>
          </Reveal>
          <QuizCards />
        </Container>
      </section>
    </div>
  );
}
