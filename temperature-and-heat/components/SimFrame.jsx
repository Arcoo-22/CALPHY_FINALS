"use client";

// Shared shell around every simulation canvas.
// Inside SimHost it also offers the 2D / 3D switch. The 2D stage stays
// mounted (only hidden) while 3D shows, because each sim's physics runs
// in its 2D animation loop; 3D reads that live state via getState().
import { useContext, useState } from "react";
import dynamic from "next/dynamic";
import { SimViewContext } from "@/components/sims/SimViewContext";
import ViewSwitch, { useSimView } from "@/components/sims/ViewSwitch";

const ThreeStage = dynamic(() => import("@/components/sims/ThreeStage"), {
  ssr: false,
  loading: () => (
    <div className="three-stage">
      <div className="three-overlay" role="status">
        <div className="spinner-border text-warning mb-2" aria-hidden="true" />
        <div className="small">Building the 3D view…</div>
      </div>
    </div>
  ),
});

export default function SimFrame({
  title,
  badge,
  stage,
  controls,
  note,
  getState,
}) {
  const views = useContext(SimViewContext);
  const hasSwitch = Boolean(views && views.views !== false);
  const has3d = Boolean(hasSwitch && views.load3d && getState);
  const [view, setView] = useSimView(views?.name, has3d);
  const [notice, setNotice] = useState(false);
  const show3d = view === "3d";

  const changeView = (next) => {
    setNotice(false);
    setView(next);
  };

  return (
    <div className="sim-shell">
      <div className="sim-header">
        <div className="sim-title">
          <span className="dot" /> {title}
        </div>
        {hasSwitch ? (
          <div className="sim-header-actions">
            {badge || null}
            <ViewSwitch view={view} has3d={has3d} onChange={changeView} />
          </div>
        ) : (
          badge || null
        )}
      </div>
      <div className="sim-stage">
        {hasSwitch ? (
          <>
            <div className={show3d ? "sim-2d is-hidden" : "sim-2d"}>{stage}</div>
            {show3d ? (
              <ThreeStage
                load3d={views.load3d}
                getState={getState}
                onBack={() => changeView("2d")}
                onFallback={() => {
                  setView("2d");
                  setNotice(true);
                }}
              />
            ) : null}
          </>
        ) : (
          stage
        )}
      </div>
      {notice ? (
        <div className="sim-notice" role="status">
          <i className="bi bi-info-circle" aria-hidden="true" />
          <span>3D isn&apos;t available on this device, so you&apos;re seeing the 2D view.</span>
          <button
            type="button"
            className="btn-close btn-sm ms-auto"
            aria-label="Dismiss"
            onClick={() => setNotice(false)}
          />
        </div>
      ) : null}
      {controls ? <div className="sim-controls">{controls}</div> : null}
      {note ? <div className="sim-note pt-2">{note}</div> : null}
    </div>
  );
}
