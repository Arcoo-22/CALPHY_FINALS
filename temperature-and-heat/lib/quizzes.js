// ============================================================
// Quiz banks. Question values taken from CALPHY_FINALS_CONTENTS.pdf
// type 'mc'      → multiple choice, `a` = index of correct option
// type 'numeric' → typed answer, accepted if |x − answer| ≤ tol
// ============================================================

// "Quiz1" is the storage key; show it as "Quiz 1"
export const quizLabel = (id) => id.replace(/(\d+)$/, " $1");

export const QUIZZES = [
  {
    id: "Quiz1",
    slug: "temperature-conversions",
    title: "Temperature Conversions",
    icon: "bi-arrow-left-right",
    accent: "#ff6b35",
    description:
      "Convert between °C, °F and K, compare temperatures, and pick the right scale for a formula.",
    lessons: ["Lesson1", "Lesson2"],
    questions: [
      {
        type: "mc",
        prompt: "Convert 25 °C to °F.",
        options: ["77 °F", "57 °F", "45 °F", "298 °F"],
        a: 0,
        explain: "°F = (1.8 × 25) + 32 = 45 + 32 = 77 °F.",
      },
      {
        type: "numeric",
        prompt: "Convert 100 °F to °C (round to 1 decimal place).",
        answer: 37.8,
        tol: 0.15,
        unit: "°C",
        explain: "°C = (100 − 32) ÷ 1.8 = 68 ÷ 1.8 = 37.78 ≈ 37.8 °C.",
      },
      {
        type: "mc",
        prompt: "What is 0 °C in kelvin?",
        options: ["273.15 K", "0 K", "32 K", "100 K"],
        a: 0,
        explain: "K = °C + 273.15, so 0 °C = 273.15 K.",
      },
      {
        type: "numeric",
        prompt:
          "There is one temperature where °C and °F read the same number. What is it?",
        answer: -40,
        tol: 0.5,
        unit: "°C = °F",
        explain: "−40 °C = (1.8 × −40) + 32 = −72 + 32 = −40 °F.",
      },
      {
        type: "mc",
        prompt: "Which is hotter: 300 K or 25 °C?",
        options: [
          "300 K",
          "25 °C",
          "They are exactly equal",
          "Cannot be compared",
        ],
        a: 0,
        explain: "300 K = 26.85 °C, so 300 K is hotter.",
      },
      {
        type: "mc",
        prompt: "A temperature change of 10 °C equals a change of …",
        options: ["18 °F", "42 °F", "10 °F", "283 °F"],
        a: 0,
        explain:
          "Δ°F = 1.8 × Δ°C = 18 °F. The +32 offset does not apply to changes.",
      },
      {
        type: "numeric",
        prompt: "Liquid nitrogen boils at 77 K. Convert to °C.",
        answer: -196.15,
        tol: 0.5,
        unit: "°C",
        explain: "°C = 77 − 273.15 = −196.15 °C.",
      },
      {
        type: "mc",
        prompt: "Absolute zero equals …",
        options: ["−273.15 °C", "0 °C", "−100 °C", "32 °F"],
        a: 0,
        explain: "0 K = −273.15 °C = −459.67 °F.",
      },
      {
        type: "numeric",
        prompt:
          "Human body temperature is 98.6 °F. Convert to °C (1 decimal place).",
        answer: 37,
        tol: 0.2,
        unit: "°C",
        explain: "°C = (98.6 − 32) ÷ 1.8 = 66.6 ÷ 1.8 = 37.0 °C.",
      },
      {
        type: "mc",
        prompt: "Which situation REQUIRES the kelvin scale?",
        options: [
          "A \u201Ctwice as hot\u201D ratio or any T⁴ formula",
          "Converting a weather report from °C to °F",
          "Measuring ΔT for Q = m × c × ΔT",
          "Reading a liquid thermometer",
        ],
        a: 0,
        explain:
          "Ratios and T⁴ only make sense from absolute zero, use kelvin. 300 K → 600 K, not 20 °C → 40 °C.",
      },
      {
        type: "numeric",
        prompt: "Convert 350 °F to kelvin (nearest whole number).",
        answer: 450,
        tol: 1,
        unit: "K",
        explain:
          "°C = (350 − 32) ÷ 1.8 = 176.67; K = 176.67 + 273.15 = 449.82 ≈ 450 K.",
      },
      {
        type: "mc",
        prompt: "Which value is physically impossible?",
        options: ["−300 °C", "−300 °F", "300 K", "300 °C"],
        a: 0,
        explain:
          "−300 °C is below absolute zero (−273.15 °C). No temperature can be lower.",
      },
    ],
  },
  {
    id: "Quiz2",
    slug: "specific-heat",
    title: "Specific Heat Calculations",
    icon: "bi-cup-hot",
    accent: "#0ea5e9",
    description:
      "Use Q = m × c × ΔT, heat capacity, and material comparisons, plus calorimetry heat balance.",
    lessons: ["Lesson5", "Lesson6"],
    questions: [
      {
        type: "numeric",
        prompt:
          "How much heat warms 0.5 kg of water from 20 °C to 100 °C? (c = 4186 J/kg·K)",
        answer: 167440,
        tol: 500,
        unit: "J",
        explain: "Q = 0.5 × 4186 × 80 = 167,440 J.",
      },
      {
        type: "mc",
        prompt: "Q = m × c × ΔT is valid only when …",
        options: [
          "the material stays inside one phase",
          "the material is melting",
          "the material is boiling",
          "temperature stays constant",
        ],
        a: 0,
        explain: "During melting or boiling use Q = m × L instead.",
      },
      {
        type: "numeric",
        prompt:
          "12,000 J is absorbed by 0.4 kg of copper (c = 385 J/kg·K). Find ΔT (1 decimal).",
        answer: 77.9,
        tol: 0.5,
        unit: "K",
        explain: "ΔT = 12,000 ÷ (0.4 × 385) = 12,000 ÷ 154 = 77.9 K.",
      },
      {
        type: "mc",
        prompt:
          "The same amount of heat is added to equal masses of water, aluminum, copper and lead. Which gets hottest?",
        options: [
          "Lead (c = 128 J/kg·K)",
          "Copper (c = 385 J/kg·K)",
          "Aluminum (c = 900 J/kg·K)",
          "Water (c = 4186 J/kg·K)",
        ],
        a: 0,
        explain:
          "A lower c means a bigger temperature change for the same heat.",
      },
      {
        type: "mc",
        prompt:
          "3,600 J raises 0.2 kg of a sample from 20 °C to 60 °C. What is it? (c = Q ÷ mΔT)",
        options: [
          "Iron (450 J/kg·K)",
          "Copper (385 J/kg·K)",
          "Aluminum (900 J/kg·K)",
          "Lead (128 J/kg·K)",
        ],
        a: 0,
        explain: "c = 3,600 ÷ (0.2 × 40) = 450 J/kg·K → iron.",
      },
      {
        type: "numeric",
        prompt:
          "Warm 2 kg of water from 20 °C to 80 °C. How much heat? (c = 4186 J/kg·K)",
        answer: 502320,
        tol: 1000,
        unit: "J",
        explain: "Q = 2 × 4186 × 60 = 502,320 J.",
      },
      {
        type: "mc",
        prompt: "The specific heat of water is 4186 J/kg·K. This means …",
        options: [
          "4186 J raises 1 kg of water by 1 K",
          "4186 J boils 1 kg of water",
          "water contains 4186 J",
          "1 kg of water weighs 4186 J",
        ],
        a: 0,
        explain: "Specific heat = energy per kilogram per kelvin.",
      },
      {
        type: "numeric",
        prompt:
          "Heat capacity C = m × c of a 2 kg aluminum block (c = 900 J/kg·K)?",
        answer: 1800,
        tol: 5,
        unit: "J/K",
        explain: "C = 2 × 900 = 1800 J/K.",
      },
      {
        type: "numeric",
        prompt:
          "Calorimetry: 0.1 kg copper at 100 °C (c = 385) drops into 0.2 kg water at 20 °C (c = 4186). Final temperature? (1 decimal)",
        answer: 23.5,
        tol: 0.4,
        unit: "°C",
        explain:
          "38.5 × (100 − T) = 837.2 × (T − 20) → 20,594 = 875.7 T → T = 23.5 °C.",
      },
      {
        type: "mc",
        prompt:
          "In calorimetry, the core principle for an isolated system is …",
        options: [
          "heat lost by hot objects = heat gained by cold objects",
          "temperature lost = temperature gained",
          "mass is conserved only",
          "the hotter object keeps its temperature",
        ],
        a: 0,
        explain:
          "Energy conservation: Q_lost = Q_gained, or ΣQ = 0 with (T_f − T_i) signs.",
      },
      {
        type: "numeric",
        prompt:
          "0.2 kg of aluminum is heated from 25 °C to 75 °C (c = 900 J/kg·K). How much heat?",
        answer: 9000,
        tol: 50,
        unit: "J",
        explain: "Q = 0.2 × 900 × 50 = 9,000 J.",
      },
      {
        type: "mc",
        prompt:
          "Why does the sea stay cool while the sand burns your feet on a sunny day?",
        options: [
          "Water has a much higher specific heat than sand",
          "Sand is darker",
          "The sea is deeper",
          "Water reflects all sunlight",
        ],
        a: 0,
        explain:
          "Water's high c (4186 J/kg·K) means the same sunlight produces a much smaller temperature rise.",
      },
    ],
  },
  {
    id: "Quiz3",
    slug: "heat-transfer-modes",
    title: "Heat Transfer Modes",
    icon: "bi-fire",
    accent: "#ef4444",
    description:
      "Identify conduction, convection and radiation, and calculate H = kAΔT/L, H = hAΔT, P = eσAT⁴ and Wien's law.",
    lessons: ["Lesson3", "Lesson4"],
    questions: [
      {
        type: "mc",
        prompt: "How does the Sun's heat reach Earth?",
        options: [
          "Radiation, space is a vacuum",
          "Convection",
          "Conduction",
          "It is carried by solar wind",
        ],
        a: 0,
        explain: "Radiation is the only mode that needs no material.",
      },
      {
        type: "mc",
        prompt: "A metal spoon in hot soup gets hot at the handle. Which mode?",
        options: ["Conduction", "Convection", "Radiation", "Evaporation"],
        a: 0,
        explain:
          "Energy passes particle-to-particle through the solid, conduction.",
      },
      {
        type: "mc",
        prompt: "Warm air rises above a stove. Which mode?",
        options: ["Convection", "Conduction", "Radiation", "Insulation"],
        a: 0,
        explain: "A moving fluid carries the heat, convection.",
      },
      {
        type: "numeric",
        prompt:
          "Copper rod: k = 401 W/m·K, A = 1 × 10⁻⁴ m², L = 0.5 m, ΔT = 100 K. Find H (2 decimals).",
        answer: 8.02,
        tol: 0.05,
        unit: "W",
        explain: "H = 401 × 1×10⁻⁴ × 100 ÷ 0.5 = 8.02 W.",
      },
      {
        type: "mc",
        prompt: "A rod's length is doubled (same k, A, ΔT). What happens to H?",
        options: [
          "It is cut in half",
          "It doubles",
          "It stays the same",
          "It becomes one quarter",
        ],
        a: 0,
        explain: "H = kAΔT/L, H is inversely proportional to L.",
      },
      {
        type: "mc",
        prompt:
          "At the same room temperature, why does metal feel colder than wood?",
        options: [
          "Metal has a higher k and pulls heat from your hand faster",
          "Metal is actually colder",
          "Wood generates heat",
          "Metal reflects your body heat",
        ],
        a: 0,
        explain:
          "Both are at room temperature; the conductor drains heat from your skin faster.",
      },
      {
        type: "numeric",
        prompt:
          "Radiated power of a blackbody (e = 1) with A = 1 m² at 300 K? (σ = 5.67 × 10⁻⁸)",
        answer: 459,
        tol: 5,
        unit: "W",
        explain: "P = 1 × 5.67×10⁻⁸ × 1 × 300⁴ = 459 W.",
      },
      {
        type: "mc",
        prompt:
          "The absolute temperature of an object doubles. Its radiated power becomes …",
        options: [
          "16 times larger",
          "2 times larger",
          "4 times larger",
          "8 times larger",
        ],
        a: 0,
        explain: "P ∝ T⁴ → 2⁴ = 16.",
      },
      {
        type: "numeric",
        prompt:
          "Wien's law: peak wavelength of the Sun's surface (5,800 K) in nm? (b = 2.898 × 10⁻³ m·K)",
        answer: 500,
        tol: 5,
        unit: "nm",
        explain:
          "λ = 2.898×10⁻³ ÷ 5800 = 5.0 × 10⁻⁷ m = 500 nm (visible light).",
      },
      {
        type: "mc",
        prompt:
          "Why is trapped air (foam, blankets, double glazing) a good insulator?",
        options: [
          "Gas particles are far apart, so collisions, and conduction, are rare",
          "Air is a perfect reflector",
          "Air contains no energy",
          "Air blocks radiation completely",
        ],
        a: 0,
        explain:
          "Air's k is only 0.026 W/m·K; trapping it stops convection too.",
      },
      {
        type: "numeric",
        prompt: "Convection: h = 25 W/m²·K, A = 2 m², ΔT = 10 K. Find H.",
        answer: 500,
        tol: 1,
        unit: "W",
        explain: "H = h × A × ΔT = 25 × 2 × 10 = 500 W.",
      },
      {
        type: "mc",
        prompt:
          "Coffee: T₀ = 90 °C, room T_s = 20 °C, k = 0.05/min. Temperature after 10 min? T = 20 + 70·e^(−0.5)",
        options: ["≈ 62.5 °C", "≈ 55 °C", "≈ 70 °C", "≈ 45 °C"],
        a: 0,
        explain: "e^(−0.5) ≈ 0.6065 → T = 20 + 70 × 0.6065 = 62.5 °C.",
      },
    ],
  },
  {
    id: "Quiz4",
    slug: "latent-heat-states",
    title: "Latent Heat & Changes of State",
    icon: "bi-snow",
    accent: "#8b5cf6",
    description:
      "Heating curves, Q = m × L, fusion vs vaporization, and the electrical method of measuring L.",
    lessons: ["Lesson7", "Lesson8"],
    questions: [
      {
        type: "numeric",
        prompt:
          "How much heat melts 0.3 kg of ice at 0 °C? (L_f = 3.34 × 10⁵ J/kg)",
        answer: 100200,
        tol: 300,
        unit: "J",
        explain: "Q = m × L = 0.3 × 334,000 = 100,200 J.",
      },
      {
        type: "mc",
        prompt: "While water boils at 100 °C, its temperature …",
        options: [
          "stays constant, energy breaks bonds",
          "rises quickly",
          "rises slowly",
          "falls",
        ],
        a: 0,
        explain:
          "Added energy becomes latent heat, not kinetic energy, so T stays at 100 °C.",
      },
      {
        type: "numeric",
        prompt:
          "How much heat boils 0.5 kg of water at 100 °C? (L_v = 2.26 × 10⁶ J/kg)",
        answer: 1130000,
        tol: 2000,
        unit: "J",
        explain: "Q = 0.5 × 2,260,000 = 1,130,000 J.",
      },
      {
        type: "mc",
        prompt: "Why is L_v (2.26 × 10⁶) much bigger than L_f (3.34 × 10⁵)?",
        options: [
          "Boiling separates particles completely and pushes back the atmosphere; melting only loosens bonds",
          "Boiling happens faster",
          "Steam is lighter than water",
          "Melting releases energy",
        ],
        a: 0,
        explain:
          "Vaporization breaks essentially all bonds and does expansion work.",
      },
      {
        type: "mc",
        prompt: "Dry ice turns directly from solid to gas. This is called …",
        options: ["Sublimation", "Vaporization", "Melting", "Condensation"],
        a: 0,
        explain:
          "Solid → gas without becoming liquid: sublimation (about −78.5 °C at 1 atm).",
      },
      {
        type: "numeric",
        prompt:
          "A 500 W heater boils 0.2 kg of water already at 100 °C. How long? (seconds, whole number)",
        answer: 904,
        tol: 5,
        unit: "s",
        explain:
          "Q = 0.2 × 2,260,000 = 452,000 J; t = 452,000 ÷ 500 = 904 s (≈ 15 min).",
      },
      {
        type: "mc",
        prompt: "Evaporation cools a liquid because …",
        options: [
          "the fastest particles escape, lowering the average energy of what remains",
          "the liquid absorbs cold from air",
          "evaporation needs no energy",
          "the container insulates",
        ],
        a: 0,
        explain: "This is exactly how sweating cools you.",
      },
      {
        type: "numeric",
        prompt:
          "A 100 W heater runs 300 s and melts 90 g of ice. Measured L? (scientific notation ok, ×10⁵ J/kg, enter e.g. 3.33)",
        answer: 3.33,
        tol: 0.03,
        unit: "×10⁵ J/kg",
        explain: "Q = 30,000 J; L = 30,000 ÷ 0.09 = 3.33 × 10⁵ J/kg.",
      },
      {
        type: "mc",
        prompt: "On a mountain, the boiling point of water is …",
        options: [
          "lower, because pressure is lower",
          "higher, because it is colder",
          "always 100 °C",
          "unpredictable",
        ],
        a: 0,
        explain:
          "Boiling point depends on pressure, lower pressure, lower boiling point (a pressure cooker does the opposite).",
      },
      {
        type: "mc",
        prompt:
          "Why does steam at 100 °C burn much worse than boiling water at 100 °C?",
        options: [
          "Condensing releases an extra 2.26 × 10⁶ J/kg before it even cools",
          "Steam is hotter than 100 °C",
          "Steam has more mass",
          "Water cannot burn skin",
        ],
        a: 0,
        explain:
          "10 g of steam delivers ≈ 25,112 J vs 2,512 J for boiling water, about 10× more.",
      },
    ],
  },
  {
    id: "Quiz5",
    slug: "gas-laws",
    title: "Gas Laws & Kinetic Model",
    icon: "bi-balloon",
    accent: "#10b981",
    description:
      "Boyle's, Charles's, Gay-Lussac's, the ideal gas law, and what particles are doing.",
    lessons: ["Lesson9"],
    questions: [
      {
        type: "mc",
        prompt: "Boyle's law applies when which quantity stays constant?",
        options: ["Temperature", "Pressure", "Volume", "Moles only"],
        a: 0,
        explain: "Boyle: P₁V₁ = P₂V₂ at constant T.",
      },
      {
        type: "numeric",
        prompt:
          "1.5 L of gas at 1 atm is squeezed to 0.5 L at constant temperature. New pressure?",
        answer: 3,
        tol: 0.05,
        unit: "atm",
        explain: "P₂ = P₁V₁ ÷ V₂ = 1.5 ÷ 0.5 = 3 atm.",
      },
      {
        type: "mc",
        prompt:
          "A sealed rigid container of gas goes from 300 K to 600 K. The pressure …",
        options: ["doubles", "halves", "stays the same", "quadruples"],
        a: 0,
        explain: "Gay-Lussac: P ∝ T (kelvin) at constant volume.",
      },
      {
        type: "numeric",
        prompt:
          "Charles's law: 2.0 L at 27 °C is heated to 87 °C at constant pressure. New volume? (2 decimals)",
        answer: 2.4,
        tol: 0.03,
        unit: "L",
        explain:
          "V₂ = 2.0 × 360.15 ÷ 300.15 = 2.40 L. Always convert to kelvin first!",
      },
      {
        type: "mc",
        prompt: "In the ideal gas law p × V = n × R × T, R equals …",
        options: [
          "8.314 J/mol·K",
          "1.38 × 10⁻²³ J/K",
          "101,325 Pa",
          "22.4 L/mol",
        ],
        a: 0,
        explain:
          "R = 8.314 J/mol·K = 0.08206 L·atm/mol·K. (1.38 × 10⁻²³ is Boltzmann's k_B.)",
      },
      {
        type: "numeric",
        prompt:
          "rms speed of nitrogen molecules at 300 K? v = √(3RT/M), M = 0.028 kg/mol. (whole number)",
        answer: 517,
        tol: 4,
        unit: "m/s",
        explain:
          "ratio = 3 × 8.314 × 300 ÷ 0.028 = 267,236 → v_rms = √267,236 ≈ 517 m/s.",
      },
      {
        type: "mc",
        prompt: "Gas pressure is caused by …",
        options: [
          "particles hitting the container walls",
          "the weight of the gas only",
          "particles attracting each other",
          "heat leaving the gas",
        ],
        a: 0,
        explain:
          "Kinetic model: more frequent, harder collisions → higher pressure.",
      },
      {
        type: "numeric",
        prompt:
          "Ideal gas law: volume of 1 mole at 300 K and 1 atm (101,325 Pa)? Give litres (1 decimal).",
        answer: 24.6,
        tol: 0.3,
        unit: "L",
        explain: "V = nRT/p = 8.314 × 300 ÷ 101,325 = 0.0246 m³ = 24.6 L.",
      },
      {
        type: "mc",
        prompt: "To double the rms speed of gas particles you must …",
        options: [
          "quadruple the absolute temperature",
          "double the absolute temperature",
          "double the Celsius temperature",
          "double the pressure",
        ],
        a: 0,
        explain: "v ∝ √T, so speed ×2 needs T ×4 (in kelvin).",
      },
      {
        type: "mc",
        prompt:
          "A tire gauge reads pressure above atmospheric. In gas-law calculations you must use …",
        options: [
          "absolute pressure = gauge + atmospheric",
          "gauge pressure",
          "either one",
          "zero pressure",
        ],
        a: 0,
        explain: "Gas laws need absolute pressure (and absolute temperature).",
      },
    ],
  },
];

export const QUIZ_BY_SLUG = Object.fromEntries(QUIZZES.map((q) => [q.slug, q]));
export const QUIZ_BY_ID = Object.fromEntries(QUIZZES.map((q) => [q.id, q]));

// Mascot "Calphy" knowledge base, keyword → answers
export const MASCOT_FACTS = [
  "Temperature measures the AVERAGE kinetic energy of particles, heat is energy in TRANSIT. They're not the same thing!",
  "Fun fact: −40 °C is exactly −40 °F. The scales cross there!",
  "Kelvin can never be negative. Absolute zero (0 K = −273.15 °C) is the cosmic speed limit for cold.",
  "Water's specific heat (4186 J/kg·K) is why the sea stays cool while the sand burns your feet.",
  "Boiling water takes ~7× more energy than melting the same ice. L_v = 2.26 × 10⁶ J/kg vs L_f = 3.34 × 10⁵ J/kg!",
  "Metals conduct heat well because free electrons carry energy quickly, not just vibrating atoms.",
  "Radiation is the only heat transfer mode that works in a vacuum. That's how sunlight reaches Earth!",
  "Double the absolute temperature → radiated power becomes 16× bigger. T⁴ grows FAST.",
  "During melting or boiling, added heat breaks bonds instead of raising temperature, the curve goes flat.",
  "In gas laws, ALWAYS use kelvin. 20 °C → 40 °C is only a ~6.8% rise in particle energy!",
  "A hot cup of tea uses all three modes: conduction through the cup, convection in the tea and air, radiation from the surface.",
  "Infrared cameras see people in the dark because our 310 K bodies peak at 9.35 μm, pure infrared (Wien's law).",
];

export const MASCOT_QA = [
  {
    keywords: [
      "celsius",
      "fahrenheit",
      "kelvin",
      "convert",
      "scale",
      "temperature",
    ],
    a: "Conversions: °F = (1.8 × °C) + 32 · °C = (°F − 32) ÷ 1.8 · K = °C + 273.15. Try the interactive thermometer in Lesson 1, drag the slider and watch all three scales move!",
  },
  {
    keywords: ["conduction"],
    a: "Conduction = heat through direct contact. H = kAΔT/L. Copper (k = 401) beats foam (k = 0.04) by ~10,000×! Play with the rod simulation in Lesson 3.",
  },
  {
    keywords: ["convection"],
    a: "Convection = heat carried by a moving fluid. Warm fluid is less dense → rises; cool fluid sinks → a loop forms. Needs gravity! Check the pot simulation in Lesson 4.",
  },
  {
    keywords: ["radiation", "radiate", "stefan", "wien"],
    a: "Radiation = electromagnetic waves, no material needed. P = eσAT⁴ and λ_max = b/T (Wien). Hotter → way more power AND shorter wavelength. Lesson 4 has a glow simulator!",
  },
  {
    keywords: ["specific heat", "q = mc", "q=mc", "mcδt", "heat capacity"],
    a: "Q = m × c × ΔT, but ONLY inside one phase! Water c = 4186, aluminum 900, lead just 128 J/kg·K. Lower c = bigger ΔT for the same energy. Race two materials in the Lesson 5 sim!",
  },
  {
    keywords: [
      "latent",
      "melt",
      "boil",
      "phase",
      "state",
      "fusion",
      "vaporization",
    ],
    a: "During a state change, T stays flat and Q = m × L. Water: L_f = 3.34 × 10⁵ J/kg, L_v = 2.26 × 10⁶ J/kg. Watch the heating curve animate in Lesson 7!",
  },
  {
    keywords: ["calorimetry", "mix", "final temperature", "equilibrium"],
    a: "Calorimetry: heat lost = heat gained. T_f = Σ(mcT) ÷ Σ(mc). With ice, first test if the water can melt ALL of it, L_f is huge! Try the mixing sim in Lesson 6.",
  },
  {
    keywords: ["gas", "boyle", "charles", "gay", "ideal", "pressure", "piston"],
    a: "pV = nRT with T in KELVIN. Constant T → Boyle (P₁V₁ = P₂V₂); constant P → Charles (V₁/T₁ = V₂/T₂); constant V → Gay-Lussac (P₁/T₁ = P₂/T₂). Pump the piston sim in Lesson 9!",
  },
  {
    keywords: ["quiz", "test", "exam", "score"],
    a: "Quiz tips: (1) convert to kelvin first, (2) grams → kilograms, (3) ask 'is the temperature changing or the state?', that picks mcΔT vs mL. Scores are saved when you log in!",
  },
  {
    keywords: ["formula", "formulas", "sheet", "equation"],
    a: "Every formula from all 9 lessons lives on the ∑ Formulas page, with the constants box at the bottom. Bookmark it!",
  },
  {
    keywords: ["absolute zero", "coldest"],
    a: "Absolute zero = 0 K = −273.15 °C = −459.67 °F. Particles have their minimum possible motion there. You can approach it but never reach it!",
  },
  {
    keywords: [
      "hello",
      "hi ",
      "hey",
      "kamusta",
      "who are you",
      "your name",
      "calphy",
    ],
    a: "Hi! I'm Calphy 🔥, your physics buddy. Ask me about temperature, heat transfer, formulas, or quizzes. Or just click me for a fun fact!",
  },
  {
    keywords: ["help", "start", "how do i", "lost"],
    a: "Start with Lesson 1 (Temperature Scales) if you're new, play with the simulations on each lesson page, then test yourself in the Quizzes tab. Your progress saves when you log in!",
  },
  {
    keywords: ["thank", "salamat", "thanks"],
    a: "Anytime! That's what I'm here for 🔥 Keep going, you're heating up... in a good way!",
  },
  {
    keywords: ["login", "log in", "account", "progress", "save", "database"],
    a: "Progress works in two modes: as a Guest it saves in your browser, and when you Log In it syncs to the PostgreSQL database (tbl_users.user_progress) so it follows your account.",
  },
];

export const MASCOT_FALLBACKS = [
  "Hmm, I'm a physics mascot, try asking me about temperature, heat, conduction, convection, radiation, specific heat, latent heat, calorimetry, gas laws, formulas, or quizzes!",
  "That's outside my thermal comfort zone 😅 Ask me something about Temperature & Heat, like 'What is conduction?' or 'Give me quiz tips!'",
  "I only radiate knowledge about heat! 🔥 Try: 'specific heat', 'latent heat', 'gas laws', or click me for a random fun fact.",
];
