"use client";

// ============================================================
// Modes of Heat Transfer, one campfire scene, three physics
// stories: conduction through the poker, convection in the soup
// pot, radiation warming the camper's face. Toggle each mode.
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SimFrame from "@/components/SimFrame";
import {
  fitCanvas,
  heatColor,
  clamp,
  label,
  roundRect,
  drawGlow,
  seeded,
  wrapLines,
} from "@/lib/canvas";

// Explanations live in a legend strip under the scene, so the scene itself
// only carries short tags and nothing collides at narrow widths.
const LEGEND = [
  {
    key: "conduction",
    color: "#f87171",
    title: "Conduction",
    text: "Vibrations pass atom to atom along the metal poker. The handle end gets hot, but no metal moves.",
  },
  {
    key: "convection",
    color: "#fbbf24",
    title: "Convection",
    text: "Hot soup rises and cool soup sinks, so the moving liquid carries the heat.",
  },
  {
    key: "radiation",
    color: "#fb923c",
    title: "Radiation",
    text: "Infrared waves reach the camper with no material in between.",
  },
];

export default function ModesOfHeatSim() {
  const canvasRef = useRef(null);
  const [show, setShow] = useState({
    conduction: true,
    convection: true,
    radiation: true,
  });
  const showRef = useRef(show);
  const soupRef = useRef(null);
  useLayoutEffect(() => {
    showRef.current = show;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const rnd = seeded(23);
    const soupParts = Array.from({ length: 34 }, () => ({
      x: rnd(),
      y: rnd(),
    }));
    soupRef.current = soupParts;
    let raf;

    const flames = (ctx, x, y, scale, t) => {
      for (let i = 0; i < 4; i++) {
        const fx = x + (i - 1.5) * 9 * scale;
        const fh = (30 + Math.sin(t / 110 + i * 1.9) * 9 + (i % 2) * 8) * scale;
        const fw = 8 * scale;
        const g = ctx.createLinearGradient(fx, y, fx, y - fh);
        g.addColorStop(0, "rgba(255,107,53,0.95)");
        g.addColorStop(0.55, "rgba(247,147,30,0.85)");
        g.addColorStop(1, "rgba(255,210,63,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(fx - fw, y);
        ctx.quadraticCurveTo(
          fx - fw * 0.4,
          y - fh * 0.55,
          fx + Math.sin(t / 200 + i) * 3 * scale,
          y - fh,
        );
        ctx.quadraticCurveTo(fx + fw * 0.4, y - fh * 0.55, fx + fw, y);
        ctx.closePath();
        ctx.fill();
      }
      drawGlow(ctx, x, y - 14 * scale, 46 * scale, "#ff6b35", 0.3);
    };

    const draw = () => {
      const { ctx, w, h } = fitCanvas(canvas);
      const t = performance.now();
      const s = showRef.current;
      ctx.clearRect(0, 0, w, h);

      // ---------- legend strip: one row of columns, or stacked on narrow ----------
      const cols = w >= 640 ? 3 : 1;
      const colGap = 18;
      const colW = (w - 24 - (cols - 1) * colGap) / cols;
      const entries = LEGEND.map((e) => ({
        ...e,
        lines: wrapLines(ctx, e.text, colW - 14, { size: 11 }),
      }));
      const entryH = (e) => 18 + e.lines.length * 14;
      const legendH =
        cols === 3
          ? Math.max(...entries.map(entryH)) + 20
          : entries.reduce((sum, e) => sum + entryH(e) + 8, 0) + 12;
      const H = h - legendH; // scene height

      let ly = H + 14;
      entries.forEach((e, i) => {
        const lx = cols === 3 ? 12 + i * (colW + colGap) : 12;
        const top = cols === 3 ? H + 14 : ly;
        ctx.save();
        ctx.globalAlpha = s[e.key] ? 1 : 0.4;
        ctx.fillStyle = e.color;
        ctx.fillRect(lx, top + 2, 3, entryH(e) - 6);
        label(ctx, e.title, lx + 10, top + 8, {
          size: 11.5,
          color: e.color,
          weight: "800",
        });
        e.lines.forEach((ln, k) =>
          label(ctx, ln, lx + 10, top + 24 + k * 14, {
            size: 11,
            color: "#cbd5e1",
          }),
        );
        ctx.restore();
        ly += entryH(e) + 8;
      });

      // ground
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.82);
      ctx.lineTo(w, H * 0.82);
      ctx.stroke();

      const fireX = w * 0.42,
        fireY = H * 0.82;

      // logs
      ctx.save();
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(fireX - 26, fireY - 2);
      ctx.lineTo(fireX + 20, fireY - 12);
      ctx.moveTo(fireX + 26, fireY - 2);
      ctx.lineTo(fireX - 20, fireY - 12);
      ctx.stroke();
      ctx.restore();

      flames(ctx, fireX, fireY - 8, 1.05, t);
      label(ctx, "CAMPFIRE", fireX, fireY + 16, {
        size: 10.5,
        color: "#7c8ba1",
        align: "center",
        weight: "800",
      });

      /* ---------- RADIATION → camper ---------- */
      const pX = w * 0.82,
        pY = H * 0.62;
      // camper
      ctx.save();
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(pX, pY - 34, 13, 0, Math.PI * 2); // head
      ctx.fill();
      roundRect(ctx, pX - 15, pY - 20, 30, 44, 9); // body
      ctx.fillStyle = "#94a3b8";
      ctx.fill();
      ctx.restore();
      label(ctx, "Camper", pX, pY + 38, {
        size: 10,
        color: "#7c8ba1",
        align: "center",
      });

      if (s.radiation) {
        // 3 sine-wave rays fire → face
        for (let r = 0; r < 3; r++) {
          const yOff = (r - 1) * 22;
          const x1 = fireX + 26,
            y1 = fireY - 40 + yOff * 0.4;
          const x2 = pX - 20,
            y2 = pY - 34 + yOff * 0.7;
          ctx.save();
          ctx.strokeStyle = `rgba(251,146,60,${0.75 - r * 0.15})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const segs = 26;
          for (let i = 0; i <= segs; i++) {
            const f = i / segs;
            const px = x1 + (x2 - x1) * f;
            const py =
              y1 + (y2 - y1) * f + Math.sin(f * 22 - t / 130 + r) * 3.4;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
          // arrow head
          ctx.fillStyle = "rgba(251,146,60,0.85)";
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - 9, y2 - 4.5);
          ctx.lineTo(x2 - 9, y2 + 4.5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        // warm face glow
        drawGlow(
          ctx,
          pX - 12,
          pY - 34,
          22,
          "#fb923c",
          0.35 + Math.sin(t / 500) * 0.08,
        );
        label(ctx, "RADIATION", pX, pY - 64, {
          size: 11,
          color: "#fb923c",
          align: "center",
          weight: "800",
        });
      }

      /* ---------- CONVECTION → soup pot ---------- */
      const potX = fireX - 8,
        potY = fireY - Math.min(150, H * 0.48),
        potW = 92,
        potH = 56;
      // tripod
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(potX - 26, fireY);
      ctx.lineTo(potX + potW / 2, potY - 6);
      ctx.lineTo(potX + potW + 26, fireY);
      ctx.stroke();

      // pot body
      ctx.save();
      ctx.fillStyle = "rgba(148,163,184,0.3)";
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2.5;
      roundRect(ctx, potX, potY, potW, potH, 7);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      // soup
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#f59e0b";
      roundRect(ctx, potX + 4, potY + 8, potW - 8, potH - 12, 5);
      ctx.fill();
      ctx.restore();

      if (s.convection) {
        // circulating soup particles: rise in centre, fall at sides
        soupParts.forEach((p) => {
          const cx = p.x - 0.5;
          const rise = Math.exp(-(cx * cx) / 0.02);
          p.y -= 0.0016 + rise * 0.004;
          p.x += Math.sign(cx || 0.01) * (p.y < 0.3 ? 0.0022 : -0.0012);
          if (p.y < 0.06) {
            p.y = 0.06;
            p.x += Math.sign(cx || 0.01) * 0.01;
          }
          if (p.y > 0.98) p.y = 0.98;
          p.x = ((p.x % 1) + 1) % 1;
          const col = heatColor(clamp(0.9 - p.y * 0.75, 0, 1));
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(
            potX + 6 + p.x * (potW - 12),
            potY + 10 + p.y * (potH - 16),
            2.3,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        });
        // loop arrows
        ctx.save();
        ctx.strokeStyle = "rgba(251,191,36,0.8)";
        ctx.fillStyle = "rgba(251,191,36,0.9)";
        ctx.lineWidth = 1.8;
        const mx = potX + potW / 2;
        ctx.beginPath();
        ctx.moveTo(mx, potY + potH - 8);
        ctx.lineTo(mx, potY + 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, potY + 10);
        ctx.lineTo(mx - 4, potY + 18);
        ctx.lineTo(mx + 4, potY + 18);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        // steam
        ctx.save();
        ctx.strokeStyle = "rgba(226,232,240,0.4)";
        ctx.lineWidth = 1.8;
        for (let i = 0; i < 3; i++) {
          const sx = potX + potW * (0.3 + i * 0.2);
          ctx.beginPath();
          for (let yy = 0; yy <= 22; yy += 4) {
            const yTop = potY - 4 - yy - ((t / 40 + i * 13) % 12);
            const xx = sx + Math.sin((yy + t / 26 + i * 30) / 7) * 4;
            yy === 0 ? ctx.moveTo(xx, yTop) : ctx.lineTo(xx, yTop);
          }
          ctx.stroke();
        }
        ctx.restore();
        label(ctx, "CONVECTION", potX + potW / 2, potY - 48, {
          size: 11,
          color: "#fbbf24",
          align: "center",
          weight: "800",
        });
      } else {
        label(ctx, "Soup pot", potX + potW / 2, potY - 20, {
          size: 10,
          color: "#7c8ba1",
          align: "center",
        });
      }

      /* ---------- CONDUCTION → metal poker ---------- */
      const rodY = fireY - 26;
      const rodX1 = fireX - 30,
        rodX2 = w * 0.06;
      ctx.save();
      const rg = ctx.createLinearGradient(rodX1, 0, rodX2, 0);
      rg.addColorStop(0, heatColor(1));
      rg.addColorStop(0.35, heatColor(0.45));
      rg.addColorStop(1, heatColor(0.05));
      ctx.strokeStyle = rg;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(rodX1, rodY);
      ctx.lineTo(rodX2, rodY - 30);
      ctx.stroke();
      // handle
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(rodX2 + 2, rodY - 29);
      ctx.lineTo(rodX2 - 16, rodY - 35);
      ctx.stroke();
      ctx.restore();

      if (s.conduction) {
        // vibrating atoms along rod: amplitude grows near fire
        const nDots = 16;
        for (let i = 0; i < nDots; i++) {
          const f = i / (nDots - 1); // 0 at fire end
          const px = rodX1 + (rodX2 - rodX1) * f;
          const py = rodY + -30 * f;
          const heat = clamp(1 - f * 1.05, 0, 1);
          const amp = 1 + heat * 4.5;
          const jx = Math.sin(t / (60 + 260 * (1 - heat)) + i * 9) * amp;
          const jy = Math.cos(t / (70 + 240 * (1 - heat)) + i * 5) * amp;
          ctx.fillStyle = heatColor(heat);
          ctx.beginPath();
          ctx.arc(px + jx * 0.6, py + jy * 0.6, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        label(ctx, "CONDUCTION", Math.max(8, rodX2 - 16), rodY - 56, {
          size: 11,
          color: "#f87171",
          weight: "800",
        });
      }

      label(ctx, "ONE FIRE · THREE WAYS HEAT TRAVELS", w / 2, 18, {
        size: 11.5,
        color: "#94a3b8",
        align: "center",
        weight: "800",
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

  const controls = (
    <div className="d-flex flex-wrap gap-2 align-items-center w-100">
      <span className="form-label mb-0 me-1">Toggle a mode:</span>
      {[
        {
          key: "conduction",
          label: "Conduction (poker)",
          icon: "bi-rulers",
          cls: show.conduction ? "btn-flame" : "btn-outline-ink",
        },
        {
          key: "convection",
          label: "Convection (soup)",
          icon: "bi-water",
          cls: show.convection ? "btn-flame" : "btn-outline-ink",
        },
        {
          key: "radiation",
          label: "Radiation (camper)",
          icon: "bi-broadcast-pin",
          cls: show.radiation ? "btn-flame" : "btn-outline-ink",
        },
      ].map((b) => (
        <button
          key={b.key}
          className={`btn btn-sm ${b.cls}`}
          onClick={() => toggle(b.key)}
        >
          <i className={`bi ${b.icon} me-1`} />
          {b.label}
        </button>
      ))}
    </div>
  );

  return (
    <SimFrame
      getState={() => ({ show: showRef.current, soup: soupRef.current })}
      title="Heat Transfer Demo, conduction · convection · radiation"
      badge={
        <span className="chip flame">
          <i className="bi bi-fire" /> Lessons 3–4
        </span>
      }
      stage={
        <canvas
          ref={canvasRef}
          style={{ "--sim-h": "clamp(400px, 52vw, 500px)", "--sim-h-sm": "500px" }}
          aria-label="Modes of heat transfer scene"
        />
      }
      controls={controls}
      note={
        <>
          <i className="bi bi-info-circle me-1" />
          Real situations mix all three modes, like the lesson&apos;s hot cup of
          tea. The decision tree: <b>no material between?</b> → radiation.
          <b> material moving and carrying heat?</b> → convection.{" "}
          <b> material still, particle-to-particle?</b> → conduction.
        </>
      }
    />
  );
}
