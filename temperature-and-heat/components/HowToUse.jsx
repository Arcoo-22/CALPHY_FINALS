"use client";

// "How to use" strip on the landing: four steps and a line of tips.
// Each step is a shortcut: the first three open their page, the last one
// opens the Cinder chat (see the calphy:open-chat listener in CalphyChat).
import Link from "next/link";
import { Container } from "react-bootstrap";
import SectionHead from "@/components/SectionHead";

const STEPS = [
  {
    icon: "bi-book",
    title: "Read a lesson",
    text: "Each one is a short read. Start at Lesson 1 or pick any unit.",
    href: "/lessons",
  },
  {
    icon: "bi-sliders",
    title: "Drag the simulation",
    text: "Move the sliders and watch the numbers change with you.",
    href: "/simulations",
  },
  {
    icon: "bi-patch-check",
    title: "Take the quiz",
    text: "Answers are graded right away, with an explanation for each.",
    href: "/quizzes",
  },
  {
    icon: "bi-chat-heart",
    title: "Ask Cinder",
    text: "Tap the flame in the corner for conversions or to find a lesson.",
  },
];

function StepBody({ step, n }) {
  return (
    <>
      <span className="icon-tile" aria-hidden="true">
        <i className={`bi ${step.icon}`} />
      </span>
      <span className="howto-num">Step {n}</span>
      <span className="howto-title">
        {step.title}
        <i className="bi bi-arrow-right-short howto-arrow" aria-hidden="true" />
      </span>
      <span className="howto-text">{step.text}</span>
    </>
  );
}

export default function HowToUse() {
  const openChat = () => window.dispatchEvent(new Event("calphy:open-chat"));

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
            <li key={s.title}>
              {s.href ? (
                <Link href={s.href} className="card-soft howto-step">
                  <StepBody step={s} n={i + 1} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="card-soft howto-step"
                  onClick={openChat}
                >
                  <StepBody step={s} n={i + 1} />
                </button>
              )}
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
