// ============================================================
// Canvas helpers shared by all simulations (no JSX here).
// ============================================================

const HEAT_STOPS = [
  [29, 78, 216], // deep blue  (cold)
  [56, 189, 248], // sky blue
  [52, 211, 153], // green
  [250, 204, 21], // yellow
  [249, 115, 22], // orange
  [239, 68, 68], // red
  [254, 243, 199], // white-hot
];

export function heatColor(t) {
  const clamped = Math.max(0, Math.min(1, t));
  const seg = clamped * (HEAT_STOPS.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = HEAT_STOPS[Math.min(i, HEAT_STOPS.length - 1)];
  const b = HEAT_STOPS[Math.min(i + 1, HEAT_STOPS.length - 1)];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// Same scale for text on the dark stage; skips the deep blue stop, which is
// unreadable as a text colour there.
export const heatTextColor = (t) => heatColor(Math.max(0.17, t));

export const norm =(x, min, max) => (x - min) / (max - min || 1);
export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
export const lerp = (a, b, t) => a + (b - a) * t;

// Fit canvas backing store to CSS size × devicePixelRatio; returns ctx + CSS dims.
export function fitCanvas(canvas) {
  const dpr = Math.min(
    2,
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
  );
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(10, rect.width);
  const h = Math.max(10, rect.height);
  if (
    canvas.width !== Math.round(w * dpr) ||
    canvas.height !== Math.round(h * dpr)
  ) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

export function drawGlow(ctx, x, y, r, color, alpha = 0.45) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function label(
  ctx,
  text,
  x,
  y,
  { size = 12, color = "#94a3b8", align = "left", weight = "600", halo } = {},
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Plus Jakarta Sans", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  // halo: dark outline so text stays legible over moving particles
  if (halo) {
    ctx.strokeStyle = halo;
    ctx.lineWidth = 3.5;
    ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function textWidth(ctx, text, { size = 12, weight = "600" } = {}) {
  ctx.save();
  ctx.font = `${weight} ${size}px "Plus Jakarta Sans", system-ui, sans-serif`;
  const width = ctx.measureText(text).width;
  ctx.restore();
  return width;
}

// Greedy word wrap; a single word wider than maxWidth stays on its own line.
export function wrapLines(ctx, text, maxWidth, { size = 12, weight = "600" } = {}) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(ctx, next, { size, weight }) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Wrapped label; draws downward from y and returns the height used.
export function labelWrap(ctx, text, x, y, maxWidth, opts = {}) {
  const { lineHeight = (opts.size || 12) * 1.3 } = opts;
  const lines = wrapLines(ctx, text, maxWidth, opts);
  lines.forEach((ln, i) => label(ctx, ln, x, y + i * lineHeight, opts));
  return lines.length * lineHeight;
}

// Label shrunk (down to minSize) so it fits maxWidth.
export function labelFit(ctx, text, x, y, maxWidth, opts = {}) {
  const { minSize = 8.5 } = opts;
  let size = opts.size || 12;
  while (size > minSize && textWidth(ctx, text, { ...opts, size }) > maxWidth) {
    size -= 0.5;
  }
  label(ctx, text, x, y, { ...opts, size });
  return size;
}

// Simple deterministic pseudo-random (stable across renders)
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
