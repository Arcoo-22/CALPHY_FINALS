"use client";

// 2D / 3D toggle in a simulation header, plus the per-sim remembered view.
import { useState } from "react";

const storageKey = (name) => `calphy:sim-view:${name}`;

function readView(name) {
  if (!name || typeof window === "undefined") return "2d";
  try {
    return window.localStorage.getItem(storageKey(name)) === "3d" ? "3d" : "2d";
  } catch {
    return "2d";
  }
}

// Last chosen view per simulation; 2D unless 3D was picked and exists.
export function useSimView(name, has3d) {
  const [view, setViewState] = useState(() => readView(name));
  const setView = (next) => {
    setViewState(next);
    if (!name) return;
    try {
      window.localStorage.setItem(storageKey(name), next);
    } catch {
      // storage blocked (private mode, quota): keep the choice for this visit only
    }
  };
  return [has3d && view === "3d" ? "3d" : "2d", setView];
}

export default function ViewSwitch({ view, has3d, onChange }) {
  return (
    <div className="btn-group btn-group-sm view-switch" role="group" aria-label="View">
      <button
        type="button"
        className={`btn ${view === "2d" ? "btn-flame" : "btn-outline-ink"}`}
        aria-pressed={view === "2d"}
        onClick={() => onChange("2d")}
      >
        2D
      </button>
      <button
        type="button"
        className={`btn ${view === "3d" ? "btn-flame" : "btn-outline-ink"}`}
        aria-pressed={view === "3d"}
        disabled={!has3d}
        title={has3d ? undefined : "3D coming soon"}
        onClick={() => onChange("3d")}
      >
        {has3d ? "3D" : "3D coming soon"}
      </button>
    </div>
  );
}
