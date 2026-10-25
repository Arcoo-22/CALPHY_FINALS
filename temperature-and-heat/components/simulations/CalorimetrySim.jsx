"use client";

// ============================================================
// Calorimetry (Lesson 6)
// • Drop a hot object into water in an insulated calorimeter
// • Optional ICE mode, resolves all three cases from the lesson:
//     1) not enough energy to reach 0 °C  2) mixture at 0 °C
//     3) all ice melts, T_f > 0
// • Rigorous energy balance referenced to liquid water at 0 °C
// • Animated convergence + live heat-balance equations
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
  labelFit,
} from "@/lib/canvas";
import { UNIVERSAL, fmt } from "@/lib/constants";

const MATS = [
  { name: "Copper", c: 385, color: "#f97316" },
  { name: "Iron", c: 450, color: "#78716c" },
  { name: "Aluminum", c: 900, color: "#94a3b8" },
  { name: "Lead", c: 128, color: "#64748b" },
  { name: "Glass", c: 840, color: "#a5f3fc" },
];
const { cWater, cIce, Lf } = UNIVERSAL;

// Solve final state. Reference: liquid water at 0 °C has E = 0.
function solve({ useIce, mObj, cObj, TObj, mW, TW, mIce, TIce }) {
  // energy of each part relative to liquid water at 0 °C
  let E = 0;
  E += mObj * cObj * (TObj - 0); // hot object (never changes phase here)
  E += mW * cWater * (TW - 0); // water
  if (useIce) E += mIce * (cIce * (TIce - 0) - Lf); // ice below/at 0
  const M = mW + (useIce ? mIce : 0); // water-side mass
  const Cobj = mObj * cObj; // the object ends at T_f too, so it keeps some heat

  if (E > 0) {
    return {
      Tf: E / (M * cWater + Cobj),
      iceLeft: 0,
      caseNo: useIce ? 3 : 0,
      note: useIce
        ? "All the ice melted, mixture settles above 0 °C."
        : "Heat lost = heat gained.",
    };
  }
  if (E > -M * Lf) {
    const iceRemaining = -E / Lf;
    return {
      Tf: 0,
      iceLeft: iceRemaining,
      caseNo: useIce ? 2 : 0,
      note: "Equilibrium at exactly 0 °C, ice and water coexist.",
    };
  }
  return {
    Tf: (E + M * Lf) / (M * cIce + Cobj),
    iceLeft: M,
    caseNo: useIce ? 1 : 0,
    note: "Everything froze, final state below 0 °C.",
  };
}

export default function CalorimetrySim() {
  const canvasRef = useRef(null);
  const [matIdx, setMatIdx] = useState(0);
  const [mObj, setMObj] = useState(0.1);
  const [TObj, setTObj] = useState(100);
  const [mW, setMW] = useState(0.2);
  const [TW, setTW] = useState(20);
  const [useIce, setUseIce] = useState(false);
  const [mIce, setMIce] = useState(0.05);
  const [TIce, setTIce] = useState(-10);
  const [phase, setPhase] = useState("idle"); // idle | dropping | mixing | done

  const sol = solve({
    useIce,
    mObj,
    cObj: MATS[matIdx].c,
    TObj,
    mW,
    TW,
    mIce,
    TIce,
  });

  const anim = useRef({
    phase: "idle",
    objY: 0,
    TobjNow: 100,
    TwNow: 20,
    Tf: 25,
    iceLeft: 0,
    splash: [],
    parts: null,
    mixT: 0,
  });

  useEffect(() => {
    const rnd = seeded(9);
    anim.current.parts = Array.from({ length: 60 }, () => ({
      x: rnd(),
      y: rnd(),
      vx: rnd() - 0.5,
      vy: rnd() - 0.5,
    }));
  }, []);

  const drop = () => {
    const a = anim.current;
    a.phase = "dropping";
    a.objY = 0;
    a.TobjNow = TObj;
    a.TwNow = useIce ? Math.max(TW, 0) : TW;
    a.Tf = sol.Tf;
    a.iceLeft = sol.iceLeft;
    a.splash = [];
    a.mixT = 0;
    setPhase("dropping");
  };
  const reset = () => {
    anim.current.phase = "idle";
    setPhase("idle");
  };

  const ctrl = useRef({ matIdx, useIce, phase });
  useLayoutEffect(() => {
    ctrl.current = { matIdx, useIce, phase };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    let last = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const a = anim.current;
      const c = ctrl.current;
      const mat = MATS[c.matIdx];
      ctx.clearRect(0, 0, w, h);

      // narrow canvases shift the cup right so the LIVE column keeps its own
      // space, and leave room on the right for the Q bar
      const narrow = w < 460;
      const cupX = narrow ? w * 0.45 : w * 0.28,
        cupW = narrow ? w * 0.55 - 50 : w * 0.44,
        cupY = h * 0.26,
        cupH = h * 0.62;
      const waterTop = cupY + cupH * 0.28;
      const waterH = cupH * 0.68;

      // ---- calorimeter cup (insulated) ----
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;
      roundRect(ctx, cupX, cupY, cupW, cupH, 10);
      ctx.fill();
      ctx.stroke();
      // insulation hatch
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(cupX - 10, cupY + 14 + i * (cupH / 10));
        ctx.lineTo(cupX - 2, cupY + 6 + i * (cupH / 10));
        ctx.moveTo(cupX + cupW + 2, cupY + 14 + i * (cupH / 10));
        ctx.lineTo(cupX + cupW + 10, cupY + 6 + i * (cupH / 10));
        ctx.stroke();
      }
      ctx.restore();
      labelFit(
        ctx,
        "INSULATED CALORIMETER, no heat escapes",
        narrow ? w / 2 : cupX + cupW / 2,
        cupY - 14,
        w - 24,
        { size: 10.5, color: "#94a3b8", align: "center", weight: "700" },
      );

      // ---- water ----
      const wT =
        a.phase === "idle" ? (c.useIce ? Math.max(TW, 0) : TW) : a.TwNow;
      const wCol = heatColor(clamp(norm(wT, -20, 100), 0, 1));
      ctx.save();
      ctx.globalAlpha = 0.5;
      const wg = ctx.createLinearGradient(0, waterTop, 0, waterTop + waterH);
      wg.addColorStop(0, wCol);
      wg.addColorStop(1, "rgba(30,64,175,0.55)");
      ctx.fillStyle = wg;
      roundRect(ctx, cupX + 4, waterTop, cupW - 8, waterH - 4, 6);
      ctx.fill();
      ctx.restore();

      // water particles
      const speed =
        clamp(Math.sqrt((Math.max(wT, 0) + 273) / 293), 0.2, 2) *
        (a.phase === "mixing" ? 90 : 45);
      (a.parts || []).forEach((p) => {
        p.x += (p.vx * speed) / cupW / 45;
        p.y += (p.vy * speed) / waterH / 45;
        if (p.x < 0 || p.x > 1) {
          p.vx *= -1;
          p.x = clamp(p.x, 0, 1);
        }
        if (p.y < 0 || p.y > 1) {
          p.vy *= -1;
          p.y = clamp(p.y, 0, 1);
        }
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.beginPath();
        ctx.arc(
          cupX + 10 + p.x * (cupW - 20),
          waterTop + 8 + p.y * (waterH - 18),
          2.2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      // ---- ice cubes (before/while present) ----
      const showIce =
        c.useIce &&
        (a.phase === "idle" || (a.phase !== "idle" && a.iceLeft > 0.001));
      if (showIce) {
        const iceScale =
          a.phase === "idle"
            ? 1
            : clamp(a.iceLeft / Math.max(mIce, 1e-9), 0, 1);
        const nCubes = Math.max(1, Math.round(3 * iceScale));
        for (let i = 0; i < nCubes; i++) {
          const bx = cupX + cupW * (0.24 + i * 0.24);
          const by = waterTop + waterH * 0.3 + Math.sin(now / 700 + i) * 4;
          const bs = 16 * (0.5 + iceScale * 0.5);
          ctx.save();
          ctx.fillStyle = "rgba(191,219,254,0.85)";
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 1.4;
          roundRect(ctx, bx - bs / 2, by - bs / 2, bs, bs, 4);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.beginPath();
          ctx.moveTo(bx - bs / 4, by - bs / 4);
          ctx.lineTo(bx + bs / 6, by + bs / 6);
          ctx.stroke();
          ctx.restore();
        }
        if (a.phase === "mixing" || a.phase === "done") {
          label(
            ctx,
            `Ice left: ${fmt(a.iceLeft * 1000, 0)} g`,
            cupX + cupW / 2,
            waterTop + waterH + 18,
            { size: 10.5, color: "#bfdbfe", align: "center" },
          );
        }
      }

      // ---- hot object ----
      const objSize = 14 + mObj * 26;
      let objX = cupX + cupW * 0.72;
      let objY;
      const restY = waterTop + waterH * 0.62;
      const hoverY = cupY - objSize / 2 - 26; // clears the calorimeter caption
      if (a.phase === "idle") {
        objY = hoverY;
      } else if (a.phase === "dropping") {
        a.objY += dt * 420;
        objY = Math.min(hoverY + a.objY, restY);
        if (objY >= restY) {
          a.phase = "mixing";
          setPhase("mixing");
          // splash
          for (let i = 0; i < 14; i++) {
            a.splash.push({
              x: objX,
              y: waterTop,
              vx: (Math.random() - 0.5) * 160,
              vy: -Math.random() * 160,
              life: 1,
            });
          }
        }
      } else {
        objY = restY + Math.sin(now / 400) * 2;
      }
      const objCol = heatColor(clamp(norm(a.TobjNow, 0, 200), 0, 1));
      drawGlow(ctx, objX, objY, objSize * 1.7, objCol, 0.4);
      ctx.fillStyle = mat.color;
      ctx.strokeStyle = objCol;
      ctx.lineWidth = 2.5;
      roundRect(
        ctx,
        objX - objSize / 2,
        objY - objSize / 2,
        objSize,
        objSize,
        5,
      );
      ctx.fill();
      ctx.stroke();
      // one line above the object: "Copper · 0.1 kg  100 °C", name then temp
      const nameText = `${mat.name} · ${fmt(mObj, 2)} kg`;
      const tempText =
        a.phase === "idle" ? `${fmt(TObj, 0)} °C` : `${fmt(a.TobjNow, 1)} °C`;
      const nameStyle = { size: 11, color: "#e2e8f0", weight: "600" };
      const tempStyle = { size: 11.5, color: objCol, weight: "800" };
      const nameW = textWidth(ctx, nameText, nameStyle);
      const tempW = textWidth(ctx, tempText, tempStyle);
      const lineX = objX - (nameW + 8 + tempW) / 2;
      const lineY = objY - objSize / 2 - 14;
      label(ctx, nameText, lineX, lineY, nameStyle);
      label(ctx, tempText, lineX + nameW + 8, lineY, tempStyle);

      // splash particles
      a.splash = a.splash.filter((sp) => {
        sp.life -= dt * 1.6;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 480 * dt;
        if (sp.life <= 0) return false;
        ctx.fillStyle = `rgba(147,197,253,${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // ---- mixing: exponential approach to T_f ----
      if (a.phase === "mixing") {
        a.mixT += dt;
        const k = 1 - Math.exp(-a.mixT * 0.8);
        a.TobjNow = TObj + (a.Tf - TObj) * k;
        a.TwNow =
          (c.useIce ? Math.max(TW, 0) : TW) +
          (a.Tf - (c.useIce ? Math.max(TW, 0) : TW)) * k;
        if (c.useIce && sol.iceLeft > 0)
          a.iceLeft = mIce * (1 - k) + sol.iceLeft * k;
        if (a.mixT > 5.5) {
          a.TobjNow = a.Tf;
          a.TwNow = a.Tf;
          if (c.useIce) a.iceLeft = sol.iceLeft;
          a.phase = "done";
          setPhase("done");
        }
        // heat flow arrows object → water
        const dirCol = a.TobjNow > a.TwNow ? "#fb923c" : "#38bdf8";
        ctx.save();
        ctx.strokeStyle = dirCol;
        ctx.globalAlpha = 0.7;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -(now / 45) % 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX - objSize, objY);
        ctx.lineTo(cupX + cupW * 0.35, objY);
        ctx.stroke();
        ctx.restore();
        label(ctx, "Q flows hot → cold", cupX + cupW * 0.3, objY + 14, {
          size: 10.5,
          color: dirCol,
          align: "center",
        });
      }
      if (a.phase === "done") {
        label(ctx, "✓ EQUILIBRIUM", cupX + cupW / 2, cupY + 22, {
          size: 13,
          color: "#34d399",
          align: "center",
          weight: "800",
        });
      }

      // ---- live temps panel ----
      const showTobj = a.phase === "idle" ? TObj : a.TobjNow;
      const showTw =
        a.phase === "idle" ? (c.useIce ? Math.max(TW, 0) : TW) : a.TwNow;
      const px = 14;
      label(ctx, "LIVE", px, cupY + 8, {
        size: 10.5,
        color: "#94a3b8",
        weight: "800",
      });
      label(ctx, `Object: ${fmt(showTobj, 1)} °C`, px, cupY + 28, {
        size: 11.5,
        color: "#fdba74",
      });
      label(ctx, `Water: ${fmt(showTw, 1)} °C`, px, cupY + 46, {
        size: 11.5,
        color: "#7dd3fc",
      });
      if (a.phase === "done" || a.phase === "mixing") {
        label(ctx, `Target T_f: ${fmt(a.Tf, 1)} °C`, px, cupY + 64, {
          size: 11.5,
          color: "#34d399",
        });
      }

      // right side: energy bars (lost vs gained)
      if (a.phase !== "idle") {
        const k = a.phase === "mixing" ? clamp(a.mixT / 5.5, 0, 1) : 1;
        const Qobj = mObj * mat.c * Math.abs(TObj - (TObj + (a.Tf - TObj) * k));
        const barX = w - 30,
          barH = cupH * 0.8,
          barY = cupY + 10;
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        roundRect(ctx, barX - 8, barY, 16, barH, 8);
        ctx.fill();
        ctx.fillStyle = "#fb923c";
        const qMax = Math.max(mObj * mat.c * Math.abs(TObj - a.Tf), 1);
        roundRect(ctx, barX - 8, barY, 16, barH * clamp(Qobj / qMax, 0, 1), 8);
        ctx.fill();
        ctx.restore();
        // full caption only where it clears the cup's insulation hatch
        const qRoom = w - 14 - (cupX + cupW + 14);
        const qText =
          textWidth(ctx, "Q exchanged", { size: 10.5 }) <= qRoom ? "Q exchanged" : "Q";
        label(ctx, qText, w - 14, barY - 14, {
          size: 10.5,
          color: "#94a3b8",
          align: "right",
        });
        label(
          ctx,
          `${fmt(Qobj >= 1000 ? Qobj / 1000 : Qobj, 1)} ${Qobj >= 1000 ? "kJ" : "J"}`,
          w - 14,
          barY + barH + 16,
          { size: 10.5, color: "#fdba74", align: "right", weight: "700" },
        );
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [mObj, TW, TObj, useIce, mIce, sol.Tf, sol.iceLeft]);

  const mat = MATS[matIdx];
  const mcObj = mObj * mat.c;
  const mcW = mW * cWater;
  const TfNoIce =
    ((mcObj * TObj) / 1000 + (mcW * TW) / 1000) / ((mcObj + mcW) / 1000);

  const controls = (
    <>
      <div style={{ minWidth: 140 }}>
        <label className="form-label" htmlFor="cal-mat">
          Hot object
        </label>
        <select
          id="cal-mat"
          className="form-select form-select-sm"
          value={matIdx}
          onChange={(e) => {
            setMatIdx(Number(e.target.value));
            reset();
          }}
        >
          {MATS.map((m, i) => (
            <option key={m.name} value={i}>
              {m.name} (c={m.c})
            </option>
          ))}
        </select>
      </div>
      <div style={{ minWidth: 120, flex: 1 }}>
        <label className="form-label" htmlFor="cal-mo">
          m object · <b>{fmt(mObj, 2)} kg</b>
        </label>
        <input
          id="cal-mo"
          type="range"
          className="form-range"
          min="0.05"
          max="1"
          step="0.05"
          value={mObj}
          onChange={(e) => {
            setMObj(Number(e.target.value));
            reset();
          }}
        />
      </div>
      <div style={{ minWidth: 120, flex: 1 }}>
        <label className="form-label" htmlFor="cal-to">
          T object · <b style={{ color: "#c2410c" }}>{fmt(TObj, 0)} °C</b>
        </label>
        <input
          id="cal-to"
          type="range"
          className="form-range"
          min="40"
          max="250"
          value={TObj}
          onChange={(e) => {
            setTObj(Number(e.target.value));
            reset();
          }}
        />
      </div>
      <div style={{ minWidth: 120, flex: 1 }}>
        <label className="form-label" htmlFor="cal-mw">
          m water · <b>{fmt(mW, 2)} kg</b>
        </label>
        <input
          id="cal-mw"
          type="range"
          className="form-range"
          min="0.05"
          max="1"
          step="0.05"
          value={mW}
          onChange={(e) => {
            setMW(Number(e.target.value));
            reset();
          }}
        />
      </div>
      <div style={{ minWidth: 120, flex: 1 }}>
        <label className="form-label" htmlFor="cal-tw">
          T water · <b style={{ color: "#0369a1" }}>{fmt(TW, 0)} °C</b>
        </label>
        <input
          id="cal-tw"
          type="range"
          className="form-range"
          min="0"
          max="60"
          value={TW}
          onChange={(e) => {
            setTW(Number(e.target.value));
            reset();
          }}
        />
      </div>
      <div className="form-check form-switch mb-1">
        <input
          className="form-check-input"
          type="checkbox"
          id="cal-ice"
          checked={useIce}
          onChange={(e) => {
            setUseIce(e.target.checked);
            reset();
          }}
        />
        <label className="form-check-label small fw-semibold" htmlFor="cal-ice">
          Add ice
        </label>
      </div>
      {useIce && (
        <>
          <div style={{ minWidth: 110, flex: 1 }}>
            <label className="form-label" htmlFor="cal-mi">
              m ice · <b>{fmt(mIce, 2)} kg</b>
            </label>
            <input
              id="cal-mi"
              type="range"
              className="form-range"
              min="0.02"
              max="0.5"
              step="0.01"
              value={mIce}
              onChange={(e) => {
                setMIce(Number(e.target.value));
                reset();
              }}
            />
          </div>
          <div style={{ minWidth: 110, flex: 1 }}>
            <label className="form-label" htmlFor="cal-ti">
              T ice · <b>{fmt(TIce, 0)} °C</b>
            </label>
            <input
              id="cal-ti"
              type="range"
              className="form-range"
              min="-40"
              max="0"
              value={TIce}
              onChange={(e) => {
                setTIce(Number(e.target.value));
                reset();
              }}
            />
          </div>
        </>
      )}
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-flame"
          onClick={drop}
          disabled={phase === "dropping" || phase === "mixing"}
        >
          <i className="bi bi-box-arrow-in-down me-1" /> Drop it in!
        </button>
        <button className="btn btn-sm btn-outline-ink" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reset
        </button>
      </div>
      <div className="sim-readout w-100">
        <span className="readout-pill">
          Predicted T_f <b>{fmt(sol.Tf, 1)} °C</b>
        </span>
        {useIce && (
          <span className="readout-pill cool">
            Ice left <b>{fmt(sol.iceLeft * 1000, 0)} g</b>
          </span>
        )}
        {useIce && (
          <span className="readout-pill">
            Case <b>{sol.caseNo} of 3</b>
          </span>
        )}
      </div>
    </>
  );

  return (
    <SimFrame
      getState={() => ({
        phase: anim.current.phase,
        objY: anim.current.objY,
        TobjNow: anim.current.TobjNow,
        TwNow: anim.current.TwNow,
        iceLeft: anim.current.iceLeft,
        Tf: anim.current.Tf,
        parts: anim.current.parts,
        mat: MATS[matIdx],
        mObj,
        TObj,
        TW,
        useIce,
        mIce,
      })}
      title="Calorimetry, heat lost = heat gained"
      badge={
        <span className="chip violet">
          <i className="bi bi-beaker" /> Lesson 6
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(360px, 52vw, 470px)" }}
          aria-label="Calorimetry simulation"
        />
      }
      controls={controls}
      note={
        <div>
          <div className="mb-1">
            <b>The math behind the prediction:</b>{" "}
            {useIce ? (
              <>
                Q_available = m·c·(T−0) of the water; Q_needed =
                m_ice·c_ice·(0−T_ice) + m_ice·L_f. {sol.note}
              </>
            ) : (
              <>
                T_f = (m₁c₁T₁ + m₂c₂T₂) ÷ (m₁c₁ + m₂c₂) = ({fmt(mcObj, 1)}×
                {fmt(TObj, 0)} + {fmt(mcW, 1)}×{fmt(TW, 0)}) ÷{" "}
                {fmt(mcObj + mcW, 1)} = <b>{fmt(TfNoIce, 1)} °C</b>, always
                between the two starting temperatures.
              </>
            )}
          </div>
          <i className="bi bi-lightbulb me-1" />
          Switch on <b>“Add ice”</b> to see why the three-case test matters:
          melting swallows 334,000 J per kg, so the answer can get pinned at
          exactly 0 °C with ice left over!
        </div>
      }
    />
  );
}
