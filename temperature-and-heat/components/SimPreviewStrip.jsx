"use client";

// Horizontal strip of simulation previews for /learn. The images are
// captures of each sim's 2D stage (public/images/sims/<anchor>.jpg);
// re-capture them if a sim's look changes.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SIM_GROUPS } from "@/lib/simulations";
import SectionHead from "@/components/SectionHead";

const SIMS = SIM_GROUPS.flatMap((g) => g.sims);

export default function SimPreviewStrip() {
  const stripRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const strip = stripRef.current;
    const update = () =>
      setEdges({
        start: strip.scrollLeft <= 8,
        end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 8,
      });
    update();
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      strip.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // mouse users on macOS get no visible scrollbar, so the buttons page by one card
  const page = (dir) => {
    const strip = stripRef.current;
    const card = strip.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : 300;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    strip.scrollBy({ left: dir * step, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <section className="learn-section" aria-labelledby="sim-strip-title">
      <SectionHead
        id="sim-strip-title"
        icon="bi-joystick"
        tag="Multimedia lab"
        title={
          <>
            Don&apos;t just read physics.{" "}
            <span className="gradient-text">Touch it.</span>
          </>
        }
        sub="Every lesson has a simulation that runs in your browser. Pick one to jump straight in."
        actions={
          <>
            <Link href="/simulations" className="small fw-semibold me-1">
              Open the lab
            </Link>
            <button
              type="button"
              className="sim-strip-nav d-none d-md-inline-flex"
              onClick={() => page(-1)}
              disabled={edges.start}
              aria-label="Previous simulations"
            >
              <i className="bi bi-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="sim-strip-nav d-none d-md-inline-flex"
              onClick={() => page(1)}
              disabled={edges.end}
              aria-label="Next simulations"
            >
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
          </>
        }
      />
      <ul ref={stripRef} className="sim-strip list-unstyled mb-0">
        {SIMS.map((s) => (
          <li key={s.anchor}>
            <Link href={`/simulations#${s.anchor}`} className="sim-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/sims/${s.anchor}.jpg`}
                alt=""
                loading="lazy"
                width={720}
                height={315}
              />
              <span className="sim-preview-body">
                <span className="sim-preview-title">{s.title}</span>
                <span className="sim-preview-lesson">{s.lesson}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
