import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { lessons, modules, topics } from '../data/mockData.js';
import { useCalphy } from '../appContext.js';
import { EmptyState, LessonCard, PageTitle, Progress } from '../components.jsx';

export default function Lessons() {
 const [params] = useSearchParams(); const topic = params.get('topic'); const [query,setQuery]=useState(''); const {state}=useCalphy();
 const filtered=useMemo(()=>lessons.filter(l=>(!topic||topic==='formulas'||l.topic===topic||((topic==='convection'||topic==='radiation')&&l.id==='convection-radiation'))&&`${l.title} ${l.summary} ${l.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase())),[topic,query]);
 const active=topics.find(t=>t.id===topic); const pct=lessons.length?Math.round(state.completedLessonIds.length/lessons.length*100):0;
 return <div className="page-stack"><PageTitle eyebrow="LESSON LIBRARY" title={active?.name ?? 'Your heat & temperature lessons'} description="Follow a guided path from temperature scales to heat transfer, specific heat, and gas laws." action={<div className="small-stat"><strong>{state.completedLessonIds.length}/{lessons.length}</strong><Progress value={pct}/></div>}/>
 <div className="filter-row"><div className="filter-pills"><Link className={!topic?'filter-pill active':'filter-pill'} to="/lessons">All lessons</Link>{topics.map(t=><Link key={t.id} className={topic===t.id?'filter-pill active':'filter-pill'} to={`/lessons?topic=${t.id}`}>{t.name}</Link>)}</div><input className="text-input lesson-filter" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter lessons…" aria-label="Filter lessons"/></div>
 {modules.filter(m=>!topic||topic==='formulas'||m.topic===topic||((topic==='convection'||topic==='radiation')&&m.id==='heat-transfer')).map(module=>{const items=filtered.filter(l=>module.lessonIds.includes(l.id));return items.length?<section className="section-block" key={module.id}><div className="section-heading"><div><p className="eyebrow">{module.subtitle}</p><h2>{module.title}</h2><p className="muted">{module.description}</p></div><span className="muted">{items.filter(l=>state.completedLessonIds.includes(l.id)).length}/{items.length} complete</span></div><div className="lesson-grid">{items.map(l=><LessonCard key={l.id} lesson={l} complete={state.completedLessonIds.includes(l.id)}/>)}</div></section>:null})}
 {!filtered.length&&<EmptyState title="No matching lessons" message="Try another search term or choose a different topic."/>}
 <section className="panel concept-map"><div><p className="eyebrow">CONCEPT CONNECTIONS</p><h2>Trace energy through a system</h2><p className="muted">Temperature describes a thermal state. A difference in temperature can drive energy transfer as heat.</p></div><div className="concept-flow"><span>Temperature difference</span><b>→</b><span>Energy transfer</span><b>→</b><span>Temperature or state change</span></div><Link className="text-link" to={`/lessons/${lessons[1].id}`}>Explore heat and temperature <span>→</span></Link></section>
 </div>;
}
