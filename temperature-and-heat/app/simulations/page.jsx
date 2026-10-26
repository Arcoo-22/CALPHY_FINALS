import Link from "next/link";
import { Container } from "react-bootstrap";
import SimHost from "@/components/SimHost";
import Reveal from "@/components/Reveal";
import { SIM_GROUPS } from "@/lib/simulations";

export const metadata = {
  title: "Simulation Lab",
  description:
    "Ten interactive canvas simulations: thermometer, conduction rod, convection pot, radiation glow, heating curve, calorimetry, gas piston and more.",
};

export default function SimulationsPage() {
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
                  Simulations
                </li>
              </ol>
            </nav>
            <span className="eyebrow">
              <i className="bi bi-joystick" /> Simulation lab
            </span>
            <h1 className="section-title">Ten playable physics machines</h1>
            <p className="section-sub mb-2">
              Every canvas is a live numerical model. Heat diffusion, energy
              balances, the heat equation, and the ideal gas law run in your
              browser. Drag, slide, drop, and pause.
            </p>
          </Reveal>

          {SIM_GROUPS.map((g, gi) => (
            <div key={g.id} className="mb-5">
              <Reveal>
                <div className="d-flex align-items-center gap-3 mb-3 mt-4">
                  <span
                    className="icon-tile"
                    style={{
                      background: "var(--ember-tint)",
                      color: "var(--ember-text)",
                    }}
                  >
                    <i className={`bi ${g.icon}`} />
                  </span>
                  <div>
                    <h2 className="fw-bold h4 mb-0">{g.title}</h2>
                    <div className="small text-muted">{g.blurb}</div>
                  </div>
                </div>
              </Reveal>
              <div className="d-grid gap-4">
                {g.sims.map((s, si) => (
                  <Reveal key={s.anchor} delay={si * 60}>
                    <div id={s.anchor} style={{ scrollMarginTop: 90 }}>
                      <SimHost name={s.name} />
                      <div className="d-flex flex-wrap align-items-center gap-2 mt-2 px-1">
                        <span className="content-label">
                          <i
                            className="bi bi-journal-bookmark"
                            aria-hidden="true"
                          />{" "}
                          {s.lesson}
                        </span>
                        <span className="small text-muted">{s.caption}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
