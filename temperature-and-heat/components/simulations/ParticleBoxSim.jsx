"use client";

// ============================================================
// Heat vs Temperature (Lesson 2)
// • Cup (0.2 kg) vs Pool (50 kg) of water
// • Particle COUNT ∝ mass, particle SPEED ∝ √T (kelvin)
// • Bars compare temperature (average KE) vs thermal energy (total)
// • "Put in thermal contact" animates heat flow until equilibrium
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SimFrame from "@/components/SimFrame";
import {
  fitCanvas,
  heatColor,
  norm,
  clamp,
  seeded,
  drawGlow,
  roundRect,
  label,
  labelFit,
  textWidth,
} from "@/lib/canvas";
import { UNIVERSAL, fmt } from "@/lib/constants";

const CUP_MASS = 0.2;
const POOL_MASS = 50;

export default function ParticleBoxSim() {
  const canvasRef = useRef(null);
  const [cupT, setCupT] = useState(90);
  const [poolT, setPoolT] = useState(30);
  const [contact, setContact] = useState(false);
  const s = useRef({
    cupT: 90,
    poolT: 30,
    contact: false,
    equilibrium: false,
    parts: null,
  });
  // mirror state into the ref the animation loop reads
  useLayoutEffect(() => {
    s.current.cupT = cupT;
    s.current.poolT = poolT;
    s.current.contact = contact;
  });

  useEffect(() => {
    const rnd = seeded(42);
    const mk = (n) =>
      Array.from({ length: n }, () => ({
        x: rnd(),
        y: rnd(),
        vx: rnd() - 0.5,
        vy: rnd() - 0.5,
        r: 2.6 + rnd() * 1.8,
      }));
    s.current.parts = { cup: mk(18), pool: mk(110) };
  }, []);

  useEffect(() => {
    if (!contact) {
      s.current.equilibrium = false;
      return;
    }
    // equilibrium temperature: weighted by mass (same substance)
    const tf =
      (CUP_MASS * s.current.cupT + POOL_MASS * s.current.poolT) /
      (CUP_MASS + POOL_MASS);
    let raf;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = s.current;
      const k = 1 - Math.exp(-dt * 0.55); // approach speed (pool dominates)
      const newCup = st.cupT + (tf - st.cupT) * k;
      const newPool =
        st.poolT + (tf - st.poolT) * k * 0.004 + (tf - st.poolT) * k * 0.02;
      setCupT(Math.abs(newCup - tf) < 0.05 ? tf : newCup);
      setPoolT(Math.abs(newPool - tf) < 0.05 ? tf : newPool);
      if (Math.abs(st.cupT - tf) < 0.05 && Math.abs(st.poolT - tf) < 0.05) {
        s.current.equilibrium = true;
        return; // stop the loop
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [contact]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let raf;
    const drawBox = (ctx, x, y, w, h, parts, T, title, subtitle) => {
      const t01 = clamp(norm(T, 0, 100), 0, 1);
      const col = heatColor(t01);
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1.4;
      roundRect(ctx, x, y, w, h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // two stacked lines so the narrow cup box never collides
      label(ctx, title, x + 12, y + 19, {
        size: 13,
        color: "#e2e8f0",
        weight: "800",
      });
      label(ctx, subtitle, x + 12, y + 37, {
        size: 12,
        color: "#94a3b8",
      });

      const speed = clamp(Math.sqrt((T + 273.15) / 300), 0.1, 2.2) * 60;
      parts.forEach((p) => {
        p.x += (p.vx * speed) / w / 60;
        p.y += (p.vy * speed) / h / 60;
        if (p.x < 0 || p.x > 1) {
          p.vx *= -1;
          p.x = clamp(p.x, 0, 1);
        }
        if (p.y < 0 || p.y > 1) {
          p.vy *= -1;
          p.y = clamp(p.y, 0, 1);
        }
        // particles stay between the header and the temperature strip
        const px = x + 10 + p.x * (w - 20);
        const py = y + 56 + p.y * (h - 96);
        drawGlow(ctx, px, py, p.r * 2.4, col, 0.22);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      label(ctx, `${fmt(T, 1)} °C`, x + w / 2, y + h - 18, {
        size: 16,
        color: col,
        align: "center",
        weight: "800",
      });
    };

    // name on the left, value on the right, bar underneath
    const drawBar = (ctx, x, y, w, value01, col, name, value) => {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, x, y, w, 10, 5);
      ctx.fill();
      ctx.fillStyle = col;
      roundRect(ctx, x, y, Math.max(6, w * clamp(value01, 0, 1)), 10, 5);
      ctx.fill();
      ctx.restore();
      label(ctx, name, x, y - 12, { size: 12, color: "#cbd5e1" });
      label(ctx, value, x + w, y - 12, {
        size: 12.5,
        color: col,
        align: "right",
        weight: "800",
      });
    };

    // bold title followed by a muted explanation on the same line; the
    // explanation shrinks to fit whatever width the title leaves
    const drawHeading = (ctx, x, y, maxW, title, detail) => {
      const titleStyle = { size: 12, color: "#f1f5f9", weight: "800" };
      label(ctx, title, x, y, titleStyle);
      const used = textWidth(ctx, title, titleStyle) + 8;
      labelFit(ctx, detail, x + used, y, maxW - used, {
        size: 12,
        minSize: 9,
        color: "#94a3b8",
      });
    };

    const draw = () => {
      const { ctx, w, h } = fitCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const st = s.current;
      const parts = st.parts;
      if (!parts) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const cupW = Math.min(150, w * 0.28);
      const poolX = cupW + 46;
      const poolW = w - poolX - 14;
      const boxY = 30;
      const panelH = 146; // bar panel below the boxes
      const boxH = h - boxY - panelH;

      drawBox(
        ctx,
        14,
        boxY,
        cupW,
        boxH,
        parts.cup,
        st.cupT,
        `CUP · ${CUP_MASS} kg`,
        "few particles",
      );
      drawBox(
        ctx,
        poolX,
        boxY,
        poolW,
        boxH,
        parts.pool,
        st.poolT,
        `POOL · ${POOL_MASS} kg`,
        "many particles",
      );

      // heat-flow arrow when in contact
      if (st.contact && !st.equilibrium) {
        const ay = boxY + boxH / 2;
        const dir = st.cupT > st.poolT ? 1 : -1; // from hot to cold
        const x1 = dir > 0 ? 14 + cupW + 6 : poolX - 6;
        const x2 = dir > 0 ? poolX - 6 : 14 + cupW + 6;
        ctx.save();
        ctx.strokeStyle = "#fbbf24";
        ctx.fillStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 6]);
        ctx.lineDashOffset = -(performance.now() / 40) % 13;
        ctx.beginPath();
        ctx.moveTo(x1, ay);
        ctx.lineTo(x2, ay);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x2, ay);
        ctx.lineTo(x2 - dir * 10, ay - 6);
        ctx.lineTo(x2 - dir * 10, ay + 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        label(ctx, "Q →", (x1 + x2) / 2, ay - 16, {
          size: 13,
          color: "#fbbf24",
          align: "center",
          weight: "800",
        });
      }
      if (st.equilibrium) {
        label(ctx, "✓ THERMAL EQUILIBRIUM", w / 2, boxY / 2, {
          size: 13,
          color: "#34d399",
          align: "center",
          weight: "800",
        });
      }

      // comparison bars: heading row, then name/value + bar per side
      const panelY = boxY + boxH;
      // rough thermal energy measured from 0 K: m · c · T(K)
      const eCup = CUP_MASS * UNIVERSAL.cWater * (st.cupT + 273.15);
      const ePool = POOL_MASS * UNIVERSAL.cWater * (st.poolT + 273.15);
      const eMax = POOL_MASS * UNIVERSAL.cWater * 373.15; // reference max
      const gap = 28;
      const barW = (w - 28 - gap) / 2;
      const bar2X = 14 + barW + gap;

      drawHeading(
        ctx,
        14,
        panelY + 22,
        w - 28,
        "TEMPERATURE",
        "average kinetic energy per particle",
      );
      drawBar(
        ctx,
        14,
        panelY + 52,
        barW,
        st.cupT / 100,
        heatColor(clamp(st.cupT / 100, 0, 1)),
        "Cup",
        `${fmt(st.cupT, 1)} °C`,
      );
      drawBar(
        ctx,
        bar2X,
        panelY + 52,
        barW,
        st.poolT / 100,
        heatColor(clamp(st.poolT / 100, 0, 1)),
        "Pool",
        `${fmt(st.poolT, 1)} °C`,
      );

      drawHeading(
        ctx,
        14,
        panelY + 92,
        w - 28,
        "THERMAL ENERGY",
        "total, grows with mass × temperature",
      );
      drawBar(
        ctx,
        14,
        panelY + 122,
        barW,
        eCup / eMax,
        "#38bdf8",
        "Cup",
        `≈ ${fmt(eCup / 1000, 0)} kJ`,
      );
      drawBar(
        ctx,
        bar2X,
        panelY + 122,
        barW,
        ePool / eMax,
        "#818cf8",
        "Pool",
        `≈ ${fmt(ePool / 1000, 0)} kJ`,
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const disabled = contact;
  const controls = (
    <>
      <div style={{ minWidth: 190, flex: 1 }}>
        <label className="form-label" htmlFor="cup-t">
          Cup temperature ·{" "}
          <b style={{ color: "#c2410c" }}>{fmt(cupT, 1)} °C</b>
        </label>
        <input
          id="cup-t"
          type="range"
          className="form-range"
          min="0"
          max="100"
          step="0.5"
          value={cupT}
          disabled={disabled}
          onChange={(e) => setCupT(Number(e.target.value))}
        />
      </div>
      <div style={{ minWidth: 190, flex: 1 }}>
        <label className="form-label" htmlFor="pool-t">
          Pool temperature ·{" "}
          <b style={{ color: "#0369a1" }}>{fmt(poolT, 1)} °C</b>
        </label>
        <input
          id="pool-t"
          type="range"
          className="form-range"
          min="0"
          max="100"
          step="0.5"
          value={poolT}
          disabled={disabled}
          onChange={(e) => setPoolT(Number(e.target.value))}
        />
      </div>
      <div className="d-flex gap-2">
        {!contact ? (
          <button
            className="btn btn-flame btn-sm"
            onClick={() => setContact(true)}
          >
            <i className="bi bi-link-45deg me-1" /> Put in thermal contact
          </button>
        ) : (
          <button
            className="btn btn-outline-ink btn-sm"
            onClick={() => {
              setContact(false);
              setCupT(90);
              setPoolT(30);
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-1" /> Reset
          </button>
        )}
      </div>
      <div className="sim-readout">
        <span className="readout-pill">
          Equilibrium T_f{" "}
          <b>
            {fmt(
              (CUP_MASS * cupT + POOL_MASS * poolT) / (CUP_MASS + POOL_MASS),
              2,
            )}{" "}
            °C
          </b>
        </span>
      </div>
    </>
  );

  return (
    <SimFrame
      title="Cup vs Pool, Temperature ≠ Thermal Energy"
      badge={
        <span className="chip cool">
          <i className="bi bi-droplet-half" /> Lesson 2
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(340px, 50vw, 460px)" }}
          aria-label="Cup vs pool heat simulation"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          The cup is <b>hotter</b> (higher temperature = faster average
          particles), but the pool holds <b>far more thermal energy</b>, it has
          250× more matter. Put them in contact and watch heat flow{" "}
          <b>hot → cold</b> until both settle near the pool&apos;s temperature
          (equilibrium is dominated by the bigger mass!).
        </>
      }
    />
  );
}
