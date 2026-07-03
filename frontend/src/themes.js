// src/themes.js
export const DARK = {
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
  scoreLabelBg: (s) =>
    s >= 75
      ? "rgba(78,122,88,.13)"
      : s >= 50
        ? "rgba(201,168,76,.12)"
        : "rgba(138,53,53,.13)",
  scoreLabelBorder: (s) =>
    s >= 75
      ? "rgba(78,122,88,.3)"
      : s >= 50
        ? "rgba(201,168,76,.3)"
        : "rgba(138,53,53,.3)",
  fd: { fontFamily: "'Cormorant Garant', serif" },
  ff: { fontFamily: "'Syne', sans-serif" },
  fm: { fontFamily: "'IBM Plex Mono', monospace" },
  inputFocusCss:
    ".input-focus:focus{border-color:#C9A84C!important}.drop-zone.over{border-color:#C9A84C!important;background:rgba(201,168,76,.07)!important}",
  btnBg: (loading) => (loading ? "#231E13" : "#C9A84C"),
  btnColor: (loading) => (loading ? "#C9A84C" : "#0D0B08"),
  btnBorder: (loading) => (loading ? "1px solid #C9A84C" : "none"),
  accentBarFn: (i) =>
    `linear-gradient(90deg, #C9A84C ${20 + i * 14}%, transparent)`,
  decorBg: null,
};

export const LIGHT = {
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
  scoreLabelBg: (s) =>
    s >= 75
      ? "rgba(79,126,92,.1)"
      : s >= 50
        ? "rgba(160,83,122,.1)"
        : "rgba(155,61,98,.1)",
  scoreLabelBorder: (s) =>
    s >= 75
      ? "rgba(79,126,92,.3)"
      : s >= 50
        ? "rgba(160,83,122,.3)"
        : "rgba(155,61,98,.3)",
  fd: { fontFamily: "'Fraunces', serif" },
  ff: { fontFamily: "'DM Sans', sans-serif" },
  fm: { fontFamily: "'IBM Plex Mono', monospace" },
  inputFocusCss:
    ".input-focus:focus{border-color:#A0537A!important}.drop-zone.over{border-color:#A0537A!important;background:rgba(160,83,122,.05)!important}",
  btnBg: (loading) =>
    loading ? "#FBF3EF" : "linear-gradient(135deg,#C47A9A,#A0537A)",
  btnColor: () => (loading ? "#A0537A" : "#FFFFFF"),
  btnBorder: (loading) => (loading ? "1px solid #D4A0B8" : "none"),
  accentBarFn: (i) =>
    `linear-gradient(90deg, #C47A9A ${10 + i * 12}%, #E8A8C0 ${30 + i * 10}%, transparent)`,
  decorBg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23D4A0B8' opacity='0.25'/%3E%3Ccircle cx='5' cy='5' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='55' cy='5' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='5' cy='55' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3Ccircle cx='55' cy='55' r='1' fill='%23D4A0B8' opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
};
