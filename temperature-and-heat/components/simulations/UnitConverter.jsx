"use client";

// ============================================================
// Unit converter (Lesson 1 companion tool), °C ⇄ °F ⇄ K live.
// ============================================================
import { useState } from "react";
import { cToF, fToC, cToK, kToC, fmt } from "@/lib/constants";

const UNITS = [
  { id: "C", label: "°C Celsius" },
  { id: "F", label: "°F Fahrenheit" },
  { id: "K", label: "K Kelvin" },
];

export default function UnitConverter() {
  const [unit, setUnit] = useState("C");
  const [value, setValue] = useState("25");

  const v = parseFloat(value);
  const valid = !isNaN(v);
  let c = null;
  if (valid) {
    c = unit === "C" ? v : unit === "F" ? fToC(v) : kToC(v);
  }
  const belowAbsolute = valid && c < -273.15;

  return (
    <div className="card-soft flat p-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span
          className="icon-tile"
          style={{
            width: "2.4rem",
            height: "2.4rem",
            fontSize: "1.1rem",
            background: "var(--cool-tint)",
            color: "var(--cool)",
          }}
        >
          <i className="bi bi-arrow-left-right" />
        </span>
        <div>
          <h5 className="fw-bold mb-0">Temperature Converter</h5>
          <div className="small text-muted">
            Type a value, see all three scales instantly
          </div>
        </div>
      </div>

      <div className="row g-2 align-items-center">
        <div className="col-7">
          <input
            className="form-control-calphy"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Temperature value"
          />
        </div>
        <div className="col-5">
          <select
            className="form-control-calphy"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Unit"
          >
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {valid && !belowAbsolute && (
        <div className="row g-2 mt-1">
          {[
            { k: "°C", val: c, cool: false },
            { k: "°F", val: cToF(c), cool: false },
            { k: "K", val: cToK(c), cool: true },
          ].map((r) => (
            <div className="col-4" key={r.k}>
              <div
                className={`readout-pill w-100 justify-content-between ${r.cool ? "cool" : ""}`}
              >
                <span className="opacity-75">{r.k}</span>
                <b>{fmt(r.val, 2)}</b>
              </div>
            </div>
          ))}
        </div>
      )}

      {belowAbsolute && (
        <div className="quiz-feedback bad mt-3 mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          Below absolute zero (−273.15 °C / 0 K), that temperature is physically
          impossible!
        </div>
      )}

      <div className="small text-muted mt-3 mb-0">
        <b>Remember:</b> °F = (1.8 × °C) + 32 · K = °C + 273.15 · and for{" "}
        <b>changes</b>: Δ1 °C = Δ1 K = Δ1.8 °F (no +32!).
      </div>
    </div>
  );
}
