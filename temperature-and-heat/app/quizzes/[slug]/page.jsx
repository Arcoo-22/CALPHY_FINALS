import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "react-bootstrap";
import { QUIZZES, QUIZ_BY_SLUG, quizLabel } from "@/lib/quizzes";
import { LESSON_BY_KEY } from "@/lib/lessons";
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
                  <Link href="/">Home</Link>
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
            <QuizRunner quiz={quiz} />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
