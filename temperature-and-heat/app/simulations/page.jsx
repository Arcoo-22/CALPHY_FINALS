import Link from "next/link";
import { Container } from "react-bootstrap";
import Reveal from "@/components/Reveal";
import SimulationsLab from "@/components/SimulationsLab";

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
            <p className="section-sub mb-4">
              Every canvas is a live numerical model. Heat diffusion, energy
              balances, the heat equation, and the ideal gas law run in your
              browser. Drag, slide, drop, and pause.
            </p>
          </Reveal>

          <SimulationsLab />
        </Container>
      </section>
    </div>
  );
}
