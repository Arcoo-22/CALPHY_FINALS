"use client";

// Navbar search: a field-shaped trigger that opens a search dialog.
// Typing is debounced so the index is only scanned once per pause.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import { searchSite } from "@/lib/search";
import useDebouncedValue from "@/lib/useDebouncedValue";

const SUGGESTIONS = ["specific heat", "calorimetry", "Wien", "Kelvin", "gas laws"];

export default function SiteSearch({ onNavigate }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 200);
  const results = useMemo(() => searchSite(debounced), [debounced]);
  // highlighted row resets whenever a new debounced query lands
  const [activeState, setActiveState] = useState({ q: "", i: 0 });
  const active = activeState.q === debounced ? activeState.i : 0;
  const setActive = (i) => setActiveState({ q: debounced, i });

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const go = (item) => {
    close();
    onNavigate?.();
    router.push(item.href);
  };

  const onInputKey = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((active + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((active - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        className="nav-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search lessons, simulations, quizzes and formulas"
        aria-keyshortcuts="Control+K Meta+K /"
      >
        <i className="bi bi-search" aria-hidden="true" />
        <span className="nav-search-label">Search</span>
        <kbd className="nav-search-kbd" aria-hidden="true">
          /
        </kbd>
      </button>

      <Modal
        show={open}
        onHide={close}
        onEntered={() => inputRef.current?.focus()}
        dialogClassName="site-search-dialog"
        contentClassName="site-search-content"
        aria-label="Search the site"
      >
        <div className="site-search-field">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search lessons, sims, quizzes, formulas"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="site-search-results"
            aria-activedescendant={
              results.length ? `site-search-option-${active}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="site-search-close"
            onClick={close}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        <div className="site-search-body">
          {!debounced ? (
            <div className="site-search-hint">
              <span>Try</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="site-search-suggestion"
                  onClick={() => {
                    setQuery(s);
                    inputRef.current?.focus();
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="site-search-empty">
              Nothing matches &ldquo;{debounced}&rdquo;. Try a topic like
              &ldquo;conduction&rdquo; or &ldquo;latent heat&rdquo;.
            </p>
          ) : (
            <ul
              id="site-search-results"
              className="site-search-results"
              role="listbox"
            >
              {results.map((r, i) => (
                <li key={r.href} role="presentation">
                  <Link
                    id={`site-search-option-${i}`}
                    href={r.href}
                    role="option"
                    aria-selected={i === active}
                    className={`site-search-result ${i === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      close();
                      onNavigate?.();
                    }}
                  >
                    <span className="site-search-icon" aria-hidden="true">
                      <i className={`bi ${r.icon}`} />
                    </span>
                    <span className="site-search-text">
                      <span className="site-search-title">{r.title}</span>
                      <span className="site-search-detail">{r.detail}</span>
                    </span>
                    <span className="site-search-type">{r.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </>
  );
}
