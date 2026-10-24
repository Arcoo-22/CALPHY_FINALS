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
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Lessons
                </li>
              </ol>
            </nav>
            <span className="eyebrow">
              <i className="bi bi-journal-bookmark" /> Curriculum
            </span>
            <h1 className="section-title">
              All lessons,{" "}
              <span className="gradient-text">Temperature &amp; Heat</span>
            </h1>
            <p className="section-sub mb-4">
              Follow the units in order, or jump straight to what you need. Each
              lesson packs an overview, key terms, worked examples, a
              simulation, a video and an interactive check.
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
