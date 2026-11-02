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

// The lesson page links here with ?from=<lessonKey>; passing then finishes
// that lesson and points to the one after it. Without it (opened from
// /quizzes), the quiz stands for all of its lessons.
function quizContext(quiz, from) {
  const lessonKeys = quiz.lessons.includes(from) ? [from] : quiz.lessons;
  const lastKey = lessonKeys[lessonKeys.length - 1];
  const next = LESSONS[LESSONS.findIndex((l) => l.key === lastKey) + 1];
  return {
    lessonKeys,
    nextLesson: next ? { slug: next.slug, n: next.n, title: next.title } : null,
  };
}

export default async function QuizPage({ params, searchParams }) {
  const { slug } = await params;
  const quiz = QUIZ_BY_SLUG[slug];
  if (!quiz) notFound();
  const { from } = await searchParams;
  const { lessonKeys, nextLesson } = quizContext(quiz, from);

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
            <QuizRunner
              quiz={quiz}
              lessonKeys={lessonKeys}
              nextLesson={nextLesson}
            />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
