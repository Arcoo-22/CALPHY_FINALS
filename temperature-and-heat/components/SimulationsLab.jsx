"use client";

import { useEffect, useState } from "react";
import SimHost from "@/components/SimHost";
import Reveal from "@/components/Reveal";
import { SIM_GROUPS } from "@/lib/simulations";

export default function SimulationsLab() {
  const [activeGroup, setActiveGroup] = useState("all");

  // If page loads with a hash (e.g. #conduction), ensure that group is visible and scroll to it
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      
      const matchedGroup = SIM_GROUPS.find((g) =>
        g.sims.some((s) => s.anchor === hash),
      );
      if (matchedGroup) {
        setActiveGroup(matchedGroup.id);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectJump = (e) => {
    const anchor = e.target.value;
    if (!anchor) return;

    const matchedGroup = SIM_GROUPS.find((g) =>
      g.sims.some((s) => s.anchor === anchor),
    );
    if (matchedGroup && activeGroup !== "all" && activeGroup !== matchedGroup.id) {
      setActiveGroup(matchedGroup.id);
    }

    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const visibleGroups =
    activeGroup === "all"
      ? SIM_GROUPS
      : SIM_GROUPS.filter((g) => g.id === activeGroup);

  const totalSimsCount = SIM_GROUPS.reduce((acc, g) => acc + g.sims.length, 0);

  return (
    <>
      {/* Simulation Lab Navigation / Filter & Quick-Jump */}
      <div className="sim-lab-nav" role="toolbar" aria-label="Simulation categories">
        <div className="sim-filter-group">
          <button
            type="button"
            className={`sim-filter-btn ${activeGroup === "all" ? "active" : ""}`}
            onClick={() => setActiveGroup("all")}
          >
            <i className="bi bi-grid-fill" /> All machines
            <span className="badge-count">{totalSimsCount}</span>
          </button>
          {SIM_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`sim-filter-btn ${activeGroup === g.id ? "active" : ""}`}
              onClick={() => setActiveGroup(g.id)}
            >
              <i className={`bi ${g.icon}`} /> {g.title.split("&")[0].trim()}
              <span className="badge-count">{g.sims.length}</span>
            </button>
          ))}
        </div>

        <select
          className="form-select form-select-sm sim-jump-select"
          aria-label="Quick jump to simulation"
          onChange={handleSelectJump}
          defaultValue=""
        >
          <option value="" disabled>
            Jump to a machine…
          </option>
          {SIM_GROUPS.map((g) => (
            <optgroup key={g.id} label={g.title}>
              {g.sims.map((s) => (
                <option key={s.anchor} value={s.anchor}>
                  {s.title} ({s.lesson})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Render active groups */}
      {visibleGroups.map((g) => (
        <div key={g.id} className="mb-5">
          <Reveal>
            <div className="d-flex align-items-center gap-3 mb-3 mt-4">
              <span
                className="icon-tile"
                style={{
                  background: "var(--ember-tint)",
                  color: "var(--ember-text)",
                }}
              >
                <i className={`bi ${g.icon}`} />
              </span>
              <div>
                <h2 className="fw-bold h4 mb-0">{g.title}</h2>
                <div className="small text-muted">{g.blurb}</div>
              </div>
            </div>
          </Reveal>
          <div className="d-grid gap-4">
            {g.sims.map((s, si) => (
              <Reveal key={s.anchor} delay={si * 60}>
                <div id={s.anchor} style={{ scrollMarginTop: 100 }}>
                  <SimHost name={s.name} />
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-2 px-1">
                    <span className="content-label">
                      <i
                        className="bi bi-journal-bookmark"
                        aria-hidden="true"
                      />{" "}
                      {s.lesson}
                    </span>
                    <span className="small text-muted">{s.caption}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
