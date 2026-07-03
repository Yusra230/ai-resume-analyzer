// src/components/ImprovementTips.jsx
import { useTheme } from "../context/ThemeContext";

export default function ImprovementTips({ results }) {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  return (
    <div className="section-in" style={{ animationDelay: "0.36s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
        <div
          style={{
            fontSize: 9.5,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: theme.textDim,
            fontWeight: 700,
            whiteSpace: "nowrap",
            fontFamily: theme.ff.fontFamily,
          }}
        >
          {isLight ? "✦ Improvement Tips ✦" : "Improvement Tips"}
        </div>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {results.improvementTips?.map((tip, i) => (
          <div
            key={i}
            className="card-el tip-card"
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cardRadius,
              boxShadow: theme.cardShadow,
              padding: "18px 18px 20px",
              position: "relative",
              overflow: "hidden",
              animation: "fadeUp .5s ease forwards",
              animationDelay: `${0.4 + i * 0.07}s`,
              opacity: 0,
              cursor: "default",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: theme.accentBarFn(i),
              }}
            />
            {isLight && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  fontSize: 16,
                  opacity: 0.2,
                  color: theme.accent,
                }}
              >
                ✦
              </div>
            )}
            <div
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 10,
                color: theme.tipNum,
                marginBottom: 9,
                letterSpacing: ".12em",
              }}
            >
              {String(i + 1).padStart(2, "0")} —
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.text,
                marginBottom: 8,
                lineHeight: 1.4,
                fontFamily: theme.ff.fontFamily,
              }}
            >
              {tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}