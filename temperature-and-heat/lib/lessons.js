// ============================================================
// Lesson content, transcribed from CALPHY_FINALS_CONTENTS.pdf
// 9 lessons + the "∑ Heat Formulas" sheet, grouped into 4 units.
// ============================================================

export const UNITS = [
  {
    id: "unit-1",
    title: "Temperature & Heat",
    subtitle:
      "What temperature really measures, and how heat differs from it.",
    icon: "bi-thermometer-half",
    gradient: "linear-gradient(135deg,#ff6b35,#f7931e)",
    lessons: ["Lesson1", "Lesson2"],
  },
  {
    id: "unit-2",
    title: "How Heat Moves",
    subtitle:
      "Conduction, convection and radiation, the three modes of heat transfer.",
    icon: "bi-fire",
    gradient: "linear-gradient(135deg,#ef4444,#f97316)",
    lessons: ["Lesson3", "Lesson4"],
  },
  {
    id: "unit-3",
    title: "Heat Calculations",
    subtitle: "Specific heat, calorimetry, changes of state and latent heat.",
    icon: "bi-calculator",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    lessons: ["Lesson5", "Lesson6", "Lesson7", "Lesson8"],
  },
  {
    id: "unit-4",
    title: "Gases & Temperature",
    subtitle: "Gas laws and the kinetic model that explains them.",
    icon: "bi-balloon",
    gradient: "linear-gradient(135deg,#10b981,#0ea5e9)",
    lessons: ["Lesson9"],
  },
];

export const LESSONS = [
  // ============================== LESSON 1 ==============================
  {
    n: 1,
    key: "Lesson1",
    slug: "temperature-scales",
    title: "Temperature Scales",
    tagline:
      "Compare Celsius, Fahrenheit, and Kelvin, and convert between common temperature scales.",
    unit: "unit-1",
    icon: "bi-thermometer-half",
    accent: "#ff6b35",
    sim: "ThermometerSim",
    video: {
      id: "Va9OuzCcAyo",
      title: "Temperature Conversion of Kelvin, Celsius, Fahrenheit",
    },
    overview:
      "Temperature tells us how hot or cold something is. Everything is made of tiny particles that are always moving. The faster they move on average, the higher the temperature. Scientists use three scales, and you need to move between them easily.",
    objectives: [
      "Explain what temperature measures.",
      "Convert between °C, °F, and K.",
      "Choose the correct scale for a formula.",
    ],
    energyTrace: [
      "Measure a temperature",
      "Pick a scale (°C, °F, or K)",
      "Convert with the right formula",
    ],
    keyTerms: [
      {
        term: "Temperature",
        def: "a measure of the average kinetic energy of the particles in a substance.",
      },
      {
        term: "Thermometer",
        def: "a device that measures temperature using something that changes with it, like a liquid that expands.",
      },
      { term: "Celsius (°C)", def: "water freezes at 0 and boils at 100." },
      { term: "Fahrenheit (°F)", def: "water freezes at 32 and boils at 212." },
      { term: "Kelvin (K)", def: "the SI scale. It starts at absolute zero." },
      { term: "Absolute zero", def: "the lowest possible temperature, 0 K." },
      {
        term: "Thermal equilibrium",
        def: "two objects in contact stop exchanging heat because they are at the same temperature.",
      },
      {
        term: "Zeroth law of thermodynamics",
        def: "if A and B are each in thermal equilibrium with C, then A and B are in thermal equilibrium with each other.",
      },
    ],
    sections: [
      {
        heading: "How a thermometer works",
        paragraphs: [
          "A liquid-in-glass thermometer uses a liquid that expands when heated and rises in a thin tube. A digital thermometer measures how the electrical resistance of a tiny sensor changes. An infrared thermometer reads the infrared radiation an object gives off.",
          "They all work because of the zeroth law. The thermometer reaches equilibrium with the object, so its reading is the object's temperature.",
        ],
      },
      {
        heading: "The three scales",
        table: {
          headers: ["Scale", "Water freezes", "Water boils", "Absolute zero"],
          rows: [
            ["Celsius", "0 °C", "100 °C", "−273.15 °C"],
            ["Fahrenheit", "32 °F", "212 °F", "−459.67 °F"],
            ["Kelvin", "273.15 K", "373.15 K", "0 K"],
          ],
        },
      },
      {
        heading: "Common temperatures",
        table: {
          headers: ["Event", "Temperature"],
          rows: [
            ["Absolute zero", "0 K (−273.15 °C)"],
            ["Liquid nitrogen boils", "77 K (−196 °C)"],
            ["Room temperature", "about 293 to 298 K (20 to 25 °C)"],
            ["Human body", "about 310 K (37 °C, 98.6 °F)"],
            ["Surface of the Sun", "about 5,800 K"],
          ],
        },
      },
      {
        heading: "How to convert (steps)",
        steps: [
          "Find the scale you have and the scale you need.",
          "If you have °F, change it to °C first.",
          "Add 273.15 to go from °C to K. Subtract 273.15 to go from K to °C.",
          "Check your answer. Kelvin can never be negative.",
        ],
      },
      {
        heading: "Temperature changes (not temperatures)",
        paragraphs: [
          "A change of 1 K equals a change of 1 °C. A change of 1 °C equals a change of 1.8 °F. Δ means \u201Cchange in\u201D.",
        ],
        formulasInline: ["ΔK = Δ°C", "Δ°F = 1.8 × Δ°C"],
      },
      {
        heading: "Conditions: which scale should I use?",
        bullets: [
          "Use kelvin for gas laws, radiation, kinetic energy, and any \u201Ctwice as hot\u201D question.",
          "Use °C or K when only a temperature change matters, such as in Q = m × c × ΔT.",
          "Never put °C or °F into a formula that has T⁴ or a ratio of temperatures.",
          "Any value below −273.15 °C (0 K) is impossible.",
          "\u201CTwice as hot\u201D only works in kelvin: 300 K to 600 K, not 20 °C to 40 °C.",
        ],
      },
    ],
    formulas: [
      {
        title: "Celsius to Fahrenheit",
        lhs: "°F =",
        num: "",
        den: "",
        display: "°F = (1.8 × °C) + 32",
        inWords: "Multiply the Celsius value by 1.8, then add 32.",
        where: "°C = Celsius, °F = Fahrenheit",
      },
      {
        title: "Fahrenheit to Celsius",
        lhs: "°C =",
        num: "°F − 32",
        den: "1.8",
        inWords: "Subtract 32 from the Fahrenheit value, then divide by 1.8.",
        where: "°F = Fahrenheit, °C = Celsius",
      },
      {
        title: "Celsius to Kelvin",
        display: "K = °C + 273.15",
        inWords: "Add 273.15 to the Celsius value.",
        where: "K = kelvin",
      },
      {
        title: "Kelvin to Celsius",
        display: "°C = K − 273.15",
        inWords: "Subtract 273.15 from the kelvin value.",
        where: "K = kelvin",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Absolute zero", "0 K = −273.15 °C = −459.67 °F"],
        ["Water freezes", "273.15 K = 0 °C = 32 °F"],
        ["Water boils", "373.15 K = 100 °C = 212 °F"],
      ],
    },
    examples: [
      {
        title: "Example 1: Convert 35 °C to °F",
        steps: ["°F = (1.8 × 35) + 32", "°F = 63 + 32"],
        answer: "°F = 95 °F",
      },
      {
        title: "Example 2: Convert 350 °F to kelvin",
        steps: [
          "°C = (350 − 32) ÷ 1.8",
          "°C = 318 ÷ 1.8 = 176.67",
          "K = 176.67 + 273.15",
        ],
        answer: "K = 449.82 K",
      },
    ],
    watchOut: [
      "A temperature change does not use the +32 rule. A 10 °C rise is an 18 °F rise, not 42 °F.",
      "Write K, not °K.",
    ],
    checks: [
      {
        q: "Convert 25 °C to °F.",
        options: ["77 °F", "57 °F", "45 °F", "298 °F"],
        a: 0,
        explain: "(1.8 × 25) + 32 = 45 + 32 = 77 °F.",
      },
      {
        q: "Which is hotter, 300 K or 25 °C?",
        options: ["300 K", "25 °C", "They are equal", "Cannot be compared"],
        a: 0,
        explain: "300 K is 26.85 °C, so 300 K is hotter.",
      },
    ],
    takeaways: [
      "Temperature measures the average kinetic energy of particles.",
      "K = °C + 273.15 and °F = (1.8 × °C) + 32.",
      "Use kelvin whenever T⁴ or a ratio of temperatures appears.",
    ],
    quizSlug: "temperature-conversions",
  },

  // ============================== LESSON 2 ==============================
  {
    n: 2,
    key: "Lesson2",
    slug: "heat-and-temperature",
    title: "Heat and Temperature",
    tagline: "Learn how temperature differs from energy transferred as heat.",
    unit: "unit-1",
    icon: "bi-arrow-left-right",
    accent: "#f7931e",
    sim: "ParticleBoxSim",
    video: {
      id: "Me60Ti0E_rY",
      title: "Heat Transfer – Conduction, Convection and Radiation",
    },
    overview:
      "People often use \u201Cheat\u201D and \u201Ctemperature\u201D as if they mean the same thing. In physics they are different. Temperature describes how fast particles move on average. Heat is energy that moves between objects because of a temperature difference.",
    objectives: [
      "Tell the difference between temperature, thermal energy, and heat.",
      "Predict which way heat flows.",
      "Decide when adding heat does or does not change temperature.",
    ],
    energyTrace: [
      "Temperature difference",
      "Heat flows from hot to cold",
      "Equilibrium at equal temperature",
    ],
    keyTerms: [
      {
        term: "Heat (Q)",
        def: "energy that moves from a hotter object to a colder one.",
      },
      {
        term: "Thermal energy",
        def: "the total energy of all the particles in an object.",
      },
      { term: "Joule (J)", def: "the SI unit of heat and energy." },
      {
        term: "Calorie (cal)",
        def: "1 cal = 4.186 J. A food Calorie is 1 kcal = 4186 J.",
      },
      {
        term: "System and surroundings",
        def: "the object we study and everything around it.",
      },
      {
        term: "Isolated system",
        def: "a system where no energy enters or leaves.",
      },
    ],
    sections: [
      {
        heading: "Temperature, thermal energy, and heat compared",
        table: {
          headers: ["", "Temperature", "Thermal energy", "Heat"],
          rows: [
            [
              "What it is",
              "Average energy per particle",
              "Total energy of all particles",
              "Energy moving because of a temperature difference",
            ],
            ["Depends on the amount of matter?", "No", "Yes", "Yes"],
            ["Unit", "K, °C, °F", "J", "J"],
          ],
        },
      },
      {
        heading: "How heat flows (steps)",
        steps: [
          "Two objects at different temperatures touch.",
          "Heat flows from the hotter object to the colder one.",
          "The hotter object cools and the colder object warms.",
          "Flow stops at thermal equilibrium, when both have the same temperature.",
        ],
      },
      {
        heading: "Particles and temperature",
        paragraphs: [
          "For an ideal gas, the average kinetic energy of one particle is directly proportional to the absolute temperature. This is why we must use kelvin when we link temperature to energy.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "Heat flows only when there is a temperature difference. Same temperature means no net flow.",
          "At the same temperature, a larger object has more thermal energy.",
          "Temperature can change without heat. Rubbing your hands warms them through work.",
          "Heat can be added without a temperature change, during melting or boiling.",
          "Sign rule: Q is positive when an object absorbs heat and negative when it releases heat.",
          "Does adding heat always raise temperature? No. If there is no change of state, yes, use Q = m × c × ΔT. During melting or boiling, the temperature stays constant, use Q = m × L.",
        ],
      },
    ],
    formulas: [
      {
        title: "Energy units",
        display: "1 cal = 4.186 J   ·   1 kcal = 4186 J",
        inWords:
          "A calorie is 4.186 joules; a food Calorie (kcal) is 4186 joules.",
        where: "cal = calorie, J = joule",
      },
      {
        title: "Average kinetic energy of a gas particle",
        lhs: "KE_avg =",
        num: "3",
        den: "2",
        suffix: "× k_B × T",
        inWords:
          "The average energy of one particle is one and a half times k_B times the absolute temperature.",
        where:
          "KE_avg = average kinetic energy (J), k_B = 1.38 × 10⁻²³ J/K, T = temperature in kelvin.",
      },
      {
        title: "First law of thermodynamics",
        display: "ΔU = Q − W",
        inWords:
          "The change in thermal energy equals the heat added minus the work done by the system.",
        where:
          "ΔU = change in thermal energy (J), Q = heat added (J), W = work done by the system (J).",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["1 cal", "= 4.186 J"],
        ["1 kcal", "= 4186 J"],
        ["Boltzmann k_B", "= 1.38 × 10⁻²³ J/K"],
      ],
    },
    examples: [
      {
        title: "Example 1: Cup of water vs pool of water",
        steps: [
          "A 0.2 kg cup of water is at 90 °C. A pool holds 50 kg of water at 30 °C. How much energy raises each by 1 K? (c = 4186 J/kg·K)",
          "Cup: Q = 0.2 × 4186 × 1 = 837.2 J",
          "Pool: Q = 50 × 4186 × 1 = 209,300 J",
        ],
        answer:
          "The cup has the higher temperature, but the pool holds far more thermal energy.",
      },
      {
        title: "Example 2: Direction of heat flow",
        steps: [
          "Tea at 80 °C is poured into a cup at 25 °C.",
          "Compare: 80 °C is higher than 25 °C.",
          "Heat flows from the tea to the cup.",
          "The tea cools and the cup warms until both have the same temperature.",
        ],
        answer: "Heat flows tea → cup until thermal equilibrium.",
      },
    ],
    watchOut: [
      "Cold does not flow into your hand. Heat flows out of your hand.",
      "An object does not \u201Ccontain heat\u201D. Heat is energy in transit.",
    ],
    checks: [
      {
        q: "Does a pool at 30 °C have more thermal energy than a cup at 90 °C?",
        options: [
          "Yes, it has many more particles",
          "No, the cup is hotter",
          "They are equal",
          "It depends on the weather",
        ],
        a: 0,
        explain:
          "Thermal energy depends on the amount of matter. The pool has vastly more particles, so more total energy.",
      },
      {
        q: "Heat is added to ice that is melting at 0 °C. Does the temperature rise?",
        options: [
          "No, the energy breaks bonds between particles",
          "Yes, always",
          "Only if stirred",
          "Yes, but only by 1 K",
        ],
        a: 0,
        explain:
          "During a change of state the temperature stays constant; the energy goes into breaking bonds (Q = m × L).",
      },
    ],
    takeaways: [
      "Temperature is average particle energy. Heat is energy in transit.",
      "Heat flows from hot to cold until the temperatures are equal.",
      "During a change of state, heat is added but temperature stays the same.",
    ],
    quizSlug: "temperature-conversions",
  },

  // ============================== LESSON 3 ==============================
  {
    n: 3,
    key: "Lesson3",
    slug: "conduction",
    title: "Conduction",
    tagline: "Follow energy transfer through particle interactions in solids.",
    unit: "unit-2",
    icon: "bi-rulers",
    accent: "#ef4444",
    sim: "ConductionSim",
    video: {
      id: "9joLYfayee8",
      title: "Physics – Energy – Heat Transfer – Conduction",
    },
    overview:
      "Conduction is heat transfer through direct contact. When a metal spoon sits in hot soup, the handle slowly gets hot even though the metal does not move.",
    objectives: [
      "Explain how conduction works at the particle level.",
      "Calculate heat flow through one layer, layers in series, and layers in parallel.",
      "Explain why some materials are good conductors and others are good insulators.",
    ],
    energyTrace: [
      "Hot end vibrates faster",
      "Neighbors pass energy along",
      "Cold end warms",
    ],
    keyTerms: [
      {
        term: "Conduction",
        def: "heat transfer through direct contact between particles.",
      },
      {
        term: "Thermal conductivity (k)",
        def: "how well a material conducts heat, in W/m·K.",
      },
      { term: "Conductor / insulator", def: "a material with high k / low k." },
      { term: "Heat current (H)", def: "the rate of heat flow, in watts." },
      {
        term: "Temperature gradient (dT/dx)",
        def: "how fast temperature changes along a distance.",
      },
      {
        term: "Steady state",
        def: "the temperature at each point stops changing with time.",
      },
      {
        term: "Thermal resistance (R)",
        def: "how strongly a layer resists heat flow.",
      },
    ],
    sections: [
      {
        heading: "How conduction works (steps)",
        steps: [
          "The hot end has particles with more kinetic energy, so they vibrate harder.",
          "These particles bump into their neighbors and pass some energy along.",
          "In metals, free electrons also carry energy quickly, which is why metals conduct best.",
          "Energy moves down the object. The particles stay in place.",
          "This continues until the temperature is equal everywhere.",
        ],
      },
      {
        heading: "Why gases are poor conductors",
        paragraphs: [
          "The particles are far apart, so collisions are rare. Trapped air is a good insulator, which is why blankets, foam, and double-glazed windows work.",
        ],
      },
      {
        heading: "Why metal feels colder than wood",
        paragraphs: [
          "Both are at room temperature. Metal has a higher k, so it pulls heat out of your hand faster.",
        ],
      },
      {
        heading: "How to solve (steps)",
        steps: [
          "List k, A, L, and ΔT. Change cm to m and cm² to m².",
          "Decide if it is one layer, layers in series, or layers in parallel.",
          "Calculate H.",
          "For energy over a time, multiply H by t.",
          "For the temperature at a boundary, find H first, then use ΔT of a layer = H × R of that layer.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "A straight-line temperature drop only happens in steady state in a uniform material.",
          "Series: heat passes through one layer after another, like a wall with brick then insulation. Resistances add.",
          "Parallel: layers sit side by side with the same temperature difference, like a glass pane next to a wooden frame. Heat currents add.",
          "Doubling A doubles H. Doubling L halves H. Doubling ΔT doubles H.",
          "Higher k means a better conductor.",
        ],
      },
    ],
    formulas: [
      {
        title: "Rate of heat flow (main formula)",
        lhs: "H =",
        num: "k × A × ΔT",
        den: "L",
        inWords:
          "Heat flow gets bigger with a better conductor, a larger area, and a bigger temperature difference. It gets smaller when the material is longer or thicker.",
        where:
          "H = heat current (W), k = thermal conductivity (W/m·K), A = cross-sectional area (m²), ΔT = temperature difference between the ends (K), L = length or thickness (m).",
      },
      {
        title: "Calculus form",
        display: "H = −k × A × (dT/dx)",
        inWords:
          "Heat current equals k times area times how fast temperature changes along the distance. The minus sign means heat flows from hot to cold.",
        where: "dT/dx = temperature gradient (K/m).",
      },
      {
        title: "Energy over a time",
        display: "Q = H × t",
        inWords: "Multiply the heat current by the time to get total energy.",
        where: "Q = heat (J), t = time (s).",
      },
      {
        title: "Thermal resistance of one layer",
        lhs: "R =",
        num: "L",
        den: "k × A",
        inWords: "A bigger R means less heat flow.",
        where: "R = thermal resistance (K/W).",
      },
      {
        title: "Layers in series",
        lhs: "H =",
        num: "A × ΔT",
        den: "L₁/k₁ + L₂/k₂ + L₃/k₃ + …",
        inWords:
          "Divide each layer's thickness by its k, add them up, and use that total as the bottom of the fraction.",
        where: "Lᵢ = thickness of layer i, kᵢ = conductivity of layer i.",
      },
      {
        title: "Layers side by side (parallel)",
        display: "H_total = H₁ + H₂ + H₃ + …",
        inWords:
          "Find H for each layer with the main formula, then add them up.",
        where: "Same ΔT across every layer.",
      },
    ],
    constantsTable: {
      title: "Thermal conductivity k (W/m·K)",
      rows: [
        ["Copper", "401"],
        ["Aluminum", "237"],
        ["Steel", "50"],
        ["Glass", "0.8"],
        ["Brick", "0.7"],
        ["Wood", "0.12"],
        ["Foam", "0.04"],
        ["Air", "0.026"],
      ],
    },
    examples: [
      {
        title: "Example 1: Copper rod",
        steps: [
          "k = 401 W/m·K, A = 1 × 10⁻⁴ m², L = 0.5 m, ΔT = 100 K.",
          "H = 401 × (1 × 10⁻⁴) × 100 ÷ 0.5",
          "H = 4.01 ÷ 0.5",
        ],
        answer: "H = 8.02 W",
      },
      {
        title: "Example 2 (calculus)",
        steps: [
          "A rod has temperature T(x) = 100 − 80x (°C, x in meters), k = 200 W/m·K, A = 2 × 10⁻⁴ m².",
          "dT/dx = −80 K/m",
          "H = −(200) × (2 × 10⁻⁴) × (−80)",
        ],
        answer: "H = 3.2 W",
      },
      {
        title: "Example 3: Layers in series",
        steps: [
          "Brick (L = 0.1 m, k = 0.7) and foam (L = 0.05 m, k = 0.04). A = 10 m², ΔT = 20 K.",
          "0.1 ÷ 0.7 = 0.143",
          "0.05 ÷ 0.04 = 1.25",
          "Total = 0.143 + 1.25 = 1.393",
          "H = (10 × 20) ÷ 1.393",
        ],
        answer: "H = 144 W",
        note: "Heat per area = 14.36 W/m². Temperature drop across brick = 14.36 × 0.143 ≈ 2.05 K. Across foam = 14.36 × 1.25 ≈ 17.95 K. The insulation takes most of the drop.",
      },
      {
        title: "Example 4: Rods in parallel",
        steps: [
          "A copper rod (k = 401) and a steel rod (k = 50), each with A = 1 × 10⁻⁴ m², L = 0.5 m, ΔT = 100 K.",
          "H_copper = 401 × 1×10⁻⁴ × 100 ÷ 0.5 = 8.02 W",
          "H_steel = 50 × 1×10⁻⁴ × 100 ÷ 0.5 = 1.00 W",
        ],
        answer: "H_total = 8.02 + 1.00 = 9.02 W",
      },
    ],
    watchOut: [
      "Change cm to m before you calculate.",
      "In series, add resistances (L ÷ kA), not k values.",
    ],
    checks: [
      {
        q: "A rod's length is doubled with the same area and ΔT. What happens to H?",
        options: [
          "It is cut in half",
          "It doubles",
          "It stays the same",
          "It becomes one quarter",
        ],
        a: 0,
        explain: "H = kAΔT/L, doubling L halves H.",
      },
      {
        q: "A steel rod has k = 50, A = 2 × 10⁻⁴ m², L = 1 m, ΔT = 50 K. Find H.",
        options: ["0.5 W", "5 W", "50 W", "0.05 W"],
        a: 0,
        explain: "(50 × 2×10⁻⁴ × 50) ÷ 1 = 0.5 W.",
      },
    ],
    takeaways: [
      "Conduction passes energy from particle to particle without bulk movement.",
      "Higher k, larger A, bigger ΔT, and shorter L all increase heat flow.",
      "Insulators have low k, so they slow heat flow.",
    ],
    quizSlug: "heat-transfer-modes",
  },

  // ============================== LESSON 4 ==============================
  {
    n: 4,
    key: "Lesson4",
    slug: "convection-and-radiation",
    title: "Convection and Radiation",
    tagline:
      "Compare energy transfer by moving fluids and electromagnetic waves.",
    unit: "unit-2",
    icon: "bi-broadcast",
    accent: "#f59e0b",
    sim: "ConvectionRadiationSim",
    video: {
      id: "Me60Ti0E_rY",
      title: "Heat Transfer – Conduction, Convection and Radiation",
    },
    overview:
      "Heat can also travel by being carried in a moving fluid (convection) or by electromagnetic waves (radiation). Radiation is the only mode that works in empty space.",
    objectives: [
      "Explain how convection currents and thermal radiation work.",
      "Calculate convective heat flow, cooling over time, radiated power, and peak wavelength.",
      "Decide whether a situation is conduction, convection, or radiation.",
    ],
    energyTrace: [
      "Heat source warms fluid or emits waves",
      "Fluid circulates or waves travel",
      "Energy reaches a cooler object",
    ],
    keyTerms: [
      {
        term: "Convection",
        def: "heat transfer by the movement of a fluid (liquid or gas).",
      },
      {
        term: "Natural convection",
        def: "movement caused by density differences.",
      },
      { term: "Forced convection", def: "movement caused by a fan or pump." },
      {
        term: "Convection current",
        def: "the loop of rising warm fluid and sinking cool fluid.",
      },
      {
        term: "Radiation",
        def: "heat transfer by electromagnetic waves, mostly infrared. It needs no material.",
      },
      { term: "Blackbody", def: "a perfect absorber and emitter." },
      {
        term: "Emissivity (e)",
        def: "how well a surface radiates compared with a blackbody, from 0 to 1.",
      },
    ],
    sections: [
      {
        heading: "How convection works (steps)",
        steps: [
          "Fluid near a heat source gains energy and its particles spread apart.",
          "The fluid becomes less dense and is pushed upward.",
          "Cooler, denser fluid sinks to take its place.",
          "This forms a loop that carries heat through the fluid.",
        ],
        paragraphs: [
          "Examples: boiling water, sea breeze, warm air above a stove, a hot air balloon, ocean currents.",
        ],
      },
      {
        heading: "How radiation works (steps)",
        steps: [
          "Every object above 0 K has moving charged particles.",
          "These particles give off electromagnetic waves, mostly infrared.",
          "The waves travel at the speed of light, even through empty space.",
          "When the waves hit another object, the energy is absorbed and the object warms.",
          "The hotter object emits more energy, so net heat flows from hot to cold.",
        ],
        paragraphs: [
          "Examples: sunlight, a campfire warming your face, an infrared heater, a thermal camera.",
        ],
      },
      {
        heading: "How to tell the three modes apart",
        steps: [
          "Is there any material between the two places? If not, it is radiation.",
          "If there is material, is the material itself moving and carrying the heat? If yes, it is convection.",
          "If the material is not moving and heat passes from particle to particle, it is conduction.",
        ],
        table: {
          headers: ["Clue", "Mode"],
          rows: [
            ["Solids touching, a metal handle or rod", "Conduction"],
            ["Rising warm air, boiling water, a breeze", "Convection"],
            [
              "Sunlight, a glowing heater, \u201Cthrough a vacuum\u201D",
              "Radiation",
            ],
          ],
        },
        paragraphs: [
          "A hot cup of tea uses all three: conduction through the cup wall, convection in the tea and the air, and radiation from the surface.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "Natural convection needs gravity. In weightlessness it almost stops.",
          "Heating a fluid from below makes strong circulation. Heating from above makes very little.",
          "Newton's cooling works best for small temperature differences. For very hot objects, radiation takes over.",
          "If the absolute temperature doubles, radiated power becomes 16 times larger.",
          "Dark, matte surfaces absorb and emit well. Shiny surfaces do not.",
          "Hotter objects emit shorter wavelengths: red, then white, then blue-white.",
        ],
      },
    ],
    formulas: [
      {
        title: "Convection: surface ↔ fluid",
        display: "H = h × A × ΔT",
        inWords:
          "Heat flow equals the convection coefficient times the surface area times the temperature difference.",
        where:
          "H = heat current (W), h = convection coefficient (W/m²·K), A = surface area (m²), ΔT = surface temperature minus fluid temperature (K).",
      },
      {
        title: "Newton's law of cooling",
        display: "T(t) = T_s + (T₀ − T_s) × e^(−k × t)",
        inWords:
          "The object's temperature moves toward the surroundings. The starting difference shrinks over time.",
        where:
          "T(t) = temperature at time t, T_s = surroundings temperature, T₀ = starting temperature, k = cooling constant, t = time, e = 2.718.",
      },
      {
        title: "Time to reach a certain temperature",
        display: "ratio = (T₀ − T_s) ÷ (T − T_s),   t = ln(ratio) ÷ k",
        inWords:
          "Divide the starting difference by the remaining difference, take the natural log, then divide by k.",
        where: "Same symbols as Newton's law of cooling.",
      },
      {
        title: "Radiation: power emitted",
        display: "P = e × σ × A × T⁴",
        inWords:
          "Power depends on the surface type, the area, and the absolute temperature raised to the fourth power.",
        where:
          "P = power (W), e = emissivity (0–1), σ = 5.67 × 10⁻⁸ W/m²·K⁴, A = area (m²), T = temperature in kelvin.",
      },
      {
        title: "Radiation: net power with surroundings",
        display: "P_net = e × σ × A × (T⁴ − T_s⁴)",
        inWords:
          "Power given out minus power taken in from the surroundings. Both temperatures must be in kelvin.",
        where: "T = object (K), T_s = surroundings (K).",
      },
      {
        title: "Wien's law: peak wavelength",
        lhs: "λ_max =",
        num: "b",
        den: "T",
        inWords: "Divide Wien's constant by the absolute temperature.",
        where:
          "λ_max = peak wavelength (m), b = 2.898 × 10⁻³ m·K, T = temperature in kelvin.",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Stefan-Boltzmann constant σ", "5.67 × 10⁻⁸ W/m²·K⁴"],
        ["Wien's constant b", "2.898 × 10⁻³ m·K"],
        ["Emissivity e, black matte surface", "about 0.95 to 1"],
        ["Emissivity e, human skin", "0.97"],
        ["Emissivity e, polished aluminum", "about 0.05"],
      ],
    },
    examples: [
      {
        title: "Example 1: Coffee cooling",
        steps: [
          "T₀ = 90 °C, T_s = 20 °C, k = 0.05 per minute. After 10 minutes:",
          "T = 20 + (90 − 20) × e^(−0.05 × 10)",
          "T = 20 + 70 × e^(−0.5)",
          "T = 20 + 70 × 0.6065",
        ],
        answer: "T = 62.5 °C",
        note: "Time to reach 40 °C: ratio = (90 − 20) ÷ (40 − 20) = 3.5, t = (1 ÷ 0.05) × ln(3.5) = 20 × 1.2528 = 25.1 minutes.",
      },
      {
        title: "Example 2: Radiation from a black object",
        steps: [
          "e = 1, A = 1 m². At 300 K:",
          "P = 1 × (5.67 × 10⁻⁸) × 1 × (300)⁴",
          "P = (5.67 × 10⁻⁸) × (8.1 × 10⁹)",
        ],
        answer: "P = 459 W   ·   at 600 K (doubled T): P = 459 × 16 = 7,348 W",
      },
      {
        title: "Example 3: Human body",
        steps: [
          "e = 0.97, A = 1.5 m², skin 306 K, surroundings 293 K.",
          "e × σ × A = 0.97 × (5.67 × 10⁻⁸) × 1.5 = 8.25 × 10⁻⁸",
          "T⁴ − T_s⁴ = (306)⁴ − (293)⁴ = 1.398 × 10⁹",
          "P_net = (8.25 × 10⁻⁸) × (1.398 × 10⁹)",
        ],
        answer: "P_net = 115 W",
      },
      {
        title: "Example 4: Wien's law",
        steps: [
          "Sun (5,800 K): λ = 2.898×10⁻³ ÷ 5800 = 5.0 × 10⁻⁷ m = 500 nm (visible light)",
          "Human body (310 K): λ = 2.898×10⁻³ ÷ 310 = 9.35 × 10⁻⁶ m = 9.35 μm (infrared)",
        ],
        answer: "This is why infrared cameras can see people in the dark.",
      },
    ],
    watchOut: [
      "Use kelvin in T⁴.",
      "For net radiation, do not forget the T_s term.",
    ],
    checks: [
      {
        q: "How does the Sun's heat reach Earth?",
        options: [
          "By radiation, space is empty",
          "By convection",
          "By conduction",
          "It does not",
        ],
        a: 0,
        explain: "Radiation is the only mode that works through a vacuum.",
      },
      {
        q: "The absolute temperature of a hot object doubles. What happens to its radiated power?",
        options: [
          "It becomes 16 times larger",
          "It doubles",
          "It becomes 4 times larger",
          "It stays the same",
        ],
        a: 0,
        explain: "P ∝ T⁴, so 2⁴ = 16 times.",
      },
      {
        q: "Warm air rises above a stove. Which mode is this?",
        options: ["Convection", "Conduction", "Radiation", "Insulation"],
        a: 0,
        explain: "A moving fluid (air) carries the heat, that is convection.",
      },
    ],
    takeaways: [
      "Convection needs a moving fluid. Radiation needs no material.",
      "Radiated power depends on T⁴, so small increases in temperature matter a lot.",
      "Most real situations use more than one mode of heat transfer.",
    ],
    quizSlug: "heat-transfer-modes",
  },

  // ============================== LESSON 5 ==============================
  {
    n: 5,
    key: "Lesson5",
    slug: "specific-heat-capacity",
    title: "Specific Heat Capacity",
    tagline: "Calculate how much energy changes a temperature.",
    unit: "unit-3",
    icon: "bi-cup-hot",
    accent: "#0ea5e9",
    sim: "SpecificHeatSim",
    video: {
      id: "GNelfJ6IAJw",
      title: "Specific heat capacity | Khan Academy",
    },
    overview:
      "Different materials need different amounts of heat to change temperature. Water heats slowly while metal heats quickly. This property is called specific heat capacity.",
    objectives: [
      "Define specific heat and heat capacity.",
      "Calculate heat using Q = m × c × ΔT, and use integration when c changes with temperature.",
      "Compare materials using their specific heat values.",
    ],
    energyTrace: [
      "Energy is added",
      "The material responds based on c",
      "Temperature rises by ΔT = Q ÷ (m × c)",
    ],
    keyTerms: [
      {
        term: "Specific heat (c)",
        def: "the heat needed to raise 1 kg of a material by 1 K, in J/kg·K.",
      },
      {
        term: "Heat capacity (C)",
        def: "the heat needed to raise the whole object by 1 K, in J/K.",
      },
      {
        term: "Molar heat capacity",
        def: "the heat needed to raise 1 mole by 1 K.",
      },
      { term: "ΔT", def: "final temperature minus initial temperature." },
    ],
    sections: [
      {
        heading: "Why water is special",
        paragraphs: [
          "Water has a very high specific heat. It takes a lot of energy to warm it and it releases a lot when it cools. This is why the sea stays cool on a sunny afternoon while the sand burns your feet, and why coastal places have milder weather.",
        ],
      },
      {
        heading: "How to solve (steps)",
        steps: [
          "Check that the material stays in one phase. No melting or boiling.",
          "Change mass to kilograms (grams × 0.001).",
          "Find ΔT = final temperature − initial temperature.",
          "Choose c for the correct material and phase.",
          "Calculate Q = m × c × ΔT. A negative Q means heat is released.",
          "If c is given as a formula of T, integrate.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "Use Q = m × c × ΔT only inside one phase. If water crosses 0 °C or 100 °C, split the problem into steps.",
          "A lower c means a bigger temperature change for the same heat.",
          "For ΔT, °C and K give the same number.",
          "If c is given as a formula of temperature, use the integral.",
        ],
      },
    ],
    formulas: [
      {
        title: "Heat needed to change temperature",
        display: "Q = m × c × ΔT",
        inWords:
          "Heat equals the mass times the specific heat times the temperature change.",
        where:
          "Q = heat (J), m = mass (kg), c = specific heat (J/kg·K), ΔT = temperature change (K or °C).",
      },
      {
        title: "Temperature change",
        display: "ΔT = T_final − T_initial",
        inWords: "A positive ΔT means heating. A negative ΔT means cooling.",
        where: "T in °C or K.",
      },
      {
        title: "Finding the specific heat",
        lhs: "c =",
        num: "Q",
        den: "m × ΔT",
        inWords: "Divide the heat by mass times temperature change.",
        where: "c in J/kg·K.",
      },
      {
        title: "Finding the temperature change",
        lhs: "ΔT =",
        num: "Q",
        den: "m × c",
        inWords: "Divide the heat by mass times specific heat.",
        where: "ΔT in K (same number in °C).",
      },
      {
        title: "Heat capacity of a whole object",
        display: "C = m × c",
        inWords:
          "The object's heat capacity is its mass times its specific heat.",
        where: "C = heat capacity (J/K).",
      },
      {
        title: "When c changes with temperature",
        display: "Q = m × ∫ c(T) dT   (from T₁ to T₂)",
        inWords:
          "Add up the heat for each tiny temperature step from the starting temperature T₁ to the final temperature T₂.",
        where: "c(T) = specific heat as a function of temperature.",
      },
      {
        title: "Gases (per mole)",
        display: "C_P = C_V + R",
        inWords:
          "Monatomic gas: C_V = (3/2)R = 12.47 J/mol·K. Diatomic gas: C_V = (5/2)R = 20.79 J/mol·K.",
        where: "R = 8.314 J/mol·K.",
      },
    ],
    constantsTable: {
      title: "Specific heat c (J/kg·K)",
      rows: [
        ["Water", "4186"],
        ["Ice", "2090"],
        ["Steam", "2010"],
        ["Aluminum", "900"],
        ["Glass", "840"],
        ["Iron", "450"],
        ["Copper", "385"],
        ["Lead", "128"],
      ],
    },
    examples: [
      {
        title: "Example 1: Warm 2 kg of water from 20 °C to 80 °C",
        steps: ["ΔT = 80 − 20 = 60 K", "Q = 2 × 4186 × 60"],
        answer: "Q = 502,320 J",
      },
      {
        title: "Example 2: Water vs aluminum",
        steps: [
          "0.2 kg of aluminum goes from 25 °C to 75 °C: Q = 0.2 × 900 × 50 = 9,000 J",
          "Same heat in 0.2 kg of water: ΔT = 9,000 ÷ (0.2 × 4186)",
        ],
        answer: "ΔT = 10.75 K",
        note: "The aluminum warms 50 K, but the water warms only 10.75 K.",
      },
      {
        title: "Example 3: Find the temperature change",
        steps: [
          "12,000 J is absorbed by 0.4 kg of copper.",
          "ΔT = 12,000 ÷ (0.4 × 385)",
          "ΔT = 12,000 ÷ 154",
        ],
        answer: "ΔT = 77.9 K",
      },
      {
        title: "Example 4: Find an unknown material",
        steps: [
          "3,600 J raises 0.2 kg of a sample from 20 °C to 60 °C.",
          "ΔT = 60 − 20 = 40 K",
          "c = 3,600 ÷ (0.2 × 40)",
          "c = 450 J/kg·K",
        ],
        answer: "The material is iron.",
      },
      {
        title: "Example 5 (calculus)",
        steps: [
          "c(T) = 400 + 0.5T, m = 2 kg, from 300 K to 400 K.",
          "Q = 2 × ∫ (400 + 0.5T) dT from 300 to 400",
          "Q = 2 × [ 400T + 0.25T² ] from 300 to 400",
          "At 400 K: 400(400) + 0.25(160,000) = 200,000",
          "At 300 K: 400(300) + 0.25(90,000) = 142,500",
          "Q = 2 × (200,000 − 142,500)",
        ],
        answer: "Q = 115,000 J",
      },
    ],
    watchOut: [
      "Do not use the c of liquid water for ice or steam.",
      "Change grams to kilograms.",
    ],
    checks: [
      {
        q: "How much heat warms 0.5 kg of water from 20 °C to 100 °C?",
        options: ["167,440 J", "83,720 J", "209,300 J", "334,000 J"],
        a: 0,
        explain: "0.5 × 4186 × 80 = 167,440 J.",
      },
      {
        q: "The same heat is added to 1 kg of aluminum and 1 kg of water. Which one gets hotter?",
        options: [
          "Aluminum, because it has a lower c",
          "Water, because it has a higher c",
          "Both equally",
          "Cannot be determined",
        ],
        a: 0,
        explain:
          "A lower c means a bigger temperature change for the same heat.",
      },
    ],
    takeaways: [
      "Q = m × c × ΔT works inside one phase.",
      "A high c means slow heating and slow cooling.",
      "If c changes with temperature, integrate.",
    ],
    quizSlug: "specific-heat",
  },

  // ============================== LESSON 6 ==============================
  {
    n: 6,
    key: "Lesson6",
    slug: "calorimetry",
    title: "Calorimetry",
    tagline:
      "Use heat exchange to find final temperatures and unknown specific heats.",
    unit: "unit-3",
    icon: "bi-beaker",
    accent: "#6366f1",
    sim: "CalorimetrySim",
    video: {
      id: "RFvXY7QxwBs",
      title: "Phase Change & Latent Heat | Physics Tutorial",
    },
    overview:
      "Calorimetry measures heat exchange. When a hot object and a cold object are put together in an insulated container, the heat lost by the hot one equals the heat gained by the cold one.",
    objectives: [
      "Set up a heat balance equation.",
      "Find a final temperature or an unknown specific heat.",
      "Decide what happens when ice is mixed with warm water.",
    ],
    energyTrace: [
      "Hot object meets cold object",
      "Heat lost equals heat gained",
      "Both reach one final temperature",
    ],
    keyTerms: [
      {
        term: "Calorimeter",
        def: "an insulated container used to measure heat exchange.",
      },
      {
        term: "Isolated system",
        def: "a system that loses no heat to the surroundings.",
      },
      {
        term: "Final (equilibrium) temperature",
        def: "the temperature all objects share at the end.",
      },
      {
        term: "Calorimeter constant",
        def: "the heat capacity of the cup itself.",
      },
    ],
    sections: [
      {
        heading: "How to solve (steps)",
        steps: [
          "List each object with its mass, specific heat, and starting temperature.",
          "Check if any melting or boiling could happen (ice or steam).",
          "Write: heat lost by the hot object = heat gained by the cold object.",
          "Solve for the final temperature, or for an unknown c.",
          "Check that the final temperature is between the lowest and highest starting temperatures.",
        ],
      },
      {
        heading: "Ice and warm water: test first",
        steps: [
          "The water cannot warm the ice to 0 °C. Everything ends below 0 °C as ice.",
          "The water can warm the ice but not melt all of it. The final temperature is exactly 0 °C with ice and water together.",
          "The water can melt all the ice. The final temperature is above 0 °C.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "The method assumes no heat escapes to the surroundings.",
          "If the final temperature is outside the starting range, there is a mistake.",
          "If both objects are the same substance, c cancels out.",
        ],
      },
    ],
    formulas: [
      {
        title: "Heat balance",
        display: "Heat lost by hot objects = Heat gained by cold objects",
        inWords:
          "In an isolated system the losses and gains are equal in size.",
        where: "All Q in joules.",
      },
      {
        title: "Heat for each object",
        display: "Q = m × c × (T_f − T_i)",
        inWords:
          "Use the final temperature minus that object's initial temperature, so signs work out automatically.",
        where:
          "T_f = final temperature, T_i = initial temperature of that object.",
      },
      {
        title: "Same equation, written as a sum",
        display: "Q₁ + Q₂ + Q₃ + … = 0",
        inWords:
          "If every object uses (T_f − T_i), the gains and losses add up to zero.",
        where: "Qᵢ = heat of object i.",
      },
      {
        title: "Final temperature (no state change)",
        lhs: "T_f =",
        num: "(m₁ × c₁ × T₁) + (m₂ × c₂ × T₂) + …",
        den: "(m₁ × c₁) + (m₂ × c₂) + …",
        inWords: "Weight each starting temperature by m × c.",
        where: "T in °C, m in kg, c in J/kg·K.",
      },
      {
        title: "Ice + water: heat needed to melt all the ice",
        display: "Q_needed = m_ice × c_ice × (0 − T_ice) + m_ice × L_f",
        inWords: "Warm the ice to 0 °C, then melt it.",
        where: "L_f = 3.34 × 10⁵ J/kg.",
      },
      {
        title: "Ice + water: heat the water can give",
        display: "Q_available = m_water × c_water × (T_water − 0)",
        inWords:
          "The most the water can release by cooling to 0 °C. If Q_available > Q_needed, all the ice melts and T_f > 0 °C. If smaller, some ice remains and T_f = 0 °C.",
        where: "c_water = 4186 J/kg·K.",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Latent heat of fusion of water L_f", "3.34 × 10⁵ J/kg"],
        ["(plus the specific heat table from Lesson 5)", ""],
      ],
    },
    examples: [
      {
        title: "Example 1: Copper in water",
        steps: [
          "Copper: 0.1 kg at 100 °C, c = 385. Water: 0.2 kg at 20 °C, c = 4186.",
          "0.1 × 385 × (100 − T) = 0.2 × 4186 × (T − 20)",
          "38.5 × (100 − T) = 837.2 × (T − 20)",
          "3850 − 38.5T = 837.2T − 16,744",
          "3850 + 16,744 = 837.2T + 38.5T",
          "20,594 = 875.7T",
        ],
        answer: "T = 23.5 °C",
      },
      {
        title: "Example 2: Find an unknown c",
        steps: [
          "0.15 kg of metal at 100 °C goes into 0.2 kg of water at 20 °C. The final temperature is 25 °C.",
          "Heat gained by water = 0.2 × 4186 × (25 − 20) = 4,186 J",
          "Heat lost by metal = 0.15 × c × (100 − 25) = 11.25 × c",
          "c = 4,186 ÷ 11.25",
        ],
        answer: "c = 372 J/kg·K (close to copper)",
      },
      {
        title: "Example 3: Ice melts completely",
        steps: [
          "0.05 kg of ice at −10 °C goes into 0.2 kg of water at 30 °C.",
          "Q_needed = 0.05 × 2090 × 10 + 0.05 × 334,000 = 1,045 + 16,700 = 17,745 J",
          "Q_available = 0.2 × 4186 × 30 = 25,116 J",
          "25,116 > 17,745, so all the ice melts.",
          "837.2 × (30 − T) = 17,745 + (0.05 × 4186 × T)",
          "25,116 − 837.2T = 17,745 + 209.3T",
          "7,371 = 1,046.5T",
        ],
        answer: "T = 7.0 °C",
      },
      {
        title: "Example 4: Not all the ice melts",
        steps: [
          "0.2 kg of ice at 0 °C goes into 0.1 kg of water at 20 °C.",
          "Q_available = 0.1 × 4186 × 20 = 8,372 J",
          "Q_needed to melt all = 0.2 × 334,000 = 66,800 J",
          "8,372 < 66,800, so some ice stays.",
          "Mass melted = 8,372 ÷ 334,000 = 0.025 kg = 25 g",
        ],
        answer: "Final temperature = 0 °C, with about 175 g of ice left.",
      },
    ],
    watchOut: [
      "Use (T_f − T_i) for every object to keep the signs right.",
      "Do not forget latent heat when ice or steam is involved.",
    ],
    checks: [
      {
        q: "0.05 kg of water at 80 °C is mixed with 0.15 kg of water at 20 °C. Find the final temperature.",
        options: ["35 °C", "50 °C", "25 °C", "65 °C"],
        a: 0,
        explain: "(0.05 × 80 + 0.15 × 20) ÷ 0.20 = 35 °C.",
      },
      {
        q: "Why check three cases when mixing ice and water?",
        options: [
          "Melting takes a large amount of energy, so the ice might not melt completely",
          "Ice can explode",
          "Water might freeze instantly",
          "The container might break",
        ],
        a: 0,
        explain:
          "L_f is huge (3.34 × 10⁵ J/kg), so the outcome depends on how much energy the water can supply.",
      },
    ],
    takeaways: [
      "In an isolated system, heat lost equals heat gained.",
      "The final temperature lies between the starting temperatures.",
      "With ice or steam, check for a change of state before using only m × c × ΔT.",
    ],
    quizSlug: "specific-heat",
  },

  // ============================== LESSON 7 ==============================
  {
    n: 7,
    key: "Lesson7",
    slug: "changes-of-state",
    title: "Changes of State",
    tagline:
      "Follow the heating curve and find the energy for melting and boiling.",
    unit: "unit-3",
    icon: "bi-snow",
    accent: "#8b5cf6",
    sim: "HeatingCurveSim",
    video: {
      id: "RFvXY7QxwBs",
      title: "Phase Change & Latent Heat | Physics Tutorial",
    },
    overview:
      "Matter can be a solid, liquid, or gas. When enough heat is added or removed, a substance changes state. During the change, the temperature stays constant.",
    objectives: [
      "Describe each change of state and the energy involved.",
      "Read and build a heating curve.",
      "Choose between Q = m × c × ΔT and Q = m × L.",
    ],
    energyTrace: [
      "Energy added at the melting or boiling point",
      "Bonds break and temperature stays flat",
      "The substance changes phase",
    ],
    keyTerms: [
      {
        term: "Melting and freezing",
        def: "solid to liquid, and liquid to solid.",
      },
      {
        term: "Vaporization and condensation",
        def: "liquid to gas, and gas to liquid.",
      },
      { term: "Sublimation", def: "solid directly to gas, such as dry ice." },
      {
        term: "Melting point and boiling point",
        def: "the temperatures where these changes happen at a given pressure.",
      },
      {
        term: "Latent heat",
        def: "energy absorbed or released during a state change with no temperature change.",
      },
      {
        term: "Heating curve",
        def: "a graph of temperature against heat added. Flat parts are state changes.",
      },
      {
        term: "Evaporation vs boiling",
        def: "evaporation happens at the surface at any temperature. Boiling happens throughout the liquid at the boiling point.",
      },
    ],
    sections: [
      {
        heading: "Why the temperature stays flat",
        paragraphs: [
          "The energy added goes into breaking the bonds between particles, not into making them move faster. Average kinetic energy does not change, so the temperature does not change.",
        ],
      },
      {
        heading: "The heating curve of water (steps)",
        steps: [
          "Ice warms to 0 °C.",
          "Ice melts at 0 °C. The temperature stays at 0 °C.",
          "Water warms from 0 °C to 100 °C.",
          "Water boils at 100 °C. The temperature stays at 100 °C.",
          "Steam warms above 100 °C.",
        ],
      },
      {
        heading: "Which formula for which part?",
        table: {
          headers: ["Part of the curve", "Formula to use"],
          rows: [
            ["Ice warms to 0 °C", "Q₁ = m × c_ice × ΔT"],
            ["Ice melts", "Q₂ = m × L_f"],
            ["Water warms to 100 °C", "Q₃ = m × c_water × ΔT"],
            ["Water boils", "Q₄ = m × L_v"],
            ["Steam warms", "Q₅ = m × c_steam × ΔT"],
          ],
        },
      },
      {
        heading: "Conditions",
        bullets: [
          "Temperature changes inside one phase: use m × c × ΔT.",
          "Temperature stays constant while the state changes: use m × L.",
          "Water at 1 atm: below 0 °C solid, at 0 °C solid and liquid together, from 0 to 100 °C liquid, at 100 °C liquid and gas together, above 100 °C gas.",
          "Heat is absorbed when melting or vaporizing. Heat is released when freezing or condensing.",
          "The boiling point depends on pressure. It is lower on a mountain and higher in a pressure cooker.",
        ],
      },
    ],
    formulas: [
      {
        title: "Inside one phase (temperature changes)",
        display: "Q = m × c × ΔT",
        inWords: "Use while the substance stays solid, liquid, or gas.",
        where: "c = specific heat of that phase.",
      },
      {
        title: "During a change of state",
        display: "Q = m × L",
        inWords: "The temperature stays the same while bonds break or form.",
        where: "Q = heat (J), m = mass (kg), L = latent heat (J/kg).",
      },
      {
        title: "Total heat for a full heating curve",
        display: "Q_total = Q₁ + Q₂ + Q₃ + Q₄ + Q₅",
        inWords: "Add the energy of every segment of the curve.",
        where: "See \u201CWhich formula for which part?\u201D table.",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Latent heat of fusion of water", "L_f = 3.34 × 10⁵ J/kg"],
        ["Latent heat of vaporization of water", "L_v = 2.26 × 10⁶ J/kg"],
        ["Specific heat of ice", "2090 J/kg·K"],
        ["Specific heat of water", "4186 J/kg·K"],
        ["Specific heat of steam", "2010 J/kg·K"],
        ["Ethanol boils at", "about 78 °C"],
        ["Nitrogen boils at", "77 K"],
        ["Dry ice sublimes at", "about −78.5 °C (1 atm)"],
      ],
    },
    examples: [
      {
        title: "Example 1: 0.1 kg of ice at −10 °C to steam at 110 °C",
        steps: [
          "Q₁ = 0.1 × 2090 × 10 = 2,090 J",
          "Q₂ = 0.1 × 334,000 = 33,400 J",
          "Q₃ = 0.1 × 4186 × 100 = 41,860 J",
          "Q₄ = 0.1 × 2,260,000 = 226,000 J",
          "Q₅ = 0.1 × 2010 × 10 = 2,010 J",
        ],
        answer: "Q_total = 305,360 J",
        note: "Boiling takes about 74% of the total energy.",
      },
      {
        title: "Example 2: Why steam burns more",
        steps: [
          "10 g of steam at 100 °C condenses and cools to 40 °C on skin.",
          "Condensing: Q = 0.01 × 2,260,000 = 22,600 J",
          "Cooling: Q = 0.01 × 4186 × 60 = 2,512 J",
          "Total from steam = 25,112 J vs boiling water cooling to 40 °C = 2,512 J",
        ],
        answer: "Steam gives about 10 times more energy.",
      },
    ],
    watchOut: [
      "Do not use m × c × ΔT while a substance is melting or boiling.",
      "If the range crosses 0 °C or 100 °C, do not skip a step.",
    ],
    checks: [
      {
        q: "How much heat melts 0.3 kg of ice at 0 °C?",
        options: ["100,200 J", "33,400 J", "678,000 J", "334,000 J"],
        a: 0,
        explain: "0.3 × 334,000 = 100,200 J.",
      },
      {
        q: "Why does the temperature stay at 100 °C while water boils?",
        options: [
          "The energy breaks bonds between particles instead of increasing their kinetic energy",
          "The thermometer is broken",
          "The fire gets weaker",
          "Water stops absorbing heat",
        ],
        a: 0,
        explain:
          "During a state change all added energy goes into latent heat, not kinetic energy.",
      },
    ],
    takeaways: [
      "Temperature stays constant during a change of state.",
      "Use m × c × ΔT inside one phase and m × L during a change of state.",
      "Boiling needs far more energy than melting.",
    ],
    quizSlug: "latent-heat-states",
  },

  // ============================== LESSON 8 ==============================
  {
    n: 8,
    key: "Lesson8",
    slug: "specific-latent-heat",
    title: "Specific Latent Heat",
    tagline:
      "Find the energy needed to melt or boil a mass and learn how L is measured.",
    unit: "unit-3",
    icon: "bi-lightning-charge",
    accent: "#ec4899",
    sim: "LatentHeatSim",
    video: {
      id: "dxtz2POUTJE",
      title: "Latent Heat of Fusion and Vaporization",
    },
    overview:
      "Specific latent heat tells us how much energy is needed to change the state of 1 kg of a substance without changing its temperature.",
    objectives: [
      "Define specific latent heat of fusion and vaporization.",
      "Use Q = m × L together with Q = P × t.",
      "Describe an experiment to measure L.",
    ],
    energyTrace: [
      "A heater supplies known energy",
      "A mass changes phase",
      "L = Q ÷ m",
    ],
    keyTerms: [
      {
        term: "Specific latent heat (L)",
        def: "energy needed per kilogram to change state, in J/kg.",
      },
      {
        term: "Specific latent heat of fusion (L_f)",
        def: "for melting or freezing.",
      },
      {
        term: "Specific latent heat of vaporization (L_v)",
        def: "for boiling or condensing.",
      },
      {
        term: "Electrical method",
        def: "using a heater of known power to supply energy so L can be measured.",
      },
      {
        term: "Efficiency",
        def: "useful energy divided by the energy supplied.",
      },
    ],
    sections: [
      {
        heading: "How to measure L (steps)",
        steps: [
          "Place an electric heater in the substance at its melting or boiling point.",
          "Record the power and the time the heater is on.",
          "Measure the mass that changed state.",
          "Calculate L from the energy and the mass.",
          "Repeat without the heater to measure heat gained from the room and subtract it.",
        ],
      },
      {
        heading: "Why L_v is much bigger than L_f",
        paragraphs: [
          "Melting only loosens the bonds. Boiling separates the particles completely, and the gas also pushes back the atmosphere as it expands.",
        ],
      },
      {
        heading: "Evaporation cools",
        paragraphs: [
          "The fastest particles escape from the surface, so the average energy of the remaining liquid drops. This is how sweating cools you.",
        ],
      },
      {
        heading: "Conditions",
        bullets: [
          "Use L only when the temperature is constant.",
          "Real heaters lose some heat, so an uncorrected measurement of L is usually too high.",
          "Heat is absorbed in melting and vaporizing, and released in freezing and condensing, with the same size of L.",
        ],
      },
    ],
    formulas: [
      {
        title: "Energy for a change of state",
        display: "Q = m × L",
        inWords: "Mass times specific latent heat.",
        where: "Q = heat (J), m = mass (kg), L = latent heat (J/kg).",
      },
      {
        title: "Finding the specific latent heat",
        lhs: "L =",
        num: "Q",
        den: "m",
        inWords: "Divide the energy by the mass that changed state.",
        where: "L in J/kg.",
      },
      {
        title: "Finding the mass that changes state",
        lhs: "m =",
        num: "Q",
        den: "L",
        inWords: "Divide the energy by the latent heat.",
        where: "m in kg.",
      },
      {
        title: "Electrical energy from a heater",
        display: "Q = P × t   =   V × I × t",
        inWords: "Power times time, or voltage times current times time.",
        where: "P = power (W), V = voltage (V), I = current (A), t = time (s).",
      },
      {
        title: "Time for a heater to change state",
        lhs: "t =",
        num: "m × L",
        den: "P",
        inWords: "Divide the needed energy by the heater power.",
        where: "t in seconds.",
      },
      {
        title: "Efficiency",
        lhs: "efficiency =",
        num: "useful energy",
        den: "energy supplied",
        suffix: "× 100%",
        inWords:
          "Useful energy divided by the energy supplied, as a percentage.",
        where: "Both energies in joules.",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Latent heat of fusion of water", "L_f = 3.34 × 10⁵ J/kg"],
        ["Latent heat of vaporization of water", "L_v = 2.26 × 10⁶ J/kg"],
      ],
    },
    examples: [
      {
        title: "Example 1: Time to boil water",
        steps: [
          "A 500 W heater boils 0.2 kg of water already at 100 °C.",
          "Q = 0.2 × 2,260,000 = 452,000 J",
          "t = 452,000 ÷ 500",
        ],
        answer: "t = 904 s (about 15 minutes)",
        note: "With heat loss, only 80% of the energy reaches the water: t = 904 ÷ 0.8 = 1,130 s.",
      },
      {
        title: "Example 2: Measure L",
        steps: [
          "A 100 W heater runs for 300 s and melts 90 g of ice.",
          "Q = 100 × 300 = 30,000 J",
          "m = 90 g = 0.09 kg",
          "L = 30,000 ÷ 0.09",
        ],
        answer: "L = 3.33 × 10⁵ J/kg",
      },
    ],
    watchOut: [
      "Change grams to kilograms.",
      "Do not use L_f when the water is boiling.",
    ],
    checks: [
      {
        q: "How much heat boils 0.5 kg of water at 100 °C?",
        options: ["1,130,000 J", "226,000 J", "2,260,000 J", "565,000 J"],
        a: 0,
        explain: "0.5 × 2,260,000 = 1,130,000 J.",
      },
      {
        q: "How long does a 600 W heater take to melt 0.18 kg of ice at 0 °C?",
        options: ["≈ 100 s", "≈ 60 s", "≈ 600 s", "≈ 10 s"],
        a: 0,
        explain: "Q = 0.18 × 334,000 = 60,120 J, so t = 60,120 ÷ 600 ≈ 100 s.",
      },
    ],
    takeaways: [
      "Q = m × L gives the energy for a change of state.",
      "L_v is much larger than L_f.",
      "Electrical energy P × t can be used to measure L in an experiment.",
    ],
    quizSlug: "latent-heat-states",
  },

  // ============================== LESSON 9 ==============================
  {
    n: 9,
    key: "Lesson9",
    slug: "gas-laws-and-temperature",
    title: "Gas Laws and Temperature",
    tagline:
      "Link gas pressure, volume, and temperature, and see how particle motion explains them.",
    unit: "unit-4",
    icon: "bi-balloon",
    accent: "#10b981",
    sim: "GasLawSim",
    video: {
      id: "Hd7OoTLBZDA",
      title: "Gas Laws – Boyle's – Charles's – Gay-Lussac's",
    },
    overview:
      "The temperature of a gas is linked to its pressure and volume. When a gas is heated, its particles move faster and hit the walls harder.",
    objectives: [
      "State and use Boyle's, Charles's, and Gay-Lussac's laws.",
      "Use the ideal gas law.",
      "Explain gas behavior using the kinetic model.",
    ],
    energyTrace: [
      "Gas is heated",
      "Particles move faster and hit the walls harder",
      "Pressure or volume increases",
    ],
    keyTerms: [
      {
        term: "Pressure (P)",
        def: "force per unit area, in pascals (Pa). 1 atm = 101,325 Pa.",
      },
      {
        term: "Ideal gas",
        def: "a gas whose particles are tiny and do not attract each other.",
      },
      { term: "Mole (n)", def: "a group of 6.022 × 10²³ particles." },
      {
        term: "Isothermal, isobaric, isochoric",
        def: "constant temperature, constant pressure, constant volume.",
      },
      { term: "STP", def: "in this tutorial, 0 °C and 1 atm." },
      {
        term: "Root-mean-square speed (v_rms)",
        def: "a typical speed of the particles.",
      },
    ],
    sections: [
      {
        heading: "Particle explanation (kinetic model)",
        paragraphs: [
          "Gas pressure comes from particles hitting the container walls. Heating the gas makes the particles faster, so they hit harder and more often, and pressure rises. Squeezing a gas into a smaller volume makes the hits more frequent, and pressure also rises.",
        ],
      },
      {
        heading: "How to solve (steps)",
        steps: [
          "Decide what stays constant: temperature, pressure, or volume.",
          "Change all temperatures to kelvin.",
          "Use absolute pressure: absolute = gauge + atmospheric.",
          "Keep units consistent (Pa with m³, or atm with L).",
          "Choose the law, solve, and check that the answer makes sense.",
        ],
      },
      {
        heading: "Which law do I use?",
        table: {
          headers: ["What stays constant", "Law"],
          rows: [
            ["Temperature", "Boyle's law"],
            ["Pressure", "Charles's law"],
            ["Volume", "Gay-Lussac's law"],
            ["Only the amount of gas", "Combined gas law"],
            ["Moles or mass are given", "Ideal gas law"],
          ],
        },
      },
      {
        heading: "Conditions",
        bullets: [
          "The ideal gas model works best at low pressure and high temperature.",
          "Average kinetic energy depends on kelvin. From 20 °C to 40 °C it increases by only about 6.8%.",
          "Speed is proportional to √T. To double the speed, quadruple the absolute temperature.",
        ],
      },
    ],
    formulas: [
      {
        title: "Boyle's law (T constant)",
        display: "P₁ × V₁ = P₂ × V₂",
        inWords: "Pressure times volume stays the same.",
        where: "P in atm or Pa, V in L or m³, keep consistent.",
      },
      {
        title: "Charles's law (P constant)",
        lhs: "",
        num: "V₁",
        den: "T₁",
        equals: "=",
        num2: "V₂",
        den2: "T₂",
        inWords: "Volume over temperature stays the same.",
        where: "T must be in kelvin.",
      },
      {
        title: "Gay-Lussac's law (V constant)",
        lhs: "",
        num: "P₁",
        den: "T₁",
        equals: "=",
        num2: "P₂",
        den2: "T₂",
        inWords: "Pressure over temperature stays the same.",
        where: "T must be in kelvin.",
      },
      {
        title: "Combined gas law",
        lhs: "",
        num: "P₁ × V₁",
        den: "T₁",
        equals: "=",
        num2: "P₂ × V₂",
        den2: "T₂",
        inWords: "Use when nothing except the amount of gas stays constant.",
        where: "T in kelvin.",
      },
      {
        title: "Ideal gas law",
        display: "p × V = n × R × T",
        inWords:
          "Pressure times volume equals moles times the gas constant times kelvin.",
        where:
          "p = pressure (Pa), V = volume (m³), n = amount of gas (mol), R = 8.314 J/mol·K, T = temperature (K).",
      },
      {
        title: "Solving for volume",
        lhs: "V =",
        num: "n × R × T",
        den: "p",
        inWords: "Rearranged ideal gas law.",
        where: "Same symbols as above.",
      },
      {
        title: "Average kinetic energy of one particle",
        lhs: "KE_avg =",
        num: "3",
        den: "2",
        suffix: "× k_B × T",
        inWords: "One and a half times Boltzmann's constant times kelvin.",
        where: "k_B = 1.38 × 10⁻²³ J/K.",
      },
      {
        title: "Rms speed of gas particles",
        display: "v_rms = √( 3 × R × T ÷ M )",
        inWords:
          "Take 3RT, divide by the molar mass in kg/mol, then take the square root.",
        where: "M = molar mass (kg/mol); nitrogen: 0.028 kg/mol.",
      },
    ],
    constantsTable: {
      title: "Constants",
      rows: [
        ["Gas constant R", "8.314 J/mol·K = 0.08206 L·atm/mol·K"],
        ["Boltzmann constant k_B", "1.38 × 10⁻²³ J/K"],
        ["Avogadro's number N_A", "6.022 × 10²³ per mol"],
        ["1 atm", "101,325 Pa"],
        ["Molar volume at 0 °C, 1 atm", "22.4 L/mol"],
      ],
    },
    examples: [
      {
        title: "Example 1: Boyle's law",
        steps: [
          "1.5 L of gas at 1 atm is squeezed to 0.5 L at constant temperature.",
          "1 × 1.5 = P₂ × 0.5",
          "P₂ = 1.5 ÷ 0.5",
        ],
        answer: "P₂ = 3 atm",
      },
      {
        title: "Example 2: Charles's law",
        steps: [
          "2.0 L of gas at 27 °C is heated to 87 °C at constant pressure.",
          "T₁ = 27 + 273.15 = 300.15 K",
          "T₂ = 87 + 273.15 = 360.15 K",
          "V₂ = 2.0 × (360.15 ÷ 300.15)",
        ],
        answer: "V₂ = 2.40 L",
      },
      {
        title: "Example 3: Gay-Lussac's law",
        steps: [
          "A tire is at 2.2 atm (absolute) at 20 °C. After driving, it is 50 °C.",
          "T₁ = 293.15 K, T₂ = 323.15 K",
          "P₂ = 2.2 × (323.15 ÷ 293.15)",
        ],
        answer: "P₂ = 2.43 atm",
      },
      {
        title: "Example 4: Ideal gas law",
        steps: [
          "Volume of 1 mole at 300 K and 1 atm.",
          "V = (1 × 8.314 × 300) ÷ 101,325",
        ],
        answer: "V = 0.0246 m³ = 24.6 L",
      },
      {
        title: "Example 5: Speed of nitrogen molecules at 300 K",
        steps: [
          "ratio = (3 × 8.314 × 300) ÷ 0.028",
          "ratio = 7,482.6 ÷ 0.028 = 267,236",
          "v_rms = √267,236",
        ],
        answer: "v_rms = 517 m/s",
      },
    ],
    watchOut: [
      "Always use kelvin in gas laws.",
      "Use absolute pressure, not gauge pressure.",
      "Do not mix L with m³.",
    ],
    checks: [
      {
        q: "1.5 L of gas at 1 atm is compressed to 0.5 L at constant temperature. What is the new pressure?",
        options: ["3 atm", "1.5 atm", "0.33 atm", "6 atm"],
        a: 0,
        explain: "P₁V₁ = P₂V₂ → P₂ = 1.5 ÷ 0.5 = 3 atm.",
      },
      {
        q: "A gas in a sealed rigid container goes from 300 K to 600 K. What happens to the pressure?",
        options: [
          "It doubles",
          "It halves",
          "It stays the same",
          "It quadruples",
        ],
        a: 0,
        explain:
          "At constant volume, P ∝ T (Gay-Lussac), so doubling kelvin doubles pressure.",
      },
    ],
    takeaways: [
      "Gas laws need absolute temperature in kelvin.",
      "Pressure comes from particles hitting the walls.",
      "p × V = n × R × T connects pressure, volume, amount, and temperature.",
    ],
    quizSlug: "gas-laws",
  },
];

// ---------- lookup helpers ----------
export const LESSON_BY_KEY = Object.fromEntries(LESSONS.map((l) => [l.key, l]));
export const LESSON_BY_SLUG = Object.fromEntries(
  LESSONS.map((l) => [l.slug, l]),
);
export const getLesson = (slug) => LESSON_BY_SLUG[slug];
export const getUnit = (id) => UNITS.find((u) => u.id === id);

// ---------- the "∑ Heat Formulas" sheet ----------
export const FORMULA_SHEET = [
  {
    name: "Temperature",
    display:
      "°F = (1.8 × °C) + 32    ·    °C = (°F − 32) ÷ 1.8    ·    K = °C + 273.15",
    useWhen: "converting between scales.",
  },
  {
    name: "Specific heat",
    display: "Q = m × c × ΔT",
    useWhen: "temperature changes inside one phase.",
  },
  {
    name: "Latent heat",
    display: "Q = m × L",
    useWhen: "the state changes and the temperature stays constant.",
  },
  {
    name: "Calorimetry",
    display: "Heat lost by hot objects = Heat gained by cold objects",
    useWhen: "objects are mixed in an insulated container.",
  },
  {
    name: "Conduction",
    display: "H = k × A × ΔT ÷ L",
    useWhen: "heat flows through a solid.",
  },
  {
    name: "Convection",
    display: "H = h × A × ΔT",
    useWhen: "heat moves between a surface and a moving fluid.",
  },
  {
    name: "Newton's cooling",
    display: "T(t) = T_s + (T₀ − T_s) × e^(−k × t)",
    useWhen: "an object cools toward its surroundings over time.",
  },
  {
    name: "Radiation",
    display: "P = e × σ × A × T⁴    ·    P_net = e × σ × A × (T⁴ − T_s⁴)",
    useWhen: "finding the power an object radiates. T in kelvin.",
  },
  {
    name: "Wien's law",
    display: "λ_max = b ÷ T",
    useWhen: "finding the peak wavelength of radiation.",
  },
  {
    name: "Kinetic energy of a gas particle",
    display: "KE_avg = (3/2) × k_B × T",
    useWhen: "linking temperature to particle energy. T in kelvin.",
  },
  {
    name: "Ideal gas law",
    display: "p × V = n × R × T",
    useWhen: "moles, pressure, volume and temperature are linked.",
  },
  {
    name: "Gas laws",
    display:
      "Boyle: P₁V₁ = P₂V₂    ·    Charles: V₁/T₁ = V₂/T₂    ·    Gay-Lussac: P₁/T₁ = P₂/T₂",
    useWhen: "one of P, V, T stays constant. T in kelvin.",
  },
];

export const CONSTANTS_BOX = [
  ["Absolute zero", "0 K = −273.15 °C = −459.67 °F"],
  ["Water freezes", "273.15 K (0 °C)"],
  ["Water boils", "373.15 K (100 °C)"],
  ["Specific heat of water", "4186 J/kg·K"],
  ["Specific heat of ice", "2090 J/kg·K"],
  ["Specific heat of steam", "2010 J/kg·K"],
  ["Specific heat of aluminum", "900 J/kg·K"],
  ["Specific heat of glass", "840 J/kg·K"],
  ["Specific heat of iron", "450 J/kg·K"],
  ["Specific heat of copper", "385 J/kg·K"],
  ["Specific heat of lead", "128 J/kg·K"],
  ["Latent heat of fusion", "3.34 × 10⁵ J/kg (water)"],
  ["Latent heat of vaporization", "2.26 × 10⁶ J/kg (water)"],
  ["Stefan-Boltzmann constant", "5.67 × 10⁻⁸ W/m²·K⁴"],
  ["Wien's constant", "2.898 × 10⁻³ m·K"],
  ["Boltzmann constant", "1.38 × 10⁻²³ J/K"],
  ["Gas constant", "8.314 J/mol·K"],
  ["Avogadro's number", "6.022 × 10²³ per mol"],
  ["1 atm", "101,325 Pa"],
];
