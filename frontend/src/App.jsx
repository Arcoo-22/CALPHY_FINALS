import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard.jsx';
import Lessons from './pages/Lessons.jsx';
import LessonDetail from './pages/LessonDetail.jsx';
import Simulator from './pages/Simulator.jsx';
import Profile from './pages/Profile.jsx';
import Search from './pages/Search.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import { notifications as initialNotifications, profile as initialProfile, topics } from './data/mockData.js';
import { getInitials } from './appContext.js';

const STORAGE_KEY = 'calphy-mvp-state';

function readSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return saved;
  } catch {
    // Ignore invalid local browser data and start with the sample state.
  }
  return {};
}

function AppShell() {
  const [saved, setSaved] = useState(readSavedState);
  const location = useLocation();
  const navigate = useNavigate();

  const state = useMemo(() => ({
    profile: { ...initialProfile, ...saved.profile },
    completedLessonIds: Array.isArray(saved.completedLessonIds) ? saved.completedLessonIds : [],
    quizScores: saved.quizScores ?? {},
    temperature: Number.isFinite(saved.temperature) ? saved.temperature : 20,
    settings: { compactMode: false, reduceMotion: false, ...saved.settings },
    notifications: Array.isArray(saved.notifications) ? saved.notifications : initialNotifications,
  }), [saved]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    document.documentElement.dataset.compact = String(state.settings.compactMode);
    document.documentElement.dataset.reduceMotion = String(state.settings.reduceMotion);
  }, [state.settings]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [navigate]);

  const actions = {
    markLessonComplete(lessonId) {
      setSaved((current) => {
        const completed = current.completedLessonIds ?? [];
        const next = completed.includes(lessonId)
          ? completed.filter((id) => id !== lessonId)
          : [...completed, lessonId];
        return { ...current, completedLessonIds: next };
      });
    },
    recordQuizScore(lessonId, score) {
      setSaved((current) => ({ ...current, quizScores: { ...(current.quizScores ?? {}), [lessonId]: score } }));
    },
    setTemperature(temperature) {
      setSaved((current) => ({ ...current, temperature }));
    },
    updateProfile(profileChanges) {
      setSaved((current) => ({ ...current, profile: { ...initialProfile, ...(current.profile ?? {}), ...profileChanges } }));
    },
    updateSettings(settingsChanges) {
      setSaved((current) => ({ ...current, settings: { ...(current.settings ?? {}), ...settingsChanges } }));
    },
    markNotificationRead(id) {
      setSaved((current) => ({
        ...current,
        notifications: (current.notifications ?? initialNotifications).map((item) => item.id === id ? { ...item, read: true } : item),
      }));
    },
    dismissNotification(id) {
      setSaved((current) => ({
        ...current,
        notifications: (current.notifications ?? initialNotifications).filter((item) => item.id !== id),
      }));
    },
  };

  const unreadCount = state.notifications.filter((item) => !item.read).length;
  const context = { state, actions };

  return (
    <div className="low-fi min-h-screen flex flex-col">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header sticky top-0 z-40 border-b border-neutral-300 bg-white">
        <div className="site-header-inner mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link className="brand flex shrink-0 items-center gap-2 font-bold tracking-wide" to="/" aria-label="CALPHY dashboard">
            <span className="brand-mark material-symbols-outlined" aria-hidden="true">science</span>
            <span>CALPHY</span>
            <span className="technical-label">HEAT LAB</span>
          </Link>
          <nav className="desktop-nav hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <MainNavLink to="/">Dashboard</MainNavLink>
            <MainNavLink to="/lessons">Lessons</MainNavLink>
            <MainNavLink to="/simulator">Simulator</MainNavLink>
            <MainNavLink to="/profile">Profile</MainNavLink>
          </nav>
          <div className="header-actions flex items-center gap-2">
            <SearchForm compact />
            <Link className="header-chip hidden sm:inline-flex" to="/profile" title="Current learning streak">
              <span className="material-symbols-outlined" aria-hidden="true">local_fire_department</span>
              {state.profile.streak}-day streak
            </Link>
            <Link className="icon-button" to="/notifications" aria-label={`Notifications, ${unreadCount} unread`}>
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
            </Link>
            <Link className="icon-button hidden sm:inline-flex" to="/settings" aria-label="Settings">
              <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            </Link>
            <Link className="primary-button hidden sm:inline-flex" to="/simulator">Launch Lab</Link>
            <Link className="avatar-button" to="/profile" aria-label={`Profile for ${state.profile.name}`}>
              {getInitials(state.profile.name)}
            </Link>
          </div>
        </div>
        <nav className="mobile-nav flex items-center justify-around border-t border-neutral-200 px-2 md:hidden" aria-label="Mobile navigation">
          <MainNavLink to="/">Home</MainNavLink>
          <MainNavLink to="/lessons">Lessons</MainNavLink>
          <MainNavLink to="/simulator">Simulator</MainNavLink>
          <MainNavLink to="/profile">Profile</MainNavLink>
          <Link className={`mobile-nav-link ${location.pathname === '/settings' ? 'active' : ''}`} to="/settings">More</Link>
        </nav>
      </header>

      <TopicRibbon />

      <Routes>
        <Route element={<PageFrame context={context} />}>
          <Route index element={<Dashboard />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="lessons/:lessonId" element={<LessonDetail />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

function MainNavLink({ to, children }) {
  const end = to === '/';
  return <NavLink end={end} to={to} className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>{children}</NavLink>;
}

function SearchForm({ compact = false }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  return (
    <form className={`search-form ${compact ? 'compact' : ''}`} onSubmit={(event) => {
      event.preventDefault();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }} role="search">
      <label className="sr-only" htmlFor={compact ? 'header-search' : 'page-search'}>Search lessons and concepts</label>
      <span className="material-symbols-outlined" aria-hidden="true">search</span>
      <input id={compact ? 'header-search' : 'page-search'} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={compact ? 'Find a concept' : 'Search lessons, formulas, and concepts'} />
      {compact && <kbd>⌘K</kbd>}
      <button className="sr-only" type="submit">Search</button>
    </form>
  );
}

function TopicRibbon() {
  const location = useLocation();
  const queryTopic = new URLSearchParams(location.search).get('topic');
  const activeTopic = queryTopic ?? (location.pathname === '/lessons' ? 'temperature' : null);
  return (
    <nav className="topic-ribbon" aria-label="Heat and temperature topics">
      <Link className="topic-equations" to="/lessons?topic=formulas">∑ <span>Heat Formulas</span></Link>
      {topics.map((topic) => (
        <Link key={topic.id} className={`topic-pill ${activeTopic === topic.id ? 'active' : ''}`} to={`/lessons?topic=${topic.id}`}>
          <span>{topic.name}</span><small>{topic.detail}</small>
        </Link>
      ))}
    </nav>
  );
}

function PageFrame({ context }) {
  return <main id="main-content" className="app-main mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6 md:py-8"><Outlet context={context} /></main>;
}

function Footer() {
  return (
    <footer className="site-footer border-t border-neutral-300 bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-5 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6">
        <span><strong>CALPHY</strong> · Heat and Temperature Learning</span>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          <Link to="/lessons">Lesson guide</Link><Link to="/search">Concept finder</Link><Link to="/settings">Preferences</Link>
        </nav>
        <span className="text-xs">A simple model for learning thermal physics</span>
      </div>
    </footer>
  );
}

function App() {
  return <BrowserRouter><AppShell /></BrowserRouter>;
}

export default App;
