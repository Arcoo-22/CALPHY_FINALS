"use client";

// ============================================================
// Interactive thermometer (Lesson 1)
// • Drag anywhere on the canvas (or use the slider) to set T
// • Liquid column + °C scale with reference markers
// • Particle box shows kinetic model: speed ∝ √T(kelvin)
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SimFrame from "@/components/SimFrame";
import {
  fitCanvas,
  heatColor,
  norm,
  clamp,
  label,
  labelFit,
  wrapLines,
  seeded,
  drawGlow,
  roundRect,
} from "@/lib/canvas";
import { cToF, cToK, fmt } from "@/lib/constants";

const MIN_C = -90;
const MAX_C = 150;

const PRESETS = [
  { label: "Ice water · 0 °C", value: 0 },
  { label: "Body · 37 °C", value: 37 },
  { label: "Boiling · 100 °C", value: 100 },
];

export default function ThermometerSim() {
  const canvasRef = useRef(null);
  const [tempC, setTempC] = useState(25);
  const stateRef = useRef({
    target: 25,
    shown: 25,
    particles: null,
    dragging: false,
  });
  useLayoutEffect(() => {
    stateRef.current.target = tempC;
  });

  // init particles once
  useEffect(() => {
    const rnd = seeded(7);
    const parts = [];
    for (let i = 0; i < 46; i++) {
      parts.push({
        x: rnd(),
        y: rnd(),
        vx: rnd() - 0.5,
        vy: rnd() - 0.5,
        r: 3.4 + rnd() * 2.4,
      });
    }
    stateRef.current.particles = parts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    // bulb and bottom follow the canvas height (set each frame) so the
    // readout under the bulb never lands on it
    const TUBE = { x: 104, top: 46, bottom: 302, r: 11, bulbY: 326, bulbR: 22 };

    const tempAtY = (y) => {
      const t = norm(y, TUBE.bottom, TUBE.top); // 0 bottom → 1 top
      return clamp(MIN_C + t * (MAX_C - MIN_C), MIN_C, MAX_C);
    };

    const onPointer = (e) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top; // CSS px
      setTempC(Math.round(tempAtY(y)));
    };
    const down = (e) => {
      stateRef.current.dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      onPointer(e);
    };
    const up = () => (stateRef.current.dragging = false);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    const draw = () => {
      const { ctx, w, h } = fitCanvas(canvas);
      const s = stateRef.current;
      s.shown += (s.target - s.shown) * 0.12; // smooth liquid motion
      const T = s.shown;
      const t01 = norm(T, MIN_C, MAX_C);
      const col = heatColor(t01);
      TUBE.bulbY = h - 64;
      TUBE.bottom = TUBE.bulbY - 24;

      ctx.clearRect(0, 0, w, h);

      // ---------- thermometer ----------
      const { x, top, bottom, r, bulbY, bulbR } = TUBE;
      // glass body
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - r, bottom);
      ctx.lineTo(x - r, top + r);
      ctx.arc(x, top + r, r, Math.PI, 0);
      ctx.lineTo(x + r, bottom);
      ctx.arc(x, bulbY, bulbR, -0.6, Math.PI + 0.6, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // liquid
      const liquidTop = bottom - t01 * (bottom - top);
      ctx.save();
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, bulbY, bulbR - 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - (r - 5), liquidTop, (r - 5) * 2, bottom - liquidTop + 6);
      ctx.restore();

      // scale ticks
      for (let c = MIN_C; c <= MAX_C; c += 10) {
        const y = bottom - norm(c, MIN_C, MAX_C) * (bottom - top);
        const major = c % 50 === 0;
        ctx.strokeStyle = major
          ? "rgba(255,255,255,0.55)"
          : "rgba(255,255,255,0.22)";
        ctx.lineWidth = major ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(x + r + 6, y);
        ctx.lineTo(x + r + (major ? 16 : 11), y);
        ctx.stroke();
        if (major)
          label(ctx, `${c}`, x + r + 21, y, { size: 11, color: "#94a3b8" });
      }

      // reference markers
      const refs = [
        { c: 0, name: "freezes", color: "#38bdf8" },
        { c: 37, name: "body", color: "#34d399" },
        { c: 100, name: "boils", color: "#f87171" },
      ];
      refs.forEach((m) => {
        const y = bottom - norm(m.c, MIN_C, MAX_C) * (bottom - top);
        ctx.save();
        ctx.strokeStyle = m.color;
        ctx.globalAlpha = 0.75;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - r - 28, y);
        ctx.lineTo(x - r - 4, y);
        ctx.stroke();
        ctx.restore();
        label(ctx, m.name, x - r - 32, y, {
          size: 10.5,
          color: m.color,
          align: "right",
        });
      });

      // digital readout on canvas
      label(ctx, "LIQUID-IN-GLASS THERMOMETER", x, 24, {
        size: 10.5,
        color: "#94a3b8",
        align: "center",
      });
      label(ctx, `${fmt(T, 1)} °C`, x, h - 16, {
        size: 13,
        color: col,
        align: "center",
        weight: "800",
      });
      label(ctx, "Drag ↕", x + r + 52, h - 16, {
        size: 10,
        color: "#94a3b8",
        align: "center",
      });

      // ---------- particle box ----------
      const narrow = w < 520;
      const bx = narrow ? x + r + 58 : 200,
        by = 40,
        bw = w - bx - (narrow ? 4 : 18),
        bh = h - 96;
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.035)";
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.4;
      roundRect(ctx, bx, by, bw, bh, 14);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      labelFit(
        ctx,
        bw < 220 ? "PARTICLE MOTION" : "PARTICLE MOTION, kinetic model",
        bx + 12,
        by + 18,
        bw - 24,
        { size: 10.5, color: "#94a3b8" },
      );

      const kelvin = Math.max(1, cToK(T));
      const speed = clamp(Math.sqrt(kelvin / 300), 0.05, 3) * 46; // px/s base
      const caption = `Particles move ${T < 5 ? "slowly, close to the cold limit ❄" : kelvin > 350 ? "fast, high average KE 🔥" : "at moderate speed"}`;
      const capLines = wrapLines(ctx, caption, bw - 24, { size: 10.5 });
      const capH = capLines.length * 13;
      const parts = s.particles || [];
      parts.forEach((p) => {
        p.x += (p.vx * speed * 0.016) / bw;
        p.y += (p.vy * speed * 0.016) / bh;
        if (p.x < 0 || p.x > 1) {
          p.vx *= -1;
          p.x = clamp(p.x, 0, 1);
        }
        if (p.y < 0 || p.y > 1) {
          p.vy *= -1;
          p.y = clamp(p.y, 0, 1);
        }
        const px = bx + 12 + p.x * (bw - 24);
        const py = by + 34 + p.y * (bh - 44 - capH);
        drawGlow(ctx, px, py, p.r * 2.6, col, 0.28);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      capLines.forEach((ln, i) =>
        label(
          ctx,
          ln,
          bx + bw / 2,
          by + bh - 14 - (capLines.length - 1 - i) * 13,
          {
            size: 10.5,
            color: "#7c8ba1",
            align: "center",
          },
        ),
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  const controls = (
    <>
      <div className="flex-grow-1" style={{ minWidth: 220 }}>
        <label className="form-label" htmlFor="therm-range">
          Temperature · <b style={{ color: "#c2410c" }}>{tempC} °C</b>
        </label>
        <input
          id="therm-range"
          type="range"
          className="form-range"
          min={MIN_C}
          max={MAX_C}
          value={tempC}
          onChange={(e) => setTempC(Number(e.target.value))}
        />
        <div className="d-flex flex-wrap gap-2 mt-1">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              className="mascot-chip"
              onClick={() => setTempC(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="sim-readout">
        <span className="readout-pill">
          °C <b>{fmt(tempC, 1)}</b>
        </span>
        <span className="readout-pill">
          °F <b>{fmt(cToF(tempC), 1)}</b>
        </span>
        <span className="readout-pill cool">
          K <b>{fmt(cToK(tempC), 2)}</b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Interactive Thermometer + Particle Model"
      badge={
        <span className="chip flame">
          <i className="bi bi-hand-index" /> Drag the canvas
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{
            "--sim-h": "clamp(320px, 46vw, 420px)",
            "--sim-h-sm": "380px",
          }}
          aria-label="Interactive thermometer simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          The liquid expands as it warms and rises in the thin tube, and in the
          particle box you can see
          <b> why</b>: temperature measures the <b>average kinetic energy</b> of
          the particles. Watch the three scales update together.
        </>
      }
    />
  );
}
