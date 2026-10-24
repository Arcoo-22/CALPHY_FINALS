// ============================================================
// Calphy, the flame mascot (inline animated SVG).
// moods: 'idle' | 'happy' | 'think' | 'wave'
// ============================================================
export default function CalphyMascot({
  size = 64,
  mood = "idle",
  className = "",
  style,
}) {
  const happy = mood === "happy";
  const think = mood === "think";

  return (
    <span
      className={`d-inline-flex ${happy ? "calphy-happy" : ""} ${className}`}
      style={{ width: size, height: size, lineHeight: 0, ...style }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="calphyBody" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#ffd23f" />
            <stop offset="0.45" stopColor="#f7931e" />
            <stop offset="1" stopColor="#ff6b35" />
          </linearGradient>
          <linearGradient id="calphyCore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff7d6" />
            <stop offset="1" stopColor="#ffd23f" />
          </linearGradient>
          <radialGradient id="calphyGlow" cx="0.5" cy="0.55" r="0.6">
            <stop offset="0" stopColor="#ff9d5c" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff9d5c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* glow */}
        <circle cx="32" cy="36" r="30" fill="url(#calphyGlow)" />

        {/* little spark above the tip */}
        <circle cx="32" cy="4.5" r="2" fill="#ffd23f" opacity="0.9"></circle>

        <g className="calphy-flame-body">
          {/* flame body */}
          <path
            d="M32 7 C 33.5 15 44 19 44 32 C 44 45.5 38.5 55 32 55 C 25.5 55 20 45.5 20 32 C 20 23.5 26.5 18.5 27.5 11 C 29 15.5 30.5 16.5 32 7 Z"
            fill="url(#calphyBody)"
          />
          {/* inner core */}
          <path
            d="M32 22 C 33 27 39 30 39 37 C 39 44.5 36 49.5 32 49.5 C 28 49.5 25 44.5 25 37 C 25 31.5 29 28.5 30 24 C 30.8 26 31.2 26.5 32 22 Z"
            fill="url(#calphyCore)"
            opacity="0.92"
          />

          {/* face */}
          {happy ? (
            <>
              <path
                d="M24.5 35.5 Q27 32 29.5 35.5"
                stroke="#7c2d12"
                strokeWidth="2.1"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M34.5 35.5 Q37 32 39.5 35.5"
                stroke="#7c2d12"
                strokeWidth="2.1"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <g className="calphy-eye">
                <circle cx="27" cy="35.5" r="3.4" fill="#fff" />
                <circle
                  cx={think ? 26.2 : 27.8}
                  cy="36.2"
                  r="1.7"
                  fill="#1e293b"
                />
                <circle
                  cx={think ? 25.6 : 27.2}
                  cy="35.4"
                  r="0.6"
                  fill="#fff"
                />
              </g>
              <g className="calphy-eye">
                <circle cx="37" cy="35.5" r="3.4" fill="#fff" />
                <circle
                  cx={think ? 36.2 : 37.8}
                  cy="36.2"
                  r="1.7"
                  fill="#1e293b"
                />
                <circle
                  cx={think ? 35.6 : 37.2}
                  cy="35.4"
                  r="0.6"
                  fill="#fff"
                />
              </g>
            </>
          )}

          {/* blush */}
          <circle cx="22.8" cy="41" r="2.1" fill="#ff7a59" opacity="0.55" />
          <circle cx="41.2" cy="41" r="2.1" fill="#ff7a59" opacity="0.55" />

          {/* mouth */}
          {happy ? (
            <path d="M28.5 41.5 Q32 46 35.5 41.5 Z" fill="#7c2d12" />
          ) : (
            <path
              d="M29 42 Q32 44.8 35 42"
              stroke="#7c2d12"
              strokeWidth="1.9"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* arms */}
          <path
            d="M20.8 40 Q15.5 41.5 14.5 46.5"
            stroke="#ea580c"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
          <g className={mood === "wave" ? "calphy-wave" : ""}>
            <path
              d="M43.2 40 Q48.5 41.5 49.5 36.5"
              stroke="#ea580c"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="49.5" cy="36.5" r="2" fill="#ea580c" />
          </g>
        </g>
      </svg>
    </span>
  );
}
