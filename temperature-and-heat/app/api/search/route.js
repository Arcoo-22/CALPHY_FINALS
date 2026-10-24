import { NextResponse } from "next/server";
import { CONSTANTS_BOX, FORMULA_SHEET, LESSONS } from "@/lib/lessons";
import { QUIZZES } from "@/lib/quizzes";

const pages = [
  {
    title: "Home",
    type: "Page",
    href: "/",
    text: "CalphyLearn temperature heat physics learning",
  },
  {
    title: "Lessons",
    type: "Page",
    href: "/lessons",
    text: "All lessons and topic units",
  },
  {
    title: "Simulations",
    type: "Page",
    href: "/simulations",
    text: "Simulation lab interactive canvas models",
  },
  {
    title: "Quizzes",
    type: "Page",
    href: "/quizzes",
    text: "Auto-graded quizzes",
  },
  {
    title: "Formulas",
    type: "Page",
    href: "/formulas",
    text: "Formula sheet constants",
  },
  {
    title: "Dashboard",
    type: "Page",
    href: "/dashboard",
    text: "Progress lesson quiz scores",
  },
  {
    title: "Log in",
    type: "Page",
    href: "/login",
    text: "Log in to sync your progress",
  },
  {
    title: "Register",
    type: "Page",
    href: "/register",
    text: "Create an account",
  },
];

const simulations = [
  {
    title: "Interactive thermometer",
    anchor: "thermometer",
    text: "temperature scales liquid glass thermometer particle speed",
  },
  {
    title: "Particle model",
    anchor: "particles",
    text: "heat energy particle motion cup pool average thermal energy",
  },
  {
    title: "Heat transfer modes",
    anchor: "modes",
    text: "conduction convection radiation campfire",
  },
  {
    title: "Conduction",
    anchor: "conduction",
    text: "heat equation rod copper foam thermal conductivity",
  },
  {
    title: "Convection and radiation",
    anchor: "convection-radiation",
    text: "moving fluid pot photon streams Wien law",
  },
  {
    title: "Specific heat",
    anchor: "specific-heat",
    text: "materials burner temperature time graph specific heat capacity",
  },
  {
    title: "Calorimetry",
    anchor: "calorimetry",
    text: "hot metal water ice energy balance calorimeter",
  },
  {
    title: "Heating curve",
    anchor: "heating-curve",
    text: "ice steam plateaus phase changes heating curve",
  },
  {
    title: "Latent heat",
    anchor: "latent-heat",
    text: "melting boiling heater latent heat energy",
  },
  {
    title: "Gas laws",
    anchor: "gas",
    text: "pressure volume temperature particles isochoric isobaric isothermal ideal gas",
  },
].map((simulation) => ({
  ...simulation,
  type: "Simulation",
  href: `/simulations#${simulation.anchor}`,
}));

const records = [
  ...pages,
  ...LESSONS.map((lesson) => ({
    title: `Lesson ${lesson.n}: ${lesson.title}`,
    type: "Lesson",
    href: `/lessons/${lesson.slug}`,
    text: JSON.stringify(lesson),
    summary: lesson.tagline,
  })),
  ...QUIZZES.map((quiz) => ({
    title: quiz.title,
    type: "Quiz",
    href: `/quizzes/${quiz.slug}`,
    text: JSON.stringify(quiz),
    summary: quiz.description,
  })),
  ...FORMULA_SHEET.map((formula) => ({
    title: formula.name,
    type: "Formula",
    href: "/formulas",
    text: `${formula.name} ${formula.display} ${formula.useWhen}`,
    summary: `${formula.display} Use when: ${formula.useWhen}`,
  })),
  ...CONSTANTS_BOX.map(([name, value]) => ({
    title: name,
    type: "Constant",
    href: "/formulas",
    text: `${name} ${value}`,
    summary: value,
  })),
  ...simulations,
];

export function GET(request) {
  const query =
    new URL(request.url).searchParams.get("q")?.trim().toLowerCase() || "";
  if (query.length < 2) return NextResponse.json({ results: [] });

  const terms = query.split(/\s+/).filter(Boolean);
  const results = records
    .map((record) => {
      const searchable =
        `${record.title} ${record.text} ${record.summary || ""}`.toLowerCase();
      const matches = terms.every((term) => searchable.includes(term));
      const title = record.title.toLowerCase();
      const score = title === query ? 0 : title.includes(query) ? 1 : 2;
      return { record, matches, score };
    })
    .filter((entry) => entry.matches)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map(({ record }) => ({
      title: record.title,
      type: record.type,
      href: record.href,
      summary: record.summary || record.text,
    }));

  return NextResponse.json({ results });
}
