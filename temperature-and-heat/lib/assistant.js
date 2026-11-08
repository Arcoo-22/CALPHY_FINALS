import { CONSTANTS_BOX, FORMULA_SHEET, LESSONS } from "@/lib/lessons";
import { SPECIFIC_HEAT, UNIVERSAL } from "@/lib/constants";

const STOP_WORDS = new Set([
  "about", "after", "also", "and", "are", "can", "calculate", "could",
  "does", "explain", "find", "for", "from", "give", "how", "into", "is",
  "lesson", "me", "more", "please", "show", "tell", "that", "the", "this",
  "page", "to", "use", "what", "when", "where", "which", "with", "would",
  "cinder", "calphy",
]);

const COURSE_HINTS = new Set([
  "heat", "temperature", "thermal", "energy", "particle", "particles",
  "celsius", "fahrenheit", "kelvin", "conduction", "convection", "radiation",
  "specific", "latent", "calorimetry", "gas", "pressure", "volume", "kinetic",
  "melting", "boiling", "phase", "thermometer", "formula", "physics",
]);

const SITE_PAGES = [
  { title: "Lessons", href: "/lessons" },
  { title: "Simulations", href: "/simulations" },
  { title: "Quizzes", href: "/quizzes" },
  { title: "Formulas", href: "/formulas" },
  { title: "Dashboard", href: "/dashboard" },
];

const COURSE_ENTRIES = [
  ...LESSONS.map((lesson) => ({
    title: `Lesson ${lesson.n}: ${lesson.title}`,
    href: `/lessons/${lesson.slug}`,
    text: [
      lesson.tagline,
      lesson.overview,
      ...(lesson.objectives || []),
      ...(lesson.keyTerms || []).map((term) => `${term.term}: ${term.def}`),
      ...(lesson.sections || []).flatMap((section) => [
        section.heading,
        ...(section.paragraphs || []),
        ...(section.bullets || []),
        ...(section.steps || []),
        ...(section.formulasInline || []),
      ]),
      ...(lesson.formulas || []).map(
        (formula) =>
          `${formula.title}: ${formula.display || `${formula.lhs} ${formula.num || ""} ÷ ${formula.den || ""}`}. ${formula.inWords || ""}. ${formula.where || ""}.`,
      ),
      ...(lesson.examples || []).flatMap((example) => [
        example.title,
        ...(example.steps || []),
        example.answer,
      ]),
      ...(lesson.takeaways || []),
    ]
      .filter(Boolean)
      .join("\n"),
  })),
  ...FORMULA_SHEET.map((formula) => ({
    title: `${formula.name} formula`,
    href: "/formulas",
    text: `${formula.display}\n${formula.useWhen}`,
  })),
  ...CONSTANTS_BOX.map(([title, value]) => ({
    title,
    href: "/formulas",
    text: `${title} ${value}`,
  })),
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/celcius/g, "celsius")
    .replace(/farenheit/g, "fahrenheit")
    .replace(/fahrenheight/g, "fahrenheit")
    .replace(/temprature/g, "temperature")
    .replace(/\bformulas?\b/g, "formula")
    .replace(/\bequations?\b/g, "equation");
}

function tokenize(text) {
  return new Set(normalize(text).match(/[a-z0-9]+/g) || []);
}

export function findCourseMatches(query) {
  const terms = [...tokenize(query)].filter(
    (term) => term.length > 2 && !STOP_WORDS.has(term),
  );
  if (!terms.length) return [];

  const ranked = COURSE_ENTRIES.map((entry) => {
    const titleTerms = tokenize(entry.title);
    const bodyTerms = tokenize(entry.text);
    const titleMatches = terms.filter((term) => titleTerms.has(term)).length;
    const bodyMatches = terms.filter((term) => bodyTerms.has(term)).length;
    return { ...entry, score: titleMatches * 4 + bodyMatches };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) return [];
  return ranked
    .filter(
      (entry, index) =>
        entry.score >= Math.max(2, ranked[0].score * 0.45) && index < 3,
    )
    .map(({ title, href, text, score }) => ({ title, href, text, score }));
}

function sentenceExcerpt(text, question) {
  const terms = [...tokenize(question)].filter(
    (term) => term.length > 2 && !STOP_WORDS.has(term),
  );
  const formulaIntent = /\b(formula|equation)\b/i.test(normalize(question));
  const sentences = text.split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/);
  const scored = sentences
    .map((sentence, index) => {
      const words = tokenize(sentence);
      const isFormula = /(?:=|÷|×|\/)/.test(sentence);
      return {
        sentence: sentence.trim(),
        index,
        score:
          terms.reduce((total, term) => total + Number(words.has(term)), 0) +
          Number(formulaIntent && isFormula) * 10,
      };
    })
    .filter((item) => item.sentence && item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, formulaIntent ? 6 : 4)
    .sort((a, b) => a.index - b.index);

  return scored.length
    ? scored.map(({ sentence }) => sentence).join(" ")
    : sentences.slice(0, 3).join(" ").trim();
}

function sourceForLesson(lesson) {
  return { title: `Lesson ${lesson.n}: ${lesson.title}`, href: `/lessons/${lesson.slug}` };
}

export function isFrustratedReply(text) {
  return /\b(?:are you kidding me|are you serious|you(?:'re| are) kidding|that(?:'s| is) wrong|this is wrong|you(?:'re| are) wrong|not what i asked|that makes no sense|you didn(?:'t|t) answer|you missed the point|what are you talking about)\b/i.test(
    text,
  );
}

function makeAnswer(answer, { links = [], sources = [] } = {}) {
  return { answer, links, sources };
}

function findLesson(question) {
  const q = normalize(question);
  const number = q.match(/\blesson\s*(\d+)\b/);
  if (number) {
    return LESSONS.find((lesson) => lesson.n === Number(number[1]));
  }
  return LESSONS.find(
    (lesson) =>
      q.includes(lesson.slug.replace(/-/g, " ")) ||
      q.includes(normalize(lesson.title)),
  );
}

function getTemperature(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return (value - 32) / 1.8;
  return value - 273.15;
}

function findTemperatureChange(question) {
  const range = question.match(
    /\bfrom\s*(-?\d+(?:\.\d+)?)\s*(?:degrees?\s*)?(?:°\s*)?(celsius|fahrenheit|kelvin|[cfk])?\s+to\s*(-?\d+(?:\.\d+)?)\s*(?:degrees?\s*)?(?:°\s*)?(celsius|fahrenheit|kelvin|[cfk])?\b/,
  );
  if (range) {
    const fromUnit = (range[2] || range[4])?.[0];
    const toUnit = (range[4] || range[2])?.[0];
    if (fromUnit && toUnit) {
      const initial = getTemperature(Number(range[1]), fromUnit);
      const final = getTemperature(Number(range[3]), toUnit);
      if (initial < -273.15 || final < -273.15) return null;
      return final - initial;
    }
  }

  const change = question.match(
    /(?:delta\s*t|δt|temperature\s+(?:change|increase|rise|difference|decrease|drop)|(?:increase|raise|decrease|drop|drops|cool|cools|change)\s+(?:the temperature\s+)?by)\s*(?:of\s*)?(-?\d+(?:\.\d+)?)/i,
  );
  if (!change) return null;
  const value = Number(change[1]);
  return /\b(decrease|drop|cool)\b/.test(question)
    ? -Math.abs(value)
    : value;
}

function formatConversionAnswer(value, from, to, celsius, result) {
  const scale = { c: "°C", f: "°F", k: "K" };
  const names = { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" };
  const res = Number(result.toFixed(2));
  const c = Number(celsius.toFixed(2));

  if (from === to) {
    return `Both values use the same scale (${scale[from]}): **${value} ${scale[from]} = ${value} ${scale[to]}**.`;
  }

  let steps = "";
  if (from === "f" && to === "k") {
    steps =
      `1. **Convert Fahrenheit to Celsius:** °C = (°F − 32) ÷ 1.8 → (${value} − 32) ÷ 1.8 = **${c} °C**\n` +
      `2. **Convert Celsius to Kelvin:** K = °C + 273.15 → ${c} + 273.15 = **${res} K**`;
  } else if (from === "k" && to === "f") {
    steps =
      `1. **Convert Kelvin to Celsius:** °C = K − 273.15 → ${value} − 273.15 = **${c} °C**\n` +
      `2. **Convert Celsius to Fahrenheit:** °F = (1.8 × °C) + 32 → (1.8 × ${c}) + 32 = **${res} °F**`;
  } else if (from === "c" && to === "f") {
    steps =
      `• **Formula:** °F = (1.8 × °C) + 32\n` +
      `• **Calculation:** (1.8 × ${value}) + 32 = **${res} °F**`;
  } else if (from === "f" && to === "c") {
    steps =
      `• **Formula:** °C = (°F − 32) ÷ 1.8\n` +
      `• **Calculation:** (${value} − 32) ÷ 1.8 = **${res} °C**`;
  } else if (from === "c" && to === "k") {
    steps =
      `• **Formula:** K = °C + 273.15\n` +
      `• **Calculation:** ${value} + 273.15 = **${res} K**`;
  } else if (from === "k" && to === "c") {
    steps =
      `• **Formula:** °C = K − 273.15\n` +
      `• **Calculation:** ${value} − 273.15 = **${res} °C**`;
  }

  return `To convert **${value} ${scale[from]}** to **${names[to]}**:\n\n${steps}\n\n**${value} ${scale[from]} = ${res} ${scale[to]}**.`;
}

function formatConversionFormula(from, to) {
  const names = { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" };
  if (from === to) {
    return `Both scales are the same (${names[from]}), so no conversion formula is needed.`;
  }
  if (from === "f" && to === "k") {
    return (
      `To convert from **Fahrenheit (°F)** to **Kelvin (K)**, convert to Celsius first:\n\n` +
      `1. **Fahrenheit to Celsius:** °C = (°F − 32) ÷ 1.8\n` +
      `2. **Celsius to Kelvin:** K = °C + 273.15`
    );
  }
  if (from === "k" && to === "f") {
    return (
      `To convert from **Kelvin (K)** to **Fahrenheit (°F)**, convert to Celsius first:\n\n` +
      `1. **Kelvin to Celsius:** °C = K − 273.15\n` +
      `2. **Celsius to Fahrenheit:** °F = (1.8 × °C) + 32`
    );
  }
  if (from === "c" && to === "f") {
    return `To convert from **Celsius (°C)** to **Fahrenheit (°F)**:\n\n• **Formula:** °F = (1.8 × °C) + 32`;
  }
  if (from === "f" && to === "c") {
    return `To convert from **Fahrenheit (°F)** to **Celsius (°C)**:\n\n• **Formula:** °C = (°F − 32) ÷ 1.8`;
  }
  if (from === "c" && to === "k") {
    return `To convert from **Celsius (°C)** to **Kelvin (K)**:\n\n• **Formula:** K = °C + 273.15`;
  }
  if (from === "k" && to === "c") {
    return `To convert from **Kelvin (K)** to **Celsius (°C)**:\n\n• **Formula:** °C = K − 273.15`;
  }
  return null;
}

function calculationAnswer(question) {
  const q = normalize(question);
  const calculateIntent =
    /\b(calculate|compute|work out|solve for|how much (?:heat|energy)|find (?:the )?(?:heat|energy|q))\b/.test(q) ||
    /\bq\s*=/.test(q);
  const conversion = q.match(
    /(?:convert\s+)?(?:from\s+)?(-?\d+(?:\.\d+)?)\s*(?:degrees?|deg\.?)?\s*°?\s*(c|celsius|f|fahrenheit|k|kelvin)s?\s+(?:to|in|into)\s*°?\s*(?:degrees?|deg\.?)?\s*(c|celsius|f|fahrenheit|k|kelvin)s?\b/,
  );
  if (conversion) {
    const value = Number(conversion[1]);
    const from = conversion[2][0];
    const to = conversion[3][0];
    const celsius = getTemperature(value, from);
    const result = to === "c" ? celsius : to === "f" ? celsius * 1.8 + 32 : celsius + 273.15;
    const lesson = LESSONS.find((item) => item.n === 1);
    if (celsius < -273.15) {
      return makeAnswer(
        "That conversion is below absolute zero (0 K), so it isn’t physically possible. Check the temperature value and try again.",
        { sources: [sourceForLesson(lesson)] },
      );
    }
    return makeAnswer(
      formatConversionAnswer(value, from, to, celsius, result),
      { sources: [sourceForLesson(lesson)] },
    );
  }

  const formulaQuery = q.match(
    /\b(?:how (?:to|do (?:i|you|we))|formula (?:for|to)|explain (?:how to)?)\s*(?:convert\s+)?(?:from\s+)?(c|celsius|f|fahrenheit|k|kelvin)s?\s+(?:to|in|into)\s*(?:degrees?|deg\.?)?\s*(c|celsius|f|fahrenheit|k|kelvin)s?\b/,
  );
  if (formulaQuery) {
    const from = formulaQuery[1][0];
    const to = formulaQuery[2][0];
    const formulaText = formatConversionFormula(from, to);
    if (formulaText) {
      const lesson = LESSONS.find((item) => item.n === 1);
      return makeAnswer(formulaText, { sources: [sourceForLesson(lesson)] });
    }
  }

  const specificHeatIntent =
    calculateIntent && /\b(heat|energy|specific heat|q\s*=|mc\s*delta)\b/.test(q);
  if (specificHeatIntent) {
    const lesson = LESSONS.find((item) => item.n === 5);
    const massMatch = q.match(/\b(\d+(?:\.\d+)?)\s*(kg|g)\b/);
    const material = SPECIFIC_HEAT.find(({ name }) =>
      new RegExp(`\\b${name.toLowerCase()}\\b`).test(q),
    );
    const delta = findTemperatureChange(q);
    if (
      !massMatch ||
      Number(massMatch[1]) <= 0 ||
      !material ||
      delta === null
    ) {
      return makeAnswer(
        "I can calculate this with **Q = m × c × ΔT**. Please include the mass with units (g or kg), the material, and either the temperature change or starting and ending temperatures.",
        { sources: [sourceForLesson(lesson)] },
      );
    }
    const mass = Number(massMatch[1]) * (massMatch[2] === "g" ? 0.001 : 1);
    const energy = mass * material.value * delta;
    return makeAnswer(
      `Using **Q = m × c × ΔT** for ${material.name}: Q = ${mass} kg × ${material.value} J/kg·K × ${Number(delta.toFixed(2))} K = **${Number(energy.toFixed(2)).toLocaleString("en-US")} J**.`,
      { sources: [sourceForLesson(lesson)] },
    );
  }

  const latentIntent =
    calculateIntent && /\b(latent|melt|melting|vapor|boil|boiling)\b/.test(q);
  if (latentIntent) {
    const lesson = LESSONS.find((item) => item.n === 8);
    const massMatch = q.match(/\b(\d+(?:\.\d+)?)\s*(kg|g)\b/);
    if (!massMatch || Number(massMatch[1]) <= 0) {
      return makeAnswer(
        "I can calculate latent heat with **Q = m × L**. Please provide the mass in grams or kilograms and say whether the change is melting or boiling.",
        { sources: [sourceForLesson(lesson)] },
      );
    }
    const mass = Number(massMatch[1]) * (massMatch[2] === "g" ? 0.001 : 1);
    const vaporization = /\b(vapor|boil|boiling)\b/.test(q);
    const latent = vaporization ? UNIVERSAL.Lv : UNIVERSAL.Lf;
    const phase = vaporization ? "vaporization" : "fusion (melting)";
    const result = mass * latent;
    return makeAnswer(
      `Using **Q = m × L** for water’s ${phase}: Q = ${mass} kg × ${latent.toLocaleString("en-US")} J/kg = **${Number(result.toFixed(2)).toLocaleString("en-US")} J**.`,
      { sources: [sourceForLesson(lesson)] },
    );
  }

  if (calculateIntent) {
    const matches = findCourseMatches(question);
    return makeAnswer(
      "I can help calculate Temperature & Heat quantities, but I need a supported formula and its values with units. Which course formula are you using?",
      { sources: matches.slice(0, 1).map(({ title, href }) => ({ title, href })) },
    );
  }
  return null;
}

const CORE_CONCEPTS = [
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?heat\b/i,
    answer:
      "**Heat ($Q$)** is thermal energy in transit — the energy that flows naturally from a hotter object to a colder one because of a temperature difference.\n\n" +
      "• **Unit:** Joules (J).\n" +
      "• **Key distinction:** Heat is *energy being transferred*. Temperature measures average particle kinetic energy, while thermal energy is the total internal energy of the system.",
    source: { title: "Lesson 2: Heat and Temperature", href: "/lessons/heat-and-temperature" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?temperature\b/i,
    answer:
      "**Temperature** is a physical quantity that measures the average kinetic energy of the particles in a substance. When particles move or vibrate faster, the temperature is higher.\n\n" +
      "• **Scales:** Celsius (°C), Fahrenheit (°F), and Kelvin (K, the SI absolute scale where $0\\text{ K} = -273.15\\text{ }^\\circ\\text{C}$ is absolute zero).",
    source: { title: "Lesson 1: Temperature and Thermometers", href: "/lessons/temperature-scales" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?thermal energy\b/i,
    answer:
      "**Thermal energy** is the total internal energy of all the particles within an object (both kinetic and potential). Unlike temperature (which is an average), thermal energy scales with both temperature and the total mass.",
    source: { title: "Lesson 2: Heat and Temperature", href: "/lessons/heat-and-temperature" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?conduction\b/i,
    answer:
      "**Conduction** is the transfer of heat through direct contact between adjacent particles in a material without any bulk movement of the substance itself.\n\n" +
      "• **Mechanism:** Fast-vibrating hot particles collide with neighboring slower particles, passing kinetic energy along the line.\n" +
      "• **Rate equation:** $H = \\frac{kA\\Delta T}{L}$, where $k$ is thermal conductivity, $A$ is cross-sectional area, and $L$ is length.",
    source: { title: "Lesson 3: Thermal Conduction", href: "/lessons/conduction" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?convection\b/i,
    answer:
      "**Convection** is the transfer of heat by the bulk movement of a fluid (liquid or gas).\n\n" +
      "• **Mechanism:** Heated fluid expands, becomes less dense, and rises. Cooler, denser fluid sinks to replace it, creating continuous **convection currents**.",
    source: { title: "Lesson 4: Convection and Radiation", href: "/lessons/convection-and-radiation" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?(?:thermal\s+)?radiation\b/i,
    answer:
      "**Thermal radiation** is the transfer of heat by electromagnetic waves (primarily infrared photons). Unlike conduction and convection, radiation requires no matter or medium — it travels across a vacuum at the speed of light.",
    source: { title: "Lesson 4: Convection and Radiation", href: "/lessons/convection-and-radiation" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?(?:specific\s+)?heat capacity\b|\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?specific heat\b/i,
    answer:
      "**Specific heat capacity ($c$)** is the amount of heat energy required to raise the temperature of 1 kilogram of a substance by 1 Kelvin (or 1 °C).\n\n" +
      "• **Formula:** $Q = m \\cdot c \\cdot \\Delta T$\n" +
      "• **Unit:** $\\text{J}/(\\text{kg}\\cdot\\text{K})$. For example, water has a high specific heat ($4184\\text{ J}/\\text{kg}\\cdot\\text{K}$), meaning it resists rapid temperature swings.",
    source: { title: "Lesson 5: Specific Heat Capacity", href: "/lessons/specific-heat-capacity" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?(?:specific\s+)?latent heat\b/i,
    answer:
      "**Specific latent heat ($L$)** is the heat energy absorbed or released per kilogram of a substance during a constant-temperature phase change (melting, freezing, boiling, or condensing).\n\n" +
      "• **Formula:** $Q = m \\cdot L$\n" +
      "• **Types:** Latent heat of fusion ($L_f$) for melting/freezing, and latent heat of vaporization ($L_v$) for boiling/condensing.",
    source: { title: "Lesson 8: Specific Latent Heat", href: "/lessons/latent-heat" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?calorimetry\b/i,
    answer:
      "**Calorimetry** is the experimental technique of measuring heat transfer during physical or chemical processes in an insulated container called a calorimeter.\n\n" +
      "• **Core principle:** In an isolated system, heat lost by warmer objects equals heat gained by cooler ones ($Q_{\\text{lost}} + Q_{\\text{gained}} = 0$).",
    source: { title: "Lesson 6: Calorimetry and Thermal Equilibrium", href: "/lessons/calorimetry" },
  },
  {
    regex: /\b(?:what is|what are|define|meaning of|explain)\s+(?:the\s+)?(?:ideal\s+)?gas laws?\b/i,
    answer:
      "**Gas laws** describe how the pressure ($P$), volume ($V$), and absolute temperature ($T$, in Kelvin) of a gas relate to one another, summarized in the **Ideal Gas Law**:\n\n" +
      "• **Equation:** $PV = nRT$ (where $n$ is moles and $R = 8.314\\text{ J}/\\text{mol}\\cdot\\text{K}$).\n" +
      "• **Key laws:** Boyle's Law ($P \\propto 1/V$), Charles's Law ($V \\propto T$), and Gay-Lussac's Law ($P \\propto T$).",
    source: { title: "Lesson 9: Gas Laws and Temperature", href: "/lessons/gas-laws" },
  },
];

export function resolveLocalAction(question) {
  const rawQ = normalize(question);
  const q = rawQ.replace(/^(?:hey|hi|hello)?\s*\b(?:cinder|calphy)\b[,:\s-]*/i, "").trim();

  // Self-identity & what Cinder does
  const isIdentityQuery =
    /^(?:who (?:are you|r u|is cinder)|what(?:'s| is) your name|your name|what are you|what r u|what (?:do you|can you|can u) do|what is your (?:purpose|job|role)|what is cinder|tell me about yourself|introduce yourself|about yourself|who (?:made|created|built) you)\b/i.test(
      q,
    ) ||
    (/^(?:who are you|who is cinder|what is your name|what do you do|what can you do|about you|cinder)\b/i.test(
      rawQ,
    ) && (q.length === 0 || /^(?:who are you|who is cinder|what is your name|what do you do|what can you do)\b/i.test(q)));

  if (isIdentityQuery) {
    return makeAnswer(
      "I’m **Cinder**, the physics mascot and learning assistant for **Ignius**! I’m here to help you explore Temperature & Heat physics.\n\n" +
      "Here is what I can do for you:\n" +
      "• **Explain Concepts**: Ask me about heat, temperature, thermal energy, conduction, convection, radiation, specific heat, phase changes, or gas laws.\n" +
      "• **Solve Calculations**: I can convert temperatures (°C, °F, K), calculate heat transfer ($Q = mc\\Delta T$), and compute latent heat ($Q = mL$).\n" +
      "• **Guide Your Learning**: Ask me to open or preview any of the 9 lessons, 10 interactive simulations, quizzes, or formulas.\n\n" +
      "What would you like to explore?",
      {
        links: [
          { label: "Browse lessons", href: "/lessons" },
          { label: "Interactive simulations", href: "/simulations" },
          { label: "Formula sheet", href: "/formulas" },
        ],
      },
    );
  }

  if (
    /^(?:thanks|thank you|thank you so much|you(?:'re| are) (?:so )?(?:good|great|awesome|amazing|the best)|good bot|nice work|well done)\b/.test(
      q || rawQ,
    )
  ) {
    return makeAnswer("Thanks! I’m glad I could help. Let me know if you have another Temperature & Heat question.");
  }
  if (!q || /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(rawQ)) {
    return makeAnswer(
      "Hi! I’m Cinder. I can help with Temperature & Heat lessons, explain course topics, find a page, or work through a course calculation.",
      { links: [{ label: "Browse lessons", href: "/lessons" }] },
    );
  }

  // Core concept definitions ("what is heat?", "cinder, what is conduction?", etc.)
  for (const concept of CORE_CONCEPTS) {
    if (concept.regex.test(q || rawQ)) {
      return makeAnswer(concept.answer, {
        sources: [concept.source],
        links: [{ label: `Open ${concept.source.title}`, href: concept.source.href }],
      });
    }
  }

  const lesson = findLesson(q || question);
  const navigationIntent =
    /\b(where|find|open|go to|link|take me|access|navigate)\b/.test(q);
  if (lesson && navigationIntent) {
    const source = sourceForLesson(lesson);
    return makeAnswer(`Open **${source.title}** here.`, {
      links: [{ label: `Open ${source.title}`, href: source.href }],
    });
  }

  if (navigationIntent) {
    const page = SITE_PAGES.find((item) => {
      const title = item.title.toLowerCase();
      return q.includes(title) || q.includes(title.replace(/s$/, ""));
    });
    if (page) {
      return makeAnswer(`Open **${page.title}** here.`, {
        links: [{ label: `Open ${page.title}`, href: page.href }],
      });
    }
  }

  if (
    /\b(preview|what (?:will|does) .* (?:contain|cover|include)|what content .* lesson|lesson .* (?:contain|cover|include|content)|content .* lesson)\b/.test(q)
  ) {
    if (!lesson) {
      return makeAnswer(
        "Which lesson would you like to preview? There are nine lessons in the Temperature & Heat course.",
        { links: [{ label: "Browse all lessons", href: "/lessons" }] },
      );
    }
    const source = sourceForLesson(lesson);
    return makeAnswer(`**${source.title}** covers ${lesson.tagline.toLowerCase()}`, {
      links: [{ label: `Preview Lesson ${lesson.n}`, href: source.href }],
      sources: [source],
    });
  }

  return calculationAnswer(q || question);
}

export function isCourseRelated(question, matches = findCourseMatches(question)) {
  const clean = question.replace(/^(?:hey|hi|hello)?\s*\b(?:cinder|calphy)\b[,:\s-]*/i, "").trim();
  const q = normalize(clean || question);
  return (
    matches.length > 0 ||
    /\blesson\s*\d+\b/.test(q) ||
    LESSONS.some((lesson) => q.includes(normalize(lesson.title))) ||
    [...tokenize(question)].some((term) => COURSE_HINTS.has(term))
  );
}

export function requestsWebSearch(question) {
  return /\b(?:search|look up|find)\b.{0,40}\b(?:web|online|internet)\b|\b(?:web|online|internet)\b.{0,40}\b(?:search|lookup)\b/i.test(question);
}

export function buildCourseFallback(question, matches, notice) {
  const closest = matches[0];
  return {
    answer: `The closest course match is **${closest.title}**. ${sentenceExcerpt(closest.text, question)}`,
    notice,
    links: [],
    sources: [{ title: closest.title, href: closest.href }],
  };
}

export function buildCourseCorrection(question, matches) {
  const formulaIntent = /\b(formula|equation)\b/i.test(normalize(question));
  if (formulaIntent) {
    const terms = tokenize(question);
    const formulaLessons = LESSONS.map((lesson) => {
      const titleTerms = [...tokenize(lesson.title)].filter(
        (term) => term.length >= 6 && !STOP_WORDS.has(term),
      );
      return {
        lesson,
        score: titleTerms.filter((term) => terms.has(term)).length,
      };
    })
      .filter(({ lesson, score }) => score && lesson.formulas?.length)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (formulaLessons.length) {
      const sections = formulaLessons.map(({ lesson }) => {
        const formulaLines = lesson.formulas
          .slice(0, 2)
          .map((formula) => {
            const expression =
              formula.display ||
              `${formula.lhs} ${formula.num || ""}${
                formula.den ? ` ÷ ${formula.den}` : ""
              }`;
            return `- **${formula.title}:** ${expression}${
              formula.where ? `\n  ${formula.where}` : ""
            }`;
          })
          .join("\n");
        return `**Lesson ${lesson.n}: ${lesson.title}**\n${formulaLines}`;
      });

      return {
        answer: `You’re right — I missed the formulas in the course. Here they are:\n\n${sections.join("\n\n")}`,
        links: [],
        sources: formulaLessons.map(({ lesson }) => sourceForLesson(lesson)),
      };
    }
  }

  const usedMatches = matches.slice(0, 2);
  const evidence = usedMatches
    .map((match) => sentenceExcerpt(match.text, question))
    .filter(Boolean)
    .join("\n\n");
  const sources = [...new Map(
    usedMatches.map(({ title, href }) => [
      href,
      { title: href === "/formulas" ? "Formula sheet" : title, href },
    ]),
  ).values()];
  return {
    answer: `You’re right — my previous answer missed the relevant course material. Here’s the direct answer:\n\n${evidence}`,
    links: [],
    sources,
  };
}

export function selectSourcesForAnswer(answer, matches, question = "") {
  const answerTerms = [...tokenize(answer)].filter(
    (term) => term.length > 2 && !STOP_WORDS.has(term),
  );
  const questionTerms = [...tokenize(question)].filter(
    (term) => term.length > 2 && !STOP_WORDS.has(term),
  );
  const ranked = matches
    .map((match) => {
      const sourceTerms = tokenize(`${match.title} ${match.text}`);
      const matchedTerms = answerTerms.filter((term) => sourceTerms.has(term));
      const answeredQuestionTerms = questionTerms.filter(
        (term) => answerTerms.includes(term) && sourceTerms.has(term),
      );
      const titleTerms = tokenize(match.title);
      const titleMatches = answerTerms.filter((term) => titleTerms.has(term));
      return {
        title: match.title,
        href: match.href,
        score: matchedTerms.length,
        titleMatches: titleMatches.length,
        answeredQuestionTerms: answeredQuestionTerms.length,
      };
    })
    .filter(
      (source) =>
        source.score >= 2 &&
        (source.answeredQuestionTerms > 0 || source.titleMatches > 0),
    )
    .sort(
      (a, b) =>
        b.answeredQuestionTerms - a.answeredQuestionTerms ||
        b.titleMatches - a.titleMatches ||
        b.score - a.score,
    )
    .slice(0, 1)
    .map(({ title, href }) => ({ title, href }));
  return ranked;
}

export function getModelContext(matches, question) {
  return matches.slice(0, 2).map((match) => ({
    title: match.title,
    href: match.href,
    excerpt: sentenceExcerpt(match.text, question),
  }));
}
