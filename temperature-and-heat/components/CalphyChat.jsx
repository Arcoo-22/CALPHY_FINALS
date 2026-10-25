"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CalphyMascot from "@/components/CalphyMascot";

function normalizeMathDelimiters(text) {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `$$${math}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math}$`)
    .replace(/\\[ \t]*(\r?\n)/g, "  $1")
    .replace(/\^\\circ!?([CF])/g, "{}^\\circ\\!$1");
}

const suggestions = ["How do I go to simulations?", "Preview Lesson 5", "Convert 25°C to °F"];

export default function CalphyChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I can guide you around CalphyLearn, preview lessons, explain course topics, and help with temperature conversions. I only answer from this site’s Temperature & Heat content." },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(value = input) {
    const question = value.trim();
    if (!question || busy) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", text: question }]);
    setBusy(true);
    try {
      const history = messages
        .slice(1)
        .slice(-8)
        .map(({ role, text }) => ({ role, content: text }));
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...history,
            { role: "user", content: question },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setMessages((current) => [...current, { role: "assistant", text: data.answer, links: data.links || [] }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", text: error.message || "Connection error. Please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && <button type="button" className="mascot-fab" onClick={() => setOpen(true)} aria-label="Open Calphy course assistant">
        <CalphyMascot size={50} mood="wave" /><span className="speech-hint">Ask Calphy</span>
      </button>}
      {open && <section className="mascot-panel" aria-label="Calphy course assistant" aria-live="polite">
        <header className="mascot-panel-header">
          <CalphyMascot size={42} mood={busy ? "think" : "wave"} />
          <div className="flex-grow-1"><div className="m-name">Calphy Assistant</div><div className="m-status">Course guide · site-grounded</div></div>
          <button type="button" className="mascot-panel-close" aria-label="Close assistant" onClick={() => setOpen(false)}>×</button>
        </header>
        <div className="mascot-msgs" role="log" aria-label="Conversation">
          {messages.map((message, index) => <div key={index} className={`mascot-msg ${message.role === "user" ? "user" : "bot"}`}>
            {message.role === "assistant" ? (
              <div className="assistant-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  skipHtml
                  components={{
                    a: ({ href, children }) =>
                      href?.startsWith("/") && !href.startsWith("//") ? (
                        <Link href={href}>{children}</Link>
                      ) : (
                        <span>{children}</span>
                      ),
                    img: ({ alt }) => <span>{alt}</span>,
                    table: ({ children }) => (
                      <div className="table-responsive">
                        <table className="table table-sm assistant-markdown-table">
                          {children}
                        </table>
                      </div>
                    ),
                  }}
                >
                  {normalizeMathDelimiters(message.text)}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="mb-0">{message.text}</p>
            )}
            {!!message.links?.length && <div className="assistant-links">{message.links.slice(0, 3).map((link) => <Link key={`${link.href}-${link.label}`} href={link.href}>{link.label}<i className="bi bi-arrow-up-right ms-1" /></Link>)}</div>}
          </div>)}
          {messages.length === 1 && <div className="assistant-suggestions">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => send(suggestion)}>{suggestion}</button>)}</div>}
          {busy && <div className="mascot-msg bot"><span className="spinner-border spinner-border-sm me-2" />Looking through the course…</div>}
          <div ref={endRef} />
        </div>
        <form className="mascot-compose" onSubmit={(event) => { event.preventDefault(); send(); }}>
          <label className="visually-hidden" htmlFor="calphy-question">Ask a course question</label>
          <input ref={inputRef} id="calphy-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a lesson or topic…" maxLength={1200} disabled={busy} />
          <button type="submit" className="btn btn-flame" disabled={busy || !input.trim()} aria-label="Send question"><i className="bi bi-send-fill" /></button>
        </form>
        <div className="assistant-footnote">Answers stay within the lessons and tools on this site.</div>
      </section>}
    </>
  );
}
