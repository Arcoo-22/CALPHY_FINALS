import Link from "next/link";
import { Container } from "react-bootstrap";
import { LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

export default function SiteFooter() {
  return (
    <footer className="calphy-footer">
      <Container className="py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-flame mb-2">
              <span className="brand-flame">
                <i className="bi bi-fire" />
              </span>
              CalphyLearn
            </div>
            <p className="small mb-2" style={{ maxWidth: 340 }}>
              An interactive Physics learning platform for{" "}
              <b className="text-white">Temperature and Heat</b>, animated
              tutorials, canvas simulations, quizzes and Calphy, your flame
              mascot.
            </p>
            <p className="small mb-0">
              Built with{" "}
              <b className="text-white">
                Next.js · React · Bootstrap 5 · PostgreSQL
              </b>
              . Content adapted from the CALPHY Finals module.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h6 className="mb-3">Lessons</h6>
            <ul className="list-unstyled small mb-0 d-grid gap-2">
              {LESSONS.slice(0, 5).map((l) => (
                <li key={l.key}>
                  <Link href={`/lessons/${l.slug}`}>
                    {l.n}. {l.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/lessons"
                  className="fw-bold"
                  style={{ color: "var(--ember-text)" }}
                >
                  All 9 lessons →
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3">Quizzes</h6>
            <ul className="list-unstyled small mb-0 d-grid gap-2">
              {QUIZZES.map((q) => (
                <li key={q.id}>
                  <Link href={`/quizzes/${q.slug}`}>{q.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3">
            <h6 className="mb-3">Explore</h6>
            <ul className="list-unstyled small mb-0 d-grid gap-2">
              <li>
                <Link href="/simulations">
                  <i className="bi bi-joystick me-2" />
                  Simulation Lab
                </Link>
              </li>
              <li>
                <Link href="/formulas">
                  <i className="bi bi-mortarboard me-2" />∑ Heat Formulas sheet
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <i className="bi bi-graph-up-arrow me-2" />
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <i className="bi bi-person-circle me-2" />
                  Log in / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "var(--line)" }} />
        <div className="d-flex flex-wrap justify-content-between gap-2 small">
          <span>
            © {new Date().getFullYear()} CalphyLearn, Temperature &amp; Heat.
          </span>
          <span>
            <i className="bi bi-cloud-check me-1" /> Progress sync is available
            when you sign in.
          </span>
        </div>
      </Container>
    </footer>
  );
}
