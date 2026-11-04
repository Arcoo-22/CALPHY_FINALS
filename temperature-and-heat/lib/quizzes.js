// ============================================================
// Quiz banks. Question values taken from CALPHY_FINALS_CONTENTS.pdf
// type 'mc'      → multiple choice, `a` = index of correct option
// type 'numeric' → typed answer, accepted if |x − answer| ≤ tol
// ============================================================

// "Quiz1" is the storage key; show it as "Quiz 1" (the final exam by name)
export const quizLabel = (id) =>
  QUIZ_BY_ID[id]?.final ? "Final exam" : id.replace(/(\d+)$/, " $1");

// score (in %) that completes the lesson a quiz belongs to
export const PASS_PERCENT = 75;

// One quiz per lesson: passing Quiz N finishes Lesson N only.
// Questions flagged `inFinal` are reused in the final exam below.
const LESSON_QUIZZES = [
  {
    id: "Quiz1",
    slug: "temperature-scales",
    title: "Temperature Scales",
    icon: "bi-thermometer-half",
    accent: "#ff6b35",
    description:
      "Convert between °C, °F and K, compare temperatures, and pick the right scale for a formula.",
    lessons: ["Lesson1"],
    questions: [
      {
        inFinal: true,
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
        inFinal: true,
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
        inFinal: true,
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
    slug: "heat-and-temperature",
    title: "Heat and Temperature",
    icon: "bi-arrow-left-right",
    accent: "#f97316",
    description:
      "Tell temperature, thermal energy and heat apart, predict heat flow, and use energy units.",
    lessons: ["Lesson2"],
    questions: [
      {
        inFinal: true,
        type: "mc",
        prompt: "Which quantity depends on the amount of matter in an object?",
        options: [
          "Thermal energy",
          "Temperature",
          "Average kinetic energy per particle",
          "Melting point",
        ],
        a: 0,
        explain: "Thermal energy is the total energy of all the particles, so more matter means more of it. Temperature is an average per particle.",
      },
      {
        inFinal: true,
        type: "mc",
        prompt: "Tea at 80 °C is poured into a cup at 25 °C. Which way does heat flow?",
        options: [
          "From the tea to the cup",
          "From the cup to the tea",
          "Both ways equally, so nothing changes",
          "No heat flows until the tea is stirred",
        ],
        a: 0,
        explain: "Heat flows from the hotter object to the colder one: the tea cools and the cup warms.",
      },
      {
        type: "mc",
        prompt: "Heat stops flowing between two objects in contact when …",
        options: [
          "they reach the same temperature",
          "they have the same thermal energy",
          "the colder one has no energy left",
          "they have the same mass",
        ],
        a: 0,
        explain: "Flow stops at thermal equilibrium, when both objects have the same temperature.",
      },
      {
        type: "mc",
        prompt: "A 0.2 kg cup of water at 90 °C sits next to a 50 kg pool at 30 °C. Which holds more thermal energy?",
        options: [
          "The pool",
          "The cup",
          "They hold the same",
          "Neither has thermal energy",
        ],
        a: 0,
        explain: "The cup is hotter, but the pool has far more particles, so it holds far more thermal energy.",
      },
      {
        type: "numeric",
        prompt: "How much energy raises 50 kg of pool water by 1 K? (c = 4186 J/kg·K)",
        answer: 209300,
        tol: 1,
        unit: "J",
        explain: "Q = m × c × ΔT = 50 × 4186 × 1 = 209,300 J.",
      },
      {
        type: "numeric",
        prompt: "Convert 500 cal to joules. (1 cal = 4.186 J)",
        answer: 2093,
        tol: 1,
        unit: "J",
        explain: "500 × 4.186 = 2,093 J.",
      },
      {
        type: "numeric",
        prompt: "A snack has 250 food Calories (kcal). How many kilojoules is that? (1 kcal = 4186 J, 1 decimal place)",
        answer: 1046.5,
        tol: 0.5,
        unit: "kJ",
        explain: "250 × 4186 = 1,046,500 J = 1,046.5 kJ.",
      },
      {
        type: "mc",
        prompt: "Rubbing your hands together warms them. This shows that …",
        options: [
          "temperature can rise through work, without heat flowing in",
          "heat flows from cold to hot",
          "friction lowers thermal energy",
          "temperature and heat are the same thing",
        ],
        a: 0,
        explain: "Work done on your hands raises their thermal energy. No heat from a hotter object is needed.",
      },
      {
        type: "mc",
        prompt: "An object releases 500 J of heat. Using the sign rule, Q is …",
        options: [
          "−500 J",
          "+500 J",
          "0 J",
          "500 K",
        ],
        a: 0,
        explain: "Q is negative when an object releases heat and positive when it absorbs heat.",
      },
      {
        inFinal: true,
        type: "numeric",
        prompt: "First law: a gas absorbs 800 J of heat and does 300 J of work. Find ΔU.",
        answer: 500,
        tol: 1,
        unit: "J",
        explain: "ΔU = Q − W = 800 − 300 = 500 J.",
      },
      {
        type: "mc",
        prompt: "The average kinetic energy of a gas particle is directly proportional to …",
        options: [
          "the absolute temperature in kelvin",
          "the temperature in °C",
          "the temperature in °F",
          "the size of the container",
        ],
        a: 0,
        explain: "KE_avg = (3/2) × k_B × T, with T in kelvin. That is why energy formulas need kelvin.",
      },
    ],
  },
  {
    id: "Quiz3",
    slug: "conduction",
    title: "Conduction",
    icon: "bi-rulers",
    accent: "#ef4444",
    description:
      "Explain conduction at the particle level and calculate heat flow through one layer, layers in series, and layers in parallel.",
    lessons: ["Lesson3"],
    questions: [
      {
        type: "mc",
        prompt: "A metal spoon in hot soup gets hot at the handle. Which mode?",
        options: ["Conduction", "Convection", "Radiation", "Evaporation"],
        a: 0,
        explain:
          "Energy passes particle-to-particle through the solid, conduction.",
      },
      {
        inFinal: true,
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
        inFinal: true,
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
        type: "mc",
        prompt: "Why do metals conduct heat much better than most other solids?",
        options: [
          "Free electrons carry energy through them quickly",
          "Their particles travel from the hot end to the cold end",
          "They contain fewer particles",
          "They are always hotter than other solids",
        ],
        a: 0,
        explain: "Metals have free electrons that move energy along quickly. The particles themselves stay in place.",
      },
      {
        type: "numeric",
        prompt: "Thermal resistance: a wool layer has L = 0.05 m, k = 0.04 W/m·K and A = 1 m². Find R.",
        answer: 1.25,
        tol: 0.01,
        unit: "K/W",
        explain: "R = L ÷ (k × A) = 0.05 ÷ (0.04 × 1) = 1.25 K/W.",
      },
      {
        inFinal: true,
        type: "numeric",
        prompt: "A wall has brick (L = 0.1 m, k = 0.7) and wool insulation (L = 0.05 m, k = 0.04) in series. A = 10 m², ΔT = 30 K. Find H (nearest watt).",
        answer: 215,
        tol: 1.5,
        unit: "W",
        explain: "Sum of L/k = 0.143 + 1.25 = 1.393. H = (10 × 30) ÷ 1.393 = 215 W.",
      },
      {
        type: "numeric",
        prompt: "A rod carries H = 8.02 W. How much energy passes through it in 10 minutes? (nearest joule)",
        answer: 4812,
        tol: 1,
        unit: "J",
        explain: "Q = H × t = 8.02 × 600 s = 4,812 J.",
      },
      {
        type: "mc",
        prompt: "A copper rod and a steel rod sit side by side between the same hot and cold walls. To find the total heat flow you …",
        options: [
          "add the two heat currents",
          "add the two thermal resistances",
          "use only the better conductor",
          "multiply the two heat currents",
        ],
        a: 0,
        explain: "Layers side by side share the same ΔT, so H_total = H₁ + H₂.",
      },
    ],
  },
  {
    id: "Quiz4",
    slug: "convection-and-radiation",
    title: "Convection and Radiation",
    icon: "bi-broadcast",
    accent: "#f59e0b",
    description:
      "Identify convection and radiation, and calculate convective heat flow, cooling over time, radiated power and peak wavelength.",
    lessons: ["Lesson4"],
    questions: [
      {
        inFinal: true,
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
        prompt: "Warm air rises above a stove. Which mode?",
        options: ["Convection", "Conduction", "Radiation", "Insulation"],
        a: 0,
        explain: "A moving fluid carries the heat, convection.",
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
        inFinal: true,
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
        inFinal: true,
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
      {
        type: "mc",
        prompt: "Which surface radiates heat best at the same temperature?",
        options: [
          "Dull black (matte)",
          "Shiny silver",
          "Polished aluminum",
          "Mirror-finish chrome",
        ],
        a: 0,
        explain: "Dark, matte surfaces have a high emissivity, so they absorb and emit well. Shiny surfaces do not.",
      },
      {
        type: "mc",
        prompt: "Natural convection almost stops in weightlessness because …",
        options: [
          "it needs gravity to make denser fluid sink",
          "fluids cannot be heated in space",
          "radiation blocks it",
          "there is no air in a spacecraft",
        ],
        a: 0,
        explain: "Warm fluid rises only because gravity pulls the cooler, denser fluid down to take its place.",
      },
      {
        type: "mc",
        prompt: "To heat a pot of water evenly by convection, the heat source should be …",
        options: [
          "at the bottom",
          "at the top",
          "at one side near the surface",
          "anywhere, it makes no difference",
        ],
        a: 0,
        explain: "Heating from below makes strong circulation. Heating from above makes very little.",
      },
      {
        type: "numeric",
        prompt: "Coffee at 90 °C cools in a 20 °C room with k = 0.05 per minute. How long until it reaches 40 °C? (minutes, 1 decimal place)",
        answer: 25.1,
        tol: 0.2,
        unit: "min",
        explain: "ratio = (90 − 20) ÷ (40 − 20) = 3.5. t = ln(3.5) ÷ 0.05 = 1.2528 ÷ 0.05 = 25.1 min.",
      },
    ],
  },
  {
    id: "Quiz5",
    slug: "specific-heat-capacity",
    title: "Specific Heat Capacity",
    icon: "bi-cup-hot",
    accent: "#e11d48",
    description:
      "Use Q = m × c × ΔT, compare materials, and find heat capacity.",
    lessons: ["Lesson5"],
    questions: [
      {
        inFinal: true,
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
        inFinal: true,
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
          "0.2 kg of aluminum is heated from 25 °C to 75 °C (c = 900 J/kg·K). How much heat?",
        answer: 9000,
        tol: 50,
        unit: "J",
        explain: "Q = 0.2 × 900 × 50 = 9,000 J.",
      },
      {
        inFinal: true,
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
    id: "Quiz6",
    slug: "calorimetry",
    title: "Calorimetry",
    icon: "bi-beaker",
    accent: "#db2777",
    description:
      "Set up heat balance equations, find final temperatures and unknown specific heats, and handle ice in warm water.",
    lessons: ["Lesson6"],
    questions: [
      {
        inFinal: true,
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
        inFinal: true,
        type: "numeric",
        prompt: "0.1 kg of water at 70 °C is mixed with 0.3 kg of water at 10 °C. Find the final temperature.",
        answer: 25,
        tol: 0.2,
        unit: "°C",
        explain: "Same substance, so c cancels: T_f = (0.1 × 70 + 0.3 × 10) ÷ 0.4 = 10 ÷ 0.4 = 25 °C.",
      },
      {
        type: "numeric",
        prompt: "0.2 kg of metal at 90 °C goes into 0.25 kg of water at 20 °C. The final temperature is 24 °C. Find c of the metal (nearest whole number).",
        answer: 317,
        tol: 2,
        unit: "J/kg·K",
        explain: "Water gains 0.25 × 4186 × 4 = 4,186 J. Metal loses 0.2 × c × 66 = 13.2c. c = 4,186 ÷ 13.2 = 317 J/kg·K.",
      },
      {
        type: "mc",
        prompt: "Your answer for the final temperature of a mixture is higher than both starting temperatures. This means …",
        options: [
          "there is a mistake, because T_f must lie between the starting temperatures",
          "the water boiled",
          "heat flowed from cold to hot",
          "the calorimeter added energy",
        ],
        a: 0,
        explain: "In an isolated system the final temperature must lie between the lowest and highest starting temperatures.",
      },
      {
        type: "mc",
        prompt: "In a calorimetry problem, the calorimeter constant is …",
        options: [
          "the heat capacity of the cup itself",
          "the specific heat of water",
          "the final temperature",
          "the mass of water used",
        ],
        a: 0,
        explain: "The cup also absorbs heat. Its heat capacity is the calorimeter constant.",
      },
      {
        type: "numeric",
        prompt: "Heat needed to warm 0.05 kg of ice from −10 °C to 0 °C and melt it all? (c_ice = 2090 J/kg·K, L_f = 3.34 × 10⁵ J/kg; nearest joule)",
        answer: 17745,
        tol: 2,
        unit: "J",
        explain: "Q = 0.05 × 2090 × 10 + 0.05 × 334,000 = 1,045 + 16,700 = 17,745 J.",
      },
      {
        inFinal: true,
        type: "numeric",
        prompt: "0.2 kg of ice at 0 °C goes into 0.1 kg of water at 20 °C. How many grams of ice melt? (c = 4186 J/kg·K, L_f = 3.34 × 10⁵ J/kg; nearest gram)",
        answer: 25,
        tol: 0.6,
        unit: "g",
        explain: "Q_available = 0.1 × 4186 × 20 = 8,372 J. Mass melted = 8,372 ÷ 334,000 = 0.025 kg = 25 g.",
      },
      {
        type: "mc",
        prompt: "In that same mix (0.2 kg of ice at 0 °C and 0.1 kg of water at 20 °C), the final temperature is …",
        options: [
          "exactly 0 °C, with ice and water together",
          "above 0 °C",
          "below 0 °C",
          "20 °C",
        ],
        a: 0,
        explain: "The water can only melt 25 g of the 200 g of ice, so ice and water end together at 0 °C.",
      },
      {
        type: "mc",
        prompt: "Why test three cases before mixing ice with warm water?",
        options: [
          "Melting needs a lot of energy, so the ice may not all melt",
          "Ice can only be mixed with water at 0 °C",
          "Water always freezes first",
          "Specific heat changes during mixing",
        ],
        a: 0,
        explain: "L_f is large (3.34 × 10⁵ J/kg), so the outcome depends on how much heat the water can give.",
      },
    ],
  },
  {
    id: "Quiz7",
    slug: "changes-of-state",
    title: "Changes of State",
    icon: "bi-snow",
    accent: "#0ea5e9",
    description:
      "Name each change of state, read a heating curve, and choose between Q = m × c × ΔT and Q = m × L.",
    lessons: ["Lesson7"],
    questions: [
      {
        inFinal: true,
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
        type: "mc",
        prompt: "Dry ice turns directly from solid to gas. This is called …",
        options: ["Sublimation", "Vaporization", "Melting", "Condensation"],
        a: 0,
        explain:
          "Solid → gas without becoming liquid: sublimation (about −78.5 °C at 1 atm).",
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
      {
        inFinal: true,
        type: "mc",
        prompt: "On a heating curve of water, the flat sections show …",
        options: [
          "changes of state at constant temperature",
          "the heater switched off",
          "the water cooling down",
          "measurement errors",
        ],
        a: 0,
        explain: "While melting or boiling, the energy breaks bonds, so the temperature stays the same.",
      },
      {
        inFinal: true,
        type: "mc",
        prompt: "Water warms from 20 °C to 80 °C. Which formula gives the heat?",
        options: [
          "Q = m × c × ΔT",
          "Q = m × L_f",
          "Q = m × L_v",
          "Q = P ÷ t",
        ],
        a: 0,
        explain: "The water stays liquid and its temperature changes, so use Q = m × c × ΔT.",
      },
      {
        type: "mc",
        prompt: "Why does the temperature stay at 0 °C while ice melts?",
        options: [
          "The energy breaks bonds instead of speeding up the particles",
          "The heater stops working",
          "Ice reflects the heat",
          "Water cannot go above 0 °C",
        ],
        a: 0,
        explain: "Average kinetic energy does not change during the state change, so the temperature does not change.",
      },
      {
        type: "mc",
        prompt: "When steam condenses into water, heat is …",
        options: [
          "released, with no temperature change",
          "absorbed, raising the temperature",
          "absorbed, with no temperature change",
          "neither absorbed nor released",
        ],
        a: 0,
        explain: "Condensing and freezing release heat. Melting and vaporizing absorb it.",
      },
      {
        type: "mc",
        prompt: "Evaporation is different from boiling because evaporation …",
        options: [
          "happens only at the surface, at any temperature",
          "happens only at 100 °C",
          "happens throughout the liquid",
          "needs no energy",
        ],
        a: 0,
        explain: "Boiling happens throughout the liquid at the boiling point. Evaporation happens at the surface at any temperature.",
      },
      {
        type: "numeric",
        prompt: "Heat to warm 0.1 kg of ice from −10 °C to 0 °C? (c_ice = 2090 J/kg·K)",
        answer: 2090,
        tol: 1,
        unit: "J",
        explain: "Q = m × c × ΔT = 0.1 × 2090 × 10 = 2,090 J.",
      },
      {
        type: "numeric",
        prompt: "Heat to turn 0.1 kg of ice at 0 °C into water at 100 °C? (L_f = 3.34 × 10⁵ J/kg, c = 4186 J/kg·K; nearest joule)",
        answer: 75260,
        tol: 5,
        unit: "J",
        explain: "Melt: 0.1 × 334,000 = 33,400 J. Warm: 0.1 × 4186 × 100 = 41,860 J. Total = 75,260 J.",
      },
    ],
  },
  {
    id: "Quiz8",
    slug: "specific-latent-heat",
    title: "Specific Latent Heat",
    icon: "bi-lightning-charge",
    accent: "#8b5cf6",
    description:
      "Use Q = m × L with Q = P × t, find L, mass or time, and explain how L is measured.",
    lessons: ["Lesson8"],
    questions: [
      {
        inFinal: true,
        type: "numeric",
        prompt:
          "How much heat melts 0.3 kg of ice at 0 °C? (L_f = 3.34 × 10⁵ J/kg)",
        answer: 100200,
        tol: 300,
        unit: "J",
        explain: "Q = m × L = 0.3 × 334,000 = 100,200 J.",
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
        inFinal: true,
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
        inFinal: true,
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
        type: "numeric",
        prompt: "How much water at 100 °C can 678,000 J boil away? (L_v = 2.26 × 10⁶ J/kg; kg, 2 decimal places)",
        answer: 0.3,
        tol: 0.005,
        unit: "kg",
        explain: "m = Q ÷ L = 678,000 ÷ 2,260,000 = 0.30 kg.",
      },
      {
        type: "numeric",
        prompt: "A heater runs at 12 V and 5 A for 200 s. How much energy does it supply?",
        answer: 12000,
        tol: 1,
        unit: "J",
        explain: "Q = V × I × t = 12 × 5 × 200 = 12,000 J.",
      },
      {
        type: "numeric",
        prompt: "A heater supplies 50,000 J, but only 40,000 J reaches the ice. What is the efficiency?",
        answer: 80,
        tol: 0.5,
        unit: "%",
        explain: "Efficiency = useful energy ÷ energy supplied × 100% = 40,000 ÷ 50,000 × 100% = 80%.",
      },
      {
        type: "mc",
        prompt: "While measuring L_v, heat escapes from the heater to the room and is not corrected for. The calculated L will be …",
        options: [
          "too high",
          "too low",
          "exactly right",
          "zero",
        ],
        a: 0,
        explain: "Some of the energy counted as Q never reached the water, so Q ÷ m comes out too large. A control run without the heater corrects for this.",
      },
    ],
  },
  {
    id: "Quiz9",
    slug: "gas-laws-and-temperature",
    title: "Gas Laws and Temperature",
    icon: "bi-balloon",
    accent: "#6366f1",
    description:
      "Apply Boyle's, Charles's and the ideal gas law, and link particle speed to temperature.",
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
        inFinal: true,
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
        inFinal: true,
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
        inFinal: true,
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

// Final exam across all nine lessons; passing it finishes no lesson.
const FINAL_EXAM = {
  id: "Quiz10",
  slug: "final-exam",
  title: "Temperature and Heat: All Topics",
  icon: "bi-mortarboard",
  accent: "#c2410c",
  description:
    "A long quiz covering every lesson, from temperature scales to gas laws. Best taken after finishing all nine lessons.",
  final: true,
  lessons: [],
  questions: LESSON_QUIZZES.flatMap((q) => q.questions.filter((x) => x.inFinal)),
};

export const QUIZZES = [...LESSON_QUIZZES, FINAL_EXAM];

export const QUIZ_BY_SLUG = Object.fromEntries(QUIZZES.map((q) => [q.slug, q]));
export const QUIZ_BY_ID = Object.fromEntries(QUIZZES.map((q) => [q.id, q]));

// Mascot "Cinder" knowledge base, keyword → answers
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
    a: "Conduction = heat through direct contact. H = kAΔT/L. Copper (k = 401) beats wool insulation (k = 0.04) by ~10,000×! Play with the rod simulation in Lesson 3.",
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
      "cinder",
    ],
    a: "Hi! I'm Cinder 🔥, your physics buddy. Ask me about temperature, heat transfer, formulas, or quizzes. Or just click me for a fun fact!",
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
