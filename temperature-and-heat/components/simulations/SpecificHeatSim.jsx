"use client";

// ============================================================
// Specific Heat Race (Lesson 5)
// • Two pans on identical burners (same power P → same Q over time)
// • ΔT rate = P / (m·c), low-c materials sprint ahead
// • Live T-vs-time graph + energy readout Q = P·t
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
  textWidth,
  heatTextColor,
} from "@/lib/canvas";
import { SPECIFIC_HEAT, fmt } from "@/lib/constants";

const MATERIALS = SPECIFIC_HEAT.filter(
  (m) => !["Ice", "Steam"].includes(m.name),
);
const T0 = 20;
const T_MAX = 250;

export default function SpecificHeatSim() {
  const canvasRef = useRef(null);
  const [matA, setMatA] = useState(0); // water
  const [matB, setMatB] = useState(4); // copper
  const [mass, setMass] = useState(0.5);
  const [power, setPower] = useState(500);
  const [running, setRunning] = useState(false);

  const sim = useRef({
    t: 0,
    Ta: T0,
    Tb: T0,
    histA: [],
    histB: [],
    partsA: null,
    partsB: null,
  });
  const [ro, setRo] = useState({ t: 0, Ta: T0, Tb: T0 });
  const lastRo = useRef(0);

  useEffect(() => {
    const rnd = seeded(3);
    const mk = () =>
      Array.from({ length: 26 }, () => ({
        x: rnd(),
        y: rnd(),
        vx: rnd() - 0.5,
        vy: rnd() - 0.5,
      }));
    sim.current.partsA = mk();
    sim.current.partsB = mk();
  }, []);

  const reset = () => {
    sim.current = {
      ...sim.current,
      t: 0,
      Ta: T0,
      Tb: T0,
      histA: [],
      histB: [],
    };
    setRunning(false);
  };

  const ctrl = useRef({ matA, matB, mass, power, running });
  useLayoutEffect(() => {
    ctrl.current = { matA, matB, mass, power, running };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    let last = performance.now();

    const drawPan = (ctx, x, y, w, h, T, parts, mat, tint) => {
      const t01 = clamp(norm(T, T0, T_MAX), 0, 1);
      const col = heatColor(t01);
      // pan body
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 2.5;
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();
      // handle
      ctx.beginPath();
      ctx.moveTo(x + w, y + h * 0.35);
      ctx.lineTo(x + w + 26, y + h * 0.2);
      ctx.stroke();
      ctx.restore();

      // material fill
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = tint;
      roundRect(ctx, x + 3, y + 3, w - 6, h - 6, 6);
      ctx.fill();
      ctx.restore();

      // particles, speed ∝ √(T in K)
      const speed = clamp(Math.sqrt((T + 273) / 300), 0.1, 2.4) * 55;
      parts.forEach((p) => {
        p.x += (p.vx * speed) / w / 55;
        p.y += (p.vy * speed) / h / 55;
        if (p.x < 0 || p.x > 1) {
          p.vx *= -1;
          p.x = clamp(p.x, 0, 1);
        }
        if (p.y < 0 || p.y > 1) {
          p.vy *= -1;
          p.y = clamp(p.y, 0, 1);
        }
        const px = x + 8 + p.x * (w - 16);
        const py = y + 8 + p.y * (h - 16);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(px, py, 2.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // mini thermometer
      const thX = x + w / 2,
        thTop = y - 44,
        thH = 40;
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, thX - 4, thTop, 8, thH, 4);
      ctx.stroke();
      const fillH = clamp(norm(T, T0, T_MAX), 0, 1) * (thH - 4);
      ctx.fillStyle = col;
      ctx.fillRect(thX - 2.5, thTop + thH - 2 - fillH, 5, fillH);

      label(ctx, mat.name, x + w / 2, y + h + 42, {
        size: 13,
        color: "#e2e8f0",
        align: "center",
        weight: "800",
      });
      label(ctx, `c = ${mat.value} J/kg·K`, x + w / 2, y + h + 60, {
        size: 11.5,
        color: "#94a3b8",
        align: "center",
      });
      label(ctx, `${fmt(T, 1)} °C`, thX, thTop - 14, {
        size: 14,
        color: heatTextColor(t01),
        align: "center",
        weight: "800",
      });

      // burner flames
      const t = performance.now() / 120;
      for (let i = 0; i < 3; i++) {
        const fx = x + w * (0.3 + i * 0.2);
        const fh = 14 + Math.sin(t + i * 2) * 4;
        const base = y + h + 22; // flames lick the pan bottom
        const g = ctx.createLinearGradient(fx, base, fx, base - fh);
        g.addColorStop(0, "rgba(255,107,53,0.9)");
        g.addColorStop(1, "rgba(255,210,63,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(fx - 6, base);
        ctx.quadraticCurveTo(fx, base - fh * 1.6, fx + 6, base);
        ctx.closePath();
        ctx.fill();
      }
    };

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const c = ctrl.current;
      const sN = sim.current;
      const mA = MATERIALS[c.matA];
      const mB = MATERIALS[c.matB];

      // physics, 1 real second = 60 simulated seconds of heating (for demo speed)
      if (c.running) {
        const simDt = dt * 60;
        sN.t += simDt;
        sN.Ta = Math.min(
          T_MAX,
          sN.Ta + (c.power * simDt) / (c.mass * mA.value),
        );
        sN.Tb = Math.min(
          T_MAX,
          sN.Tb + (c.power * simDt) / (c.mass * mB.value),
        );
        if (
          sN.histA.length === 0 ||
          sN.t - sN.histA[sN.histA.length - 1].t > 4
        ) {
          sN.histA.push({ t: sN.t, T: sN.Ta });
          sN.histB.push({ t: sN.t, T: sN.Tb });
        }
      }

      ctx.clearRect(0, 0, w, h);

      // ---------- graph ----------
      // legend sits beside the title when both fit, otherwise on its own row
      const legend = [
        { name: `A · ${mA.name}`, color: "#38bdf8" },
        { name: `B · ${mB.name}`, color: "#fb923c" },
      ];
      const legendW = legend.reduce(
        (sum, item) =>
          sum + textWidth(ctx, item.name, { size: 11.5, weight: "700" }) + 48,
        -20,
      );
      const titleW = textWidth(ctx, "TEMPERATURE VS TIME", {
        size: 11.5,
        weight: "800",
      });
      const legendRow = titleW + 24 + legendW > w - 76;
      const legendY = legendRow ? 38 : 18;
      const gx = 58,
        gy = legendRow ? 62 : 46,
        gw = w - gx - 18,
        gh = Math.max(110, h * 0.4 - gy);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = gy + (gh * i) / 4;
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx + gw, y);
        ctx.stroke();
        const tick = T_MAX - ((T_MAX - T0) * i) / 4;
        label(ctx, `${fmt(tick, 0)} °C`, gx - 8, y, {
          size: 11,
          color: "#94a3b8",
          align: "right",
        });
      }
      ctx.restore();
      label(ctx, "TEMPERATURE VS TIME", gx, 18, {
        size: 11.5,
        color: "#e2e8f0",
        weight: "800",
      });
      // subtitle only where it can't run into the legend
      if (w > 760) {
        label(ctx, "Same burner power on both pans", gx + 158, 18, {
          size: 11.5,
          color: "#94a3b8",
        });
      }

      const tMax = Math.max(60, sN.t);
      label(ctx, "0 s", gx, gy + gh + 16, { size: 11, color: "#94a3b8" });
      label(ctx, `${fmt(tMax, 0)} s`, gx + gw, gy + gh + 16, {
        size: 11,
        color: "#94a3b8",
        align: "right",
      });

      const plot = (hist, color) => {
        if (hist.length < 2) return;
        ctx.beginPath();
        hist.forEach((pt, i) => {
          const px = gx + (pt.t / tMax) * gw;
          const py = gy + gh - clamp(norm(pt.T, T0, T_MAX), 0, 1) * gh;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };
      plot(sN.histA, "#38bdf8");
      plot(sN.histB, "#fb923c");

      // legend: right-aligned beside the title, or left-aligned on its own row
      let lx = legendRow ? gx + 28 : gx + gw - legendW + 28;
      legend.forEach((item) => {
        const tw = textWidth(ctx, item.name, { size: 11.5, weight: "700" });
        label(ctx, item.name, lx, legendY, {
          size: 11.5,
          color: item.color,
          weight: "700",
        });
        ctx.save();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(lx - 28, legendY);
        ctx.lineTo(lx - 8, legendY);
        ctx.stroke();
        ctx.restore();
        lx += tw + 48;
      });

      // ---------- pan zone: banner row, then the pan stack, centered ----------
      const zoneTop = gy + gh + 30;
      const stackH = 26 + 44 + 64 + 70; // temp label, thermometer, pan, flames + labels
      const panY =
        zoneTop + 30 + Math.max(0, (h - zoneTop - 30 - stackH) / 2) + 70;

      // ---------- pans ----------
      const panW = Math.min(150, w * 0.24);
      const panH = 64;
      const gap = (w - panW * 2) / 3;
      drawPan(ctx, gap, panY, panW, panH, sN.Ta, sN.partsA, mA, "#38bdf8");
      drawPan(
        ctx,
        gap * 2 + panW,
        panY,
        panW,
        panH,
        sN.Tb,
        sN.partsB,
        mB,
        "#fb923c",
      );

      // winner badge
      if (c.running && sN.t > 2 && Math.abs(sN.Ta - sN.Tb) > 1) {
        const lead =
          sN.Ta > sN.Tb
            ? { name: mA.name, x: gap + panW / 2 }
            : { name: mB.name, x: gap * 2 + panW * 1.5 };
        label(
          ctx,
          `▲ ${lead.name} heats faster (lower c)`,
          w / 2,
          zoneTop + 10,
          {
            size: 12.5,
            color: "#fbbf24",
            align: "center",
            weight: "800",
          },
        );
      }

      if (now - lastRo.current > 200) {
        lastRo.current = now;
        setRo((prev) =>
          prev.t === sN.t && prev.Ta === sN.Ta && prev.Tb === sN.Tb
            ? prev
            : { t: sN.t, Ta: sN.Ta, Tb: sN.Tb },
        );
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const Q = ro.t * power;
  const controls = (
    <>
      <div style={{ minWidth: 150 }}>
        <label className="form-label" htmlFor="sh-a">
          Pan A material
        </label>
        <select
          id="sh-a"
          className="form-select form-select-sm"
          value={matA}
          onChange={(e) => {
            setMatA(Number(e.target.value));
            reset();
          }}
        >
          {MATERIALS.map((m, i) => (
            <option key={m.name} value={i}>
              {m.name} (c={m.value})
            </option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 150 }}>
        <label className="form-label" htmlFor="sh-b">
          Pan B material
        </label>
        <select
          id="sh-b"
          className="form-select form-select-sm"
          value={matB}
          onChange={(e) => {
            setMatB(Number(e.target.value));
            reset();
          }}
        >
          {MATERIALS.map((m, i) => (
            <option key={m.name} value={i}>
              {m.name} (c={m.value})
            </option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="sh-m">
          Mass (each) · <b>{fmt(mass, 2)} kg</b>
        </label>
        <input
          id="sh-m"
          type="range"
          className="form-range"
          min="0.1"
          max="2"
          step="0.1"
          value={mass}
          onChange={(e) => setMass(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="sh-p">
          Burner power · <b>{power} W</b>
        </label>
        <input
          id="sh-p"
          type="range"
          className="form-range"
          min="100"
          max="2000"
          step="50"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
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
          {running ? "Pause" : "Heat!"}
        </button>
        <button className="btn btn-sm btn-outline-ink" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reset
        </button>
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          Q supplied{" "}
          <b>
            {fmt(Q >= 1e6 ? Q / 1e6 : Q / 1000, 1)} {Q >= 1e6 ? "MJ" : "kJ"}
          </b>
        </span>
        <span className="readout-pill cool">
          ΔT = Q/(m·c){" "}
          <b>
            A: {fmt(ro.Ta - T0, 1)} K · B: {fmt(ro.Tb - T0, 1)} K
          </b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Specific Heat Race, same energy, different materials"
      badge={
        <span className="chip cool">
          <i className="bi bi-cup-hot" /> Lesson 5
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(440px, 58vw, 520px)" }}
          aria-label="Specific heat simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          Both pans receive the <b>same Q = P × t</b>, but ΔT = Q ÷ (m·c). Water
          (c = 4186) barely moves while copper (c = 385) and lead (c = 128)
          sprint. That&apos;s why a metal spoon burns your tongue but the soup
          it sits in is still sippable, and why oceans moderate coastal weather.
        </>
      }
    />
  );
}
