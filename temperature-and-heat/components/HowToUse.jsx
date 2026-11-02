// "How to use" strip on the landing: four steps and a line of tips.
import { Container } from "react-bootstrap";
import SectionHead from "@/components/SectionHead";

const STEPS = [
  {
    icon: "bi-book",
    title: "Read a lesson",
    text: "Each one is a short read. Start at Lesson 1 or pick any unit.",
  },
  {
    icon: "bi-sliders",
    title: "Drag the simulation",
    text: "Move the sliders and watch the numbers change with you.",
  },
  {
    icon: "bi-patch-check",
    title: "Take the quiz",
    text: "Answers are graded right away, with an explanation for each.",
  },
  {
    icon: "bi-chat-heart",
    title: "Ask Calphy",
    text: "Tap the flame in the corner for conversions or to find a lesson.",
  },
];

export default function HowToUse() {
  return (
    <section className="howto pb-5" aria-labelledby="howto-title">
      <Container>
        <SectionHead
          id="howto-title"
          icon="bi-compass"
          tag="How to use"
          title={
            <>
              Four steps, <span className="gradient-text">no setup.</span>
            </>
          }
        />
        <ol className="howto-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card-soft flat howto-step">
              <span className="icon-tile" aria-hidden="true">
                <i className={`bi ${s.icon}`} />
              </span>
              <span className="howto-num">Step {i + 1}</span>
              <h3 className="howto-title">{s.title}</h3>
              <p className="howto-text mb-0">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="howto-tips small mb-0">
          <i className="bi bi-lightbulb" aria-hidden="true" /> Log in to save
          your progress to the dashboard. Press{" "}
          <kbd className="nav-search-kbd">/</kbd> anywhere to search.
        </p>
      </Container>
    </section>
  );
}
