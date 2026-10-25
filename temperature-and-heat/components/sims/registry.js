// ============================================================
// Simulation registry: each sim declares its 2D component and an
// optional 3D scene module (components/sims/three/*).
//   load3d: null   → 3D tab shown disabled ("3D coming soon")
//   views: false   → no 2D / 3D switch at all (not a canvas sim)
// ============================================================

export const SIM_REGISTRY = {
  ThermometerSim: {
    load2d: () => import("../simulations/ThermometerSim"),
    load3d: () => import("./three/Thermometer3D"),
  },
  ParticleBoxSim: {
    load2d: () => import("../simulations/ParticleBoxSim"),
    load3d: () => import("./three/ParticleBox3D"),
  },
  ConductionSim: {
    load2d: () => import("../simulations/ConductionSim"),
    load3d: () => import("./three/Conduction3D"),
  },
  ConvectionRadiationSim: {
    load2d: () => import("../simulations/ConvectionRadiationSim"),
    load3d: () => import("./three/ConvectionRadiation3D"),
  },
  SpecificHeatSim: {
    load2d: () => import("../simulations/SpecificHeatSim"),
    load3d: () => import("./three/SpecificHeat3D"),
  },
  CalorimetrySim: {
    load2d: () => import("../simulations/CalorimetrySim"),
    load3d: () => import("./three/Calorimetry3D"),
  },
  HeatingCurveSim: {
    load2d: () => import("../simulations/HeatingCurveSim"),
    load3d: () => import("./three/HeatingCurve3D"),
  },
  LatentHeatSim: {
    load2d: () => import("../simulations/LatentHeatSim"),
    load3d: () => import("./three/LatentHeat3D"),
  },
  GasLawSim: {
    load2d: () => import("../simulations/GasLawSim"),
    load3d: () => import("./three/GasLaw3D"),
  },
  ModesOfHeatSim: {
    load2d: () => import("../simulations/ModesOfHeatSim"),
    load3d: () => import("./three/ModesOfHeat3D"),
  },
  UnitConverter: {
    load2d: () => import("../simulations/UnitConverter"),
    load3d: null,
    views: false,
  },
};
