"use client";

// ============================================================
// Heating Curve of Water (Lesson 7)
// • Constant-power heater takes 0.1 kg from −20 °C ice → 120 °C steam
// • Live T-vs-Q graph draws itself; flat plateaus = state changes
// • Beaker shows the phase: crystal lattice → melting → liquid →
//   boiling bubbles → steam
// • Scrub, pause, and change mass / power
// ============================================================
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import SimFrame from "@/components/SimFrame";
import {
  fitCanvas,
  heatColor,
  norm,
  clamp,
  label,
  roundRect,
  drawGlow,
  seeded,
  labelFit,
  textWidth,
  heatTextColor,
} from "@/lib/canvas";
import { UNIVERSAL, fmt } from "@/lib/constants";

const { cIce, cWater, cSteam, Lf, Lv } = UNIVERSAL;
const T_START = -20;
const T_END = 120;

function segments(m) {
  const Q1 = m * cIce * (0 - T_START);
  const Q2 = m * Lf;
  const Q3 = m * cWater * (100 - 0);
  const Q4 = m * Lv;
  const Q5 = m * cSteam * (T_END - 100);
  const bounds = [
    0,
    Q1,
    Q1 + Q2,
    Q1 + Q2 + Q3,
    Q1 + Q2 + Q3 + Q4,
    Q1 + Q2 + Q3 + Q4 + Q5,
  ];
  return { Q1, Q2, Q3, Q4, Q5, bounds, total: bounds[5] };
}

function stateAt(Q, m) {
  const s = segments(m);
  const b = s.bounds;
  if (Q <= b[1])
    return {
      T: T_START + (Q - b[0]) / (m * cIce),
      phase: "Ice warming",
      seg: 1,
      frac: (Q - b[0]) / (s.Q1 || 1),
    };
  if (Q <= b[2])
    return {
      T: 0,
      phase: "Melting (ice + water)",
      seg: 2,
      frac: (Q - b[1]) / (s.Q2 || 1),
    };
  if (Q <= b[3])
    return {
      T: (Q - b[2]) / (m * cWater),
      phase: "Water warming",
      seg: 3,
      frac: (Q - b[2]) / (s.Q3 || 1),
    };
  if (Q <= b[4])
    return {
      T: 100,
      phase: "Boiling (water + steam)",
      seg: 4,
      frac: (Q - b[3]) / (s.Q4 || 1),
    };
  return {
    T: 100 + (Q - b[4]) / (m * cSteam),
    phase: "Steam warming",
    seg: 5,
    frac: (Q - b[4]) / (s.Q5 || 1),
  };
}

const SEG_NAMES = [
  "Q₁ = m·c_ice·ΔT",
  "Q₂ = m·L_f",
  "Q₃ = m·c_water·ΔT",
  "Q₄ = m·L_v",
  "Q₅ = m·c_steam·ΔT",
];
const SEG_COLORS = ["#93c5fd", "#bfdbfe", "#38bdf8", "#fca5a5", "#fdba74"];

export default function HeatingCurveSim() {
  const canvasRef = useRef(null);
  const [mass, setMass] = useState(0.1);
  const [power, setPower] = useState(400);
  const [running, setRunning] = useState(true);
  const [scrub, setScrub] = useState(0); // 0..1 progress when paused

  const seg = useMemo(() => segments(mass), [mass]);
  const Qref = useRef(0);
  const userScrubbing = useRef(false);
  const [readout, setReadout] = useState({
    Q: 0,
    tSim: 0,
    segIdx: 1,
    phase: "Ice warming",
  });
  const lastReadout = useRef(0);

  const ctrl = useRef({ mass, power, running, seg });
  useLayoutEffect(() => {
    ctrl.current = { mass, power, running, seg };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const rnd = seeded(21);
    const steamParts = Array.from({ length: 26 }, () => ({
      x: rnd(),
      y: rnd(),
      s: 0.3 + rnd() * 0.7,
    }));
    let raf;
    let last = performance.now();

    const curvePoint = (q, gx, gy, gw, gh, s) => {
      const st = stateAt(q, ctrl.current.mass);
      return {
        x: gx + (q / s.total) * gw,
        y: gy + gh - clamp(norm(st.T, T_START, T_END), 0, 1) * gh,
      };
    };

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const c = ctrl.current;
      const s = c.seg;

      // advance Q, full curve in ~34 s of viewing time (power affects displayed sim time)
      if (c.running && !userScrubbing.current) {
        Qref.current = Math.min(s.total, Qref.current + (s.total / 34) * dt);
      } else if (userScrubbing.current) {
        Qref.current = scrub * s.total;
      }
      const Q = Qref.current;
      const st = stateAt(Q, c.mass);

      ctx.clearRect(0, 0, w, h);

      // wide: beaker left, graph right. narrow: beaker on top, graph below.
      const stacked = w < 560;
      const bw = stacked ? Math.min(170, w * 0.48) : Math.min(240, w * 0.34),
        bx = stacked ? (w - bw - 40) / 2 : 30,
        by = 72,
        bh = stacked ? 170 : h - 170;
      const textCol = heatTextColor(clamp(norm(st.T, T_START, T_END), 0, 1));

      // ================= beaker =================
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2.5;
      roundRect(ctx, bx, by, bw, bh, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      const col = heatColor(clamp(norm(st.T, T_START, T_END), 0, 1));
      const innerX = bx + 8,
        innerW = bw - 16,
        innerBottom = by + bh - 8;
      const fillTop = by + bh * 0.3;

      // contents by segment
      if (st.seg === 1 || (st.seg === 2 && st.frac < 1)) {
        // ice: crystal lattice
        const iceAlpha = st.seg === 1 ? 1 : 1 - st.frac;
        ctx.save();
        ctx.globalAlpha = iceAlpha;
        ctx.fillStyle = "rgba(191,219,254,0.75)";
        roundRect(ctx, innerX, fillTop, innerW, innerBottom - fillTop, 5);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1;
        const cols = 6,
          rows = 5;
        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            const px = innerX + (innerW * i) / cols;
            const py = fillTop + ((innerBottom - fillTop) * j) / rows;
            const jitter =
              st.seg === 2 ? Math.sin(now / 120 + i * j) * 1.6 * st.frac : 0;
            ctx.beginPath();
            ctx.arc(px + jitter, py + jitter, 1.8, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
      if (st.seg >= 2 && st.seg <= 4) {
        // liquid water
        const waterAlpha =
          st.seg === 2 ? st.frac : st.seg === 4 ? 1 - st.frac : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, waterAlpha) * 0.65;
        const wg = ctx.createLinearGradient(0, fillTop, 0, innerBottom);
        wg.addColorStop(0, heatColor(clamp(norm(st.T, 0, 100), 0, 1)));
        wg.addColorStop(1, "rgba(30,64,175,0.6)");
        ctx.fillStyle = wg;
        roundRect(
          ctx,
          innerX,
          fillTop + 4,
          innerW,
          innerBottom - fillTop - 4,
          5,
        );
        ctx.fill();
        ctx.restore();

        // boiling bubbles in segment 4
        if (st.seg === 4) {
          const t = now / 600;
          for (let i = 0; i < 9; i++) {
            const bxp = innerX + (innerW * ((i * 41) % 90)) / 100 + 6;
            const byp =
              innerBottom -
              ((t * 70 * st.frac + i * 29) % (innerBottom - fillTop));
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(bxp, byp, 2 + (i % 3) * st.frac + 1, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      if (st.seg === 4 || st.seg === 5) {
        // steam particles rising
        const alpha = st.seg === 4 ? 0.25 + st.frac * 0.5 : 0.8;
        steamParts.forEach((p) => {
          p.y -= p.s * 0.004 * (st.seg === 5 ? 2 : 1);
          if (p.y < 0) {
            p.y = 1;
            p.x = rnd();
          }
          const px = bx + 10 + p.x * (bw - 20);
          const py = by - 10 - (1 - p.y) * 46;
          if (py > by - 56) {
            ctx.fillStyle = `rgba(226,232,240,${alpha * p.s * 0.5})`;
            ctx.beginPath();
            ctx.arc(px, py, 3 + p.s * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // thermometer beside beaker
      const thX = bx + bw + 22,
        thTop = by + 10,
        thH = bh - 20;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, thX - 5, thTop, 10, thH, 5);
      ctx.stroke();
      const f = clamp(norm(st.T, T_START, T_END), 0, 1);
      ctx.fillStyle = col;
      ctx.fillRect(thX - 3, thTop + thH - f * (thH - 4), 6, f * (thH - 4));
      ctx.beginPath();
      ctx.arc(thX, thTop + thH + 8, 8, 0, Math.PI * 2);
      ctx.fill();
      label(ctx, `${fmt(st.T, 1)} °C`, thX, thTop - 14, {
        size: 13,
        color: textCol,
        align: "center",
        weight: "800",
      });

      // heater under beaker
      const heaterOn = c.running;
      ctx.save();
      ctx.strokeStyle = heaterOn ? "#fb7185" : "rgba(255,255,255,0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const hx = bx + 20 + i * ((bw - 40) / 6);
        const hy = by + bh + 14 + (i % 2 === 0 ? -5 : 5);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.stroke();
      ctx.restore();
      if (heaterOn)
        drawGlow(ctx, bx + bw / 2, by + bh + 14, 40, "#fb7185", 0.25);
      label(ctx, `Heater ${c.power} W`, bx + bw / 2, by + bh + 34, {
        size: 10,
        color: "#7c8ba1",
        align: "center",
      });

      // phase name sits under the heater, clear of the steam above the beaker
      const phaseX = stacked ? w / 2 : bx + bw / 2;
      const phaseMax = stacked ? w - 24 : bw + 40;
      labelFit(ctx, st.phase.toUpperCase(), phaseX, by + bh + 56, phaseMax, {
        size: 12.5,
        color: textCol,
        align: "center",
        weight: "800",
      });
      label(ctx, SEG_NAMES[st.seg - 1], phaseX, by + bh + 74, {
        size: 10,
        color: "#7c8ba1",
        align: "center",
      });

      // ================= T–Q graph =================
      const gx = stacked ? 46 : thX + 56,
        gy = stacked ? by + bh + 124 : 46,
        gw = w - gx - (stacked ? 16 : 22),
        gh = h - gy - (stacked ? 44 : 74);
      // axes
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx, gy - 8);
      ctx.lineTo(gx, gy + gh);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();
      label(ctx, "T (°C)", gx + 4, gy - 18, { size: 10.5, color: "#94a3b8" });
      label(ctx, "Q added →", gx + gw, gy + gh + 28, {
        size: 10.5,
        color: "#94a3b8",
        align: "right",
      });
      [T_END, 100, 0, T_START].forEach((tv) => {
        const y = gy + gh - norm(tv, T_START, T_END) * gh;
        ctx.save();
        ctx.strokeStyle =
          tv === 0 || tv === 100
            ? "rgba(255,255,255,0.16)"
            : "rgba(255,255,255,0.07)";
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx + gw, y);
        ctx.stroke();
        ctx.restore();
        label(ctx, `${tv}°`, gx - 8, y, {
          size: 10,
          color: "#7c8ba1",
          align: "right",
        });
      });

      // segment backgrounds + labels
      for (let i = 0; i < 5; i++) {
        const x1 = gx + (s.bounds[i] / s.total) * gw;
        const x2 = gx + (s.bounds[i + 1] / s.total) * gw;
        ctx.save();
        ctx.globalAlpha = i + 1 === st.seg ? 0.16 : 0.06;
        ctx.fillStyle = SEG_COLORS[i];
        ctx.fillRect(x1, gy - 4, x2 - x1, gh + 4);
        ctx.restore();
        // a segment too thin for its tag gets it under the axis instead
        const thin = x2 - x1 < 18;
        label(ctx, `Q${"₁₂₃₄₅"[i]}`, (x1 + x2) / 2, gy + gh + (thin ? 12 : -10), {
          size: 10,
          color: SEG_COLORS[i],
          align: "center",
          weight: "800",
        });
        // plateau tag just above its flat line, only where it fits
        const tagW = textWidth(ctx, "TEMP CONSTANT", { size: 8.5, weight: "800" });
        if ((i === 1 || i === 3) && x2 - x1 > tagW + 6) {
          const plateauY = gy + gh - norm(i === 1 ? 0 : 100, T_START, T_END) * gh;
          ctx.save();
          ctx.globalAlpha = 0.8;
          label(ctx, "TEMP CONSTANT", (x1 + x2) / 2, plateauY - 12, {
            size: 8.5,
            color: SEG_COLORS[i],
            align: "center",
            weight: "800",
          });
          ctx.restore();
        }
      }

      // the curve (drawn up to current Q)
      ctx.beginPath();
      const steps = 240;
      for (let i = 0; i <= steps; i++) {
        const q = (Q * i) / steps;
        const p = curvePoint(q, gx, gy, gw, gh, s);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(251,191,36,0.55)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ghost of the remaining curve
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const q = Q + ((s.total - Q) * i) / steps;
        const p = curvePoint(q, gx, gy, gw, gh, s);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.stroke();
      ctx.restore();

      // current point
      const cur = curvePoint(Q, gx, gy, gw, gh, s);
      drawGlow(ctx, cur.x, cur.y, 14, col, 0.6);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // throttled react readout (~6 Hz)
      if (now - lastReadout.current > 160) {
        lastReadout.current = now;
        setReadout((prev) =>
          Math.abs(prev.Q - Q) < 0.5 && prev.segIdx === st.seg
            ? prev
            : {
                Q,
                tSim: c.power > 0 ? Q / c.power : 0,
                segIdx: st.seg,
                phase: st.phase,
              },
        );
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [scrub]);

  const controls = (
    <>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="hc-m">
          Mass · <b>{fmt(mass, 2)} kg</b>
        </label>
        <input
          id="hc-m"
          type="range"
          className="form-range"
          min="0.05"
          max="0.3"
          step="0.01"
          value={mass}
          onChange={(e) => {
            setMass(Number(e.target.value));
            Qref.current = 0;
          }}
        />
      </div>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="hc-p">
          Heater power · <b>{power} W</b>
        </label>
        <input
          id="hc-p"
          type="range"
          className="form-range"
          min="100"
          max="1000"
          step="50"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 170, flex: 1.4 }}>
        <label className="form-label" htmlFor="hc-s">
          Scrub the curve
        </label>
        <input
          id="hc-s"
          type="range"
          className="form-range"
          min="0"
          max="1"
          step="0.005"
          value={running ? clamp(readout.Q / seg.total, 0, 1) : scrub}
          onPointerDown={() => {
            userScrubbing.current = true;
          }}
          onPointerUp={() => {
            userScrubbing.current = false;
          }}
          onChange={(e) => {
            setRunning(false);
            setScrub(Number(e.target.value));
            Qref.current = Number(e.target.value) * seg.total;
          }}
        />
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-flame"
          onClick={() => setRunning((r) => !r)}
        >
          <i
            className={`bi ${running ? "bi-pause-fill" : "bi-play-fill"} me-1`}
          />
          {running ? "Pause" : "Play"}
        </button>
        <button
          className="btn btn-sm btn-outline-ink"
          onClick={() => {
            Qref.current = 0;
            setScrub(0);
            setRunning(true);
          }}
        >
          <i className="bi bi-arrow-counterclockwise me-1" />
          Restart
        </button>
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          Q added{" "}
          <b>
            {fmt(readout.Q / 1000, 1)} kJ / {fmt(seg.total / 1000, 1)} kJ
          </b>
        </span>
        <span className="readout-pill cool">
          Simulated time <b>{fmt(readout.tSim, 0)} s</b>
        </span>
        <span className="readout-pill">
          Now: <b>{SEG_NAMES[readout.segIdx - 1]}</b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      getState={() => ({
        st: stateAt(Qref.current, ctrl.current.mass),
        Q: Qref.current,
        total: ctrl.current.seg.total,
        bounds: ctrl.current.seg.bounds,
        running: ctrl.current.running,
        power: ctrl.current.power,
        curveAt: (q) => stateAt(q, ctrl.current.mass),
        Tstart: T_START,
        Tend: T_END,
        segColors: SEG_COLORS,
        segNames: SEG_NAMES,
      })}
      title="Heating Curve of Water, ice at −20 °C → steam at 120 °C"
      badge={
        <span className="chip violet">
          <i className="bi bi-snow" /> Lesson 7
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(360px, 52vw, 470px)", "--sim-h-sm": "630px" }}
          aria-label="Heating curve simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          The <b>slanted</b> parts use Q = m·c·ΔT (temperature rises inside one
          phase). The <b>flat plateaus</b> use Q = m·L, all the energy breaks
          bonds while the temperature refuses to move. Notice how enormous the
          boiling plateau (Q₄ = m·L_v) is: about <b>74%</b> of the whole
          journey&apos;s energy!
        </>
      }
    />
  );
}
