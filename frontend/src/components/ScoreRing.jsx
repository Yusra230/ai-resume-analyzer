// src/components/ScoreRing.jsx
import { useTheme } from "../context/ThemeContext";

export default function ScoreRing({ scoreVal }) {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  const R = 82;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ - (scoreVal / 100) * circ;
  const scoreColor = scoreVal >= 75 ? theme.sage : scoreVal >= 50 ? theme.accent : theme.rose;
  const scoreLabel = scoreVal >= 75 ? "Strong Match" : scoreVal >= 50 ? "Moderate Match" : "Needs Work";

  return (
    <div
      className="card-el section-in"
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.cardRadius,
        boxShadow: theme.cardShadow,
        padding: "28px 24px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        animation: "fadeUp .55s ease forwards",
        opacity: 0,
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: theme.textDim,
          fontWeight: 600,
          fontFamily: theme.ff.fontFamily,
        }}
      >
        Compatibility Score
      </div>

      <div style={{ position: "relative" }}>
        {isLight && (
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.roseBg} 0%, transparent 70%)`,
              animation: "pulseRing 3s ease-in-out infinite",
            }}
          />
        )}
        <svg width="196" height="196" viewBox="0 0 196 196">
          {isLight && (
            <>
              <circle cx="98" cy="98" r="94" fill="none" stroke={theme.border} strokeWidth=".5" strokeDasharray="3 6" />
              <circle cx="98" cy="98" r="85" fill={theme.roseBg} />
            </>
          )}
          {!isLight && <circle cx="98" cy="98" r="94" fill="none" stroke={theme.border} strokeWidth=".5" />}
          <circle cx="98" cy="98" r={R} fill="none" stroke={theme.surface} strokeWidth="10" />
          <circle
            className="score-ring"
            cx="98"
            cy="98"
            r={R}
            fill="none"
            stroke={scoreColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 98 98)"
          />
          <text
            x="98"
            y="88"
            textAnchor="middle"
            style={{ fontFamily: "'IBM Plex Mono',monospace" }}
            fill={theme.text}
            fontSize="46"
            fontWeight="400"
          >
            {scoreVal}
          </text>
          <text
            x="98"
            y="108"
            textAnchor="middle"
            style={{ fontFamily: theme.ff.fontFamily }}
            fill={theme.textDim}
            fontSize="10.5"
            letterSpacing="2"
          >
            OUT OF 100
          </text>
        </svg>
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".12em",
          color: scoreColor,
          textTransform: "uppercase",
          padding: "5px 16px",
          background: theme.scoreLabelBg(scoreVal),
          border: `1px solid ${theme.scoreLabelBorder(scoreVal)}`,
          borderRadius: isLight ? "20px" : "2px",
          fontFamily: theme.ff.fontFamily,
        }}
      >
        {isLight && "✦ "}
        {scoreLabel}
        {isLight && " ✦"}
      </div>
    </div>
  );
}