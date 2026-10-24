"use client";

// YouTube embed with click-to-load thumbnail (fast pages + privacy friendly).
import { useState } from "react";

export default function VideoEmbed({ id, title }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="video-frame">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className="video-fallback w-100 h-100 border-0 p-0"
          style={{ cursor: "pointer", background: "var(--stage)" }}
          onClick={() => setLoaded(true)}
          aria-label={`Play video: ${title}`}
        >
          {/* plain <img>: a remote YouTube thumbnail with an onError fallback;
              next/image would need img.youtube.com whitelisted for no gain */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.75,
            }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              position: "relative",
              width: 68,
              height: 68,
              background: "var(--ember)",
              color: "#fff",
              fontSize: "1.6rem",
              boxShadow: "0 12px 30px rgba(255,107,53,.5)",
            }}
          >
            <i className="bi bi-play-fill" />
          </span>
          <span
            className="small fw-semibold"
            style={{ position: "relative", color: "var(--ink-soft)" }}
          >
            ▶ {title}
          </span>
        </button>
      )}
    </div>
  );
}
