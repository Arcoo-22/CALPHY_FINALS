// Renders a formula from lib data: fraction (num/den), prefix, suffix or a plain display string.
export default function FormulaCard({ f }) {
  return (
    <div className="formula-card">
      <div className="formula-name">{f.title || f.name}</div>
      <div className="formula-display">
        {f.display ? (
          <span>{f.display}</span>
        ) : (
          <>
            {f.lhs ? <span>{f.lhs}</span> : null}
            {f.num !== undefined && f.den !== undefined ? (
              <span className="frac">
                <span className="num">{f.num}</span>
                <span className="den">{f.den}</span>
              </span>
            ) : null}
            {f.suffix ? <span>{f.suffix}</span> : null}
            {f.equals ? <span className="mx-1">{f.equals}</span> : null}
            {f.num2 !== undefined && f.den2 !== undefined ? (
              <span className="frac">
                <span className="num">{f.num2}</span>
                <span className="den">{f.den2}</span>
              </span>
            ) : null}
          </>
        )}
      </div>
      {f.inWords ? <div className="formula-inwords">{f.inWords}</div> : null}
      {f.where ? <div className="formula-where">{f.where}</div> : null}
      {f.useWhen ? (
        <div className="formula-where">Use when: {f.useWhen}</div>
      ) : null}
    </div>
  );
}
