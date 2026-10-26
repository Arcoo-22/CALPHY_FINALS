import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import FormulaCard from "@/components/FormulaCard";
import Reveal from "@/components/Reveal";
import { LESSONS, FORMULA_SHEET, CONSTANTS_BOX } from "@/lib/lessons";
import { slugify } from "@/lib/search";

export const metadata = {
  title: "∑ Heat Formulas",
  description:
    "The complete formula sheet: every equation and constant from all nine lessons, with guidance on when to use each.",
};

export default function FormulasPage() {
  return (
    <div className="page-top-space">
      <section className="section-tight">
        <Container>
          <Reveal>
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb small mb-0">
                <li className="breadcrumb-item">
                  <Link href="/learn">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  ∑ Formulas
                </li>
              </ol>
            </nav>
            <span className="eyebrow">
              <i className="bi bi-mortarboard" /> The ∑ Heat Formulas sheet
            </span>
            <h1 className="section-title">Every formula. One page.</h1>
            <p className="section-sub mb-4">
              Exactly like the module&apos;s formula button, plus the constants
              box. Each card tells you
              <b> when</b> to use it, in words, and what every symbol means.
            </p>
          </Reveal>

          {/* quick sheet */}
          <Row className="g-3 mb-5">
            {FORMULA_SHEET.map((f, i) => (
              <Col key={f.name} md={6} xl={4}>
                <Reveal delay={(i % 3) * 60} className="h-100">
                  <div
                    className="sheet-card"
                    id={`formula-${slugify(f.name)}`}
                    style={{ scrollMarginTop: 90 }}
                  >
                    <div className="sheet-name">
                      <i
                        className="bi bi-calculator me-1"
                        style={{ color: "var(--ember-text)" }}
                      />
                      {f.name}
                    </div>
                    <div className="sheet-formula">{f.display}</div>
                    <div className="sheet-when">Use when: {f.useWhen}</div>
                  </div>
                </Reveal>
              </Col>
            ))}
          </Row>

          {/* constants box */}
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-box-seam me-2"
                style={{ color: "var(--cool)" }}
              />
              Constants box
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="table-responsive table-pretty mb-5">
              <table className="table table-sm mb-0">
                <tbody>
                  {CONSTANTS_BOX.map((r, i) => (
                    <tr key={i}>
                      <td className="fw-semibold" style={{ width: "45%" }}>
                        {r[0]}
                      </td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* per lesson */}
          <Reveal>
            <h2 className="fw-bold h4 mb-3">
              <i
                className="bi bi-journal-bookmark me-2"
                style={{ color: "var(--ember-text)" }}
              />
              By lesson
            </h2>
          </Reveal>
          {LESSONS.map((l, li) => (
            <div key={l.key} className="mb-5">
              <Reveal>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="chip flame">Lesson {l.n}</span>
                  <Link
                    href={`/lessons/${l.slug}`}
                    className="fw-bold text-dark"
                  >
                    {l.title} <i className="bi bi-arrow-right small" />
                  </Link>
                </div>
              </Reveal>
              <Row className="g-3">
                {l.formulas.map((f, i) => (
                  <Col key={i} md={6} xl={4}>
                    <Reveal delay={(i % 3) * 50} className="h-100">
                      <FormulaCard f={f} />
                    </Reveal>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
