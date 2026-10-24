"use client";

// ============================================================
// Conduction (Lesson 3)
// • 1-D heat equation across a rod: ∂T/∂t ∝ k·∂²T/∂x²
// • Hot reservoir (flame) at T_cold+ΔT, cold reservoir at 20 °C
// • Material picker (k), sliders for ΔT, L, A
// • Live steady-state readouts: H = kAΔT/L, R = L/(kA), Q = H·t
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
  textWidth,
} from "@/lib/canvas";
import { THERMAL_CONDUCTIVITY, fmt } from "@/lib/constants";

const N = 30; // nodes
const T_COLD = 20;

export default function ConductionSim() {
  const canvasRef = useRef(null);
  const [matIdx, setMatIdx] = useState(0); // copper default
  const [dT, setDT] = useState(100);
  const [lenCm, setLenCm] = useState(50); // cm
  const [areaE4, setAreaE4] = useState(1); // ×10⁻⁴ m²
  const [running, setRunning] = useState(true);

  const mat = THERMAL_CONDUCTIVITY[matIdx];
  const ctrl = useRef({ mat, dT, lenCm, areaE4, running });
  useLayoutEffect(() => {
    ctrl.current = { mat, dT, lenCm, areaE4, running };
  });

  const T = useRef(new Array(N).fill(T_COLD));
  const elapsed = useRef(0);
  const packets = useRef([]);
  const spawnAcc = useRef(0);

  // reset profile when material/geometry changes strongly
  const reset = () => {
    T.current = new Array(N).fill(T_COLD);
    elapsed.current = 0;
    packets.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    let last = performance.now();

    const draw = () => {
      const now = performance.now();
      const dtReal = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const c = ctrl.current;
      const hot = T_COLD + c.dT;

      // ---- physics step (explicit diffusion, scaled for visibility) ----
      if (c.running) {
        const k = c.mat.value;
        // visual diffusivity: log-scaled so copper and foam both look sensible
        const alpha = clamp(
          0.05 + 0.24 * (Math.log10(k / 0.02) / Math.log10(410 / 0.02)),
          0.05,
          0.29,
        );
        const substeps = 4;
        for (let sN = 0; sN < substeps; sN++) {
          const arr = T.current;
          const next = arr.slice();
          for (let i = 1; i < N - 1; i++) {
            next[i] = arr[i] + alpha * (arr[i - 1] + arr[i + 1] - 2 * arr[i]);
          }
          next[0] = hot; // flame side held at hot
          next[N - 1] = T_COLD; // cold side held
          T.current = next;
        }
        elapsed.current += dtReal;
      }

      ctx.clearRect(0, 0, w, h);
      const arr = T.current;

      // ---- layout: graph band, rod band, heat-flow lane, caption ----
      const resW = 46;
      const rodLeft = 16 + resW + 12;
      const rodRight = w - 16 - resW - 12;
      const segW = (rodRight - rodLeft) / N;
      const cellX = (i) => rodLeft + (i + 0.5) * segW;
      // legend sits beside the title when both fit, otherwise on its own row
      const LEGEND_W = 222;
      const titleW = textWidth(ctx, "TEMPERATURE ALONG THE ROD", {
        size: 11.5,
        weight: "800",
      });
      const legendRow = titleW + 24 + LEGEND_W > rodRight - rodLeft;
      const legendY = legendRow ? 38 : 18;
      const gy0 = legendRow ? 62 : 46;
      const gH = Math.max(90, h - 176 - gy0);
      const rodH = 46;
      const rodY = gy0 + gH + 48;
      const laneY = rodY + rodH + 26;
      const captionY = h - 16;

      // ---- reservoirs (mirrored blocks, labels above and below) ----
      const drawReservoir = (x, fill, stroke, title, temp, color) => {
        ctx.save();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, rodY - 10, resW, rodH + 20, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        label(ctx, title, x + resW / 2, rodY - 24, {
          size: 11,
          color,
          align: "center",
          weight: "800",
        });
        label(ctx, temp, x + resW / 2, rodY + rodH + 26, {
          size: 12,
          color,
          align: "center",
          weight: "800",
        });
      };
      drawReservoir(
        16,
        "rgba(249,115,22,0.16)",
        "rgba(251,146,60,0.65)",
        "HOT",
        `${fmt(hot, 0)} °C`,
        "#fdba74",
      );
      drawReservoir(
        w - 16 - resW,
        "rgba(56,189,248,0.14)",
        "rgba(56,189,248,0.6)",
        "COLD",
        `${T_COLD} °C`,
        "#7dd3fc",
      );

      // flames inside the hot block
      const ft = now / 130;
      const flameBase = rodY + rodH + 4;
      for (let i = 0; i < 3; i++) {
        const fh = 22 + Math.sin(ft + i * 2.1) * 5 + (i === 1 ? 8 : 0);
        const fx = 16 + resW / 2 + (i - 1) * 11;
        const g = ctx.createLinearGradient(fx, flameBase, fx, flameBase - fh);
        g.addColorStop(0, "rgba(255,107,53,0.95)");
        g.addColorStop(0.6, "rgba(247,147,30,0.75)");
        g.addColorStop(1, "rgba(255,210,63,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(fx - 6, flameBase);
        ctx.quadraticCurveTo(fx, flameBase - fh * 2, fx + 6, flameBase);
        ctx.closePath();
        ctx.fill();
      }
      label(ctx, "❄", w - 16 - resW / 2, rodY + rodH / 2, {
        size: 18,
        color: "#bae6fd",
        align: "center",
      });

      // ---- rod as particle cells ----
      for (let i = 0; i < N; i++) {
        const t01 = clamp(norm(arr[i], T_COLD, hot), 0, 1);
        const cx = cellX(i);
        ctx.fillStyle = heatColor(t01);
        ctx.globalAlpha = 0.85;
        roundRect(ctx, cx - segW / 2 + 0.6, rodY, segW - 1.2, rodH, 3);
        ctx.fill();
        ctx.globalAlpha = 1;
        // vibration amplitude ∝ temperature
        const amp = 1.5 + t01 * 6.5;
        const jitterX = Math.sin(now / (60 + 240 * (1 - t01)) + i * 13.7) * amp;
        const jitterY = Math.cos(now / (70 + 260 * (1 - t01)) + i * 7.3) * amp;
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.beginPath();
        ctx.arc(cx + jitterX * 0.5, rodY + rodH / 2 + jitterY * 0.5, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, rodLeft, rodY - 1, rodRight - rodLeft, rodH + 2, 6);
      ctx.stroke();

      // ---- heat-flow lane: packets travel hot → cold ----
      // spawn rate follows H (log scale); speed follows the local gradient,
      // so packets crawl through the part of the rod that hasn't warmed up yet
      const H = (c.mat.value * c.areaE4 * 1e-4 * c.dT) / (c.lenCm / 100);
      const rate = clamp(0.6 + 1.6 * Math.log10(1 + H), 0.6, 9); // packets/s
      const pk = packets.current;
      if (c.running) {
        spawnAcc.current += dtReal * rate;
        while (spawnAcc.current >= 1) {
          spawnAcc.current -= 1;
          pk.push({ x: 0, wobble: Math.random() * 6.28 });
        }
        const steadyGrad = c.dT / (N - 1);
        for (const p of pk) {
          const i = clamp(Math.floor(p.x * (N - 1)), 0, N - 2);
          const grad = Math.max(0, arr[i] - arr[i + 1]);
          p.x += dtReal * 0.22 * clamp(grad / steadyGrad, 0.08, 2.5);
        }
        packets.current = pk.filter((p) => p.x < 1);
      }
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.moveTo(rodLeft, laneY);
      ctx.lineTo(rodRight, laneY);
      ctx.stroke();
      ctx.restore();
      for (const p of packets.current) {
        const px = rodLeft + p.x * (rodRight - rodLeft);
        const py = laneY + Math.sin(now / 300 + p.wobble) * 2;
        const col = heatColor(1 - p.x * 0.85);
        drawGlow(ctx, px, py, 9, col, 0.45);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      label(ctx, "Heat flow →", legendRow ? 16 : rodLeft, laneY + 20, {
        size: 11.5,
        color: "#cbd5e1",
        weight: "700",
      });
      label(
        ctx,
        `H = ${H >= 1000 ? `${fmt(H / 1000, 2)} kW` : `${fmt(H, H < 1 ? 3 : 1)} W`} at steady state`,
        legendRow ? w - 16 : rodRight,
        laneY + 20,
        { size: 11.5, color: "#fbbf24", align: "right", weight: "700" },
      );
      label(
        ctx,
        `${c.mat.name} rod · k = ${c.mat.value} W/m·K · L = ${fmt(c.lenCm / 100, 2)} m`,
        w / 2,
        captionY,
        { size: 11.5, color: "#94a3b8", align: "center" },
      );

      // ---- temperature profile graph ----
      const gx0 = cellX(0);
      const gx1 = cellX(N - 1);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy0);
      ctx.moveTo(gx0, gy0 + gH);
      ctx.lineTo(gx1, gy0 + gH);
      ctx.stroke();
      ctx.restore();
      label(ctx, "TEMPERATURE ALONG THE ROD", gx0, 18, {
        size: 11.5,
        color: "#e2e8f0",
        weight: "800",
      });
      label(ctx, `${fmt(hot, 0)} °C`, gx0 - 10, gy0, {
        size: 11,
        color: "#94a3b8",
        align: "right",
      });
      label(ctx, `${T_COLD} °C`, gx0 - 10, gy0 + gH, {
        size: 11,
        color: "#94a3b8",
        align: "right",
      });

      const legendX = legendRow ? gx0 : gx1 - LEGEND_W;
      const legendSwatch = (x, dashed, color) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        if (dashed) ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(x, legendY);
        ctx.lineTo(x + 22, legendY);
        ctx.stroke();
        ctx.restore();
      };
      legendSwatch(legendX, false, "#fbbf24");
      label(ctx, "Now", legendX + 30, legendY, { size: 11, color: "#cbd5e1" });
      legendSwatch(legendX + 82, true, "rgba(255,255,255,0.45)");
      label(ctx, "Steady state", legendX + 112, legendY, { size: 11, color: "#cbd5e1" });

      // steady-state reference line (straight drop)
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy0 + gH);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const py = gy0 + gH - clamp(norm(arr[i], T_COLD, hot), 0, 1) * gH;
        i === 0 ? ctx.moveTo(cellX(i), py) : ctx.lineTo(cellX(i), py);
      }
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.4;
      ctx.shadowColor = "rgba(251,191,36,0.5)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  // live numbers (steady state)
  const L = lenCm / 100;
  const A = areaE4 * 1e-4;
  const H = (mat.value * A * dT) / L;
  const R = L / (mat.value * A);

  const controls = (
    <>
      <div style={{ minWidth: 170 }}>
        <label className="form-label" htmlFor="cond-mat">
          Material (k)
        </label>
        <select
          id="cond-mat"
          className="form-select form-select-sm"
          value={matIdx}
          onChange={(e) => {
            setMatIdx(Number(e.target.value));
            reset();
          }}
        >
          {THERMAL_CONDUCTIVITY.map((m, i) => (
            <option key={m.name} value={i}>
              {m.name}, {m.value} W/m·K
            </option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 150, flex: 1 }}>
        <label className="form-label" htmlFor="cond-dt">
          ΔT · <b style={{ color: "#c2410c" }}>{dT} K</b>
        </label>
        <input
          id="cond-dt"
          type="range"
          className="form-range"
          min="10"
          max="200"
          value={dT}
          onChange={(e) => setDT(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="cond-l">
          L · <b>{lenCm} cm</b>
        </label>
        <input
          id="cond-l"
          type="range"
          className="form-range"
          min="10"
          max="100"
          value={lenCm}
          onChange={(e) => setLenCm(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 130, flex: 1 }}>
        <label className="form-label" htmlFor="cond-a">
          A · <b>{areaE4} ×10⁻⁴ m²</b>
        </label>
        <input
          id="cond-a"
          type="range"
          className="form-range"
          min="0.5"
          max="4"
          step="0.5"
          value={areaE4}
          onChange={(e) => setAreaE4(Number(e.target.value))}
        />
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-ink"
          onClick={() => setRunning((r) => !r)}
        >
          <i
            className={`bi ${running ? "bi-pause-fill" : "bi-play-fill"} me-1`}
          />
          {running ? "Pause" : "Run"}
        </button>
        <button className="btn btn-sm btn-outline-ink" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reset
        </button>
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          H = kAΔT/L{" "}
          <b>{H >= 1000 ? `${fmt(H / 1000, 2)} kW` : `${fmt(H, 2)} W`}</b>
        </span>
        <span className="readout-pill cool">
          R = L/kA <b>{fmt(R, 3)} K/W</b>
        </span>
        <span className="readout-pill">
          Q in 60 s <b>{fmt(H * 60, 0)} J</b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Conduction Rod, particle-to-particle energy transfer"
      badge={
        <span className="chip flame">
          <i className="bi bi-rulers" /> Lesson 3
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(360px, 44vw, 440px)" }}
          aria-label="Conduction simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          Particles stay in place but vibrate harder where it&apos;s hot, bumping
          energy down the rod. Try <b>copper → foam</b>: same ΔT, thousands of
          times less heat flow. The glowing packets show heat on the move: they
          crawl through the cold part until the profile settles into the dashed
          straight line, where H = kAΔT/L.
        </>
      }
    />
  );
}
