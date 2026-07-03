// src/components/StrengthsWeaknesses.jsx
import { useTheme } from "../context/ThemeContext";

export default function StrengthsWeaknesses({ results }) {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  const cardStyle = (delay = 0) => ({
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.cardRadius,
    boxShadow: theme.cardShadow,
    padding: 24,
    animation: "fadeUp .55s ease forwards",
    opacity: 0,
    animationDelay: `${delay}s`,
  });

  return (
    <div className="skill-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
      {/* Strengths */}
      <div className="card-el section-in" style={cardStyle(0.24)}>
        <div
          style={{
            fontSize: 9.5,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: theme.accent,
            fontWeight: 700,
            marginBottom: 18,
            fontFamily: theme.ff.fontFamily,
          }}
        >
          {isLight ? "✦ Strengths" : "Strengths"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {results.strengths?.map((s, i) => (
            <div
              key={i}
              className="str-row"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                animationDelay: `${0.28 + i * 0.07}s`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: theme.sageBg,
                  border: `1px solid ${theme.sageBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9">
                  <polyline
                    points="1.5,5 3.5,7.5 7.5,1.5"
                    fill="none"
                    stroke={theme.sageText}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.65, color: theme.bodyText, fontFamily: theme.ff.fontFamily }}>
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="card-el section-in" style={cardStyle(0.3)}>
        <div
          style={{
            fontSize: 9.5,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: theme.weaknessLabel,
            fontWeight: 700,
            marginBottom: 18,
            fontFamily: theme.ff.fontFamily,
          }}
        >
          {isLight ? "✦ Areas to Develop" : "Areas to Develop"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {results.weaknesses?.map((w, i) => (
            <div
              key={i}
              className="str-row"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                animationDelay: `${0.34 + i * 0.07}s`,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: theme.roseBg,
                  border: `1px solid ${theme.roseBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <div style={{ width: 7, height: 1.5, background: theme.rose, borderRadius: 1 }} />
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.65, color: theme.bodyText, fontFamily: theme.ff.fontFamily }}>
                {w}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}