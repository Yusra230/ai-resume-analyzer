// src/components/SkillsSection.jsx
import { useTheme } from "../context/ThemeContext";

export default function SkillsSection({ results }) {
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
      {/* Matched */}
      <div className="card-el section-in" style={cardStyle(0.14)}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.sage, flexShrink: 0 }} />
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.sage,
              fontWeight: 700,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Matched Skills
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 10.5,
              color: theme.textDim,
              marginLeft: "auto",
            }}
          >
            {results.matchedSkills?.length}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {results.matchedSkills?.map((sk, i) => (
            <span
              key={i}
              className="chip"
              style={{
                background: theme.sageBg,
                border: `1px solid ${theme.sageBorder}`,
                borderRadius: theme.chipRadius,
                padding: isLight ? "5px 13px" : "5px 11px",
                fontSize: 11,
                color: theme.sageText,
                fontWeight: 500,
                letterSpacing: ".04em",
                cursor: "default",
                animation: "fadeUp .4s ease forwards",
                animationDelay: `${0.14 + i * 0.05}s`,
                opacity: 0,
                fontFamily: theme.ff.fontFamily,
              }}
            >
              {isLight ? "✓ " : "✓ "}
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Missing */}
      <div className="card-el section-in" style={cardStyle(0.2)}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.rose, flexShrink: 0 }} />
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.rose,
              fontWeight: 700,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Skill Gaps
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 10.5,
              color: theme.textDim,
              marginLeft: "auto",
            }}
          >
            {results.missingSkills?.length}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {results.missingSkills?.map((sk, i) => (
            <span
              key={i}
              className="chip"
              style={{
                background: theme.roseBg,
                border: `1px solid ${theme.roseBorder}`,
                borderRadius: theme.chipRadius,
                padding: isLight ? "5px 13px" : "5px 11px",
                fontSize: 11,
                color: theme.roseText,
                fontWeight: 500,
                letterSpacing: ".04em",
                cursor: "default",
                animation: "fadeUp .4s ease forwards",
                animationDelay: `${0.2 + i * 0.05}s`,
                opacity: 0,
                fontFamily: theme.ff.fontFamily,
              }}
            >
              ○ {sk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}