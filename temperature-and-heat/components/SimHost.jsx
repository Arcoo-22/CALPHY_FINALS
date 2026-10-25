"use client";

// Dynamically loads a simulation canvas component by name (client-side only).
// Components and optional 3D scenes are declared in components/sims/registry.js.
import dynamic from "next/dynamic";
import { SimViewContext } from "./sims/SimViewContext";
import { SIM_REGISTRY } from "./sims/registry";

const SimLoading = () => (
  <div className="sim-shell">
    <div className="sim-header">
      <div className="sim-title">
        <span className="dot" /> Loading simulation…
      </div>
    </div>
    <div
      className="sim-stage d-flex align-items-center justify-content-center"
      style={{ minHeight: 320 }}
    >
      <div className="text-center text-light opacity-75">
        <div className="spinner-border text-warning mb-2" role="status" />
        <div className="small">Warming up the particles…</div>
      </div>
    </div>
  </div>
);

const load = (loader) => dynamic(loader, { ssr: false, loading: SimLoading });

const SIMS = Object.fromEntries(
  Object.entries(SIM_REGISTRY).map(([name, entry]) => [
    name,
    {
      Comp: load(entry.load2d),
      view: { name, load3d: entry.load3d, views: entry.views },
    },
  ]),
);

export default function SimHost({ name, ...props }) {
  const sim = SIMS[name];
  if (!sim) return null;
  const { Comp, view } = sim;
  return (
    <SimViewContext.Provider value={view}>
      <Comp {...props} />
    </SimViewContext.Provider>
  );
}

export const SIM_NAMES = Object.keys(SIMS);
