import { redirect } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import LandingActions from "@/components/LandingActions";
import { getSession } from "@/lib/auth";
import { MAIN_HREF } from "@/lib/visit";

export const metadata = {
  title: "CalphyLearn · Temperature and Heat",
  description:
    "Nine short lessons on temperature and heat, each with a simulation you can drag, plus auto-graded quizzes.",
};

// First-visit landing. Returning visitors never see it: signed-in users are
// redirected here, guests by the <head> script in app/layout.jsx.
export default async function LandingPage() {
  if (await getSession()) redirect(MAIN_HREF);

  return (
    <section className="hero landing page-top-space">
      <Container>
        <Row className="align-items-center g-4 g-lg-5">
          <Col lg={6}>
            <span className="eyebrow">Physics · Thermal physics</span>
            <h1 className="hero-title mb-3">
              Learn <span className="gradient-text">Temperature &amp; Heat</span>{" "}
              by playing with it.
            </h1>
            <p className="hero-sub mb-4">
              Nine short lessons with simulations you can drag, from
              thermometers to gas laws.
            </p>
            <LandingActions />
          </Col>
          <Col lg={6}>
            <div className="hero-art-panel border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.png"
                alt="Calphy the flame mascot beside a giant thermometer with physics formulas"
                className="img-fluid w-100 d-block"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
