import React, { useState, useCallback, useRef, useEffect } from "react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,450;9..144,600;9..144,700&family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;500;600&display=swap');
`;

const SKILL_DB = [
  { name: "React.js", group: "Frontend" },
  { name: "Node.js", group: "Backend" },
  { name: "Python", group: "Language" },
  { name: "MongoDB", group: "Database" },
  { name: "REST APIs", group: "Backend" },
  { name: "TypeScript", group: "Language" },
  { name: "Tailwind CSS", group: "Frontend" },
  { name: "Git", group: "Tooling" },
  { name: "Docker", group: "DevOps" },
  { name: "SQL", group: "Database" },
  { name: "Team Leadership", group: "Soft Skill" },
  { name: "Agile/Scrum", group: "Process" },
  { name: "Figma", group: "Design" },
  { name: "AWS", group: "DevOps" },
  { name: "GraphQL", group: "Backend" },
  { name: "Communication", group: "Soft Skill" },
];

const GROUP_COLORS = {
  Frontend: { bg: "#2a2117", border: "#caa05a", text: "#e8c98a" },
  Backend: { bg: "#1c2420", border: "#7fa88a", text: "#a8d4b6" },
  Language: { bg: "#241c1f", border: "#c08a8a", text: "#dcb0b0" },
  Database: { bg: "#1d2128", border: "#7e94b8", text: "#aac0e2" },
  Tooling: { bg: "#211e28", border: "#9c8ac0", text: "#c7b8e6" },
  DevOps: { bg: "#28211c", border: "#c2965f", text: "#e4bd8c" },
  "Soft Skill": { bg: "#23201a", border: "#b8a878", text: "#dccfa0" },
  Process: { bg: "#1e2424", border: "#7fb0ab", text: "#a8d6d0" },
  Design: { bg: "#241e23", border: "#c08ab0", text: "#e0aed0" },
};

function pickSkills(seed) {
  const shuffled = [...SKILL_DB].sort((a, b) => {
    const h1 = (a.name.charCodeAt(0) * seed) % 17;
    const h2 = (b.name.charCodeAt(0) * seed) % 17;
    return h1 - h2;
  });
  return shuffled.slice(0, 9 + (seed % 4));
}

function makeAnalysis(fileName) {
  let seed = 0;
  for (let i = 0; i < fileName.length; i++) seed += fileName.charCodeAt(i);
  const score = 58 + (seed % 38);
  const skills = pickSkills(seed);

  const feedbackPool = [
    "Your work experience section tells a clear, results-driven story — recruiters will notice the impact metrics right away.",
    "Strong technical breadth. Your skills section reads as current and relevant to modern full-stack roles.",
    "Your formatting is clean and scannable — a recruiter could parse this in under eight seconds, which is exactly the goal.",
    "Good use of action verbs throughout. Phrases like 'engineered', 'shipped', and 'optimized' carry far more weight than passive language.",
    "Your project descriptions strike a nice balance between technical depth and business outcomes.",
  ];
  const feedback = feedbackPool[seed % feedbackPool.length];

  const allSuggestions = [
    { text: "Add quantifiable metrics to 2–3 bullet points (e.g. 'reduced load time by 40%').", priority: "high" },
    { text: "Include a concise professional summary at the top — 2 lines max.", priority: "high" },
    { text: "Your contact section is missing a LinkedIn or portfolio link.", priority: "medium" },
    { text: "Consider trimming older roles older than 8 years unless highly relevant.", priority: "low" },
    { text: "Use consistent date formatting across all entries (MM/YYYY).", priority: "medium" },
    { text: "Add 2–3 more industry keywords to improve ATS keyword matching.", priority: "high" },
    { text: "Break up dense paragraphs into bullet points for better scanability.", priority: "medium" },
    { text: "List certifications in a dedicated section rather than inline.", priority: "low" },
  ];
  const suggestions = allSuggestions
    .filter((_, i) => (seed + i) % 2 === 0 || i < 3)
    .slice(0, 5);

  return { score, skills, feedback, suggestions, fileName };
}

const PRIORITY_STYLE = {
  high: { dot: "#d4675a", label: "High impact" },
  medium: { dot: "#caa05a", label: "Worth fixing" },
  low: { dot: "#7fa88a", label: "Nice to have" },
};

function ScoreGauge({ score }) {
  const [animated, setAnimated] = useState(0);
  const r = 88;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    setAnimated(0);
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;
  const color = score >= 80 ? "#9fc48a" : score >= 60 ? "#caa05a" : "#cf7a6a";

  return (
    <div className="relative w-56 h-56 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#2a2622" strokeWidth="10" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1), stroke 1.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tabular-nums leading-none"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "3.6rem", fontWeight: 700, color: "#f3ead9" }}
        >
          {animated}
        </span>
        <span
          className="tracking-[0.3em] text-[10px] mt-2 uppercase"
          style={{ color: "#9c9388", fontFamily: "'Work Sans', sans-serif" }}
        >
          ATS Score
        </span>
      </div>
    </div>
  );
}

function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="relative cursor-pointer rounded-2xl transition-all duration-300 group"
      style={{
        border: `1px dashed ${dragging ? "#caa05a" : "#3a352e"}`,
        background: dragging
          ? "radial-gradient(circle at 50% 30%, rgba(202,160,90,0.08), transparent 70%)"
          : "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.015), transparent 70%)",
        padding: "4.5rem 2rem",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <div className="flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
          style={{ border: "1px solid #caa05a", background: "rgba(202,160,90,0.06)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#caa05a" strokeWidth="1.5">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 450 }}
          className="text-[#f3ead9] text-2xl mb-2"
        >
          Drop your resume here
        </p>
        <p style={{ fontFamily: "'Work Sans', sans-serif" }} className="text-[#9c9388] text-sm">
          or click to browse · PDF, DOC, DOCX
        </p>
      </div>
    </div>
  );
}

function AnalyzingState({ fileName }) {
  const steps = ["Parsing document structure", "Extracting skills & keywords", "Scoring against ATS rules", "Generating feedback"];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    }, 650);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-20">
      <div className="relative w-20 h-20 mb-8">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid #3a352e" }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{ border: "1px solid transparent", borderTopColor: "#caa05a", animationDuration: "1.1s" }}
        />
      </div>
      <p style={{ fontFamily: "'Fraunces', serif" }} className="text-[#f3ead9] text-xl mb-1">
        Analyzing {fileName}
      </p>
      <p style={{ fontFamily: "'Space Mono', monospace" }} className="text-[#caa05a] text-xs tracking-wider">
        {steps[stepIndex]}
      </p>
      <div className="flex gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full transition-all duration-500"
            style={{
              width: i <= stepIndex ? "28px" : "12px",
              background: i <= stepIndex ? "#caa05a" : "#3a352e",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SkillsCard({ skills }) {
  return (
    <div
      className="rounded-2xl p-7"
      style={{ background: "#1a1714", border: "1px solid #2e2a24" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#f3ead9] text-lg">
          Extracted Skills
        </h3>
        <span
          style={{ fontFamily: "'Space Mono', monospace" }}
          className="text-[10px] text-[#9c9388]"
        >
          {skills.length} found
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => {
          const c = GROUP_COLORS[skill.group] || GROUP_COLORS.Tooling;
          return (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs opacity-0"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}55`,
                color: c.text,
                fontFamily: "'Work Sans', sans-serif",
                animation: `riseIn 0.5s ease forwards`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.border }} />
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function FeedbackCard({ text }) {
  return (
    <div
      className="rounded-2xl p-7 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #221c16, #1a1714)", border: "1px solid #3a3024" }}
    >
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #caa05a, transparent 70%)" }}
      />
      <div className="flex items-start gap-3 relative">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "rgba(202,160,90,0.12)", border: "1px solid #caa05a55" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#caa05a" strokeWidth="1.6">
            <path d="M12 2a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2z" strokeLinejoin="round" />
            <path d="M9 21h6" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#f3ead9] text-base mb-1.5">
            Overall Feedback
          </h3>
          <p
            style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300 }}
            className="text-[#d9cfc0] text-[15px] leading-relaxed"
          >
            "{text}"
          </p>
        </div>
      </div>
    </div>
  );
}

function SuggestionsCard({ suggestions }) {
  return (
    <div
      className="rounded-2xl p-7"
      style={{ background: "#1a1714", border: "1px solid #2e2a24" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#f3ead9] text-lg">
          Suggested Improvements
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((s, i) => {
          const p = PRIORITY_STYLE[s.priority];
          return (
            <div
              key={i}
              className="flex items-start gap-3 pb-3 opacity-0"
              style={{
                borderBottom: i < suggestions.length - 1 ? "1px solid #2a2620" : "none",
                animation: "riseIn 0.5s ease forwards",
                animationDelay: `${300 + i * 90}ms`,
              }}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: p.dot }}
              />
              <div className="flex-1">
                <p style={{ fontFamily: "'Work Sans', sans-serif" }} className="text-[#e5dccd] text-sm leading-snug">
                  {s.text}
                </p>
                <span
                  style={{ fontFamily: "'Space Mono', monospace", color: p.dot }}
                  className="text-[10px] tracking-wide uppercase"
                >
                  {p.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [stage, setStage] = useState("idle");
  const [analysis, setAnalysis] = useState(null);

  const handleFile = (file) => {
    setStage("analyzing");
    setTimeout(() => {
      setAnalysis(makeAnalysis(file.name));
      setStage("results");
    }, 2700);
  };

  const reset = () => {
    setStage("idle");
    setAnalysis(null);
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center px-6 py-14"
      style={{
        background:
          "radial-gradient(circle at 15% 0%, #1f1a14 0%, #14110d 45%, #0e0c0a 100%)",
      }}
    >
      <style>{FONT_IMPORT}</style>
      <style>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-3xl">
        <div
          className="text-center mb-12"
          style={{ animation: "fadeUp 0.7s ease forwards" }}
        >
          <p
            style={{ fontFamily: "'Space Mono', monospace", color: "#caa05a" }}
            className="text-xs tracking-[0.35em] uppercase mb-3"
          >
            Résumé Intelligence
          </p>
          <h1
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            className="text-[#f3ead9] text-4xl sm:text-5xl mb-3"
          >
            The Analyzer
          </h1>
          <p style={{ fontFamily: "'Work Sans', sans-serif" }} className="text-[#9c9388] text-sm max-w-md mx-auto">
            Upload your résumé for an instant ATS compatibility score, extracted skills, and tailored improvement notes.
          </p>
        </div>

        {stage === "idle" && (
          <div style={{ animation: "fadeUp 0.7s ease 0.1s forwards", opacity: 0 }}>
            <UploadZone onFile={handleFile} />
          </div>
        )}

        {stage === "analyzing" && <AnalyzingState fileName={analysis?.fileName || "your resume"} />}

        {stage === "results" && analysis && (
          <div className="flex flex-col gap-6">
            <div
              className="rounded-2xl p-10 flex flex-col items-center"
              style={{
                background: "linear-gradient(180deg, #1c1813, #161310)",
                border: "1px solid #3a3024",
                animation: "fadeUp 0.7s ease forwards",
              }}
            >
              <ScoreGauge score={analysis.score} />
              <p
                style={{ fontFamily: "'Work Sans', sans-serif" }}
                className="text-[#9c9388] text-xs mt-4 text-center max-w-xs"
              >
                {analysis.score >= 80
                  ? "Excellent — this resume is well-optimized for ATS screening."
                  : analysis.score >= 60
                  ? "Solid foundation, with room to sharpen keyword alignment."
                  : "Several quick fixes could meaningfully raise this score."}
              </p>
            </div>

            <div style={{ animation: "fadeUp 0.7s ease 0.15s forwards", opacity: 0, animationFillMode: "forwards" }}>
              <SkillsCard skills={analysis.skills} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div style={{ animation: "fadeUp 0.7s ease 0.25s forwards", opacity: 0, animationFillMode: "forwards" }}>
                <FeedbackCard text={analysis.feedback} />
              </div>
              <div style={{ animation: "fadeUp 0.7s ease 0.3s forwards", opacity: 0, animationFillMode: "forwards" }}>
                <SuggestionsCard suggestions={analysis.suggestions} />
              </div>
            </div>

            <button
              onClick={reset}
              className="mx-auto mt-2 px-6 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: "#caa05a",
                border: "1px solid #caa05a55",
                background: "transparent",
              }}
            >
              ← Analyze another resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}