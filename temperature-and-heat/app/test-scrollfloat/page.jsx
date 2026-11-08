"use client";

import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";
import ScrollFloat from "@/components/ScrollFloat";

export default function TestScrollFloatPage() {
  return (
    <main className="page-top-space pb-5">
      <Container className="py-4">
        <div className="mb-5 text-center">
          <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-2 rounded-pill fw-bold">
            Interactive Testbed
          </span>
          <h1 className="fw-bolder mb-2">ScrollFloat Showcase</h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: 600 }}>
            Scroll down slowly to test and see each GSAP ScrollTrigger effect in action.
            Letters will float, wave, roll, and assemble as you scroll through the page.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link href="/learn" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1" /> Back to Learn
            </Link>
            <Link href="/welcome" className="btn btn-outline-secondary btn-sm">
              View Welcome Page
            </Link>
          </div>
        </div>

        {/* Spacer to allow scrolling */}
        <div className="card-soft p-4 mb-5 text-center text-muted border border-dashed rounded-3">
          <i className="bi bi-mouse fs-2 d-block mb-1 text-primary" />
          <span>Scroll down to trigger each section animation</span>
          <div className="mt-2 text-primary">
            <i className="bi bi-arrow-down fs-4" />
          </div>
        </div>

        {/* Demo 1: Float Effect */}
        <div className="my-5 py-5 border-top border-bottom border-light-subtle">
          <span className="text-uppercase tracking-wider small fw-bold text-primary d-block mb-2">
            Effect 1: Float (Default)
          </span>
          <ScrollFloat
            as="h2"
            effect="float"
            distance={80}
            stretch={2.2}
            animationDuration={1}
            stagger={0.03}
            containerClassName="my-2"
          >
            Thermal Physics in Motion
          </ScrollFloat>
          <p className="text-secondary mt-3">
            Each character stretches upward from below and settles into place with an elastic ease.
          </p>
        </div>

        {/* Demo 2: Wave Effect */}
        <div className="my-5 py-5 border-bottom border-light-subtle">
          <span className="text-uppercase tracking-wider small fw-bold text-info d-block mb-2">
            Effect 2: Wave
          </span>
          <ScrollFloat
            as="h2"
            effect="wave"
            distance={90}
            stretch={2.4}
            animationDuration={1.1}
            stagger={0.035}
            containerClassName="my-2"
          >
            Conduction &amp; Convection Waves
          </ScrollFloat>
          <p className="text-secondary mt-3">
            Letters swell and sway along a kinetic wave curve as the viewport scrolls.
          </p>
        </div>

        {/* Demo 3: Flip Effect */}
        <div className="my-5 py-5 border-bottom border-light-subtle">
          <span className="text-uppercase tracking-wider small fw-bold text-warning d-block mb-2">
            Effect 3: 3D Flip
          </span>
          <ScrollFloat
            as="h2"
            effect="flip"
            distance={100}
            animationDuration={1}
            stagger={0.03}
            containerClassName="my-2"
          >
            Three Dimensional Energy
          </ScrollFloat>
          <p className="text-secondary mt-3">
            Each letter rolls in on a 3D cylindrical drum perspective.
          </p>
        </div>

        {/* Demo 4: Blur Effect */}
        <div className="my-5 py-5 border-bottom border-light-subtle">
          <span className="text-uppercase tracking-wider small fw-bold text-success d-block mb-2">
            Effect 4: Blur Focus
          </span>
          <ScrollFloat
            as="h2"
            effect="blur"
            distance={60}
            animationDuration={1}
            stagger={0.025}
            containerClassName="my-2"
          >
            Molecular Particle Focus
          </ScrollFloat>
          <p className="text-secondary mt-3">
            Characters transition from diffused depth-of-field blur into sharp optical focus.
          </p>
        </div>

        {/* Demo 5: Scatter Effect */}
        <div className="my-5 py-5">
          <span className="text-uppercase tracking-wider small fw-bold text-danger d-block mb-2">
            Effect 5: Scatter Assembly
          </span>
          <ScrollFloat
            as="h2"
            effect="scatter"
            distance={110}
            animationDuration={1.2}
            stagger={0.04}
            containerClassName="my-2"
          >
            Thermodynamic Entropy Assembly
          </ScrollFloat>
          <p className="text-secondary mt-3">
            Scattered chaotic fragments coalesce into structured typography as entropy decreases.
          </p>
        </div>

        <div className="mt-5 text-center text-secondary small">
          End of ScrollFloat testbed · All 5 React Bits effects verified.
        </div>
      </Container>
    </main>
  );
}
