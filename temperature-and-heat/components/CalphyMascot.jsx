"use client";
// ============================================================
// Calphy, the flame mascot. Squashes while held, jelly-wobbles and throws
// sparks on release.
// moods: 'idle' | 'happy' | 'think' | 'wave'
// only idle and wave have their own art; happy and think reuse idle
// ============================================================
import { useState } from "react";
import Image from "next/image";

const ART = {
  idle: "/images/brand/mascot-idle.png",
  wave: "/images/brand/mascot-wave.png",
};

const WOBBLE = [
  { scale: "1.22 0.76" },
  { scale: "0.86 1.16" },
  { scale: "1.08 0.94" },
  { scale: "0.97 1.03" },
  { scale: "1 1" },
];

const SPARK_COLORS = ["#ffd23f", "#f59e0b", "#fb923c", "#fff3c4"];

// sparks live on <body>, not inside the mascot, so the wobble doesn't squash
// them and an overflow-hidden parent can't clip them
function sparkBurst(el, size) {
  const box = el.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height * 0.45;
  const count = 10;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const reach = size * (0.55 + Math.random() * 0.35);
    const dot = size * (0.06 + Math.random() * 0.04);
    const spark = document.createElement("span");
    spark.className = i % 3 === 0 ? "calphy-spark star" : "calphy-spark";
    Object.assign(spark.style, {
      left: `${cx - dot / 2}px`,
      top: `${cy - dot / 2}px`,
      width: `${dot}px`,
      height: `${dot}px`,
      background: SPARK_COLORS[i % SPARK_COLORS.length],
    });
    document.body.appendChild(spark);
    spark
      .animate(
        [
          { translate: "0 0", scale: 1, opacity: 1 },
          {
            translate: `${Math.cos(angle) * reach}px ${Math.sin(angle) * reach}px`,
            scale: 0.2,
            opacity: 0,
          },
        ],
        { duration: 520 + Math.random() * 180, easing: "cubic-bezier(.2,.7,.3,1)" },
      )
      .finished.then(() => spark.remove(), () => spark.remove());
  }
}

export default function CalphyMascot({
  size = 64,
  mood = "idle",
  className = "",
  style,
}) {
  const [pressed, setPressed] = useState(false);
  const happy = mood === "happy";

  // capture keeps the squash going if the finger slides off; the click still
  // reaches a parent link or button, so the navbar and chat launcher work
  const press = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setPressed(true);
  };

  const release = (e) => {
    if (!pressed) return;
    setPressed(false);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.currentTarget.animate(WOBBLE, { duration: 650, easing: "ease-out" });
    sparkBurst(e.currentTarget, size);
  };

  return (
    <span
      className={`calphy-mascot d-inline-flex ${pressed ? "is-pressed" : ""} ${happy ? "calphy-happy" : ""} ${className}`}
      // a parent can resize it from CSS with --mascot-size (e.g. the chat
      // button on phones); the images fill the box so they stay centred
      style={{
        width: `var(--mascot-size, ${size}px)`,
        height: `var(--mascot-size, ${size}px)`,
        lineHeight: 0,
        ...style,
      }}
      aria-hidden="true"
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={() => setPressed(false)}
    >
      <Image
        src={ART[mood] ?? ART.idle}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className="calphy-flame-body"
      />
      {/* stacked rather than swapped, so the wink is already loaded on the
          first squish */}
      {mood !== "wave" && (
        <Image
          src={ART.wave}
          alt=""
          width={size}
          height={size}
          draggable={false}
          className="calphy-wink"
        />
      )}
    </span>
  );
}
