import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "react-bootstrap";
import { QUIZZES, QUIZ_BY_SLUG, quizLabel } from "@/lib/quizzes";
import { LESSONS, LESSON_BY_KEY } from "@/lib/lessons";
import QuizRunner from "@/components/QuizRunner";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return QUIZZES.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const quiz = QUIZ_BY_SLUG[slug];
  if (!quiz) return { title: "Quiz not found" };
  return { title: `Quiz: ${quiz.title}`, description: quiz.description };
}

// Results-screen link: the next lesson, or the final exam after Lesson 9.
function nextStep(quiz) {
  if (quiz.final) return null;
  const lessonKey = quiz.lessons[quiz.lessons.length - 1];
  const next = LESSONS[LESSONS.findIndex((l) => l.key === lessonKey) + 1];
  if (next)
    return {
      href: `/lessons/${next.slug}`,
      label: `Next: Lesson ${next.n} · ${next.title}`,
    };
  const finalExam = QUIZZES.find((q) => q.final);
  return finalExam
    ? { href: `/quizzes/${finalExam.slug}`, label: "Next: Final exam" }
    : null;
}

export default async function QuizPage({ params }) {
  const { slug } = await params;
  const quiz = QUIZ_BY_SLUG[slug];
  if (!quiz) notFound();

  return (
    <div className="page-top-space">
      <section className="section-tight pb-5">
        <Container>
          <Reveal>
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb small mb-0">
                <li className="breadcrumb-item">
                  <Link href="/learn">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/quizzes">Quizzes</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {quizLabel(quiz.id)}
                </li>
              </ol>
            </nav>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="chip flame">
                <i className={`bi ${quiz.icon}`} /> {quizLabel(quiz.id)}
              </span>
              {quiz.final && (
                <span className="chip cool">
                  <i className="bi bi-collection" /> Covers all{" "}
                  {LESSONS.length} lessons
                </span>
              )}
              {quiz.lessons.map((lk) => {
                const l = LESSON_BY_KEY[lk];
                return (
                  <Link
                    key={lk}
                    href={`/lessons/${l.slug}`}
                    className="chip cool"
                  >
                    <i className="bi bi-journal-bookmark" /> Review Lesson {l.n}
                  </Link>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={60}>
            <QuizRunner quiz={quiz} next={nextStep(quiz)} />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
