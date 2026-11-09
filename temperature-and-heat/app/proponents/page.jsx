import Link from "next/link";
import { Container } from "react-bootstrap";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Proponents",
  description: "The team behind Ignius, the Temperature and Heat learning site.",
};

// "Surname, Given names M.I." — kept in the class-list order
const MEMBERS = [
  "Lat, Gio Angelo L.",
  "Lat, Pauline Mae R.",
  "Llanes, Stephen Lawrence B.",
  "Martinez, Jordan G.",
  "Martinez, Prince Rupert T.",
  "Melendres, Lee Andrei V.",
  "Molina, Ma. Guillena B.",
  "Ocampo, Marco R.",
  "Ongy, Christian Benedict R.",
  "Palmero, Jerome L.",
  "Pesa, Jonadab A.",
  "Posadas, Arvin John J.",
  "Raboy, Liam Paul S.",
  "Rizaldo, Gabriel Rudolf G.",
  "Salazar, Catherine Joy P.",
  "Udani, Gwyneth Crystal Anne M.",
  "Villanueva, Julien John G.",
].map((full) => {
  const [surname, given] = full.split(", ");
  return { full, surname, given, initials: given[0] + surname[0] };
});

// avatar colours cycle through the site's warm/cool/green tints
const TONES = ["ember", "cool", "good"];

export default function ProponentsPage() {
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
                  Proponents
                </li>
              </ol>
            </nav>
            <span className="eyebrow">
              <i className="bi bi-people" /> Proponents
            </span>
            <h1 className="section-title">The team behind Ignius</h1>
            <p className="section-sub mb-4">
              {MEMBERS.length} students built these lessons, simulations, and
              quizzes for the CALPHY Finals unit on Temperature and Heat.
            </p>
          </Reveal>

          <ul className="proponent-grid list-unstyled mb-0">
            {MEMBERS.map((m, i) => (
              <Reveal as="li" key={m.full} delay={(i % 6) * 50}>
                <div className="card-soft proponent-card">
                  <span
                    className={`proponent-avatar tone-${TONES[i % TONES.length]}`}
                    aria-hidden="true"
                  >
                    {m.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="proponent-surname">{m.surname}</div>
                    <div className="proponent-given">{m.given}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </div>
  );
}
