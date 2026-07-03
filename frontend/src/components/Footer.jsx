// src/components/Footer.jsx
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  return (
    <footer
      style={{
        borderTop: `1px solid ${theme.border}`,
        padding: "20px 28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ ...theme.fd, fontSize: 13, color: theme.textDim, fontStyle: "italic" }}>
        {isLight ? "✦ Résumé Oracle" : "Résumé Oracle"}
      </div>
      <div
        style={{
          fontSize: 9.5,
          letterSpacing: ".18em",
          color: theme.textDim,
          textTransform: "uppercase",
          fontFamily: theme.ff.fontFamily,
        }}
      >
        AI · Career Intelligence
      </div>
    </footer>
  );
}