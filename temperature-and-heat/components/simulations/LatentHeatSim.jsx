"use client";

// ============================================================
// Specific Latent Heat, the electrical method (Lesson 8)
// • Mode: melt ice (L_f) or boil water (L_v)
// • Heater of known power P; Q = P·t; useful Q = efficiency × Q
// • m converted = Q_useful / L  →  and the classic student error:
//   ignoring losses makes the MEASURED L look too high.
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
  labelWrap,
  wrapLines,
} from "@/lib/canvas";
import { UNIVERSAL, fmt, fmtSci } from "@/lib/constants";

const { Lf, Lv } = UNIVERSAL;
const TOTAL_MASS = 0.2; // kg
const TIME_SCALE = 25; // 1 real second = 25 experiment seconds

export default function LatentHeatSim() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("melt"); // melt | boil
  const [power, setPower] = useState(300);
  const [eff, setEff] = useState(100);
  const [running, setRunning] = useState(false);

  const L = mode === "melt" ? Lf : Lv;
  const st = useRef({ t: 0, mDone: 0, parts: null, bubbles: [] });

  useEffect(() => {
    const rnd = seeded(13);
    st.current.parts = Array.from({ length: 24 }, () => ({
      x: rnd(),
      y: rnd(),
      vx: rnd() - 0.5,
      vy: rnd() - 0.5,
    }));
  }, []);

  const ctrl = useRef({ mode, power, eff, running, L });
  useLayoutEffect(() => {
    ctrl.current = { mode, power, eff, running, L };
  });
  const [readout, setReadout] = useState({ t: 0, Q: 0, mDone: 0, Lmeas: 0 });
  const lastR = useRef(0);

  const reset = () => {
    st.current.t = 0;
    st.current.mDone = 0;
    setRunning(false);
    setReadout({ t: 0, Q: 0, mDone: 0, Lmeas: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    let last = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const c = ctrl.current;
      const sN = st.current;

      // physics
      if (c.running && sN.mDone < TOTAL_MASS) {
        sN.t += dt * TIME_SCALE;
        const Quseful = c.power * (c.eff / 100) * sN.t;
        sN.mDone = Math.min(TOTAL_MASS, Quseful / c.L);
      }
      const Qsupplied = c.power * sN.t;
      const Quseful = Qsupplied * (c.eff / 100);
      const done = sN.mDone >= TOTAL_MASS - 1e-9;

      if (now - lastR.current > 150) {
        lastR.current = now;
        setReadout((prev) =>
          Math.abs(prev.t - sN.t) < 0.01 && prev.mDone === sN.mDone
            ? prev
            : {
                t: sN.t,
                Q: Qsupplied,
                mDone: sN.mDone,
                Lmeas: sN.mDone > 0.001 ? Qsupplied / sN.mDone : 0,
              },
        );
      }

      ctx.clearRect(0, 0, w, h);
      const fracLeft = clamp(1 - sN.mDone / TOTAL_MASS, 0, 1);

      // wide: apparatus left, ledger right. narrow: ledger below the beaker.
      const stacked = w < 560;

      // ---------- apparatus ----------
      const bx = stacked ? 16 : w * 0.08,
        bw = stacked ? w - 32 : w * 0.5,
        by = stacked ? 44 : h * 0.18,
        bh = stacked ? 170 : h * 0.56;
      // beaker
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2.5;
      roundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (c.mode === "melt") {
        // ice block shrinking + surrounding water
        const waterH = bh * 0.55 * (1 - fracLeft * 0.55);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#38bdf8";
        roundRect(ctx, bx + 5, by + bh - waterH - 5, bw - 10, waterH, 6);
        ctx.fill();
        ctx.restore();
        if (fracLeft > 0.02) {
          const iceW = (bw - 60) * Math.sqrt(fracLeft);
          const iceH = bh * 0.42 * fracLeft;
          const ix = bx + (bw - iceW) / 2,
            iy = by + bh - waterH - iceH;
          ctx.save();
          ctx.fillStyle = "rgba(191,219,254,0.9)";
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          roundRect(ctx, ix, iy, iceW, iceH, 6);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          label(
            ctx,
            `Ice: ${fmt(sN.mDone >= TOTAL_MASS ? 0 : TOTAL_MASS - sN.mDone, 3)} kg left`,
            bx + bw / 2,
            iy + iceH / 2,
            { size: 11, color: "#1e3a8a", align: "center", weight: "800" },
          );
        } else {
          label(ctx, "All melted ✓", bx + bw / 2, by + bh * 0.45, {
            size: 13,
            color: "#34d399",
            align: "center",
            weight: "800",
          });
        }
        label(
          ctx,
          "Melting at 0 °C: T stays constant",
          bx + bw / 2,
          by - 14,
          { size: 11, color: "#93c5fd", align: "center", weight: "700" },
        );
      } else {
        // boiling water
        const waterTop = by + bh * 0.3;
        ctx.save();
        ctx.globalAlpha = 0.55;
        const wg = ctx.createLinearGradient(0, waterTop, 0, by + bh);
        wg.addColorStop(0, "#60a5fa");
        wg.addColorStop(1, "#1d4ed8");
        ctx.fillStyle = wg;
        roundRect(ctx, bx + 5, waterTop, bw - 10, by + bh - waterTop - 5, 6);
        ctx.fill();
        ctx.restore();
        // bubbles
        if (c.running && fracLeft > 0.02) {
          const t = now / 500;
          for (let i = 0; i < 10; i++) {
            const bxp = bx + (bw * ((i * 37) % 90)) / 100 + 10;
            const byp = by + bh - ((t * 80 + i * 41) % (bh * 0.6));
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(bxp, byp, 2.5 + (i % 3), 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        // steam
        ctx.save();
        ctx.strokeStyle = `rgba(226,232,240,${c.running ? 0.4 : 0.12})`;
        ctx.lineWidth = 2;
        const t2 = now / 800;
        for (let i = 0; i < 5; i++) {
          const sx = bx + bw * (0.2 + i * 0.15);
          ctx.beginPath();
          for (let yy = 0; yy <= 30; yy += 5) {
            const yTop = waterTop - 8 - yy - ((t2 * 26 + i * 11) % 16);
            const xx = sx + Math.sin((yy + t2 * 40 + i * 30) / 8) * 6;
            yy === 0 ? ctx.moveTo(xx, yTop) : ctx.lineTo(xx, yTop);
          }
          ctx.stroke();
        }
        ctx.restore();
        label(
          ctx,
          `Water left: ${fmt(TOTAL_MASS - sN.mDone, 3)} kg`,
          bx + bw / 2,
          waterTop + 22,
          { size: 11, color: "#dbeafe", align: "center", weight: "700" },
        );
        label(
          ctx,
          "Boiling at 100 °C: T stays constant",
          bx + bw / 2,
          by - 14,
          { size: 11, color: "#fca5a5", align: "center", weight: "700" },
        );
      }

      // heater coil inside beaker
      const coilY = by + bh - 16;
      ctx.save();
      ctx.strokeStyle = c.running ? "#fb7185" : "rgba(255,255,255,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const hx = bx + 24 + i * ((bw - 48) / 8);
        const hy = coilY + (i % 2 === 0 ? -6 : 6);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.stroke();
      ctx.restore();
      if (c.running) drawGlow(ctx, bx + bw / 2, coilY, 60, "#fb7185", 0.3);
      label(ctx, `Heater ${c.power} W`, bx + bw / 2, by + bh + 22, {
        size: 10.5,
        color: "#7c8ba1",
        align: "center",
      });

      // ---------- energy → mass ledger ----------
      const lx = stacked ? 16 : bx + bw + 44;
      const lw = w - lx - 16;
      const ly = stacked ? by + bh + 56 : by;
      label(ctx, "ENERGY LEDGER", lx, ly + 4, {
        size: 11,
        color: "#94a3b8",
        weight: "800",
      });
      const rows = [
        ["t (experiment time)", `${fmt(sN.t, 0)} s`],
        ["Q supplied = P × t", `${fmt(Qsupplied / 1000, 1)} kJ`],
        [`Q useful (${c.eff}%)`, `${fmt(Quseful / 1000, 1)} kJ`],
        [
          `m converted = Q_useful ÷ L`,
          `${fmt(sN.mDone * 1000, 0)} g / ${TOTAL_MASS * 1000} g`,
        ],
        [
          `true L (${c.mode === "melt" ? "fusion" : "vaporization"})`,
          fmtSci(c.L, 3) + " J/kg",
        ],
      ];
      rows.forEach((r, i) => {
        const y = ly + 34 + i * 34;
        // name and value share a line when they fit, else the value drops below
        const fits =
          textWidth(ctx, r[0], { size: 11 }) +
            textWidth(ctx, r[1], { size: 12.5, weight: "800" }) +
            12 <=
          lw;
        label(ctx, r[0], lx, fits ? y : y - 8, { size: 11, color: "#7c8ba1" });
        label(ctx, r[1], lx + lw, fits ? y : y + 8, {
          size: 12.5,
          color: i === 3 ? "#34d399" : "#e2e8f0",
          align: "right",
          weight: "800",
        });
      });

      // progress bar for mass converted
      const pbY = ly + 34 + rows.length * 34 + 14;
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, lx, pbY, lw, 14, 7);
      ctx.fill();
      const grad = ctx.createLinearGradient(lx, 0, lx + lw, 0);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(1, "#34d399");
      ctx.fillStyle = grad;
      roundRect(ctx, lx, pbY, Math.max(8, lw * (sN.mDone / TOTAL_MASS)), 14, 7);
      ctx.fill();
      ctx.restore();
      label(
        ctx,
        `${fmt((sN.mDone / TOTAL_MASS) * 100, 0)}% of the mass changed state`,
        lx + lw / 2,
        pbY + 30,
        { size: 10.5, color: "#7c8ba1", align: "center" },
      );

      if (done) {
        labelWrap(
          ctx,
          "✓ Complete: stop the heater and weigh what's left!",
          lx + lw / 2,
          pbY + 56,
          lw,
          { size: 12, color: "#34d399", align: "center", weight: "800" },
        );
      }
      // prediction
      const tPredict = (TOTAL_MASS * c.L) / (c.power * (c.eff / 100));
      const predLines = wrapLines(
        ctx,
        `Predicted full-conversion time: t = mL ÷ P_eff = ${fmt(tPredict, 0)} s (${fmt(tPredict / 60, 1)} min)`,
        lw,
        { size: 10.5 },
      );
      predLines.forEach((ln, i) =>
        label(ctx, ln, lx + lw / 2, h - 16 - (predLines.length - 1 - i) * 14, {
          size: 10.5,
          color: "#7c8ba1",
          align: "center",
        }),
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const controls = (
    <>
      <div className="btn-group btn-group-sm" role="group">
        <button
          className={`btn ${mode === "melt" ? "btn-cool" : "btn-outline-ink"}`}
          onClick={() => {
            setMode("melt");
            reset();
          }}
        >
          <i className="bi bi-snow2 me-1" /> Melt ice (L_f)
        </button>
        <button
          className={`btn ${mode === "boil" ? "btn-flame" : "btn-outline-ink"}`}
          onClick={() => {
            setMode("boil");
            reset();
          }}
        >
          <i className="bi bi-fire me-1" /> Boil water (L_v)
        </button>
      </div>
      <div style={{ minWidth: 140, flex: 1 }}>
        <label className="form-label" htmlFor="lh-p">
          Heater power · <b style={{ color: "#c2410c" }}>{power} W</b>
        </label>
        <input
          id="lh-p"
          type="range"
          className="form-range"
          min="100"
          max="1000"
          step="25"
          value={power}
          onChange={(e) => setPower(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 140, flex: 1 }}>
        <label className="form-label" htmlFor="lh-e">
          Efficiency · <b>{eff}%</b>
        </label>
        <input
          id="lh-e"
          type="range"
          className="form-range"
          min="50"
          max="100"
          value={eff}
          onChange={(e) => setEff(Number(e.target.value))}
        />
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-flame"
          onClick={() => setRunning((r) => !r)}
          disabled={readout.mDone >= TOTAL_MASS - 1e-9}
        >
          <i
            className={`bi ${running ? "bi-pause-fill" : "bi-play-fill"} me-1`}
          />
          {running ? "Stop heater" : "Start heater"}
        </button>
        <button className="btn btn-sm btn-outline-ink" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reset
        </button>
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          Q = P·t <b>{fmt(readout.Q / 1000, 1)} kJ</b>
        </span>
        <span className="readout-pill cool">
          m = Q_useful/L <b>{fmt(readout.mDone * 1000, 0)} g</b>
        </span>
        <span className="readout-pill">
          Naive L = Q_supplied/m{" "}
          <b>{readout.Lmeas ? `${fmtSci(readout.Lmeas, 3)} J/kg` : "not measured yet"}</b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Measuring L, the electrical method"
      badge={
        <span className="chip flame">
          <i className="bi bi-journal-bookmark" /> Lesson 8
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(400px, 48vw, 460px)", "--sim-h-sm": "600px" }}
          aria-label="Latent heat experiment simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          Drop the efficiency below 100% and watch the <b>
            naive measured L
          </b>{" "}
          drift above the true value, exactly why real experiments “lose heat
          to the room” and must be corrected (run it again with the heater off
          to measure the drift). Also notice: boiling the same mass takes ~7×
          the energy of melting it. <b>L_v ≫ L_f</b>.
        </>
      }
    />
  );
}
