import { Link } from 'react-router-dom';

export function Icon({ children }) { return <span className="material-symbols-outlined" aria-hidden="true">{children}</span>; }
export function PageTitle({ eyebrow, title, description, action }) {
  return <div className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="muted lead">{description}</p>}</div>{action}</div>;
}
export function Progress({ value, label = `${value}% complete` }) {
  return <div className="progress-wrap"><div className="progress-track" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}><span style={{ width: `${value}%` }} /></div><small>{label}</small></div>;
}
export function LessonCard({ lesson, complete = false }) {
  return <Link className="lesson-card" to={`/lessons/${lesson.id}`}><div className="card-meta"><span className="tag">{lesson.level}</span><span>{lesson.duration}</span></div><h3>{lesson.title}</h3><p className="muted">{lesson.summary}</p><div className="card-bottom"><span>{complete ? 'Completed' : 'Open lesson'}</span><Icon>{complete ? 'check_circle' : 'arrow_forward'}</Icon></div></Link>;
}
export function EmptyState({ title, message }) { return <section className="panel empty-state"><Icon>search_off</Icon><h2>{title}</h2><p className="muted">{message}</p></section>; }
