// ============================================================
// Colour helpers for the 3D scenes. Temperature colours come from
// the same heatColor() the 2D canvases use, so both views agree.
// ============================================================
import { heatColor } from "@/lib/canvas";

// "rgb(r,g,b)" → [r, g, b] in 0..1 (sRGB)
function parseRgb(str) {
  const m = /rgba?\(([^)]+)\)/.exec(str);
  if (!m) return [1, 1, 1];
  const [r, g, b] = m[1].split(",").map((v) => Number(v) / 255);
  return [r, g, b];
}

// Writes heatColor(t01) into an existing THREE.Color (no allocation).
export function setHeatColor(color, t01) {
  const [r, g, b] = parseRgb(heatColor(t01));
  color.setRGB(r, g, b, "srgb");
  return color;
}

// Any CSS colour string the 2D code uses (#hex or rgb()) → THREE.Color.
export function cssColor(THREE, str) {
  if (str.startsWith("rgb")) {
    const [r, g, b] = parseRgb(str);
    return new THREE.Color().setRGB(r, g, b, "srgb");
  }
  return new THREE.Color(str);
}

// DESIGN.md tokens, read live so 3D follows globals.css.
export function readTokens() {
  const css = getComputedStyle(document.documentElement);
  const get = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  return {
    stage: get("--stage", "#0B1220"),
    ember: get("--ember", "#C2410C"),
    cool: get("--cool", "#0369A1"),
    line: get("--line", "#2E3441"),
    flame: get("--flame-glow", "#F59E0B"),
  };
}

// Fixed per-index depth in -1..1 for particles that only move in x/y.
// Display only: the simulation itself stays 2D.
export function depthFor(i) {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}
