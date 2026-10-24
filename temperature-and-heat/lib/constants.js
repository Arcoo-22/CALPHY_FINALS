// ============================================================
// Physics constants, transcribed from CALPHY_FINALS_CONTENTS.pdf
// ============================================================

export const SPECIFIC_HEAT = [
  { name: "Water", value: 4186, unit: "J/kg·K", color: "#38bdf8" },
  { name: "Ice", value: 2090, unit: "J/kg·K", color: "#93c5fd" },
  { name: "Steam", value: 2010, unit: "J/kg·K", color: "#cbd5e1" },
  { name: "Aluminum", value: 900, unit: "J/kg·K", color: "#94a3b8" },
  { name: "Glass", value: 840, unit: "J/kg·K", color: "#a5f3fc" },
  { name: "Iron", value: 450, unit: "J/kg·K", color: "#78716c" },
  { name: "Copper", value: 385, unit: "J/kg·K", color: "#f97316" },
  { name: "Lead", value: 128, unit: "J/kg·K", color: "#64748b" },
];

export const THERMAL_CONDUCTIVITY = [
  { name: "Copper", value: 401, unit: "W/m·K", color: "#f97316" },
  { name: "Aluminum", value: 237, unit: "W/m·K", color: "#94a3b8" },
  { name: "Steel", value: 50, unit: "W/m·K", color: "#64748b" },
  { name: "Glass", value: 0.8, unit: "W/m·K", color: "#a5f3fc" },
  { name: "Brick", value: 0.7, unit: "W/m·K", color: "#b45309" },
  { name: "Wood", value: 0.12, unit: "W/m·K", color: "#a16207" },
  { name: "Foam", value: 0.04, unit: "W/m·K", color: "#fde68a" },
  { name: "Air", value: 0.026, unit: "W/m·K", color: "#e2e8f0" },
];

export const EMISSIVITY = [
  { name: "Black matte surface", value: "0.95 – 1" },
  { name: "Human skin", value: "0.97" },
  { name: "Polished aluminum", value: "≈ 0.05" },
];

export const UNIVERSAL = {
  cWater: 4186,
  cIce: 2090,
  cSteam: 2010,
  Lf: 3.34e5, // J/kg
  Lv: 2.26e6, // J/kg
  sigma: 5.67e-8, // W/m²·K⁴
  wienB: 2.898e-3, // m·K
  kB: 1.38e-23, // J/K
  R: 8.314, // J/mol·K
  NA: 6.022e23,
  atm: 101325, // Pa
  molarVolumeSTP: 22.4, // L/mol
  calToJ: 4.186,
  kcalToJ: 4186,
};

export const REFERENCE_TEMPS = [
  { label: "Absolute zero", c: -273.15, f: -459.67, k: 0 },
  { label: "Liquid nitrogen boils", c: -196, f: -312.8, k: 77 },
  { label: "Water freezes", c: 0, f: 32, k: 273.15 },
  { label: "Room temperature", c: 22, f: 71.6, k: 295.15 },
  { label: "Human body", c: 37, f: 98.6, k: 310.15 },
  { label: "Ethanol boils", c: 78, f: 172.4, k: 351.15 },
  { label: "Water boils", c: 100, f: 212, k: 373.15 },
  { label: "Dry ice sublimes", c: -78.5, f: -109.3, k: 194.65 },
  { label: "Surface of the Sun", c: 5526.85, f: 9980.33, k: 5800 },
];

// ---------- conversion helpers ----------
export const cToF = (c) => 1.8 * c + 32;
export const fToC = (f) => (f - 32) / 1.8;
export const cToK = (c) => c + 273.15;
export const kToC = (k) => k - 273.15;

export function fmt(n, digits = 2) {
  if (!isFinite(n)) return "n/a";
  const r = Number(n.toFixed(digits));
  return r.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export function fmtSci(n, digits = 2) {
  if (!isFinite(n) || n === 0) return "0";
  if (Math.abs(n) >= 1e5 || Math.abs(n) < 1e-3) {
    return n.toExponential(digits).replace("e", " × 10^").replace("+", "");
  }
  return fmt(n, digits);
}
