// src/App.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { GLOBAL_CSS } from "./styles/global";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InputSection from "./components/InputSection";
import Results from "./components/Results";
import Footer from "./components/Footer";

// This is the inner component that uses the theme context
function AppContent() {
  const { theme, themeId } = useTheme();
  const isLight = themeId === "light";

  // All state
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [tab, setTab] = useState("paste");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [err, setErr] = useState("");
  const [scoreVal, setScoreVal] = useState(0);
  const fileRef = useRef(null);
  const styleRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Inject global CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = GLOBAL_CSS;
    document.head.appendChild(s);
    styleRef.current = s;
    return () => document.head.removeChild(s);
  }, []);

  // Inject theme-specific CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "theme-dynamic";
    s.innerHTML =
      theme.inputFocusCss +
      `
      body { background: ${theme.bg}; font-family: ${theme.ff.fontFamily}; }
      .tip-card:hover { background: ${theme.cardH} !important; }
      ${isLight ? `.tip-card:hover { box-shadow: ${theme.tipShadow} !important; }` : ""}
    `;
    document.head.appendChild(s);
    return () => {
      const el = document.getElementById("theme-dynamic");
      if (el) el.remove();
    };
  }, [themeId, theme]);

  // Update score animation when results change
  useEffect(() => {
    if (results?.matchScore != null) {
      const t = setTimeout(() => setScoreVal(results.matchScore), 120);
      return () => clearTimeout(t);
    }
  }, [results]);

  // File handling
  const readFile = useCallback(
    async (file) => {
      if (!file) return;
      setFileName(file.name);
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        setResumeText(await file.text());
      } else {
        const reader = new FileReader();
        reader.onload = (e) => setResumeText("__B64__" + e.target.result.split(",")[1]);
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  }, [readFile]);

  // Analysis function
  const analyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setErr("Add your resume and a job description first.");
      return;
    }
    setErr("");
    setLoading(true);
    setResults(null);
    setScoreVal(0);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/resume/analyze-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeText,
          jobDescription: jobDesc,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      setErr(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Button style helper
  const btnStyle = {
    background: loading
      ? (isLight ? "#FBF3EF" : theme.cardH)
      : (isLight ? "linear-gradient(135deg,#C47A9A,#A0537A)" : theme.accent),
    color: loading ? theme.accent : (isLight ? "#FFFFFF" : theme.bg),
    border: loading ? `1px solid ${theme.border}` : "none",
    padding: isLight ? "16px 60px" : "15px 60px",
    fontSize: 10,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    borderRadius: isLight ? "30px" : "2px",
    fontFamily: theme.ff.fontFamily,
    transition: "all .25s",
    minWidth: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: isLight && !loading ? "0 4px 20px rgba(160,83,122,.35)" : "none",
  };

  return (
    <div
      className="app-root"
      style={{
        background: theme.bg,
        backgroundImage: isLight ? theme.decorBg : "none",
        minHeight: "100vh",
        color: theme.text,
        fontFamily: theme.ff.fontFamily,
        transition: "background .4s, color .4s",
      }}
    >
      <Header />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px 80px" }}>
        <Hero />
        <InputSection
          tab={tab}
          setTab={setTab}
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDesc={jobDesc}
          setJobDesc={setJobDesc}
          fileName={fileName}
          setFileName={setFileName}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={onDrop}
          readFile={readFile}
          err={err}
        />
        {/* Analyze Button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 60 }}>
          <button className="btn-analyze" onClick={analyze} disabled={loading} style={btnStyle}>
            {loading ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}
                >
                  <circle
                    cx="6.5"
                    cy="6.5"
                    r="5"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="1.5"
                    strokeDasharray="18 10"
                  />
                </svg>
                Analysing your profile…
              </>
            ) : isLight ? (
              "✦ Run Analysis ✦"
            ) : (
              "Run Analysis →"
            )}
          </button>
        </div>

        {/* Results */}
        {results && <Results results={results} scoreVal={scoreVal} />}

        {/* Empty state */}
        {!results && !loading && (
          <div style={{ textAlign: "center", marginTop: 24, opacity: 0.4 }}>
            <div
              style={{
                ...theme.fd,
                fontSize: 16,
                color: theme.textDim,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Your analysis will appear here
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// The top-level App wraps with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}