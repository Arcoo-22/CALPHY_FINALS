// ============================================================
// Site search: one flat index over lessons, simulations, quizzes
// and the formula sheet, matched in memory (no network calls).
// ============================================================
import { LESSONS, FORMULA_SHEET } from "@/lib/lessons";
import { QUIZZES, quizLabel } from "@/lib/quizzes";
import { SIM_GROUPS } from "@/lib/simulations";

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// lowercase and strip accents so "Wiens" still finds "Wien's"
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ'’]/g, "");

const join = (...parts) => parts.flat().filter(Boolean).join(" ");

function buildIndex() {
  const items = [];

  LESSONS.forEach((l) => {
    items.push({
      type: "Lesson",
      icon: l.icon,
      title: `Lesson ${l.n}: ${l.title}`,
      detail: l.tagline,
      href: `/lessons/${l.slug}`,
      keywords: join(
        l.keyTerms?.map((k) => k.term),
        l.formulas?.map((f) => f.title),
        l.sections?.map((s) => s.heading),
      ),
    });
  });

  SIM_GROUPS.forEach((g) =>
    g.sims.forEach((s) => {
      items.push({
        type: "Simulation",
        icon: g.icon,
        title: s.title,
        detail: s.caption,
        href: `/simulations#${s.anchor}`,
        keywords: join(g.title, s.lesson),
      });
    }),
  );

  QUIZZES.forEach((q) => {
    items.push({
      type: "Quiz",
      icon: q.icon,
      title: q.title,
      detail: q.description,
      href: `/quizzes/${q.slug}`,
      keywords: join(q.id, quizLabel(q.id)),
    });
  });

  FORMULA_SHEET.forEach((f) => {
    items.push({
      type: "Formula",
      icon: "bi-calculator",
      title: f.name,
      detail: f.display,
      href: `/formulas#formula-${slugify(f.name)}`,
      keywords: f.useWhen,
    });
  });

  return items.map((item) => ({
    ...item,
    titleNorm: normalize(item.title),
    bodyNorm: normalize(join(item.detail, item.keywords)),
  }));
}

let index = null;

// Every word must appear somewhere; title hits rank above body hits.
export function searchSite(query, limit = 8) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  index ??= buildIndex();

  const scored = [];
  for (const item of index) {
    let score = 0;
    let matchedAll = true;
    for (const w of words) {
      if (item.titleNorm.startsWith(w)) score += 6;
      else if (item.titleNorm.includes(` ${w}`)) score += 4;
      else if (item.titleNorm.includes(w)) score += 3;
      else if (item.bodyNorm.includes(w)) score += 1;
      else {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
