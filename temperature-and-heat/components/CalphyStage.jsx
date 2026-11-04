// ============================================================
// A big Cinder with a warm glow, rising embers and twinkling sparkles.
// Positions are fixed (not random) so server and client render the same.
// Pass children to stage something else (the landing's hero art); scale the
// effects with --stage-scale in CSS.
// ============================================================
import CalphyMascot from "@/components/CalphyMascot";

// offsets are from Cinder's center, so the effects stay around him however
// wide the stage gets
const EMBERS = [
  { x: "-2.4rem", drift: "-1.2rem", dur: "3.4s", delay: "0s" },
  { x: "-0.4rem", drift: "0.6rem", dur: "2.9s", delay: "1.1s" },
  { x: "1.6rem", drift: "1.4rem", dur: "3.8s", delay: "0.5s" },
  { x: "-1.4rem", drift: "-0.4rem", dur: "4.2s", delay: "2.2s" },
  { x: "0.8rem", drift: "-1rem", dur: "3.1s", delay: "1.7s" },
  { x: "2.6rem", drift: "0.8rem", dur: "3.6s", delay: "2.8s" },
];

const STARS = [
  { x: "-8rem", y: "-5rem", s: "1.5rem", delay: "0s" },
  { x: "7rem", y: "-4rem", s: "1.15rem", delay: "0.8s" },
  { x: "-9rem", y: "3rem", s: "0.95rem", delay: "1.5s" },
  { x: "8.5rem", y: "3.5rem", s: "1.3rem", delay: "0.4s" },
  { x: "3rem", y: "-7rem", s: "0.8rem", delay: "1.9s" },
];

export default function CalphyStage({ size = 200, className = "", children }) {
  return (
    <div className={`calphy-stage ${className}`}>
      <span className="calphy-stage-aura" aria-hidden="true" />
      {EMBERS.map((e, i) => (
        <span
          key={`e${i}`}
          className="calphy-stage-ember"
          aria-hidden="true"
          style={{
            "--x": e.x,
            "--drift": e.drift,
            "--dur": e.dur,
            "--delay": e.delay,
          }}
        />
      ))}
      {STARS.map((s, i) => (
        <span
          key={`s${i}`}
          className="calphy-stage-star"
          aria-hidden="true"
          style={{
            "--x": s.x,
            "--y": s.y,
            "--s": s.s,
            "--delay": s.delay,
          }}
        />
      ))}
      <div className="calphy-stage-subject">
        {children ?? <CalphyMascot size={size} />}
      </div>
    </div>
  );
}
