"use client";

// ============================================================
// Gas Laws & the kinetic model (Lesson 9)
// • Cylinder + movable piston with 60 bouncing particles
// • Modes: Isochoric (V const) · Isobaric (P const) ·
//   Isothermal (T const) · Ideal gas (free P V T)
// • P = nRT/V, particle speed ∝ √T, live gauge + v_rms readouts
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  labelWrap,
} from "@/lib/canvas";
import { UNIVERSAL, fmt } from "@/lib/constants";

const { R, kB } = UNIVERSAL;
const N_MOL = 0.04;
const M_N2 = 0.028; // kg/mol
const T_MIN = 200,
  T_MAX = 600;
const V_MIN = 1,
  V_MAX = 4; // litres

const MODES = [
  {
    id: "isochoric",
    name: "Isochoric",
    law: "Gay-Lussac · V constant",
    formula: "P₁/T₁ = P₂/T₂",
    fixed: "V",
    free: "T",
  },
  {
    id: "isobaric",
    name: "Isobaric",
    law: "Charles · P constant",
    formula: "V₁/T₁ = V₂/T₂",
    fixed: "P",
    free: "T",
  },
  {
    id: "isothermal",
    name: "Isothermal",
    law: "Boyle · T constant",
    formula: "P₁V₁ = P₂V₂",
    fixed: "T",
    free: "V",
  },
  {
    id: "free",
    name: "Ideal gas",
    law: "everything moves",
    formula: "pV = nRT",
    fixed: null,
    free: "TV",
  },
];

export default function GasLawSim() {
  const canvasRef = useRef(null);
  const [modeIdx, setModeIdx] = useState(0);
  const [tempK, setTempK] = useState(300);
  const [volL, setVolL] = useState(2);
  const [readout, setReadout] = useState({
    P: 0,
    V: 2,
    T: 300,
    vrms: 0,
    ke: 0,
  });

  const mode = MODES[modeIdx];

  // state: temperature is always user-controlled except isothermal; volume derived for isobaric
  const st = useRef({ T: 300, V: 2, parts: null, gauge: 0 });

  useEffect(() => {
    const rnd = seeded(17);
    st.current.parts = Array.from({ length: 60 }, () => {
      const ang = rnd() * Math.PI * 2;
      return {
        x: rnd(),
        y: rnd(),
        vx: Math.cos(ang),
        vy: Math.sin(ang),
        r: 2.6,
      };
    });
  }, []);

  // apply mode constraints
  useEffect(() => {
    const s = st.current;
    if (mode.id === "isothermal") {
      // T fixed at 300; user moves V
      s.T = 300;
      s.V = volL;
    } else if (mode.id === "isobaric") {
      // P fixed at value computed for 300 K, 2 L
      s.T = tempK;
      const Pfixed = (N_MOL * R * 300) / 0.002;
      s.V = clamp(((N_MOL * R * tempK) / Pfixed) * 1000, V_MIN, V_MAX);
    } else if (mode.id === "isochoric") {
      s.T = tempK;
      s.V = 2; // fixed volume
    } else {
      s.T = tempK;
      s.V = volL;
    }
  }, [mode, tempK, volL]);

  const ctrl = useRef({ mode });
  useLayoutEffect(() => {
    ctrl.current = { mode };
  });
  const lastR = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    let last = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const s = st.current;
      ctx.clearRect(0, 0, w, h);

      const P = (N_MOL * R * s.T) / (s.V / 1000); // Pa
      const vScale = clamp(Math.sqrt(s.T / 300), 0.4, 2) * 150; // px/s

      // wide: cylinder | gauge with info under it. narrow: cylinder and gauge
      // share a top zone of height Z, info block runs full width below.
      const stacked = w < 560;
      const Z = stacked ? 300 : h;

      // ---------- cylinder ----------
      const cylX = stacked ? 16 : w * 0.09,
        cylW = stacked ? w * 0.5 : w * 0.4;
      const cylBottom = Z * 0.86;
      const maxH = Z * 0.62;
      const gasH = maxH * norm(s.V, V_MIN * 0.8, V_MAX * 1.05);
      const pistonY = cylBottom - gasH;

      // gas volume box
      ctx.save();
      const gg = ctx.createLinearGradient(0, pistonY, 0, cylBottom);
      gg.addColorStop(
        0,
        `rgba(56,189,248,${0.06 + norm(s.T, T_MIN, T_MAX) * 0.1})`,
      );
      gg.addColorStop(1, `rgba(255,107,53,${norm(s.T, T_MIN, T_MAX) * 0.12})`);
      ctx.fillStyle = gg;
      ctx.fillRect(cylX, pistonY, cylW, gasH);
      ctx.restore();

      // cylinder walls
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cylX, cylBottom);
      ctx.lineTo(cylX, Z * 0.12);
      ctx.moveTo(cylX + cylW, cylBottom);
      ctx.lineTo(cylX + cylW, Z * 0.12);
      ctx.moveTo(cylX - 10, cylBottom);
      ctx.lineTo(cylX + cylW + 10, cylBottom);
      ctx.stroke();

      // piston
      ctx.save();
      const pg = ctx.createLinearGradient(0, pistonY - 16, 0, pistonY + 8);
      pg.addColorStop(0, "#64748b");
      pg.addColorStop(1, "#334155");
      ctx.fillStyle = pg;
      roundRect(ctx, cylX - 6, pistonY - 16, cylW + 12, 22, 5);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // piston rod
      ctx.fillStyle = "#475569";
      ctx.fillRect(cylX + cylW / 2 - 5, pistonY - 40, 10, 26);
      ctx.restore();
      // beside the rod, so it never reaches the canvas title at full volume
      label(ctx, "PISTON", cylX + cylW / 2 + 12, pistonY - 27, {
        size: 9.5,
        color: "#94a3b8",
        weight: "800",
      });

      // ---------- particles ----------
      (s.parts || []).forEach((p) => {
        p.x += (p.vx * vScale * dt) / cylW;
        p.y += (p.vy * vScale * dt) / gasH;
        if (p.x < 0 || p.x > 1) {
          p.vx *= -1;
          p.x = clamp(p.x, 0, 1);
        }
        if (p.y < 0 || p.y > 1) {
          p.vy *= -1;
          p.y = clamp(p.y, 0, 1);
        }
        const px = cylX + 4 + p.x * (cylW - 8);
        const py = pistonY + 4 + p.y * (gasH - 8);
        ctx.fillStyle = heatColor(clamp(norm(s.T, T_MIN, T_MAX), 0, 1));
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      label(ctx, `V = ${fmt(s.V, 2)} L`, cylX + cylW / 2, cylBottom + 18, {
        size: 11,
        color: "#7dd3fc",
        align: "center",
        weight: "800",
      });

      // ---------- pressure gauge ----------
      const gx = stacked ? (cylX + cylW + w) / 2 : w * 0.72,
        gy = Z * 0.3,
        gr = stacked ? Math.min(60, (w - cylX - cylW) / 2 - 12) : Math.min(74, w * 0.13);
      const PkPa = P / 1000;
      const PmaxK = (N_MOL * R * T_MAX) / (V_MIN / 1000) / 1000;
      const ang = -Math.PI * 0.75 + clamp(PkPa / PmaxK, 0, 1) * Math.PI * 1.5;
      s.gauge += (ang - s.gauge) * 0.08;
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // ticks
      for (let i = 0; i <= 10; i++) {
        const a = -Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
        ctx.beginPath();
        ctx.moveTo(gx + Math.cos(a) * (gr - 7), gy + Math.sin(a) * (gr - 7));
        ctx.lineTo(gx + Math.cos(a) * (gr - 13), gy + Math.sin(a) * (gr - 13));
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      // needle
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(
        gx + Math.cos(s.gauge) * (gr - 16),
        gy + Math.sin(s.gauge) * (gr - 16),
      );
      ctx.stroke();
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.arc(gx, gy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, `${fmt(PkPa, 1)} kPa`, gx, gy + gr * 0.55, {
        size: 15,
        color: "#fda4af",
        align: "center",
        weight: "800",
      });
      label(ctx, "PRESSURE", gx, gy + gr + 22, {
        size: 10,
        color: "#7c8ba1",
        align: "center",
        weight: "800",
      });

      // ---------- info block ----------
      const ix = stacked ? 16 : w * 0.56;
      const iy = stacked ? Z + 30 : h * 0.62;
      const iw = w - ix - 12;
      labelFit(ctx, ctrl.current.mode.law.toUpperCase(), ix, iy, iw, {
        size: 12,
        color: "#fbbf24",
        weight: "800",
      });
      labelFit(ctx, ctrl.current.mode.formula, ix, iy + 22, iw, {
        size: 14,
        color: "#e2e8f0",
        weight: "800",
      });
      const vrms = Math.sqrt((3 * R * s.T) / M_N2);
      const ke = 1.5 * kB * s.T;
      label(ctx, `T = ${fmt(s.T, 0)} K`, ix, iy + 48, {
        size: 11.5,
        color: "#94a3b8",
      });
      labelFit(ctx, `v_rms (N₂) = ${fmt(vrms, 0)} m/s ∝ √T`, ix, iy + 66, iw, {
        size: 11.5,
        color: "#94a3b8",
      });
      labelFit(
        ctx,
        `KE_avg = 1.5·k_B·T = ${ke.toExponential(2)} J`,
        ix,
        iy + 84,
        iw,
        { size: 11.5, color: "#94a3b8" },
      );
      labelWrap(
        ctx,
        "Hotter particles hit the walls harder and more often, so P rises.",
        ix,
        iy + 108,
        iw,
        { size: 10.5, color: "#7c8ba1", lineHeight: 14 },
      );

      labelFit(
        ctx,
        w < 420
          ? "KINETIC MODEL: pressure = wall collisions"
          : "KINETIC MODEL, pressure = particles colliding with the walls",
        w / 2,
        18,
        w - 24,
        { size: 11, color: "#94a3b8", align: "center", weight: "700" },
      );

      if (now - lastR.current > 200) {
        lastR.current = now;
        setReadout((prev) =>
          Math.abs(prev.P - PkPa) < 0.05 &&
          Math.abs(prev.V - s.V) < 0.005 &&
          prev.T === s.T
            ? prev
            : { P: PkPa, V: s.V, T: s.T, vrms, ke },
        );
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const showT = mode.free !== "V" || mode.id === "free"; // T slider usable except isothermal
  const tDisabled = mode.id === "isothermal";
  const vDisabled = mode.id === "isochoric" || mode.id === "isobaric";

  const controls = (
    <>
      <div style={{ minWidth: 210 }}>
        <label className="form-label">Process</label>
        <div className="d-flex flex-wrap gap-1">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              className={`mascot-chip ${modeIdx === i ? "active" : ""}`}
              style={
                modeIdx === i
                  ? {
                      background: "#ff6b35",
                      color: "#fff",
                      borderColor: "#ff6b35",
                    }
                  : undefined
              }
              onClick={() => setModeIdx(i)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ minWidth: 150, flex: 1 }}>
        <label className="form-label" htmlFor="gas-t">
          Temperature ·{" "}
          <b style={{ color: "#c2410c" }}>
            {tDisabled ? "300 K (fixed)" : `${tempK} K`}
          </b>
        </label>
        <input
          id="gas-t"
          type="range"
          className="form-range"
          min={T_MIN}
          max={T_MAX}
          step="5"
          value={tDisabled ? 300 : tempK}
          disabled={tDisabled}
          onChange={(e) => setTempK(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 150, flex: 1 }}>
        <label className="form-label" htmlFor="gas-v">
          Volume ·{" "}
          <b style={{ color: "#0369a1" }}>
            {vDisabled
              ? `${fmt(readout.V, 2)} L (derived)`
              : `${volL.toFixed(1)} L`}
          </b>
        </label>
        <input
          id="gas-v"
          type="range"
          className="form-range"
          min={V_MIN}
          max={V_MAX}
          step="0.1"
          value={vDisabled ? readout.V : volL}
          disabled={vDisabled}
          onChange={(e) => setVolL(Number(e.target.value))}
        />
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          P <b>{fmt(readout.P, 1)} kPa</b>
        </span>
        <span className="readout-pill cool">
          V <b>{fmt(readout.V, 2)} L</b>
        </span>
        <span className="readout-pill">
          T <b>{fmt(readout.T, 0)} K</b>
        </span>
        <span className="readout-pill cool">
          v_rms <b>{fmt(readout.vrms, 0)} m/s</b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Gas Laws Piston, pV = nRT with real bouncing particles"
      badge={
        <span className="chip green">
          <i className="bi bi-balloon" /> Lesson 9
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(400px, 52vw, 470px)", "--sim-h-sm": "490px" }}
          aria-label="Gas law piston simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />n = {N_MOL} mol of nitrogen.
          Try each process: <b>Isochoric</b>, heat it and the gauge climbs (P ∝
          T). <b>Isobaric</b>, heat it and the piston rises (V ∝ T).{" "}
          <b>Isothermal</b>, squeeze the volume and pressure climbs (P ∝ 1/V).
          Faster particles at higher T is why all gas laws demand
          <b> kelvin</b>.
        </>
      }
    />
  );
}
