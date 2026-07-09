// src/components/Header.jsx
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { theme, themeId, toggleTheme } = useTheme();
  const isLight = themeId === "light";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 99,
        background: theme.bgHeader,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${theme.border}`,
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isLight ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke={theme.accent} strokeWidth="1.2" opacity=".3" />
            <circle cx="14" cy="14" r="7" fill={theme.roseBg} stroke={theme.accent} strokeWidth="1.2" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="14"
                cy="6"
                rx="2.5"
                ry="4"
                fill={theme.roseBg}
                stroke={theme.accent}
                strokeWidth="1"
                opacity=".6"
                transform={`rotate(${a} 14 14)`}
              />
            ))}
            <circle cx="14" cy="14" r="2.5" fill={theme.accent} />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="1" y="1" width="9" height="24" rx=".5" stroke={theme.accent} strokeWidth="1.2" />
            <rect x="14" y="1" width="11" height="24" rx=".5" stroke={theme.accent} strokeWidth="1.2" opacity=".35" />
            <line x1="3.5" y1="6" x2="7.5" y2="6" stroke={theme.accent} strokeWidth="1" />
            <line x1="3.5" y1="10" x2="7.5" y2="10" stroke={theme.accent} strokeWidth="1" />
            <line x1="3.5" y1="14" x2="7.5" y2="14" stroke={theme.accent} strokeWidth="1" />
            <line x1="3.5" y1="18" x2="7.5" y2="18" stroke={theme.accent} strokeWidth="1" />
          </svg>
        )}
        <div>
          <div
            style={{
              ...theme.fd,
              fontSize: 19,
              fontWeight: isLight ? 400 : 600,
              lineHeight: 1,
              letterSpacing: ".02em",
            }}
          >
            <span style={{ color: theme.accent }}>{isLight ? "Résumé" : "Résumé"}</span>{" "}
            {isLight ? <em style={{ fontStyle: "italic", fontWeight: 300 }}>Oracle</em> : "Oracle"}
          </div>
          <div className="hidden sm:block"
            style={{
              fontSize: 9,
              letterSpacing: ".22em",
              color: theme.textDim,
              textTransform: "uppercase",
              marginTop: 2,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            AI · Career Analysis
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: isLight ? "rgba(160,83,122,.1)" : "rgba(201,168,76,.1)",
            border: `1px solid ${isLight ? "rgba(160,83,122,.3)" : "rgba(201,168,76,.3)"}`,
            borderRadius: "20px",
            padding: "6px 14px 6px 10px",
            cursor: "pointer",
            color: theme.accent,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontFamily: theme.ff.fontFamily,
          }}
        >
          <span style={{ fontSize: 14 }}>{isLight ? "🌙" : "🌸"}</span>
          {isLight ? "Ink & Gold" : "Girly"}
        </button>
        <div
          style={{
            fontSize: 9,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: theme.textDim,
            border: `1px solid ${theme.border}`,
            borderRadius: isLight ? "12px" : "2px",
            padding: "4px 10px",
            fontWeight: 600,
            fontFamily: theme.ff.fontFamily,
          }}
        >
          Powered by Yusra
        </div>
      </div>
    </header>
  );
}