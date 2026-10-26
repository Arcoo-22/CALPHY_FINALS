// Section opener for /learn: small tag, heading, one-line context.
// `actions` sits on the right (links, strip buttons) and wraps under on phones.
export default function SectionHead({ id, icon, tag, title, sub, actions }) {
  return (
    <div className="learn-section-head">
      <div className="min-w-0">
        <span className="eyebrow mb-1">
          <i className={`bi ${icon}`} aria-hidden="true" /> {tag}
        </span>
        <h2 id={id} className="learn-section-title">
          {title}
        </h2>
        {sub ? <p className="learn-section-sub mb-0">{sub}</p> : null}
      </div>
      {actions ? <div className="learn-section-actions">{actions}</div> : null}
    </div>
  );
}
