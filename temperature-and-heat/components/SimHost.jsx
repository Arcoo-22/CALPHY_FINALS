"use client";

// Dynamically loads a simulation canvas component by name (client-side only).
import dynamic from "next/dynamic";

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

const SIMS = {
  ThermometerSim: load(() => import("./simulations/ThermometerSim")),
  ParticleBoxSim: load(() => import("./simulations/ParticleBoxSim")),
  ConductionSim: load(() => import("./simulations/ConductionSim")),
  ConvectionRadiationSim: load(
    () => import("./simulations/ConvectionRadiationSim"),
  ),
  SpecificHeatSim: load(() => import("./simulations/SpecificHeatSim")),
  CalorimetrySim: load(() => import("./simulations/CalorimetrySim")),
  HeatingCurveSim: load(() => import("./simulations/HeatingCurveSim")),
  LatentHeatSim: load(() => import("./simulations/LatentHeatSim")),
  GasLawSim: load(() => import("./simulations/GasLawSim")),
  ModesOfHeatSim: load(() => import("./simulations/ModesOfHeatSim")),
  UnitConverter: load(() => import("./simulations/UnitConverter")),
};

export default function SimHost({ name, ...props }) {
  const Comp = SIMS[name];
  if (!Comp) return null;
  return <Comp {...props} />;
}

export const SIM_NAMES = Object.keys(SIMS);
