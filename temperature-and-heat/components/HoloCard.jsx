"use client";
// ============================================================
// Tilts toward the pointer with a hologram sheen and rainbow foil that follow
// it (mouse only, off for reduced motion). Ported from the passport on
// quiet-mystic-pull's about page. `mask` (an image URL, usually a smaller copy
// of the child image) clips the sheen to a transparent PNG's shape.
// ============================================================
import { useRef } from "react";

export default function HoloCard({ className = "", mask, children }) {
  const sceneRef = useRef(null);

  const move = (e) => {
    if (e.pointerType !== "mouse") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scene = sceneRef.current;
    const box = scene.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    scene.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    scene.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    scene.style.setProperty("--mx", `${x * 100}%`);
    scene.style.setProperty("--my", `${y * 100}%`);
    scene.classList.add("is-tilting");
  };

  const leave = () => {
    const scene = sceneRef.current;
    scene.style.setProperty("--rx", "0deg");
    scene.style.setProperty("--ry", "0deg");
    scene.classList.remove("is-tilting");
  };

  return (
    <div
      ref={sceneRef}
      className="holo-scene"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div
        className={`holo-card ${mask ? "is-masked" : ""} ${className}`}
        style={mask ? { "--holo-mask": `url(${mask})` } : undefined}
      >
        {children}
        <span className="holo-foil" aria-hidden="true" />
        <span className="holo-sheen" aria-hidden="true" />
      </div>
    </div>
  );
}
