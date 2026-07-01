import { useState, useRef, useEffect, useCallback } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box}
body{margin:0;background:#0D0B08;font-family:'Syne',sans-serif}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#3A3020;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes breathe{0%,100%{opacity:0.7}50%{opacity:1}}
.score-ring{transition:stroke-dashoffset 1.8s cubic-bezier(.25,.46,.45,.94)}
.chip{transition:transform .15s,opacity .15s}
.chip:hover{transform:scale(1.04)}
.tip-card{transition:transform .2s,background .2s}
.tip-card:hover{transform:translateY(-3px)}
.btn-analyze:hover:not(:disabled){filter:brightness(1.1)}
.btn-analyze:active:not(:disabled){transform:scale(.98)}
.gold-text{background:linear-gradient(90deg,#8A7030 0%,#C9A84C 40%,#E8D080 50%,#C9A84C 60%,#8A7030 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 6s linear infinite}
.drop-zone{transition:border-color .2s,background .2s}
.drop-zone.over{border-color:#C9A84C!important;background:rgba(201,168,76,.07)!important}
.input-focus{transition:border-color .2s}
.input-focus:focus{border-color:#C9A84C!important}
.tab-btn{transition:color .15s,border-color .15s}
.str-row{animation:fadeUp .45s ease forwards;opacity:0}
.section-in{animation:fadeUp .55s ease forwards;opacity:0}
@media(max-width:760px){.two-col{grid-template-columns:1fr!important}.skill-row{grid-template-columns:1fr!important}.stat-row{gap:16px!important}}
`;

const C = {
  bg: "#0D0B08", surface: "#131008", card: "#1C1812", cardH: "#231E13",
  border: "#2B2419", borderL: "#3A3020",
  gold: "#C9A84C", goldDim: "#7A6428", goldGlow: "rgba(201,168,76,.12)",
  cream: "#EDE0C4", creamDim: "#8A7B60",
  sage: "#4E7A58", sageBg: "rgba(78,122,88,.13)", sageBorder: "rgba(78,122,88,.3)",
  sageText: "#7DB88A",
  rose: "#8A3535", roseBg: "rgba(138,53,53,.13)", roseBorder: "rgba(138,53,53,.3)",
  roseText: "#C47070",
};

const fd = { fontFamily: "'Cormorant Garant', serif" };
const fm = { fontFamily: "'IBM Plex Mono', monospace" };

export default function App() {
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

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = G;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

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
  const scoreColor = scoreVal >= 75 ? C.sage : scoreVal >= 50 ? C.gold : C.rose;
  const scoreLabel = scoreVal >= 75 ? "Strong Match" : scoreVal >= 50 ? "Moderate Match" : "Needs Work";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.cream }}>
      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 99,
        background: "rgba(13,11,8,.92)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
        height: 62, display: "flex", alignItems: "center",
        padding: "0 32px", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="1" y="1" width="9" height="24" rx=".5" stroke={C.gold} strokeWidth="1.2"/>
            <rect x="14" y="1" width="11" height="24" rx=".5" stroke={C.gold} strokeWidth="1.2" opacity=".35"/>
            <line x1="3.5" y1="6" x2="7.5" y2="6" stroke={C.gold} strokeWidth="1"/>
            <line x1="3.5" y1="10" x2="7.5" y2="10" stroke={C.gold} strokeWidth="1"/>
            <line x1="3.5" y1="14" x2="7.5" y2="14" stroke={C.gold} strokeWidth="1"/>
            <line x1="3.5" y1="18" x2="7.5" y2="18" stroke={C.gold} strokeWidth="1"/>
          </svg>
          <div>
            <div style={{ ...fd, fontSize: 19, fontWeight: 600, lineHeight: 1, letterSpacing: ".02em" }}>
              <span style={{ color: C.gold }}>Résumé</span>{" "}Oracle
            </div>
            <div style={{ fontSize: 9, letterSpacing: ".22em", color: C.creamDim, textTransform: "uppercase", marginTop: 1 }}>
              AI · Analysis
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase",
          color: C.creamDim, border: `1px solid ${C.border}`, borderRadius: 2,
          padding: "4px 10px", fontWeight: 600
        }}>
          Powered by Claude
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase",
            color: C.gold, marginBottom: 16, fontWeight: 600
          }}>
            Intelligent Career Intelligence
          </div>
          <h1 style={{
            ...fd, margin: 0, fontWeight: 300,
            fontSize: "clamp(38px, 5.5vw, 68px)",
            lineHeight: 1.08, letterSpacing: "-.01em", color: C.cream
          }}>
            Know exactly where you<br/>
            <em style={{ fontStyle: "italic", color: C.gold }}>stand before you apply.</em>
          </h1>
          <p style={{
            margin: "22px auto 0", maxWidth: 460, fontSize: 14.5,
            color: C.creamDim, lineHeight: 1.75, fontWeight: 400
          }}>
            Paste your resume and a job description. Get an instant compatibility score,
            skills gap breakdown, and editorial-quality improvement advice.
          </p>
        </div>

        {/* ── INPUT GRID ── */}
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

          {/* Resume */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
              {["paste", "upload"].map(t => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{
                  flex: 1, padding: "11px 0",
                  background: tab === t ? C.cardH : "transparent",
                  border: "none",
                  borderBottom: `2px solid ${tab === t ? C.gold : "transparent"}`,
                  color: tab === t ? C.gold : C.creamDim,
                  fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase",
                  fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif"
                }}>
                  {t === "paste" ? "Paste Text" : "Upload File"}
                </button>
              ))}
            </div>
            <div style={{ padding: 20 }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                color: C.gold, marginBottom: 10, fontWeight: 700
              }}>Your Resume</div>

              {tab === "paste" ? (
                <textarea
                  className="input-focus"
                  value={resumeText.startsWith("__B64__") ? "" : resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here…"
                  style={{
                    width: "100%", height: 256, background: C.surface,
                    border: `1px solid ${C.border}`, borderRadius: 3,
                    color: C.cream, padding: "14px 16px", fontSize: 12.5,
                    lineHeight: 1.75, resize: "none", fontFamily: "'Syne',sans-serif"
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
                    height: 256, border: `1.5px dashed ${C.borderL}`,
                    borderRadius: 3, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", gap: 14, background: C.surface
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <rect x="9" y="3" width="18" height="28" rx="1" stroke={C.gold} strokeWidth="1.3" opacity=".4"/>
                    <rect x="13" y="3" width="18" height="28" rx="1" stroke={C.gold} strokeWidth="1.3"/>
                    <line x1="17" y1="11" x2="27" y2="11" stroke={C.gold} strokeWidth="1.1" opacity=".65"/>
                    <line x1="17" y1="15" x2="27" y2="15" stroke={C.gold} strokeWidth="1.1" opacity=".65"/>
                    <line x1="17" y1="19" x2="23" y2="19" stroke={C.gold} strokeWidth="1.1" opacity=".65"/>
                    <circle cx="33" cy="33" r="9" fill={C.card} stroke={C.gold} strokeWidth="1.3"/>
                    <line x1="33" y1="29.5" x2="33" y2="36.5" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="29.5" y1="33" x2="36.5" y2="33" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.cream, fontSize: 13.5, fontWeight: 500, marginBottom: 5 }}>
                      {fileName || "Drop your résumé here"}
                    </div>
                    <div style={{ color: C.creamDim, fontSize: 11 }}>PDF or TXT · click to browse</div>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display: "none" }}
                onChange={e => readFile(e.target.files[0])} />
            </div>
          </div>

          {/* Job Description */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4 }}>
            <div style={{ padding: "11px 20px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase",
                color: C.creamDim, fontWeight: 600
              }}>Target Role</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{
                fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                color: C.gold, marginBottom: 10, fontWeight: 700
              }}>Job Description</div>
              <textarea
                className="input-focus"
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the full job description you're applying for…"
                style={{
                  width: "100%", height: 256, background: C.surface,
                  border: `1px solid ${C.border}`, borderRadius: 3,
                  color: C.cream, padding: "14px 16px", fontSize: 12.5,
                  lineHeight: 1.75, resize: "none", fontFamily: "'Syne',sans-serif"
                }}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div style={{
            background: C.roseBg, border: `1px solid ${C.roseBorder}`,
            borderRadius: 3, padding: "11px 16px", marginBottom: 16,
            color: C.roseText, fontSize: 12.5, letterSpacing: ".01em"
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
              background: loading ? C.cardH : C.gold,
              color: loading ? C.gold : C.bg,
              border: loading ? `1px solid ${C.gold}` : "none",
              padding: "15px 60px",
              fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase",
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 2, fontFamily: "'Syne',sans-serif",
              transition: "all .25s", minWidth: 240,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10
            }}
          >
            {loading ? (
              <>
                <svg width="13" height="13" viewBox="0 0 13 13" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
                  <circle cx="6.5" cy="6.5" r="5" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="18 10"/>
                </svg>
                Analysing your profile…
              </>
            ) : "Run Analysis →"}
          </button>
        </div>

        {/* ── RESULTS ── */}
        {results && (
          <div style={{ animation: "fadeUp .5s ease forwards" }}>

            {/* Score + Summary */}
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: 18, marginBottom: 18 }}>

              {/* Score Ring */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: "28px 24px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14
              }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: C.creamDim, fontWeight: 600
                }}>Compatibility Score</div>

                <svg width="196" height="196" viewBox="0 0 196 196">
                  {/* Decorative outer ring */}
                  <circle cx="98" cy="98" r="94" fill="none" stroke={C.border} strokeWidth=".5"/>
                  {/* Track */}
                  <circle cx="98" cy="98" r={R} fill="none" stroke={C.surface} strokeWidth="10"/>
                  {/* Progress */}
                  <circle
                    className="score-ring"
                    cx="98" cy="98" r={R}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 98 98)"
                    style={{ filter: `drop-shadow(0 0 6px ${scoreColor}55)` }}
                  />
                  {/* Score number */}
                  <text x="98" y="88" textAnchor="middle"
                    style={{ fontFamily: "'IBM Plex Mono',monospace" }}
                    fill={C.cream} fontSize="46" fontWeight="400">
                    {scoreVal}
                  </text>
                  <text x="98" y="108" textAnchor="middle"
                    style={{ fontFamily: "'Syne',sans-serif" }}
                    fill={C.creamDim} fontSize="10.5" letterSpacing="2">
                    OUT OF 100
                  </text>
                </svg>

                {/* Label */}
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: ".14em",
                  color: scoreColor, textTransform: "uppercase",
                  padding: "5px 14px",
                  background: scoreVal >= 75 ? C.sageBg : scoreVal >= 50 ? C.goldGlow : C.roseBg,
                  border: `1px solid ${scoreVal >= 75 ? C.sageBorder : scoreVal >= 50 ? "rgba(201,168,76,.3)" : C.roseBorder}`,
                  borderRadius: 2
                }}>
                  {scoreLabel}
                </div>
              </div>

              {/* Candidate Summary */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: 28, animationDelay: ".08s"
              }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: C.creamDim, fontWeight: 600, marginBottom: 18
                }}>Candidate Profile</div>
                <p style={{
                  ...fd, fontSize: 19.5, lineHeight: 1.72, color: C.cream,
                  margin: 0, fontWeight: 400
                }}>
                  {results.summary}
                </p>

                {/* Mini stats */}
                <div className="stat-row" style={{
                  display: "flex", gap: 32, marginTop: 26,
                  paddingTop: 20, borderTop: `1px solid ${C.border}`
                }}>
                  {[
                    { label: "Matched Skills", val: results.matchedSkills?.length ?? 0, color: C.sage },
                    { label: "Skill Gaps", val: results.missingSkills?.length ?? 0, color: C.rose },
                    { label: "Action Tips", val: results.improvementTips?.length ?? 0, color: C.gold },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ ...fm, fontSize: 30, fontWeight: 500, color: s.color, lineHeight: 1 }}>
                        {s.val}
                      </div>
                      <div style={{
                        fontSize: 9, letterSpacing: ".18em", color: C.creamDim,
                        textTransform: "uppercase", marginTop: 5
                      }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Row */}
            <div className="skill-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Matched */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: 24, animationDelay: ".14s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage, flexShrink: 0 }}/>
                  <div style={{
                    fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                    color: C.sage, fontWeight: 700
                  }}>Matched Skills</div>
                  <div style={{ ...fm, fontSize: 10.5, color: C.creamDim, marginLeft: "auto" }}>
                    {results.matchedSkills?.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {results.matchedSkills?.map((sk, i) => (
                    <span key={i} className="chip" style={{
                      background: C.sageBg, border: `1px solid ${C.sageBorder}`,
                      borderRadius: 2, padding: "5px 11px",
                      fontSize: 11, color: C.sageText, fontWeight: 500,
                      letterSpacing: ".04em", cursor: "default",
                      animation: "fadeUp .4s ease forwards",
                      animationDelay: `${.14 + i * .05}s`, opacity: 0
                    }}>
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: 24, animationDelay: ".2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.rose, flexShrink: 0 }}/>
                  <div style={{
                    fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                    color: C.rose, fontWeight: 700
                  }}>Skill Gaps</div>
                  <div style={{ ...fm, fontSize: 10.5, color: C.creamDim, marginLeft: "auto" }}>
                    {results.missingSkills?.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {results.missingSkills?.map((sk, i) => (
                    <span key={i} className="chip" style={{
                      background: C.roseBg, border: `1px solid ${C.roseBorder}`,
                      borderRadius: 2, padding: "5px 11px",
                      fontSize: 11, color: C.roseText, fontWeight: 500,
                      letterSpacing: ".04em", cursor: "default",
                      animation: "fadeUp .4s ease forwards",
                      animationDelay: `${.2 + i * .05}s`, opacity: 0
                    }}>
                      ○ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="skill-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              {/* Strengths */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: 24, animationDelay: ".24s"
              }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: C.gold, fontWeight: 700, marginBottom: 18
                }}>Strengths</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {results.strengths?.map((s, i) => (
                    <div key={i} className="str-row" style={{ display: "flex", gap: 12, alignItems: "flex-start", animationDelay: `${.28 + i * .07}s` }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: C.sageBg, border: `1px solid ${C.sageBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1
                      }}>
                        <svg width="9" height="9" viewBox="0 0 9 9">
                          <polyline points="1.5,5 3.5,7.5 7.5,1.5" fill="none" stroke={C.sageText} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.65, color: "#C5BDB0" }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="section-in" style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: 24, animationDelay: ".3s"
              }}>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: "#7A4040", fontWeight: 700, marginBottom: 18
                }}>Areas to Develop</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {results.weaknesses?.map((w, i) => (
                    <div key={i} className="str-row" style={{ display: "flex", gap: 12, alignItems: "flex-start", animationDelay: `${.34 + i * .07}s` }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: C.roseBg, border: `1px solid ${C.roseBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1
                      }}>
                        <div style={{ width: 7, height: 1.5, background: C.rose, borderRadius: 1 }}/>
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.65, color: "#C5BDB0" }}>{w}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="section-in" style={{ animationDelay: ".36s" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, marginBottom: 18
              }}>
                <div style={{ flex: 1, height: 1, background: C.border }}/>
                <div style={{
                  fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase",
                  color: C.creamDim, fontWeight: 700, whiteSpace: "nowrap"
                }}>
                  Improvement Tips
                </div>
                <div style={{ flex: 1, height: 1, background: C.border }}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {results.improvementTips?.map((tip, i) => (
                  <div key={i} className="tip-card" style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    padding: "18px 18px 20px",
                    position: "relative", overflow: "hidden",
                    animation: "fadeUp .5s ease forwards",
                    animationDelay: `${.4 + i * .07}s`, opacity: 0,
                    cursor: "default"
                  }}>
                    {/* Top accent bar — varying lengths add rhythm */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, ${C.gold} ${20 + i * 14}%, transparent)`
                    }}/>
                    <div style={{ ...fm, fontSize: 10, color: C.goldDim, marginBottom: 9, letterSpacing: ".12em" }}>
                      {String(i + 1).padStart(2, "0")} —
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.cream, marginBottom: 8, lineHeight: 1.4 }}>
                      {tip}
                    </div>
                 
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Empty state hint */}
        {!results && !loading && (
          <div style={{ textAlign: "center", marginTop: 24, opacity: .45 }}>
            <div style={{ ...fd, fontSize: 16, color: C.creamDim, fontStyle: "italic", fontWeight: 300 }}>
              Your analysis will appear here
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`, padding: "20px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ ...fd, fontSize: 13, color: C.creamDim, fontStyle: "italic" }}>
          Résumé Oracle
        </div>
        <div style={{ fontSize: 9.5, letterSpacing: ".18em", color: C.creamDim, textTransform: "uppercase" }}>
          AI · Career Intelligence
        </div>
      </footer>
    </div>
  );
}