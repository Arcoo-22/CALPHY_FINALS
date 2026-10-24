// ============================================================
// Simulation lab groups, shared by /simulations and site search.
// ============================================================

export const SIM_GROUPS = [
  {
    id: "group-1",
    title: "Temperature basics",
    blurb:
      "What the scales mean and why temperature is really particle motion.",
    icon: "bi-thermometer-half",
    accent: "#ff6b35",
    sims: [
      {
        anchor: "thermometer",
        title: "Interactive Thermometer",
        name: "ThermometerSim",
        lesson: "Lesson 1",
        caption:
          "Drag the canvas or the slider, liquid, scale and particle speed all respond.",
      },
    ],
  },
  {
    id: "group-2",
    title: "Heat vs energy & how heat moves",
    blurb:
      "Conduction, convection and radiation, each with its own living model.",
    icon: "bi-fire",
    accent: "#ef4444",
    sims: [
      {
        anchor: "particles",
        title: "Cup vs Pool",
        name: "ParticleBoxSim",
        lesson: "Lesson 2",
        caption:
          "Cup vs pool: temperature is average energy, thermal energy is total energy.",
      },
      {
        anchor: "modes",
        title: "Heat Transfer Demo",
        name: "ModesOfHeatSim",
        lesson: "Lessons 3–4",
        caption:
          "The campfire scene: toggle conduction, convection and radiation one by one.",
      },
      {
        anchor: "conduction",
        title: "Conduction Rod",
        name: "ConductionSim",
        lesson: "Lesson 3",
        caption:
          "A real heat-equation rod, swap copper for foam and feel the k difference.",
      },
      {
        anchor: "convection-radiation",
        title: "Convection Pot & Thermal Radiation",
        name: "ConvectionRadiationSim",
        lesson: "Lesson 4",
        caption:
          "Convection loops in a pot; photon streams coloured by Wien's law.",
      },
    ],
  },
  {
    id: "group-3",
    title: "Counting heat",
    blurb:
      "Specific heat, calorimetry, phase changes and the electrical method.",
    icon: "bi-calculator",
    accent: "#6366f1",
    sims: [
      {
        anchor: "specific-heat",
        title: "Specific Heat Race",
        name: "SpecificHeatSim",
        lesson: "Lesson 5",
        caption:
          "Same burner, two materials, watch low-c metals sprint ahead on the T–t graph.",
      },
      {
        anchor: "calorimetry",
        title: "Calorimetry",
        name: "CalorimetrySim",
        lesson: "Lesson 6",
        caption:
          "Drop hot metal into water; add ice to trigger the famous three-case test.",
      },
      {
        anchor: "heating-curve",
        title: "Heating Curve of Water",
        name: "HeatingCurveSim",
        lesson: "Lesson 7",
        caption:
          "Ice → steam with plateaus that refuse to budge while bonds break.",
      },
      {
        anchor: "latent-heat",
        title: "Measuring Latent Heat",
        name: "LatentHeatSim",
        lesson: "Lesson 8",
        caption:
          "Measure L with a heater, and see why ignoring losses inflates your result.",
      },
    ],
  },
  {
    id: "group-4",
    title: "Gases",
    blurb: "Pressure from bouncing particles, and the three classic gas laws.",
    icon: "bi-balloon",
    accent: "#10b981",
    sims: [
      {
        anchor: "gas",
        title: "Gas Laws Piston",
        name: "GasLawSim",
        lesson: "Lesson 9",
        caption:
          "Isochoric, isobaric, isothermal or full ideal-gas mode with a live gauge.",
      },
    ],
  },
];
