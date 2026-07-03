// src/components/Hero.jsx
import { useTheme } from "../context/ThemeContext";

export default function Hero() {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      {isLight && (
        <div style={{ marginBottom: 20, opacity: 0.5 }}>
          {["✦", "✧", "✦"].map((s, i) => (
            <span key={i} style={{ color: theme.accent, fontSize: 14, margin: "0 8px" }}>
              {s}
            </span>
          ))}
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: theme.accent,
          marginBottom: 16,
          fontWeight: 600,
          fontFamily: theme.ff.fontFamily,
        }}
      >
        {isLight ? "✦ Intelligent Career Intelligence ✦" : "Intelligent Career Intelligence"}
      </div>
      <h1
        style={{
          ...theme.fd,
          margin: 0,
          fontWeight: isLight ? 300 : 300,
          fontSize: "clamp(38px, 5.5vw, 66px)",
          lineHeight: 1.1,
          letterSpacing: "-.01em",
          color: theme.text,
        }}
      >
        Know exactly where you<br />
        <em style={{ fontStyle: "italic", color: theme.accent }}>stand before you apply.</em>
      </h1>
      <p
        style={{
          margin: "22px auto 0",
          maxWidth: 460,
          fontSize: 14.5,
          color: theme.textDim,
          lineHeight: 1.78,
          fontWeight: 400,
          fontFamily: theme.ff.fontFamily,
        }}
      >
        Paste your resume and a job description. Get an instant compatibility score, skills gap
        breakdown, and actionable improvement advice.
      </p>
    </div>
  );
}