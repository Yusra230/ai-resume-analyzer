// src/components/Results.jsx
import { useTheme } from "../context/ThemeContext";
import ScoreRing from "./ScoreRing";
import SkillsSection from "./SkillsSection";
import StrengthsWeaknesses from "./StrengthsWeaknesses";
import ImprovementTips from "./ImprovementTips";

export default function Results({ results, scoreVal }) {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  // card style helper
  const cardStyle = (delay = 0) => ({
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.cardRadius,
    boxShadow: theme.cardShadow,
    ...(delay ? { animation: "fadeUp .55s ease forwards", opacity: 0, animationDelay: `${delay}s` } : {}),
  });

  return (
    <div style={{ animation: "fadeUp .5s ease forwards" }}>
      {/* Score + Summary */}
      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: 18, marginBottom: 18 }}>
        <ScoreRing scoreVal={scoreVal} />
        <div className="card-el section-in" style={{ ...cardStyle(0.08), padding: 28 }}>
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.textDim,
              fontWeight: 600,
              marginBottom: 18,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Candidate Profile
          </div>
          <p
            style={{
              ...theme.fd,
              fontSize: isLight ? 20 : 19.5,
              lineHeight: 1.74,
              color: theme.text,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {results.summary}
          </p>
          <div
            className="stat-row"
            style={{
              display: "flex",
              gap: 32,
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${theme.border}`,
            }}
          >
            {[
              { label: "Matched Skills", val: results.matchedSkills?.length ?? 0, color: theme.sage },
              { label: "Skill Gaps", val: results.missingSkills?.length ?? 0, color: theme.rose },
              { label: "Action Tips", val: results.improvementTips?.length ?? 0, color: theme.accent },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: 30,
                    fontWeight: 500,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: ".18em",
                    color: theme.textDim,
                    textTransform: "uppercase",
                    marginTop: 5,
                    fontFamily: theme.ff.fontFamily,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <SkillsSection results={results} />

      {/* Strengths & Weaknesses */}
      <StrengthsWeaknesses results={results} />

      {/* Improvement Tips */}
      <ImprovementTips results={results} />
    </div>
  );
}