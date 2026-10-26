import Link from "next/link";
import { Container } from "react-bootstrap";
import LessonGrid from "@/components/LessonGrid";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Lessons",
  description:
    "Nine interactive lessons on Temperature and Heat, grouped into four units with simulations, videos and mini-quizzes.",
};

export default function LessonsIndexPage() {
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
                  Lessons
                </li>
              </ol>
            </nav>
            <h1 className="section-title">Lessons</h1>
            <p className="section-sub mb-4">
              Follow the units in order, or jump to any lesson.
            </p>
          </Reveal>
        </Container>
      </section>
      <section className="pb-5">
        <Container>
          <LessonGrid />
        </Container>
      </section>
    </div>
  );
}
