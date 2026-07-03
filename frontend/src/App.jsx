import { useState, useRef, useEffect, useCallback } from "react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,200;1,9..144,300;1,9..144,400&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box}
body{margin:0}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmerDark{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes shimmerRose{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes floatPetal{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(4deg)}}
@keyframes pulseRing{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.7;transform:scale(1.03)}}
.score-ring{transition:stroke-dashoffset 1.8s cubic-bezier(.25,.46,.45,.94)}
.chip{transition:transform .15s}
.chip:hover{transform:scale(1.05)}
.tip-card{transition:transform .22s,box-shadow .22s}
.tip-card:hover{transform:translateY(-3px)}
.btn-analyze:active:not(:disabled){transform:scale(.98)}
.tab-btn{transition:color .15s,border-color .15s,background .15s}
.str-row{animation:fadeUp .45s ease forwards;opacity:0}
.section-in{animation:fadeUp .55s ease forwards;opacity:0}
.theme-toggle{transition:background .3s,color .3s,border-color .3s}
.app-root{transition:background .4s,color .4s}
.card-el{transition:background .3s,border-color .3s,box-shadow .3s}
@media(max-width:760px){.two-col{grid-template-columns:1fr!important}.skill-row{grid-template-columns:1fr!important}.stat-row{gap:16px!important}}
`;

// ── DARK THEME ── ink & gold editorial
const DARK = {
  id: "dark",
  bg: "#0D0B08",
  bgHeader: "rgba(13,11,8,.92)",
  surface: "#131008",
  card: "#1C1812",
  cardH: "#231E13",
  border: "#2B2419",
  borderL: "#3A3020",
  accent: "#C9A84C",
  accentDim: "#7A6428",
  accentGlow: "rgba(201,168,76,.12)",
  text: "#EDE0C4",
  textDim: "#8A7B60",
  sage: "#4E7A58",
  sageBg: "rgba(78,122,88,.13)",
  sageBorder: "rgba(78,122,88,.3)",
  sageText: "#7DB88A",
  rose: "#8A3535",
  roseBg: "rgba(138,53,53,.13)",
  roseBorder: "rgba(138,53,53,.3)",
  roseText: "#C47070",
  weaknessLabel: "#7A4040",
  bodyText: "#C5BDB0",
  tipNum: "#7A6428",
  chipRadius: "2px",
  cardRadius: "4px",
  inputRadius: "3px",
  cardShadow: "none",
  tipShadow: "none",
  scoreLabelBg: (s) => s >= 75 ? "rgba(78,122,88,.13)" : s >= 50 ? "rgba(201,168,76,.12)" : "rgba(138,53,53,.13)",
  scoreLabelBorder: (s) => s >= 75 ? "rgba(78,122,88,.3)" : s >= 50 ? "rgba(201,168,76,.3)" : "rgba(138,53,53,.3)",
  fd: { fontFamily: "'Cormorant Garant', serif" },
  ff: { fontFamily: "'Syne', sans-serif" },
  fm: { fontFamily: "'IBM Plex Mono', monospace" },
  inputFocusCss: ".input-focus:focus{border-color:#C9A84C!important}.drop-zone.over{border-color:#C9A84C!important;background:rgba(201,168,76,.07)!important}",
  btnBg: (loading) => loading ? "#231E13" : "#C9A84C",
  btnColor: (loading) => loading ? "#C9A84C" : "#0D0B08",
  btnBorder: (loading) => loading ? "1px solid #C9A84C" : "none",
  accentBarFn: (i) => `linear-gradient(90deg, #C9A84C ${20 + i * 14}%, transparent)`,
  decorBg: null,
};

// ── LIGHT THEME ── girly luxury rose
const LIGHT = {
  id: "light",
  bg: "#FBF3EF",
  bgHeader: "rgba(251,243,239,.94)",
  surface: "#F5EBE5",
  card: "#FFFFFF",
  cardH: "#FEF8F5",
  border: "#ECD5CC",
  borderL: "#D9B8AE",
  accent: "#A0537A",
  accentDim: "#7A3A5C",
  accentGlow: "rgba(160,83,122,.1)",
  text: "#3A2232",
  textDim: "#8A6878",
  sage: "#4F7E5C",
  sageBg: "rgba(79,126,92,.09)",
  sageBorder: "rgba(79,126,92,.28)",
  sageText: "#3A6B46",
  rose: "#9B3D62",
  roseBg: "rgba(155,61,98,.09)",
  roseBorder: "rgba(155,61,98,.28)",
  roseText: "#7A2848",
  weaknessLabel: "#9B3D62",
  bodyText: "#5A3D4A",
  tipNum: "#C4888E",
  chipRadius: "20px",
  cardRadius: "16px",
  inputRadius: "12px",
  cardShadow: "0 2px 16px rgba(160,83,122,.07)",
  tipShadow: "0 4px 20px rgba(160,83,122,.1)",
  scoreLabelBg: (s) => s >= 75 ? "rgba(79,126,92,.1)" : s >= 50 ? "rgba(160,83,122,.1)" : "rgba(155,61,98,.1)",
  scoreLabelBorder: (s) => s >= 75 ? "rgba(79,126,92,.3)" : s >= 50 ? "rgba(160,83,122,.3)" : "rgba(155,61,98,.3)",
  fd: { fontFamily: "'Fraunces', serif" },
  ff: { fontFamily: "'DM Sans', sans-serif" },
  fm: { fontFamily: "'IBM Plex Mono', monospace" },
  inputFocusCss: ".input-focus:focus{border-color:#A0537A!important}.drop-zone.over{border-color:#A0537A!important;background:rgba(160,83,122,.05)!important}",
  btnBg: (loading) => loading ? "#FBF3EF" : "linear-gradient(135deg,#C47A9A,#A0537A)",
  btnColor: () => loading ? "#A0537A" : "#FFFFFF",
  btnBorder: (loading) => loading ? "1px solid #D4A0B8" : "none",
  accentBarFn: (i) => `linear-gradient(90deg, #C47A9A ${10 + i * 12}%, #E8A8C0 ${30 + i * 10}%, transparent)`,
  decorBg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23D4A0B8' opacity='0.25'/%3E%3Ccircle cx='5' cy='5' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='55' cy='5' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='5' cy='55' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='55' cy='55' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
};

const PROMPT = (resume, jd) => `You are an expert resume analyst. Analyze the resume against the job description and return ONLY valid JSON with NO markdown fences, NO preamble.

RESUME:
${resume}

JOB DESCRIPTION:
${jd}

Return exactly this JSON shape:
{
  "matchScore": <integer 0-100>,
  "candidateSummary": "<2-3 sentence summary of the candidate's profile and fit>",
  "matchedSkills": ["<concise skill 1-3 words>", ...],
  "missingSkills": ["<concise skill 1-3 words>", ...],
  "strengths": ["<1-2 sentence strength>", ...],
  "weaknesses": ["<1-2 sentence area to develop>", ...],
  "improvementTips": [
    {"title": "<short action title>", "description": "<1-2 sentence actionable tip>"},
    ...
  ]
}
Provide 4-7 matchedSkills, 4-7 missingSkills, 4 strengths, 3-4 weaknesses, 5-6 improvementTips.`;

export default function App() {
  const [themeId, setThemeId] = useState("dark");
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

  const T = themeId === "dark" ? DARK : LIGHT;

  // Inject global CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = GLOBAL_CSS;
    document.head.appendChild(s);
    styleRef.current = s;
    return () => document.head.removeChild(s);
  }, []);

  // Inject theme-specific focus/hover CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "theme-dynamic";
    s.innerHTML = T.inputFocusCss + `
      body { background: ${T.bg}; font-family: ${T.ff.fontFamily}; }
      .tip-card:hover { background: ${T.cardH} !important; }
      ${T.id === "light" ? `.tip-card:hover { box-shadow: ${T.tipShadow} !important; }` : ""}
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById("theme-dynamic"); if (el) el.remove(); };
  }, [themeId]);

  useEffect(() => {
    if (results?.matchScore != null) {
      const t = setTimeout(() => setScoreVal(results.matchScore), 120);
      return () => clearTimeout(t);
    }
  }, [results]);

  const readFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      setResumeText(await file.text());
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setResumeText("__B64__" + e.target.result.split(",")[1]);
      reader.readAsDataURL(file);
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  }, [readFile]);

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
    // Send resume text (or base64) + job description as JSON
    const response = await fetch('/api/v1/resume/analyze-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: resumeText,      // could be plain text or "__B64__..."
        jobDescription: jobDesc
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Analysis failed');
    }

    const data = await response.json();
    // The backend returns { status: 'success', data: { ... } }
    console.log(data.data)
    setResults(data.data);        // matches the DUMMY_RESULTS shape
  } catch (error) {
    setErr(error.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
  };

  const R = 82;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ - (scoreVal / 100) * circ;
  const scoreColor = scoreVal >= 75 ? T.sage : scoreVal >= 50 ? T.accent : T.rose;
  const scoreLabel = scoreVal >= 75 ? "Strong Match" : scoreVal >= 50 ? "Moderate Match" : "Needs Work";

  const isLight = themeId === "light";

  // Reusable card style
  const cardStyle = (delay = 0) => ({
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: T.cardRadius,
    boxShadow: T.cardShadow,
    ...(delay ? { animation: "fadeUp .55s ease forwards", opacity: 0, animationDelay: `${delay}s` } : {})
  });

  return (
    <div className="app-root" style={{
      background: T.bg,
      backgroundImage: isLight ? T.decorBg : "none",
      minHeight: "100vh",
      color: T.text,
      fontFamily: T.ff.fontFamily,
      transition: "background .4s, color .4s"
    }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 99,
        background: T.bgHeader,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        height: 64, display: "flex", alignItems: "center",
        padding: "0 28px", justifyContent: "space-between"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLight ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke={T.accent} strokeWidth="1.2" opacity=".3"/>
              <circle cx="14" cy="14" r="7" fill={T.roseBg} stroke={T.accent} strokeWidth="1.2"/>
              {[0,60,120,180,240,300].map(a => (
                <ellipse key={a} cx="14" cy="6" rx="2.5" ry="4" fill={T.roseBg} stroke={T.accent} strokeWidth="1"
                  opacity=".6" transform={`rotate(${a} 14 14)`}/>
              ))}
              <circle cx="14" cy="14" r="2.5" fill={T.accent}/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="1" y="1" width="9" height="24" rx=".5" stroke={T.accent} strokeWidth="1.2"/>
              <rect x="14" y="1" width="11" height="24" rx=".5" stroke={T.accent} strokeWidth="1.2" opacity=".35"/>
              <line x1="3.5" y1="6" x2="7.5" y2="6" stroke={T.accent} strokeWidth="1"/>
              <line x1="3.5" y1="10" x2="7.5" y2="10" stroke={T.accent} strokeWidth="1"/>
              <line x1="3.5" y1="14" x2="7.5" y2="14" stroke={T.accent} strokeWidth="1"/>
              <line x1="3.5" y1="18" x2="7.5" y2="18" stroke={T.accent} strokeWidth="1"/>
            </svg>
          )}
          <div>
            <div style={{ ...T.fd, fontSize: 19, fontWeight: isLight ? 400 : 600, lineHeight: 1, letterSpacing: ".02em" }}>
              <span style={{ color: T.accent }}>{isLight ? "Résumé" : "Résumé"}</span>{" "}
              {isLight ? <em style={{ fontStyle: "italic", fontWeight: 300 }}>Oracle</em> : "Oracle"}
            </div>
            <div style={{ fontSize: 9, letterSpacing: ".22em", color: T.textDim, textTransform: "uppercase", marginTop: 2, fontFamily: T.ff.fontFamily }}>
              AI · Career Analysis
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="theme-toggle"
            onClick={() => { setThemeId(t => t === "dark" ? "light" : "dark"); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: isLight ? "rgba(160,83,122,.1)" : "rgba(201,168,76,.1)",
              border: `1px solid ${isLight ? "rgba(160,83,122,.3)" : "rgba(201,168,76,.3)"}`,
              borderRadius: "20px",
              padding: "6px 14px 6px 10px",
              cursor: "pointer",
              color: T.accent,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontFamily: T.ff.fontFamily
            }}
          >
            <span style={{ fontSize: 14 }}>{isLight ? "🌙" : "🌸"}</span>
            {isLight ? "Ink & Gold" : "Rose & Blush"}
          </button>
          <div style={{
            fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase",
            color: T.textDim, border: `1px solid ${T.border}`, borderRadius: isLight ? "12px" : "2px",
            padding: "4px 10px", fontWeight: 600, fontFamily: T.ff.fontFamily
          }}>
            Powered by Yusra
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          {isLight && (
            <div style={{ marginBottom: 20, opacity: .5 }}>
              {["✦","✧","✦"].map((s,i) => (
                <span key={i} style={{ color: T.accent, fontSize: 14, margin: "0 8px" }}>{s}</span>
              ))}
            </div>
          )}
          <div style={{
            fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase",
            color: T.accent, marginBottom: 16, fontWeight: 600, fontFamily: T.ff.fontFamily
          }}>
            {isLight ? "✦ Intelligent Career Intelligence ✦" : "Intelligent Career Intelligence"}
          </div>
          <h1 style={{
            ...T.fd, margin: 0, fontWeight: isLight ? 300 : 300,
            fontSize: "clamp(38px, 5.5vw, 66px)",
            lineHeight: 1.1, letterSpacing: "-.01em", color: T.text
          }}>
            Know exactly where you<br/>
            <em style={{ fontStyle: "italic", color: T.accent }}>stand before you apply.</em>
          </h1>
          <p style={{
            margin: "22px auto 0", maxWidth: 460, fontSize: 14.5,
            color: T.textDim, lineHeight: 1.78, fontWeight: 400,
            fontFamily: T.ff.fontFamily
          }}>
            Paste your resume and a job description. Get an instant compatibility score,
            skills gap breakdown, and actionable improvement advice.
          </p>
        </div>

        {/* ── INPUT GRID ── */}
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

          {/* Resume */}
          <div className="card-el" style={{ ...cardStyle(), overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
              {["paste", "upload"].map(t => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{
                  flex: 1, padding: "11px 0",
                  background: tab === t ? (isLight ? "rgba(160,83,122,.07)" : T.cardH) : "transparent",
                  border: "none",
                  borderBottom: `2px solid ${tab === t ? T.accent : "transparent"}`,
                  color: tab === t ? T.accent : T.textDim,
                  fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase",
                  fontWeight: 700, cursor: "pointer", fontFamily: T.ff.fontFamily
                }}>
                  {t === "paste" ? "Paste Text" : "Upload File"}
                </button>
              ))}
            </div>
            <div style={{ padding: 20 }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                color: T.accent, marginBottom: 10, fontWeight: 700, fontFamily: T.ff.fontFamily
              }}>Your Resume</div>

              {tab === "paste" ? (
                <textarea
                  className="input-focus"
                  value={resumeText.startsWith("__B64__") ? "" : resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here…"
                  style={{
                    width: "100%", height: 250, background: T.surface,
                    border: `1px solid ${T.border}`, borderRadius: T.inputRadius,
                    color: T.text, padding: "14px 16px", fontSize: 12.5,
                    lineHeight: 1.75, resize: "none", fontFamily: T.ff.fontFamily
                  }}
                />
              ) : (
                <div
                  className={`drop-zone${dragOver ? " over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    height: 250, border: `1.5px dashed ${T.borderL}`,
                    borderRadius: T.inputRadius, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", gap: 14, background: T.surface
                  }}
                >
                  {isLight ? (
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="22" r="14" fill={T.roseBg} stroke={T.accent} strokeWidth="1.2"/>
                      <path d="M24 16 Q28 20 24 24 Q20 20 24 16Z" fill={T.accent} opacity=".4"/>
                      <path d="M18 19 Q22 19 22 24 Q18 24 18 19Z" fill={T.accent} opacity=".3"/>
                      <path d="M30 19 Q30 24 26 24 Q26 19 30 19Z" fill={T.accent} opacity=".3"/>
                      <path d="M19 27 Q22 24 24 28 Q22 30 19 27Z" fill={T.accent} opacity=".3"/>
                      <path d="M29 27 Q26 24 24 28 Q26 30 29 27Z" fill={T.accent} opacity=".3"/>
                      <circle cx="24" cy="22" r="3" fill={T.accent}/>
                      <line x1="24" y1="36" x2="24" y2="44" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="20" y1="40" x2="28" y2="40" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <rect x="9" y="3" width="18" height="28" rx="1" stroke={T.accent} strokeWidth="1.3" opacity=".4"/>
                      <rect x="13" y="3" width="18" height="28" rx="1" stroke={T.accent} strokeWidth="1.3"/>
                      <line x1="17" y1="11" x2="27" y2="11" stroke={T.accent} strokeWidth="1.1" opacity=".65"/>
                      <line x1="17" y1="15" x2="27" y2="15" stroke={T.accent} strokeWidth="1.1" opacity=".65"/>
                      <line x1="17" y1="19" x2="23" y2="19" stroke={T.accent} strokeWidth="1.1" opacity=".65"/>
                      <circle cx="33" cy="33" r="9" fill={T.card} stroke={T.accent} strokeWidth="1.3"/>
                      <line x1="33" y1="29.5" x2="33" y2="36.5" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="29.5" y1="33" x2="36.5" y2="33" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: T.text, fontSize: 13.5, fontWeight: 500, marginBottom: 5, fontFamily: T.ff.fontFamily }}>
                      {fileName || "Drop your résumé here"}
                    </div>
                    <div style={{ color: T.textDim, fontSize: 11, fontFamily: T.ff.fontFamily }}>PDF or TXT · click to browse</div>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display: "none" }}
                onChange={e => readFile(e.target.files[0])} />
            </div>
          </div>

          {/* Job Description */}
          <div className="card-el" style={{ ...cardStyle(), overflow: "hidden" }}>
            <div style={{ padding: "11px 20px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase",
                color: T.textDim, fontWeight: 600, fontFamily: T.ff.fontFamily
              }}>Target Role</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                color: T.accent, marginBottom: 10, fontWeight: 700, fontFamily: T.ff.fontFamily
              }}>Job Description</div>
              <textarea
                className="input-focus"
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the full job description you're applying for…"
                style={{
                  width: "100%", height: 250, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: T.inputRadius,
                  color: T.text, padding: "14px 16px", fontSize: 12.5,
                  lineHeight: 1.75, resize: "none", fontFamily: T.ff.fontFamily
                }}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div style={{
            background: T.roseBg, border: `1px solid ${T.roseBorder}`,
            borderRadius: T.inputRadius, padding: "11px 16px", marginBottom: 16,
            color: T.roseText, fontSize: 12.5, fontFamily: T.ff.fontFamily
          }}>
            {err}
          </div>
        )}

        {/* ── ANALYZE BUTTON ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 60 }}>
          <button
            className="btn-analyze"
            onClick={analyze}
            disabled={loading}
            style={{
              background: loading
                ? (isLight ? "#FBF3EF" : T.cardH)
                : (isLight ? "linear-gradient(135deg,#C47A9A,#A0537A)" : T.accent),
              color: loading ? T.accent : (isLight ? "#FFFFFF" : T.bg),
              border: loading ? `1px solid ${T.border}` : "none",
              padding: isLight ? "16px 60px" : "15px 60px",
              fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase",
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              borderRadius: isLight ? "30px" : "2px",
              fontFamily: T.ff.fontFamily,
              transition: "all .25s", minWidth: 240,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: isLight && !loading ? "0 4px 20px rgba(160,83,122,.35)" : "none"
            }}
          >
            {loading ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
                  <circle cx="6.5" cy="6.5" r="5" fill="none" stroke={T.accent} strokeWidth="1.5" strokeDasharray="18 10"/>
                </svg>
                Analysing your profile…
              </>
            ) : isLight ? "✦ Run Analysis ✦" : "Run Analysis →"}
          </button>
        </div>

        {/* ── RESULTS ── */}
        {results && (
          <div style={{ animation: "fadeUp .5s ease forwards" }}>

            {/* ── Score + Summary ── */}
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: 18, marginBottom: 18 }}>

              {/* Score Ring */}
              <div className="card-el section-in" style={{
                ...cardStyle(0), padding: "28px 24px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14
              }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: T.textDim, fontWeight: 600, fontFamily: T.ff.fontFamily
                }}>Compatibility Score</div>

                <div style={{ position: "relative" }}>
                  {isLight && (
                    <div style={{
                      position: "absolute", inset: -12, borderRadius: "50%",
                      background: `radial-gradient(circle, ${T.roseBg} 0%, transparent 70%)`,
                      animation: "pulseRing 3s ease-in-out infinite"
                    }}/>
                  )}
                  <svg width="196" height="196" viewBox="0 0 196 196">
                    {isLight && (
                      <>
                        <circle cx="98" cy="98" r="94" fill="none" stroke={T.border} strokeWidth=".5" strokeDasharray="3 6"/>
                        <circle cx="98" cy="98" r="85" fill={T.roseBg}/>
                      </>
                    )}
                    {!isLight && <circle cx="98" cy="98" r="94" fill="none" stroke={T.border} strokeWidth=".5"/>}
                    <circle cx="98" cy="98" r={R} fill="none" stroke={T.surface} strokeWidth="10"/>
                    <circle
                      className="score-ring"
                      cx="98" cy="98" r={R}
                      fill="none" stroke={scoreColor} strokeWidth="10"
                      strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dashOffset}
                      transform="rotate(-90 98 98)"
                    />
                    <text x="98" y="88" textAnchor="middle"
                      style={{ fontFamily: "'IBM Plex Mono',monospace" }}
                      fill={T.text} fontSize="46" fontWeight="400">
                      {scoreVal}
                    </text>
                    <text x="98" y="108" textAnchor="middle"
                      style={{ fontFamily: T.ff.fontFamily }}
                      fill={T.textDim} fontSize="10.5" letterSpacing="2">
                      OUT OF 100
                    </text>
                  </svg>
                </div>

                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: ".12em",
                  color: scoreColor, textTransform: "uppercase",
                  padding: "5px 16px",
                  background: T.scoreLabelBg(scoreVal),
                  border: `1px solid ${T.scoreLabelBorder(scoreVal)}`,
                  borderRadius: isLight ? "20px" : "2px",
                  fontFamily: T.ff.fontFamily
                }}>
                  {isLight && "✦ "}{scoreLabel}{isLight && " ✦"}
                </div>
              </div>

              {/* Summary */}
              <div className="card-el section-in" style={{ ...cardStyle(.08), padding: 28 }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: T.textDim, fontWeight: 600, marginBottom: 18, fontFamily: T.ff.fontFamily
                }}>Candidate Profile</div>
                <p style={{
                  ...T.fd, fontSize: isLight ? 20 : 19.5, lineHeight: 1.74,
                  color: T.text, margin: 0, fontWeight: 400
                }}>
                  {results.summary}
                </p>
                <div className="stat-row" style={{
                  display: "flex", gap: 32, marginTop: 24,
                  paddingTop: 20, borderTop: `1px solid ${T.border}`
                }}>
                  {[
                    { label: "Matched Skills", val: results.matchedSkills?.length ?? 0, color: T.sage },
                    { label: "Skill Gaps", val: results.missingSkills?.length ?? 0, color: T.rose },
                    { label: "Action Tips", val: results.improvementTips?.length ?? 0, color: T.accent },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 30, fontWeight: 500, color: s.color, lineHeight: 1 }}>
                        {s.val}
                      </div>
                      <div style={{ fontSize: 9, letterSpacing: ".18em", color: T.textDim, textTransform: "uppercase", marginTop: 5, fontFamily: T.ff.fontFamily }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="skill-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Matched */}
              <div className="card-el section-in" style={{ ...cardStyle(.14), padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.sage, flexShrink: 0 }}/>
                  <div style={{ fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: T.sage, fontWeight: 700, fontFamily: T.ff.fontFamily }}>
                    Matched Skills
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: T.textDim, marginLeft: "auto" }}>
                    {results.matchedSkills?.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {results.matchedSkills?.map((sk, i) => (
                    <span key={i} className="chip" style={{
                      background: T.sageBg, border: `1px solid ${T.sageBorder}`,
                      borderRadius: T.chipRadius, padding: isLight ? "5px 13px" : "5px 11px",
                      fontSize: 11, color: T.sageText, fontWeight: 500,
                      letterSpacing: ".04em", cursor: "default",
                      animation: "fadeUp .4s ease forwards",
                      animationDelay: `${.14 + i * .05}s`, opacity: 0,
                      fontFamily: T.ff.fontFamily
                    }}>
                      {isLight ? "✓ " : "✓ "}{sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="card-el section-in" style={{ ...cardStyle(.2), padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.rose, flexShrink: 0 }}/>
                  <div style={{ fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: T.rose, fontWeight: 700, fontFamily: T.ff.fontFamily }}>
                    Skill Gaps
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: T.textDim, marginLeft: "auto" }}>
                    {results.missingSkills?.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {results.missingSkills?.map((sk, i) => (
                    <span key={i} className="chip" style={{
                      background: T.roseBg, border: `1px solid ${T.roseBorder}`,
                      borderRadius: T.chipRadius, padding: isLight ? "5px 13px" : "5px 11px",
                      fontSize: 11, color: T.roseText, fontWeight: 500,
                      letterSpacing: ".04em", cursor: "default",
                      animation: "fadeUp .4s ease forwards",
                      animationDelay: `${.2 + i * .05}s`, opacity: 0,
                      fontFamily: T.ff.fontFamily
                    }}>
                      ○ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Strengths & Weaknesses ── */}
            <div className="skill-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Strengths */}
              <div className="card-el section-in" style={{ ...cardStyle(.24), padding: 24 }}>
                <div style={{ fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: T.accent, fontWeight: 700, marginBottom: 18, fontFamily: T.ff.fontFamily }}>
                  {isLight ? "✦ Strengths" : "Strengths"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {results.strengths?.map((s, i) => (
                    <div key={i} className="str-row" style={{ display: "flex", gap: 12, alignItems: "flex-start", animationDelay: `${.28 + i * .07}s` }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: T.sageBg, border: `1px solid ${T.sageBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1
                      }}>
                        <svg width="9" height="9" viewBox="0 0 9 9">
                          <polyline points="1.5,5 3.5,7.5 7.5,1.5" fill="none" stroke={T.sageText} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.65, color: T.bodyText, fontFamily: T.ff.fontFamily }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="card-el section-in" style={{ ...cardStyle(.3), padding: 24 }}>
                <div style={{ fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: T.weaknessLabel, fontWeight: 700, marginBottom: 18, fontFamily: T.ff.fontFamily }}>
                  {isLight ? "✦ Areas to Develop" : "Areas to Develop"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {results.weaknesses?.map((w, i) => (
                    <div key={i} className="str-row" style={{ display: "flex", gap: 12, alignItems: "flex-start", animationDelay: `${.34 + i * .07}s` }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: T.roseBg, border: `1px solid ${T.roseBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1
                      }}>
                        <div style={{ width: 7, height: 1.5, background: T.rose, borderRadius: 1 }}/>
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.65, color: T.bodyText, fontFamily: T.ff.fontFamily }}>{w}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Improvement Tips ── */}
            <div className="section-in" style={{ animationDelay: ".36s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 1, background: T.border }}/>
                <div style={{ fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: T.textDim, fontWeight: 700, whiteSpace: "nowrap", fontFamily: T.ff.fontFamily }}>
                  {isLight ? "✦ Improvement Tips ✦" : "Improvement Tips"}
                </div>
                <div style={{ flex: 1, height: 1, background: T.border }}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {results.improvementTips?.map((tip, i) => (
                  <div key={i} className="card-el tip-card" style={{
                    background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: T.cardRadius, boxShadow: T.cardShadow,
                    padding: "18px 18px 20px", position: "relative", overflow: "hidden",
                    animation: "fadeUp .5s ease forwards",
                    animationDelay: `${.4 + i * .07}s`, opacity: 0, cursor: "default"
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: T.accentBarFn(i)
                    }}/>
                    {isLight && (
                      <div style={{
                        position: "absolute", top: 10, right: 12,
                        fontSize: 16, opacity: .2, color: T.accent
                      }}>✦</div>
                    )}
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: T.tipNum, marginBottom: 9, letterSpacing: ".12em" }}>
                      {String(i + 1).padStart(2, "0")} —
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.4, fontFamily: T.ff.fontFamily }}>
                      {tip}
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!results && !loading && (
          <div style={{ textAlign: "center", marginTop: 24, opacity: .4 }}>
            <div style={{ ...T.fd, fontSize: 16, color: T.textDim, fontStyle: "italic", fontWeight: 300 }}>
              Your analysis will appear here
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...T.fd, fontSize: 13, color: T.textDim, fontStyle: "italic" }}>
          {isLight ? "✦ Résumé Oracle" : "Résumé Oracle"}
        </div>
        <div style={{ fontSize: 9.5, letterSpacing: ".18em", color: T.textDim, textTransform: "uppercase", fontFamily: T.ff.fontFamily }}>
          AI · Career Intelligence
        </div>
      </footer>
    </div>
  );
}