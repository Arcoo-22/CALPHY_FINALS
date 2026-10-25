"use client";

// ============================================================
// Convection & Radiation (Lesson 4), tabbed simulation
// TAB 1 Convection: pot on a burner, particles ride a circulation
//   loop (hot rises / cool sinks), power slider, bubbles & steam.
// TAB 2 Radiation: glowing emitter sends photons (colour from
//   Wien's law) to a cooler absorber; P = eσAT⁴, P_net, λ_max.
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
  textWidth,
} from "@/lib/canvas";
import { UNIVERSAL, fmt, fmtSci } from "@/lib/constants";

const { sigma, wienB } = UNIVERSAL;

// ---------- visible spectrum colour from wavelength (nm) ----------
function wavelengthColor(nm) {
  if (nm < 380) return "rgba(190,160,255,0.9)"; // UV → pale violet
  if (nm > 750) return "rgba(255,80,60,0.55)"; // IR → dim red
  let r = 0,
    g = 0,
    b = 0;
  if (nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else {
    r = 1;
  }
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

function bandOf(nm) {
  if (nm < 380) return "ultraviolet";
  if (nm <= 750) return "visible light";
  if (nm <= 1e5) return "infrared";
  return "microwave+";
}

/* =========================== TAB 1 · CONVECTION =========================== */
function ConvectionCanvas({ power, liveRef }) {
  const canvasRef = useRef(null);
  const powerRef = useRef(power);
  useLayoutEffect(() => {
    powerRef.current = power;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const rnd = seeded(11);
    const parts = Array.from({ length: 150 }, () => ({
      x: rnd(),
      y: rnd(),
      t: 0.3,
    }));
    // shared with the 3D view (read only)
    if (liveRef) liveRef.current.conv = parts;
    let raf;

    const field = (x, y) => {
      const cx = x - 0.5;
      const ax = Math.abs(cx);
      const sign = cx >= 0 ? 1 : -1;
      let vx = 0,
        vy = 0;
      const upW = Math.exp(-(cx * cx) / (2 * 0.1 * 0.1));
      vy -= upW * (0.35 + 0.75 * Math.sin(Math.PI * clamp(y, 0, 1)));
      const wallW = Math.exp(-((ax - 0.42) ** 2) / (2 * 0.07 * 0.07));
      vy += wallW * 1.05;
      const topW = Math.exp(-((y - 0.07) ** 2) / (2 * 0.08 * 0.08));
      vx += sign * topW * 1.0;
      const botW = Math.exp(-((y - 0.93) ** 2) / (2 * 0.08 * 0.08));
      vx -= sign * botW * 1.0;
      return { vx, vy };
    };

    const draw = () => {
      const { ctx, w, h } = fitCanvas(canvas);
      const p = powerRef.current / 100;
      ctx.clearRect(0, 0, w, h);

      const potX = w * 0.14,
        potW = w * 0.72,
        potY = Math.max(h * 0.16, 72), // keeps steam wisps clear of the title
        potH = h * 0.62;

      // water body
      const wg = ctx.createLinearGradient(0, potY, 0, potY + potH);
      wg.addColorStop(0, "rgba(56,189,248,0.10)");
      wg.addColorStop(1, `rgba(255,107,53,${0.05 + p * 0.14})`);
      ctx.fillStyle = wg;
      roundRect(ctx, potX, potY, potW, potH, 10);
      ctx.fill();

      // particles riding the convection loop
      parts.forEach((pt) => {
        const f = field(pt.x, pt.y);
        const speed = 0.16 * p + 0.012;
        pt.x +=
          f.vx * speed * 0.016 + (Math.random() - 0.5) * 0.0022 * (0.2 + p);
        pt.y +=
          f.vy * speed * 0.016 + (Math.random() - 0.5) * 0.0018 * (0.2 + p);
        pt.x = ((pt.x % 1) + 1) % 1;
        pt.y = clamp(pt.y, 0.02, 0.98);
        // local temperature target: hot near bottom-centre, cool near top walls
        const target = clamp(0.9 * p * (1 - pt.y) + 0.12 * p + 0.05, 0, 1);
        pt.t += (target - pt.t) * 0.03;
        const px = potX + 8 + pt.x * (potW - 16);
        const py = potY + 8 + pt.y * (potH - 16);
        const col = heatColor(pt.t);
        drawGlow(ctx, px, py, 7, col, 0.22 * (0.4 + p));
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // pot outline
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;
      roundRect(ctx, potX, potY, potW, potH, 10);
      ctx.stroke();
      // handles
      ctx.beginPath();
      ctx.moveTo(potX - 14, potY + 12);
      ctx.lineTo(potX, potY + 12);
      ctx.moveTo(potX + potW, potY + 12);
      ctx.lineTo(potX + potW + 14, potY + 12);
      ctx.stroke();

      // burner flames
      if (p > 0.02) {
        const t = performance.now() / 120;
        for (let i = 0; i < 5; i++) {
          const fx = potX + potW * (0.2 + i * 0.15);
          const fh = (22 + Math.sin(t + i * 1.7) * 8) * (0.5 + p * 0.8);
          const g = ctx.createLinearGradient(
            fx,
            potY + potH + 26,
            fx,
            potY + potH + 26 - fh,
          );
          g.addColorStop(0, "rgba(255,107,53,0.95)");
          g.addColorStop(1, "rgba(255,210,63,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(fx - 6, potY + potH + 26);
          ctx.quadraticCurveTo(
            fx,
            potY + potH + 26 - fh,
            fx + 6,
            potY + potH + 26,
          );
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(potX - 10, potY + potH + 28);
      ctx.lineTo(potX + potW + 10, potY + potH + 28);
      ctx.stroke();

      // bubbles when hot
      if (p > 0.55) {
        const t = performance.now() / 700;
        for (let i = 0; i < 8; i++) {
          const bx = potX + potW * (0.15 + ((i * 37) % 70) / 100);
          const by = potY + potH - ((t * 60 + i * 53) % (potH - 20));
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(bx, by, 2.5 + (i % 3), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // steam wisps
      if (p > 0.4) {
        const t = performance.now() / 900;
        ctx.save();
        ctx.strokeStyle = `rgba(226,232,240,${0.16 + p * 0.2})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const sx = potX + potW * (0.25 + i * 0.17);
          ctx.beginPath();
          for (let yy = 0; yy <= 26; yy += 4) {
            const yTop = potY - 6 - yy - ((t * 20 + i * 9) % 14);
            const xx = sx + Math.sin((yy + t * 30 + i * 40) / 9) * 5;
            yy === 0 ? ctx.moveTo(xx, yTop) : ctx.lineTo(xx, yTop);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // loop arrows
      if (p > 0.05) {
        ctx.save();
        ctx.strokeStyle = "rgba(251,191,36,0.75)";
        ctx.fillStyle = "rgba(251,191,36,0.9)";
        ctx.lineWidth = 2;
        const cxm = potX + potW / 2;
        const arrow = (x, y, ang) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-3, -4);
          ctx.lineTo(-3, 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };
        // up centre
        ctx.beginPath();
        ctx.moveTo(cxm, potY + potH * 0.8);
        ctx.lineTo(cxm, potY + potH * 0.3);
        ctx.stroke();
        arrow(cxm, potY + potH * 0.3, -Math.PI / 2);
        // down at right wall
        ctx.beginPath();
        ctx.moveTo(potX + potW * 0.88, potY + potH * 0.3);
        ctx.lineTo(potX + potW * 0.88, potY + potH * 0.75);
        ctx.stroke();
        arrow(potX + potW * 0.88, potY + potH * 0.75, Math.PI / 2);
        ctx.restore();
        // each caption sits in the lane beside its arrow, never across one
        labelWrap(
          ctx,
          "Hot fluid rises (less dense)",
          cxm - 10,
          potY + potH * 0.42,
          cxm - potX - 24,
          { size: 10.5, color: "#fbbf24", align: "right", weight: "700", halo: "#0b1220" },
        );
        labelWrap(
          ctx,
          "Cool fluid sinks",
          cxm + 12,
          potY + potH * 0.5,
          potX + potW * 0.88 - cxm - 26,
          { size: 10.5, color: "#7dd3fc", weight: "700", halo: "#0b1220" },
        );
      } else {
        labelWrap(
          ctx,
          "Burner off: only slow conduction, no current",
          w / 2,
          potY + potH / 2,
          potW - 24,
          { size: 11.5, color: "#7c8ba1", align: "center" },
        );
      }

      labelFit(
        ctx,
        w < 420
          ? "CONVECTION CURRENT: the moving fluid carries heat"
          : "CONVECTION CURRENT, heat carried by the moving fluid itself",
        w / 2,
        18,
        w - 24,
        { size: 11, color: "#94a3b8", align: "center", weight: "700" },
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [liveRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ "--sim-h": "clamp(320px, 46vw, 430px)", "--sim-h-sm": "360px" }}
      aria-label="Convection simulation"
    />
  );
}

/* =========================== TAB 2 · RADIATION =========================== */
function RadiationCanvas({ tempK, emissivity, surrK, liveRef }) {
  const canvasRef = useRef(null);
  const ctrl = useRef({ tempK, emissivity, surrK });
  useLayoutEffect(() => {
    ctrl.current = { tempK, emissivity, surrK };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const rnd = seeded(5);
    let photons = [];
    let spawnAcc = 0;
    let last = performance.now();
    let raf;

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { ctx, w, h } = fitCanvas(canvas);
      const { tempK: T, emissivity: e, surrK: Ts } = ctrl.current;
      ctx.clearRect(0, 0, w, h);

      const P = e * sigma * 1 * Math.pow(T, 4);
      const Pmax = sigma * Math.pow(2500, 4);
      const lamNm = (wienB / T) * 1e9;
      const col = wavelengthColor(lamNm);

      const ex = Math.max(w * 0.2, 70),
        ey = h * 0.5,
        er = 34 + 26 * clamp(norm(T, 300, 2500), 0, 1);
      const ax = w * 0.82,
        ay = h * 0.5,
        ar = 30;

      // starfield backdrop (vacuum of space vibe)
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97.3) % w;
        const sy = (i * 61.7) % h;
        ctx.fillRect(sx, sy, 1.4, 1.4);
      }
      ctx.restore();

      // emitter glow + body
      drawGlow(ctx, ex, ey, er * (2.2 + clamp(P / Pmax, 0, 1) * 2.5), col, 0.4);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(ex - er * 0.3, ey - er * 0.3, er * 0.16, 0, Math.PI * 2);
      ctx.fill();
      // keep the centred captions inside the canvas on narrow widths
      const inside = (x, text, size) => {
        const half = textWidth(ctx, text, { size, weight: "700" }) / 2;
        return clamp(x, half + 8, w - half - 8);
      };
      const emitterText = `EMITTER · ${fmt(T, 0)} K`;
      label(ctx, emitterText, inside(ex, emitterText, 11), ey + er + 22, {
        size: 11,
        color: "#e2e8f0",
        align: "center",
        weight: "700",
      });
      label(ctx, `e = ${e}`, inside(ex, emitterText, 11), ey + er + 38, {
        size: 10,
        color: "#7c8ba1",
        align: "center",
      });

      // absorber (surroundings)
      const aCol = heatColor(clamp(norm(Ts, 200, 500), 0, 1));
      ctx.fillStyle = "rgba(148,163,184,0.25)";
      ctx.strokeStyle = aCol;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ax, ay, ar, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const absorberText = `ABSORBER · ${fmt(Ts, 0)} K`;
      label(ctx, absorberText, inside(ax, absorberText, 11), ay + ar + 22, {
        size: 11,
        color: "#e2e8f0",
        align: "center",
        weight: "700",
      });
      label(ctx, "No material between: vacuum ✓", (ex + ax) / 2, h - 16, {
        size: 10.5,
        color: "#7c8ba1",
        align: "center",
      });

      // photon emission, rate compressed for visibility but ∝ growing with T⁴
      const rate = (2.5 + 55 * Math.pow(clamp(P / Pmax, 0, 1), 0.22)) * e;
      spawnAcc += rate * dt;
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        const ang = (rnd() - 0.5) * 0.9;
        photons.push({
          x: ex + er,
          y: ey + (rnd() - 0.5) * er,
          vx: Math.cos(ang) * 210,
          vy: Math.sin(ang) * 210,
          wave: rnd() * 6,
        });
      }
      if (photons.length > 420) photons = photons.slice(-420);

      // update + render photons as little wave dashes
      photons = photons.filter((ph) => {
        ph.x += ph.vx * dt;
        ph.y += ph.vy * dt;
        ph.wave += dt * 22;
        if (ph.x > ax - ar) return false; // absorbed
        if (ph.y < 0 || ph.y > h) return false;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let sN = 0; sN < 3; sN++) {
          const px = ph.x - sN * 6;
          const py = ph.y + Math.sin(ph.wave + sN * 1.6) * 2.6;
          sN === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
        return true;
      });

      if (liveRef) liveRef.current.rad = { photons, ex, ey, er, ax, ay, ar };

      // absorption flashes
      if (rnd() < clamp(P / Pmax, 0, 1) * 0.5 + 0.05) {
        drawGlow(ctx, ax - ar, ay + (rnd() - 0.5) * ar, 14, "#fbbf24", 0.35);
      }

      labelFit(
        ctx,
        `λ_max = ${lamNm >= 1000 ? `${fmt(lamNm / 1000, 2)} μm` : `${fmt(lamNm, 0)} nm`} (${bandOf(lamNm)})`,
        w / 2,
        20,
        w - 24,
        { size: 11.5, color: col, align: "center", weight: "800" },
      );
      labelFit(
        ctx,
        "Photons travel at light speed; radiation needs no medium",
        w / 2,
        40,
        w - 24,
        { size: 10, color: "#7c8ba1", align: "center" },
      );

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [liveRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ "--sim-h": "clamp(320px, 46vw, 430px)", "--sim-h-sm": "360px" }}
      aria-label="Radiation simulation"
    />
  );
}

/* =========================== SHELL =========================== */
export default function ConvectionRadiationSim() {
  const [tab, setTab] = useState("convection");
  const [power, setPower] = useState(70);
  const [tempK, setTempK] = useState(1200);
  const [surrK, setSurrK] = useState(293);
  const [emisIdx, setEmisIdx] = useState(0);
  const liveRef = useRef({ conv: null, rad: null });
  const EMIS = [
    { name: "Black matte (e = 0.95)", value: 0.95 },
    { name: "Human skin (e = 0.97)", value: 0.97 },
    { name: "Polished aluminum (e = 0.05)", value: 0.05 },
  ];
  const e = EMIS[emisIdx].value;
  const P = e * sigma * Math.pow(tempK, 4);
  const Pnet = e * sigma * (Math.pow(tempK, 4) - Math.pow(surrK, 4));
  const lamNm = (wienB / tempK) * 1e9;
  // live state for the 3D view; the 2D canvases own the motion
  const getState = () => ({
    tab,
    power,
    tempK,
    surrK,
    e,
    color: wavelengthColor(lamNm),
    lamNm,
    band: bandOf(lamNm),
    pFrac: clamp(P / (sigma * Math.pow(2500, 4)), 0, 1),
    conv: liveRef.current.conv,
    rad: liveRef.current.rad,
  });

  const tabs = (
    <div className="btn-group btn-group-sm" role="group" aria-label="Mode">
      <button
        className={`btn ${tab === "convection" ? "btn-flame" : "btn-outline-ink"}`}
        onClick={() => setTab("convection")}
      >
        <i className="bi bi-water me-1" /> Convection
      </button>
      <button
        className={`btn ${tab === "radiation" ? "btn-flame" : "btn-outline-ink"}`}
        onClick={() => setTab("radiation")}
      >
        <i className="bi bi-broadcast-pin me-1" /> Radiation
      </button>
    </div>
  );

  if (tab === "convection") {
    return (
      <SimFrame
        getState={getState}
        title="Convection Pot, the circulating loop"
        badge={tabs}
        stage={<ConvectionCanvas power={power} liveRef={liveRef} />}
        controls={
          <>
            <div style={{ minWidth: 220, flex: 1 }}>
              <label className="form-label" htmlFor="conv-power">
                Burner power · <b style={{ color: "#c2410c" }}>{power}%</b>
              </label>
              <input
                id="conv-power"
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={power}
                onChange={(ev) => setPower(Number(ev.target.value))}
              />
            </div>
            <div className="sim-readout">
              <span className="readout-pill">
                Mode{" "}
                <b>
                  {power > 55
                    ? "boiling-like"
                    : power > 5
                      ? "gentle current"
                      : "off"}
                </b>
              </span>
              <span className="readout-pill cool">
                H = h·A·ΔT <b>grows with ΔT</b>
              </span>
            </div>
          </>
        }
        note={
          <>
            <i className="bi bi-info-circle me-1" />
            Heating <b>from below</b> makes warm fluid expand, become less dense
            and rise, cool fluid sinks to replace it, forming a
            <b> convection current</b>. Turn the burner off: no bulk motion,
            only slow conduction. Real examples: boiling water, sea breezes,
            hot-air balloons.
          </>
        }
      />
    );
  }

  return (
    <SimFrame
      getState={getState}
      title="Thermal Radiation, photons across a vacuum"
      badge={tabs}
      stage={
        <RadiationCanvas
          tempK={tempK}
          emissivity={e}
          surrK={surrK}
          liveRef={liveRef}
        />
      }
      controls={
        <>
          <div style={{ minWidth: 190, flex: 1 }}>
            <label className="form-label" htmlFor="rad-t">
              Emitter temperature ·{" "}
              <b style={{ color: "#c2410c" }}>{fmt(tempK, 0)} K</b>
            </label>
            <input
              id="rad-t"
              type="range"
              className="form-range"
              min="300"
              max="2500"
              step="10"
              value={tempK}
              onChange={(ev) => setTempK(Number(ev.target.value))}
            />
          </div>
          <div style={{ minWidth: 150, flex: 1 }}>
            <label className="form-label" htmlFor="rad-ts">
              Surroundings · <b>{fmt(surrK, 0)} K</b>
            </label>
            <input
              id="rad-ts"
              type="range"
              className="form-range"
              min="200"
              max="600"
              step="5"
              value={surrK}
              onChange={(ev) => setSurrK(Number(ev.target.value))}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <label className="form-label" htmlFor="rad-e">
              Surface (emissivity)
            </label>
            <select
              id="rad-e"
              className="form-select form-select-sm"
              value={emisIdx}
              onChange={(ev) => setEmisIdx(Number(ev.target.value))}
            >
              {EMIS.map((m, i) => (
                <option key={m.name} value={i}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-sm btn-outline-ink"
            onClick={() => setTempK((t) => clamp(t * 2, 300, 2500))}
          >
            <i className="bi bi-fast-forward me-1" /> Double T
          </button>
          <div className="sim-readout w-100">
            <span className="readout-pill">
              P = eσAT⁴ <b>{fmtSci(P, 3)} W</b>
            </span>
            <span className="readout-pill cool">
              P_net <b>{fmtSci(Pnet, 3)} W</b>
            </span>
            <span className="readout-pill">
              λ_max <b>{fmt((wienB / tempK) * 1e9, 0)} nm</b>
            </span>
          </div>
        </>
      }
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          Every object above 0 K radiates. Hotter → far more power (<b>T⁴</b>:
          press “Double T” and watch P jump ×16) and a shorter peak wavelength (
          <b>Wien&apos;s law</b>): infrared at body temperature, orange-white near
          1500 K. Polished aluminum barely radiates, shiny surfaces are poor
          emitters.
        </>
      }
    />
  );
}
