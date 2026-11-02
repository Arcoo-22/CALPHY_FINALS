// Landing content, shared by / (first visit only) and /welcome (the logo's
// link, always reachable). `stay` turns off the skip-to-/learn redirect.
import { Container, Row, Col } from "react-bootstrap";
import LandingActions from "@/components/LandingActions";
import HowToUse from "@/components/HowToUse";
import HoloCard from "@/components/HoloCard";
import CalphyStage from "@/components/CalphyStage";
import HeroCalphy from "@/components/HeroCalphy";

export default function Landing({ stay = false }) {
  return (
    <>
      <section className="hero landing page-top-space">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6}>
              <span className="eyebrow">Physics · Thermal physics</span>
              <h1 className="hero-title mb-3">
                Learn{" "}
                <span className="gradient-text">Temperature &amp; Heat</span>{" "}
                by playing with it.
              </h1>
              <p className="hero-sub mb-4">
                Nine short lessons with simulations you can drag, from
                thermometers to gas laws.
              </p>
              <LandingActions stay={stay} />
            </Col>
            <Col lg={6}>
              <CalphyStage className="hero-stage">
                <HoloCard mask="/images/brand/mascot-idle.png">
                  <HeroCalphy />
                </HoloCard>
              </CalphyStage>
            </Col>
          </Row>
        </Container>
      </section>
      <HowToUse />
    </>
  );
}
