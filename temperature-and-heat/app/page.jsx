import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import LessonGrid from "@/components/LessonGrid";
import QuizCards from "@/components/QuizCards";
import Reveal from "@/components/Reveal";
import CalphyMascot from "@/components/CalphyMascot";
import VideoEmbed from "@/components/VideoEmbed";
import SimHost from "@/components/SimHost";
import { UNITS, LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

export const metadata = {
  title: "CalphyLearn · Temperature and Heat",
  description:
    "Interactive tutorials, canvas simulations and quizzes on Temperature and Heat, with Calphy the flame mascot. Learn scales, heat transfer, specific heat, calorimetry, phase changes and gas laws.",
};

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero page-top-space">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Reveal>
                <span className="eyebrow">
                  Physics · Thermal physics module
                </span>
                <h1 className="hero-title mb-3">
                  Learn{" "}
                  <span className="gradient-text">Temperature &amp; Heat</span>{" "}
                  by playing with it.
                </h1>
                <p className="hero-sub mb-4">
                  Nine animated lessons, from temperature scales to gas laws.
                  Drag the thermometers, watch the particles, follow the heating
                  curve, and check yourself with auto-graded quizzes.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <Link
                    href="/lessons/temperature-scales"
                    className="btn btn-flame btn-lg px-4"
                  >
                    <i className="bi bi-play-circle me-2" />
                    Start Lesson 1
                  </Link>
                  <Link href="/simulations" className="btn btn-ink btn-lg px-4">
                    <i className="bi bi-joystick me-2" />
                    Open the simulation lab
                  </Link>
                </div>
              </Reveal>
            </Col>
            <Col lg={6}>
              <Reveal delay={120}>
                <div className="position-relative text-center">
                  <div className="hero-art-panel" style={{ border: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/hero.png"
                      alt="Calphy the flame mascot beside a giant thermometer with physics formulas"
                      className="img-fluid w-100"
                      style={{ display: "block" }}
                    />
                  </div>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ COURSE COUNTS ============ */}
      <section className="home-stats pb-4" aria-label="Course overview">
        <Container>
          <Reveal>
            <Row className="g-3">
              {[
                {
                  icon: "bi-collection",
                  value: UNITS.length,
                  label: "topic units",
                },
                {
                  icon: "bi-journal-bookmark",
                  value: LESSONS.length,
                  label: "rich lessons",
                },
                { icon: "bi-joystick", value: 10, label: "canvas simulations" },
                {
                  icon: "bi-patch-question",
                  value: QUIZZES.length,
                  label: "auto-graded quizzes",
                },
                {
                  icon: "bi-signpost-split",
                  value: 1,
                  label: "focused learning path",
                },
              ].map((stat) => (
                <Col className="col-xl" xs={6} md={4} key={stat.label}>
                  <div className="card-soft stat-card h-100 d-flex flex-column align-items-center justify-content-center text-center">
                    <i
                      className={`bi ${stat.icon} stat-icon`}
                      aria-hidden="true"
                    />
                    <div className="stat-num">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Reveal>
        </Container>
      </section>

      {/* ============ TOPICS ============ */}
      <section className="section" id="topics">
        <Container>
          <Reveal>
            <div className="text-center mb-5">
              <span className="eyebrow blue">
                <i className="bi bi-signpost-split" /> Browse by group
              </span>
              <h2 className="section-title">Four units. One warm story.</h2>
              <p className="section-sub mx-auto">
                Every unit builds on the last: what temperature <em>is</em>, how
                heat travels, how to count it, and what gases do when they get
                hot.
              </p>
            </div>
          </Reveal>
          <LessonGrid compact />
        </Container>
      </section>

      {/* ============ SIMULATIONS TEASER ============ */}
      <section className="section">
        <Container>
          <Reveal>
            <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
              <div>
                <span className="eyebrow">
                  <i className="bi bi-joystick" /> Multimedia lab
                </span>
                <h2 className="section-title mb-1">
                  Don&apos;t read physics.{" "}
                  <span className="gradient-text">Touch it.</span>
                </h2>
                <p className="section-sub">
                  Every lesson includes an interactive canvas simulation that
                  runs in your browser.
                </p>
              </div>
              <Link href="/simulations" className="btn btn-outline-ink">
                Open the full lab <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </Reveal>
          <SimHost name="ThermometerSim" />
        </Container>
      </section>

      {/* ============ QUIZZES ============ */}
      <section className="section">
        <Container>
          <Reveal>
            <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
              <div>
                <span className="eyebrow">
                  <i className="bi bi-patch-question" /> Check yourself
                </span>
                <h2 className="section-title mb-1">
                  Quizzes that save your score
                </h2>
                <p className="section-sub">
                  Guest mode saves in your browser. Log in and every score syncs
                  to{" "}
                  <code style={{ color: "var(--cool)" }}>
                    db_users.tbl_users.user_progress
                  </code>{" "}
                  in PostgreSQL.
                </p>
              </div>
              <Link href="/dashboard" className="btn btn-outline-ink">
                My dashboard <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </Reveal>
          <QuizCards />
        </Container>
      </section>

      {/* ============ MASCOT + VIDEO ============ */}
      <section className="section">
        <Container>
          <Row className="g-4 align-items-stretch">
            <Col lg={5}>
              <Reveal className="h-100">
                <div
                  className="card-soft flat p-4 p-lg-5 h-100 text-center"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <CalphyMascot size={130} mood="wave" />
                  </div>
                  <h2 className="fw-bold h4">
                    Meet <span className="gradient-text">Calphy</span>
                  </h2>
                  <p className="text-muted small mb-3">
                    Calphy is the flame mascot for your temperature and heat
                    lessons. Keep him nearby as you explore the simulations and
                    check your understanding with quizzes.
                  </p>
                </div>
              </Reveal>
            </Col>
            <Col lg={7}>
              <Reveal delay={90} className="h-100">
                <div className="card-soft flat p-4 h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span
                      className="icon-tile"
                      style={{
                        width: "2.4rem",
                        height: "2.4rem",
                        fontSize: "1.1rem",
                        background: "var(--ember-tint)",
                        color: "var(--ember-text)",
                      }}
                    >
                      <i className="bi bi-youtube" />
                    </span>
                    <div>
                      <h2 className="fw-bold h5 mb-0">Watch &amp; learn</h2>
                      <div className="small text-muted">
                        A 5-minute visual intro to the three modes of heat
                        transfer
                      </div>
                    </div>
                  </div>
                  <VideoEmbed
                    id="Me60Ti0E_rY"
                    title="Heat Transfer – Conduction, Convection and Radiation"
                  />
                  <div className="small text-muted mt-3 mb-0">
                    More videos are embedded at the end of every lesson page.
                  </div>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ HOW PROGRESS WORKS ============ */}
      <section className="section">
        <Container>
          <Reveal>
            <div className="text-center mb-4">
              <span className="eyebrow blue">
                <i className="bi bi-hdd-network" /> Progress tracking
              </span>
              <h2 className="section-title">Your journey, saved</h2>
            </div>
          </Reveal>
          <Row className="g-3">
            {[
              {
                icon: "bi-person-walking",
                title: "Learn as a guest",
                text: "Lessons, sims and quiz scores work instantly, saved in your browser's local storage.",
              },
              {
                icon: "bi-box-arrow-in-right",
                title: "Log in when ready",
                text: "Create an account: your guest progress carries over into the database automatically.",
              },
              {
                icon: "bi-database-check",
                title: "Sync your progress",
                text: "Lesson status & quiz scores live in tbl_users.user_progress (JSONB), the dashboard follows you on any device.",
              },
            ].map((s, i) => (
              <Col md={4} key={s.title}>
                <Reveal delay={i * 80} className="h-100">
                  <div className="card-soft hover-card p-4 h-100 text-center">
                    <span
                      className="icon-tile mx-auto mb-3"
                      style={{
                        background:
                          i === 2 ? "var(--good-tint)" : "var(--ember-tint)",
                        color: i === 2 ? "var(--good)" : "var(--ember-text)",
                      }}
                    >
                      <i className={`bi ${s.icon}`} />
                    </span>
                    <h3 className="fw-bold h6">{s.title}</h3>
                    <p className="small text-muted mb-0">{s.text}</p>
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link href="/register" className="btn btn-flame btn-lg px-4">
              <i className="bi bi-person-plus me-2" />
              Create free account
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
