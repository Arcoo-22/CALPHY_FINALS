// Shared shell around every simulation canvas.
export default function SimFrame({ title, badge, stage, controls, note }) {
  return (
    <div className="sim-shell">
      <div className="sim-header">
        <div className="sim-title">
          <span className="dot" /> {title}
        </div>
        {badge || null}
      </div>
      <div className="sim-stage">{stage}</div>
      {controls ? <div className="sim-controls">{controls}</div> : null}
      {note ? <div className="sim-note pt-2">{note}</div> : null}
    </div>
  );
}
