import Link from "next/link";
import { Container } from "react-bootstrap";
import CalphyMascot from "@/components/CalphyMascot";

export default function NotFound() {
  return (
    <div className="page-top-space">
      <Container className="text-center py-5">
        <div className="d-flex justify-content-center mb-3">
          <CalphyMascot size={120} mood="think" />
        </div>
        <h1
          className="fw-bold"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        >
          <span className="gradient-text">404</span>
        </h1>
        <h2 className="fw-bold h4 mb-2">Absolute zero… nothing here!</h2>
        <p className="text-muted mb-4">
          This page radiates no content. Calphy checked every particle, the page
          you want must be at another temperature.
        </p>
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          <Link href="/learn" className="btn btn-flame">
            <i className="bi bi-house-door me-1" /> Home
          </Link>
          <Link href="/lessons" className="btn btn-outline-ink">
            <i className="bi bi-journal-bookmark me-1" /> Lessons
          </Link>
          <Link href="/simulations" className="btn btn-outline-ink">
            <i className="bi bi-joystick me-1" /> Simulations
          </Link>
        </div>
      </Container>
    </div>
  );
}
