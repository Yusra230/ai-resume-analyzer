// src/components/InputSection.jsx
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function InputSection({
  tab,
  setTab,
  resumeText,
  setResumeText,
  jobDesc,
  setJobDesc,
  fileName,
  setFileName,
  dragOver,
  setDragOver,
  onDrop,
  readFile,
  err,
}) {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";
  const fileRef = useRef(null);

  const cardStyle = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.cardRadius,
    boxShadow: theme.cardShadow,
    overflow: "hidden",
  };

  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
      {/* Resume Card */}
      <div className="card-el" style={cardStyle}>
        <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}` }}>
          {["paste", "upload"].map((t) => (
            <button
              key={t}
              className="tab-btn"
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "11px 0",
                background: tab === t ? (isLight ? "rgba(160,83,122,.07)" : theme.cardH) : "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === t ? theme.accent : "transparent"}`,
                color: tab === t ? theme.accent : theme.textDim,
                fontSize: 9.5,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: theme.ff.fontFamily,
              }}
            >
              {t === "paste" ? "Paste Text" : "Upload File"}
            </button>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.accent,
              marginBottom: 10,
              fontWeight: 700,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Your Resume
          </div>
          {tab === "paste" ? (
            <textarea
              className="input-focus"
              value={resumeText.startsWith("__B64__") ? "" : resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the full text of your resume here…"
              style={{
                width: "100%",
                height: 250,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.inputRadius,
                color: theme.text,
                padding: "14px 16px",
                fontSize: 12.5,
                lineHeight: 1.75,
                resize: "none",
                fontFamily: theme.ff.fontFamily,
              }}
            />
          ) : (
            <div
              className={`drop-zone${dragOver ? " over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                height: 250,
                border: `1.5px dashed ${theme.borderL}`,
                borderRadius: theme.inputRadius,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                gap: 14,
                background: theme.surface,
              }}
            >
              {isLight ? (
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="22" r="14" fill={theme.roseBg} stroke={theme.accent} strokeWidth="1.2" />
                  <path d="M24 16 Q28 20 24 24 Q20 20 24 16Z" fill={theme.accent} opacity=".4" />
                  <path d="M18 19 Q22 19 22 24 Q18 24 18 19Z" fill={theme.accent} opacity=".3" />
                  <path d="M30 19 Q30 24 26 24 Q26 19 30 19Z" fill={theme.accent} opacity=".3" />
                  <path d="M19 27 Q22 24 24 28 Q22 30 19 27Z" fill={theme.accent} opacity=".3" />
                  <path d="M29 27 Q26 24 24 28 Q26 30 29 27Z" fill={theme.accent} opacity=".3" />
                  <circle cx="24" cy="22" r="3" fill={theme.accent} />
                  <line x1="24" y1="36" x2="24" y2="44" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="20" y1="40" x2="28" y2="40" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="9" y="3" width="18" height="28" rx="1" stroke={theme.accent} strokeWidth="1.3" opacity=".4" />
                  <rect x="13" y="3" width="18" height="28" rx="1" stroke={theme.accent} strokeWidth="1.3" />
                  <line x1="17" y1="11" x2="27" y2="11" stroke={theme.accent} strokeWidth="1.1" opacity=".65" />
                  <line x1="17" y1="15" x2="27" y2="15" stroke={theme.accent} strokeWidth="1.1" opacity=".65" />
                  <line x1="17" y1="19" x2="23" y2="19" stroke={theme.accent} strokeWidth="1.1" opacity=".65" />
                  <circle cx="33" cy="33" r="9" fill={theme.card} stroke={theme.accent} strokeWidth="1.3" />
                  <line x1="33" y1="29.5" x2="33" y2="36.5" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="29.5" y1="33" x2="36.5" y2="33" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: theme.text,
                    fontSize: 13.5,
                    fontWeight: 500,
                    marginBottom: 5,
                    fontFamily: theme.ff.fontFamily,
                  }}
                >
                  {fileName || "Drop your résumé here"}
                </div>
                <div style={{ color: theme.textDim, fontSize: 11, fontFamily: theme.ff.fontFamily }}>
                  PDF or TXT · click to browse
                </div>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf"
            style={{ display: "none" }}
            onChange={(e) => readFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* Job Description Card */}
      <div className="card-el" style={cardStyle}>
        <div style={{ padding: "11px 20px", borderBottom: `1px solid ${theme.border}` }}>
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: theme.textDim,
              fontWeight: 600,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Target Role
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 9.5,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: theme.accent,
              marginBottom: 10,
              fontWeight: 700,
              fontFamily: theme.ff.fontFamily,
            }}
          >
            Job Description
          </div>
          <textarea
            className="input-focus"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description you're applying for…"
            style={{
              width: "100%",
              height: 250,
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.inputRadius,
              color: theme.text,
              padding: "14px 16px",
              fontSize: 12.5,
              lineHeight: 1.75,
              resize: "none",
              fontFamily: theme.ff.fontFamily,
            }}
          />
        </div>
      </div>

      {/* Error Display (if any) */}
      {err && (
        <div
          style={{
            gridColumn: "1 / -1",
            background: theme.roseBg,
            border: `1px solid ${theme.roseBorder}`,
            borderRadius: theme.inputRadius,
            padding: "11px 16px",
            marginBottom: 16,
            color: theme.roseText,
            fontSize: 12.5,
            fontFamily: theme.ff.fontFamily,
          }}
        >
          {err}
        </div>
      )}
    </div>
  );
}