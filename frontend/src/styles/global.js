// src/styles/global.js
export const GLOBAL_CSS = `
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
