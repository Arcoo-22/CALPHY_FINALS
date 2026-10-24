import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { LESSONS, getLesson, getUnit } from "@/lib/lessons";
import Reveal from "@/components/Reveal";
import FormulaCard from "@/components/FormulaCard";
import MiniQuiz from "@/components/MiniQuiz";
import SimHost from "@/components/SimHost";
import VideoEmbed from "@/components/VideoEmbed";
import { LessonTracker, MarkCompleteButton } from "@/components/LessonProgress";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return {
    title: `Lesson ${lesson.n}: ${lesson.title}`,
    description: lesson.tagline,
  };
}

function SectionBlock({ s }) {
  return (
    <Reveal className="mb-4">
      <h3 className="fw-bold h5 mb-3">
        <span className="me-2" style={{ color: "var(--ember-text)" }}>
          ▸
        </span>
        {s.heading}
      </h3>
      {s.paragraphs?.map((p, i) => (
        <p key={i} className="text-secondary" style={{ lineHeight: 1.75 }}>
          {p}
        </p>
      ))}
      {s.bullets && (
        <ul className="text-secondary" style={{ lineHeight: 1.9 }}>
          {s.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {s.steps && (
        <ol className="steps-list">
          {s.steps.map((st, i) => (
            <li key={i}>{st}</li>
          ))}
        </ol>
      )}
      {s.formulasInline && (
        <div className="d-flex flex-wrap gap-2 my-2">
          {s.formulasInline.map((f, i) => (
            <span
              key={i}
              className="readout-pill"
              style={{ fontSize: "0.95rem" }}
            >
              <b>{f}</b>
            </span>
          ))}
        </div>
      )}
      {s.table && (
        <div className="table-responsive table-pretty mt-2">
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                {s.table.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Reveal>
  );
}

export default async function LessonPage({ params }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const unit = getUnit(lesson.unit);
  const idx = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  return (
    <>
      <LessonTracker lessonKey={lesson.key} />

      {/* ================= hero ================= */}
      <header className="lesson-hero page-top-space">
        <Container>
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/lessons">Lessons</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Lesson {lesson.n}
              </li>
            </ol>
          </nav>

          <Row className="g-4 align-items-end">
            <Col lg={8}>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="content-label">
                  <i className={`bi ${unit.icon}`} /> {unit.title}
                </span>
                <span className="content-label">
                  <i className="bi bi-joystick" /> simulation
                </span>
                <span className="content-label">
                  <i className="bi bi-youtube" /> video
                </span>
                <span className="content-label">
                  <i className="bi bi-patch-check" /> mini-quiz
                </span>
              </div>
              <h1
                className="fw-bold mb-2"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
              >
                <span className="gradient-text">Lesson {lesson.n}.</span>{" "}
                {lesson.title}
              </h1>
              <p className="section-sub">{lesson.tagline}</p>
            </Col>
            <Col lg={4}>
              <div className="card-soft flat p-3 d-flex align-items-center gap-3">
                <span
                  className="icon-tile"
                  style={{
                    background: "var(--ember-tint)",
                    color: "var(--ember-text)",
                    width: "3.8rem",
                    height: "3.8rem",
                    fontSize: "1.8rem",
                  }}
                >
                  <i className={`bi ${lesson.icon}`} />
                </span>
                <div className="small text-muted">
                  <b className="d-block text-dark">Trace the energy</b>
                  <div className="trace-flow mt-1" style={{ gap: "0.3rem" }}>
                    {lesson.energyTrace.map((t, i) => (
                      <span
                        key={i}
                        className="d-flex align-items-center"
                        style={{ gap: "0.3rem" }}
                      >
                        <span
                          className="trace-step"
                          style={{
                            padding: "0.2rem 0.6rem",
                            fontSize: "0.72rem",
                          }}
                        >
                          {t}
                        </span>
                        {i < lesson.energyTrace.length - 1 && (
                          <span className="trace-arrow">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="mt-4">
            <MarkCompleteButton lessonKey={lesson.key} />
          </div>
        </Container>
      </header>

      {/* ================= overview + objectives ================= */}
      <section className="section-tight">
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <Reveal>
                <div className="card-soft flat p-4 h-100">
                  <h2 className="fw-bold h5 mb-3">
                    <i
                      className="bi bi-compass me-2"
                      style={{ color: "var(--ember-text)" }}
                    />
                    Overview
                  </h2>
                  <p
                    className="text-secondary mb-0"
                    style={{ lineHeight: 1.8 }}
                  >
                    {lesson.overview}
                  </p>
                </div>
              </Reveal>
            </Col>
            <Col lg={5}>
              <Reveal delay={80}>
                <div className="card-soft flat p-4 h-100">
                  <h2 className="fw-bold h5 mb-3">
                    <i
                      className="bi bi-bullseye me-2"
                      style={{ color: "var(--ember-text)" }}
                    />
                    What you will learn
                  </h2>
                  <ul className="mb-0 text-secondary" style={{ lineHeight: 2 }}>
                    {lesson.objectives.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= simulation ================= */}
      <section className="section-tight" id="sim">
        <Container>
          <Reveal>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="eyebrow mb-0">
                <i className="bi bi-joystick" /> Try it yourself
              </span>
              <Link href="/simulations" className="small ms-auto">
                open in the lab <i className="bi bi-box-arrow-up-right" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <SimHost name={lesson.sim} />
          </Reveal>
          {lesson.sim === "ThermometerSim" && (
            <Row className="g-4 mt-1">
              <Col lg={5} className="ms-auto me-auto">
                <Reveal delay={120}>
                  <SimHost name="UnitConverter" />
                </Reveal>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* ================= key terms ================= */}
      <section className="section-tight">
        <Container>
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-bookmark-star me-2"
                style={{ color: "var(--ember-text)" }}
              />
              Key terms
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="keyterm-grid">
              {lesson.keyTerms.map((kt) => (
                <div className="keyterm" key={kt.term}>
                  <b>{kt.term}:</b> <span>{kt.def}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ================= main content ================= */}
      <section className="section-tight">
        <Container>
          <Reveal>
            <h2 className="fw-bold h4 mb-4">
              <i
                className="bi bi-text-paragraph me-2"
                style={{ color: "var(--ember-text)" }}
              />
              Main content
            </h2>
          </Reveal>
          {lesson.sections.map((s, i) => (
            <SectionBlock key={i} s={s} />
          ))}
        </Container>
      </section>

      {/* ================= formulas ================= */}
      <section className="section-tight">
        <Container>
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-calculator me-2"
                style={{ color: "var(--ember-text)" }}
              />
              Formulas
            </h2>
          </Reveal>
          <Row className="g-3">
            {lesson.formulas.map((f, i) => (
              <Col key={i} md={6} xl={4}>
                <Reveal delay={i * 50} className="h-100">
                  <FormulaCard f={f} />
                </Reveal>
              </Col>
            ))}
          </Row>

          {lesson.constantsTable && (
            <Reveal delay={80}>
              <div className="table-responsive table-pretty mt-4">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th colSpan={2}>{lesson.constantsTable.title}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.constantsTable.rows.map((r, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{r[0]}</td>
                        <td>{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* ================= worked examples ================= */}
      <section className="section-tight">
        <Container>
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-pencil-square me-2"
                style={{ color: "var(--ember-text)" }}
              />
              Worked examples
            </h2>
          </Reveal>
          <Row className="g-3">
            {lesson.examples.map((ex, i) => (
              <Col
                key={i}
                md={6}
                xl={i >= 2 && lesson.examples.length > 2 ? 4 : 6}
              >
                <Reveal delay={i * 60} className="h-100">
                  <div className="example-card">
                    <div className="ex-title">
                      <i
                        className="bi bi-mortarboard"
                        style={{ color: "var(--ember-text)" }}
                      />
                      {ex.title}
                    </div>
                    {ex.steps.map((st, j) => (
                      <div className="ex-step" key={j}>
                        {j + 1}. {st}
                      </div>
                    ))}
                    <div className="ex-answer">{ex.answer}</div>
                    {ex.note && <div className="ex-note">{ex.note}</div>}
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= watch out + takeaways ================= */}
      <section className="section-tight">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <Reveal className="h-100">
                <div className="watchout h-100">
                  <h3
                    className="fw-bold h5 mb-3"
                    style={{ color: "var(--ember-text)" }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    Watch out
                  </h3>
                  <ul className="mb-0" style={{ lineHeight: 2 }}>
                    {lesson.watchOut.map((wo, i) => (
                      <li key={i}>{wo}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Col>
            <Col lg={6}>
              <Reveal delay={80} className="h-100">
                <div className="takeaway-card h-100">
                  <h3
                    className="fw-bold h5 mb-3"
                    style={{ color: "var(--good)" }}
                  >
                    <i className="bi bi-check-circle me-2" />
                    Key takeaways
                  </h3>
                  <ul className="mb-0" style={{ lineHeight: 2 }}>
                    {lesson.takeaways.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= video ================= */}
      <section className="section-tight">
        <Container>
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-youtube me-2"
                style={{ color: "var(--ember-text)" }}
              />
              Watch: {lesson.video.title}
            </h2>
          </Reveal>
          <Row>
            <Col lg={9} xl={8}>
              <Reveal delay={60}>
                <VideoEmbed id={lesson.video.id} title={lesson.video.title} />
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= check your understanding ================= */}
      <section className="section-tight pb-5">
        <Container>
          <Reveal>
            <MiniQuiz items={lesson.checks} />
          </Reveal>

          {/* next steps */}
          <Reveal delay={80}>
            <div className="card-soft flat p-4 mt-4">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="flex-grow-1" style={{ minWidth: 240 }}>
                  <h3 className="fw-bold h5 mb-1">Ready to prove it?</h3>
                  <p className="small text-muted mb-0">
                    Take the full graded quiz for this topic, scores save to
                    your dashboard.
                  </p>
                </div>
                <MarkCompleteButton lessonKey={lesson.key} />
                <Link
                  href={`/quizzes/${lesson.quizSlug}`}
                  className="btn btn-flame"
                >
                  <i className="bi bi-patch-question me-1" /> Take the quiz
                </Link>
              </div>
            </div>
          </Reveal>

          {/* prev / next */}
          <div className="d-flex justify-content-between gap-3 mt-4 flex-wrap">
            {prev ? (
              <Link
                href={`/lessons/${prev.slug}`}
                className="btn btn-outline-ink"
              >
                <i className="bi bi-arrow-left me-1" /> Lesson {prev.n}:{" "}
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/lessons/${next.slug}`}
                className="btn btn-outline-ink"
              >
                Lesson {next.n}: {next.title}{" "}
                <i className="bi bi-arrow-right ms-1" />
              </Link>
            ) : (
              <Link href="/quizzes" className="btn btn-cool">
                All quizzes <i className="bi bi-arrow-right ms-1" />
              </Link>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
