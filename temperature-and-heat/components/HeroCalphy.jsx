"use client";
// ============================================================
// Landing hero Calphy: a thought bubble that cycles greetings with "…" beats
// in between, and a wink each time a new line lands (and on hover).
// ============================================================
import { useEffect, useState } from "react";
import Image from "next/image";

const LINES = [
  "Hi there! I'm Calphy.",
  "Welcome to CalphyLearn!",
  "Let's warm up your brain.",
];

const THINK_MS = 1100;
const LINE_MS = 3200;
const WINK_MS = 650;

export default function HeroCalphy() {
  // even steps are the "…" beat, odd steps show LINES[(step - 1) / 2]
  const [step, setStep] = useState(0);
  const [wink, setWink] = useState(false);

  useEffect(() => {
    const thinking = step % 2 === 0;
    const next = setTimeout(
      () => {
        setStep((s) => (s + 1) % (LINES.length * 2));
        if (thinking) setWink(true);
      },
      thinking ? THINK_MS : LINE_MS,
    );
    return () => clearTimeout(next);
  }, [step]);

  // its own effect: a step change must not cancel the un-wink
  useEffect(() => {
    if (!wink) return;
    const t = setTimeout(() => setWink(false), WINK_MS);
    return () => clearTimeout(t);
  }, [wink]);

  const line = step % 2 === 1 ? LINES[(step - 1) / 2] : null;

  return (
    <div className="hero-calphy">
      <Image
        src="/images/brand/mascot-full.png"
        alt="Calphy, the CalphyLearn flame mascot"
        width={1080}
        height={1080}
        sizes="(min-width: 992px) 40vw, 80vw"
        loading="eager"
        fetchPriority="high"
        className="img-fluid w-100 d-block"
      />
      <Image
        src="/images/brand/mascot-wave.png"
        alt=""
        width={1080}
        height={1080}
        sizes="(min-width: 992px) 40vw, 80vw"
        loading="eager"
        className={`hero-calphy-wink ${wink ? "on" : ""}`}
      />
      <span className="thought-bubble hero-bubble" aria-hidden="true">
        {line ? (
          <span key={line} className="thought-text">
            {line}
          </span>
        ) : (
          <span className="thought-dots">
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
    </div>
  );
}
