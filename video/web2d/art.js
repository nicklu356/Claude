// Illustrated (semi-realistic, shaded vector) art for the HearHere concept video.
// Every builder returns an SVG <g>; moving parts are exposed on .parts so the
// scenes can pose them per frame with plain transform attributes.
// Green-screen mode: no painted backgrounds or contact shadows, so the team can
// composite real Melbourne photos behind the characters.
export const GREEN = '#00B140';
export const C = {
  purple: '#7B4B94', purpleD: '#5A3370', purpleL: '#EDE3F3', purpleM: '#9C6DB8',
  orange: '#F28C28', orangeD: '#C96A10', orangeL: '#FFE6CC',
  green: '#1E9BB0', greenD: '#16707F', greenL: '#DDF1F5',
  cream: '#FFF4E0', navy: '#1F2A44', navy2: '#46506A', red: '#E0544B',
};

const NS = 'http://www.w3.org/2000/svg';
export function svgEl(tag, attrs = {}, html = '') {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (html) e.innerHTML = html;
  return e;
}
export const g = (html = '', attrs = {}) => svgEl('g', attrs, html);
export const tf = (el, s) => { if (el && el.getAttribute('transform') !== s) el.setAttribute('transform', s); };
const R = (deg) => deg * Math.PI / 180;
// point (0, l) rotated by SVG angle a (degrees, clockwise)
const rot = (l, a) => ({ x: -l * Math.sin(R(a)), y: l * Math.cos(R(a)) });

// ------------------------------------------------------------------ shared defs
export function defs() {
  return svgEl('defs', {}, `
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB3E6"/><stop offset=".55" stop-color="#BFE0F4"/><stop offset="1" stop-color="#FCEFD9"/></linearGradient>
    <linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2350"/><stop offset=".5" stop-color="#7A4A82"/><stop offset=".85" stop-color="#E88A5A"/><stop offset="1" stop-color="#F7B46A"/></linearGradient>
    <radialGradient id="gSun"><stop offset="0" stop-color="#FFF8DC" stop-opacity="1"/><stop offset=".25" stop-color="#FFF1C4" stop-opacity=".8"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient>
    <linearGradient id="gHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9F3FA" stop-opacity="0"/><stop offset="1" stop-color="#F4F1E8" stop-opacity=".85"/></linearGradient>
    <linearGradient id="gHazeD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E88A5A" stop-opacity="0"/><stop offset="1" stop-color="#F2A066" stop-opacity=".6"/></linearGradient>
    <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFE6F2"/><stop offset=".45" stop-color="#8DB7CF"/><stop offset="1" stop-color="#5E89A6"/></linearGradient>
    <linearGradient id="gGlassN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE3A3"/><stop offset="1" stop-color="#F2A94E"/></linearGradient>
    <linearGradient id="gWalk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BDB3A5"/><stop offset=".25" stop-color="#D6CDBF"/><stop offset="1" stop-color="#E3DBCE"/></linearGradient>
    <linearGradient id="gWalkD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5E6E"/><stop offset="1" stop-color="#9A8790"/></linearGradient>
    <linearGradient id="gRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C515C"/><stop offset="1" stop-color="#5E636E"/></linearGradient>
    <linearGradient id="gRoadD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B3346"/><stop offset="1" stop-color="#4C4256"/></linearGradient>
    <linearGradient id="gBark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A6A58"/><stop offset=".5" stop-color="#A69580"/><stop offset="1" stop-color="#6A5A4A"/></linearGradient>
    <radialGradient id="gLeaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8BCB6E"/><stop offset=".6" stop-color="#5DA34F"/><stop offset="1" stop-color="#3E7E3E"/></radialGradient>
    <radialGradient id="gLeafD" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6C8F6A"/><stop offset="1" stop-color="#344E40"/></radialGradient>
    <radialGradient id="gSkin" cx=".62" cy=".38" r=".75"><stop offset="0" stop-color="#F8D5B5"/><stop offset=".7" stop-color="#EDBB94"/><stop offset="1" stop-color="#D99E77"/></radialGradient>
    <linearGradient id="gSkinL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D9A07A"/><stop offset="1" stop-color="#F1C6A2"/></linearGradient>
    <linearGradient id="gHood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E98F8"/><stop offset=".55" stop-color="#4874E6"/><stop offset="1" stop-color="#3256C2"/></linearGradient>
    <linearGradient id="gSleeve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3D63D0"/><stop offset=".55" stop-color="#5C88F2"/><stop offset="1" stop-color="#3A5FCB"/></linearGradient>
    <linearGradient id="gSleeveB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2C4BAA"/><stop offset="1" stop-color="#3B5FC8"/></linearGradient>
    <linearGradient id="gJeans" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2C3A5C"/><stop offset=".5" stop-color="#43557E"/><stop offset="1" stop-color="#2A3656"/></linearGradient>
    <linearGradient id="gJeansB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#222C47"/><stop offset="1" stop-color="#303D60"/></linearGradient>
    <linearGradient id="gHair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3C3644"/><stop offset="1" stop-color="#141218"/></linearGradient>
    <linearGradient id="gShoe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DADDE5"/></linearGradient>
    <linearGradient id="gFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A858"/><stop offset=".6" stop-color="#DB8A3C"/><stop offset="1" stop-color="#B96F2C"/></linearGradient>
    <radialGradient id="gFurH" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#F6B66A"/><stop offset="1" stop-color="#D3853A"/></radialGradient>
    <linearGradient id="gEnamel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9C3D3"/><stop offset=".22" stop-color="#F4F2F8"/><stop offset=".38" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#DCD6E4"/><stop offset="1" stop-color="#A9A1B7"/></linearGradient>
    <linearGradient id="gGraphite" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1E2234"/><stop offset=".3" stop-color="#3A4058"/><stop offset=".55" stop-color="#2E3449"/><stop offset="1" stop-color="#171A28"/></linearGradient>
    <linearGradient id="gConsole" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5170"/><stop offset="1" stop-color="#2A2F45"/></linearGradient>
    <linearGradient id="gCapM" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4E2C66"/><stop offset=".35" stop-color="#9C6DB8"/><stop offset=".6" stop-color="#7B4B94"/><stop offset="1" stop-color="#3E2552"/></linearGradient>
    <linearGradient id="gChrome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E8AA0"/><stop offset=".4" stop-color="#F1F0F6"/><stop offset="1" stop-color="#77738A"/></linearGradient>
    <radialGradient id="gHead" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#C39BE0"/><stop offset=".45" stop-color="#8A58A8"/><stop offset="1" stop-color="#432559"/></radialGradient>
    <linearGradient id="gEar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#6E4288"/><stop offset="1" stop-color="#A57CC4"/></linearGradient>
    <linearGradient id="gEarIn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E58FB8"/><stop offset="1" stop-color="#FBD0E3"/></linearGradient>
    <linearGradient id="gVisor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3B5E"/><stop offset="1" stop-color="#0E1322"/></linearGradient>
    <linearGradient id="gScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#FFE2BC"/></linearGradient>
    <linearGradient id="gWrap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#121829"/><stop offset=".4" stop-color="#26304E"/><stop offset="1" stop-color="#101525"/></linearGradient>
    <radialGradient id="gGlow"><stop offset="0" stop-color="#FFD58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
    <radialGradient id="gLamp"><stop offset="0" stop-color="#FFE7A8" stop-opacity=".95"/><stop offset="1" stop-color="#FFC66B" stop-opacity="0"/></radialGradient>
    <radialGradient id="gLed"><stop offset="0" stop-color="#C9A2FF" stop-opacity=".9"/><stop offset="1" stop-color="#9C6DF0" stop-opacity="0"/></radialGradient>
    <pattern id="pBrick" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="#B4664A"/><path d="M0 0.5H48M0 12.5H48M12 0V12M36 12V24" stroke="#9A5440" stroke-width="2"/><rect x="2" y="2" width="8" height="8" fill="#C27358" opacity=".5"/></pattern>
    <pattern id="pBrickD" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="#7E4A48"/><path d="M0 0.5H48M0 12.5H48M12 0V12M36 12V24" stroke="#673B3B" stroke-width="2"/></pattern>
    <filter id="fSh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1F2A44" flood-opacity=".18"/></filter>
    <filter id="fBlur4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="fGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
  `);
}

// ------------------------------------------------------------------ Jason
// Origin = between the feet on the ground; ~600 units tall; faces right.
const HIP_Y = -310, SH_Y = -470, THIGH = 150, UARM = 124, FARM = 128;
function legSVG(back) {
  const J = back ? 'url(#gJeansB)' : 'url(#gJeans)';
  const shin = g(`
    <path d="M-21 0 C -21 50, -18 100, -16 128 L 16 128 C 18 100, 21 50, 21 0 Z" fill="${J}"/>
    <path d="M6 10 C 8 50, 8 90, 6 120" stroke="#fff" stroke-opacity=".12" stroke-width="3" fill="none"/>
    <path d="M-17 112 L 17 112 L 17 130 L -17 130 Z" fill="${back ? '#1D2640' : '#2A3654'}"/>
    <g transform="translate(0 132)">
      <path d="M-22 -8 C -22 -18, -2 -20, 12 -12 C 32 -8, 54 -2, 58 12 L 58 18 L -24 18 Z" fill="${back ? '#D5D8E0' : 'url(#gShoe)'}"/>
      <path d="M10 -10 C 18 -6, 26 -2, 32 4" stroke="#B9BDC9" stroke-width="2.5" fill="none"/>
      <path d="M14 -9 l-3 7 M20 -6 l-3 7 M26 -3 l-3 7" stroke="#9AA0B0" stroke-width="2"/>
      <path d="M-24 12 L 58 12 L 58 20 Q 58 25 53 25 L -20 25 Q -26 25 -24 18 Z" fill="${back ? '#B9BDC9' : '#E9EBF0'}"/>
      <path d="M-24 18 L 58 18" stroke="${C.purple}" stroke-width="3"/>
    </g>`);
  const thigh = g(`
    <path d="M-26 0 C -28 50, -25 110, -21 152 L 21 152 C 24 110, 28 50, 26 0 Z" fill="${J}"/>
    <path d="M8 6 C 10 60, 10 110, 8 148" stroke="#fff" stroke-opacity=".1" stroke-width="3" fill="none"/>
    <path d="M-20 120 q 18 8 38 0" stroke="#000" stroke-opacity=".15" stroke-width="3" fill="none"/>`);
  const root = g(); root.append(thigh, shin);
  return { root, thigh, shin };
}
function armSVG(back) {
  const S = back ? 'url(#gSleeveB)' : 'url(#gSleeve)';
  const fore = g(`
    <path d="M-18 0 C -18 40, -16 76, -15 94 L 15 94 C 16 76, 18 40, 18 0 Z" fill="${S}"/>
    <path d="M-12 30 q 12 6 24 0 M-12 58 q 12 5 22 0" stroke="#000" stroke-opacity=".14" stroke-width="2.5" fill="none"/>
    <rect x="-16" y="88" width="32" height="18" rx="7" fill="${back ? '#22408F' : '#3051B8'}"/>
    <path d="M-12 92 v10 M-6 92 v10 M0 92 v10 M6 92 v10 M12 92 v10" stroke="#000" stroke-opacity=".15" stroke-width="1.5"/>
    <g transform="translate(0 108)">
      <path d="M-13 0 C -15 14, -12 30, 0 32 C 12 32, 15 16, 13 0 Z" fill="${back ? '#D8A07C' : 'url(#gSkinL)'}"/>
      <path d="M9 4 C 19 8, 19 18, 12 23" stroke="${back ? '#C58C6A' : '#D9A07A'}" stroke-width="7" fill="none" stroke-linecap="round"/>
    </g>`);
  const phone = g(`<rect x="-14" y="-30" width="30" height="56" rx="7" fill="#1C2133"/><rect x="-10" y="-25" width="22" height="44" rx="4" fill="#9C6DB8"/><rect x="-10" y="-25" width="8" height="44" rx="3" fill="#fff" opacity=".25"/>`, { opacity: 0, transform: 'translate(4 124)' });
  fore.appendChild(phone);
  const upper = g(`
    <path d="M-22 -10 C -25 40, -23 90, -19 128 L 19 128 C 23 90, 25 40, 22 -10 Q 0 -22 -22 -10 Z" fill="${S}"/>
    <path d="M-14 60 q 14 7 28 0" stroke="#000" stroke-opacity=".14" stroke-width="2.5" fill="none"/>
    <path d="M10 -6 C 14 30, 14 80, 12 120" stroke="#fff" stroke-opacity=".14" stroke-width="4" fill="none"/>`);
  const root = g(); root.append(upper, fore);
  return { root, upper, fore, phone };
}
export function jason() {
  const root = g(`${GREEN ? '' : '<ellipse cx="8" cy="2" rx="86" ry="13" fill="#141826" opacity=".28" filter="url(#fBlur4)"/>'}`);
  const LB = legSVG(true), LF = legSVG(false), AB = armSVG(true), AF = armSVG(false);
  const torso = g(`
    <path d="M-44 -490 C -54 -520, 34 -528, 44 -492 C 22 -502, -20 -502, -44 -490 Z" fill="#2E4FB0"/>
    <path d="M-52 -492 C -72 -482, -76 -440, -74 -400 C -72 -360, -68 -320, -64 -296 L 68 -296 C 72 -330, 74 -380, 72 -420 C 70 -460, 64 -484, 50 -492 Q 0 -502 -52 -492 Z" fill="url(#gHood)"/>
    <path d="M-52 -492 C -72 -482, -76 -440, -74 -400 C -72 -360, -68 -320, -64 -296 L -36 -296 C -46 -340, -50 -420, -40 -488 Z" fill="#1F3A8F" opacity=".35"/>
    <path d="M30 -470 C 50 -440, 58 -380, 56 -320" stroke="#fff" stroke-opacity=".16" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-40 -362 L 42 -362 L 48 -322 L -46 -322 Z" fill="#3A60CF"/>
    <path d="M-40 -362 L 42 -362" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
    <path d="M-30 -420 q 20 10 40 4 M-48 -380 q 10 20 6 40 M30 -400 q 10 10 24 8" stroke="#1F3A8F" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="-66" y="-314" width="134" height="20" rx="8" fill="#2E4FB0"/>
    <path d="M-60 -309 h122 M-60 -302 h122" stroke="#000" stroke-opacity=".12" stroke-width="1.5"/>
    <path d="M-8 -488 C -10 -470, -12 -456, -12 -440 M16 -488 C 18 -470, 20 -456, 20 -436" stroke="#F2F2F6" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="-15" y="-442" width="6" height="12" rx="2" fill="#C9CCD6"/><rect x="17" y="-438" width="6" height="12" rx="2" fill="#C9CCD6"/>`);
  const eyes = g(`
    <path d="M20 -54 q10 -9 20 0 q-10 8 -20 0z" fill="#fff"/><circle cx="31" cy="-53" r="5.6" fill="#3B2618"/><circle cx="31.5" cy="-53" r="2.6" fill="#120B07"/><circle cx="33" cy="-55" r="1.7" fill="#fff"/>
    <path d="M-6 -53 q8 -8 16 0 q-8 7 -16 0z" fill="#fff"/><circle cx="3" cy="-52.5" r="4.8" fill="#3B2618"/><circle cx="3.4" cy="-52.5" r="2.2" fill="#120B07"/><circle cx="4.6" cy="-54.2" r="1.4" fill="#fff"/>
    <path d="M19 -55 q11 -11 22 0" stroke="#2A1C14" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M-7 -54 q9 -10 18 0" stroke="#2A1C14" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
  const brows = g(`<path d="M18 -68 q12 -7 26 -1" stroke="#1E1A22" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-8 -67 q9 -6 19 -1" stroke="#1E1A22" stroke-width="4.5" fill="none" stroke-linecap="round"/>`);
  const mouth = svgEl('path', { d: '', stroke: '#8A4636', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' });
  const head = g(`
    <path d="M-16 -14 L 18 -14 L 16 14 L -14 14 Z" fill="#D9A07A"/>
    <path d="M-16 -2 Q 2 10 18 -4 L 18 6 Q 2 16 -16 8 Z" fill="#B97F5D" opacity=".6"/>
    <path d="M-40 -60 C -42 -95, -10 -110, 18 -104 C 44 -98, 52 -72, 50 -48 C 50 -38, 54 -32, 57 -25 C 58 -20, 53 -18, 50 -17 C 50 -6, 46 4, 36 10 C 26 16, 8 18, -6 14 C -26 8, -40 -14, -40 -40 Z" fill="url(#gSkin)"/>
    <path d="M-40 -40 C -40 -14, -26 8, -6 14 C -20 4, -30 -14, -32 -40 Z" fill="#C88A64" opacity=".35"/>
    <ellipse cx="-30" cy="-44" rx="9" ry="14" fill="#E3AC86"/><path d="M-32 -50 q5 6 0 12" stroke="#C48460" stroke-width="2.5" fill="none"/>
    <path d="M50 -38 C 54 -32, 57 -25, 50 -20" stroke="#C88A64" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="38" cy="-26" rx="9" ry="5" fill="#F0907C" opacity=".35"/>
    <path d="M-46 -50 C -54 -96, -16 -124, 22 -118 C 52 -112, 66 -86, 58 -60 C 52 -72, 40 -82, 28 -84 C 32 -76, 26 -68, 16 -64 C 18 -74, 8 -82, -4 -82 C -14 -74, -24 -64, -28 -48 C -32 -40, -38 -34, -46 -50 Z" fill="url(#gHair)"/>
    <path d="M-30 -96 C -14 -110, 14 -112, 34 -100" stroke="#6A6274" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M-20 -86 C -6 -96, 12 -98, 26 -92" stroke="#5A5264" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M-34 -52 C -36 -40, -36 -34, -34 -28" stroke="#1C1820" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  head.append(eyes, brows, mouth);
  const headG = g(); headG.appendChild(head);
  const body = g();
  body.append(AB.root, LB.root, LF.root, torso, headG, AF.root);
  root.appendChild(body);
  root.parts = { body, LB, LF, AB, AF, torso, headG, eyes, brows, mouth };
  return root;
}
// pose: {walk: phase|null, armF, elbowF, armB, elbowB (deg), look, mouth, talk, blink, phone}
// returns hand grip points (front F, back B) in Jason-local coordinates
export function poseJason(j, p = {}) {
  const P = j.parts, w = p.walk;
  let tF = 0, tB = 0, kF = 4, kB = 4, aF = 6, aB = -6, eF = 14, eB = 10, bob = 0, lean = 0;
  if (w != null) {
    const ph = w * Math.PI * 2, s = Math.sin(ph);
    tF = 24 * s; tB = -24 * s;
    kF = 6 + 34 * Math.max(0, Math.sin(ph - 1.4)); kB = 6 + 34 * Math.max(0, Math.sin(ph + Math.PI - 1.4));
    aF = -20 * s; aB = 20 * s; eF = 18 + 8 * Math.max(0, -s); eB = 18 + 8 * Math.max(0, s);
    bob = -Math.abs(Math.cos(ph)) * 8; lean = 2;
  }
  if (p.armF != null) aF = p.armF; if (p.elbowF != null) eF = p.elbowF;
  if (p.armB != null) aB = p.armB; if (p.elbowB != null) eB = p.elbowB;
  tf(P.body, `translate(0 ${bob}) rotate(${lean} 0 ${HIP_Y})`);
  const leg = (L, x, t, k) => { tf(L.root, `translate(${x} ${HIP_Y})`); tf(L.thigh, `rotate(${-t})`); tf(L.shin, `rotate(${-t}) translate(0 ${THIGH}) rotate(${k})`); };
  leg(P.LF, 8, tF, kF); leg(P.LB, -10, tB, kB);
  const arm = (A, x, a, e) => { tf(A.root, `translate(${x} ${SH_Y})`); tf(A.upper, `rotate(${-a})`); tf(A.fore, `rotate(${-a}) translate(0 ${UARM}) rotate(${-e})`); };
  arm(P.AF, 46, aF, eF); arm(P.AB, -48, aB, eB);
  tf(P.headG, `translate(6 -500) rotate(${p.look || 0})`);
  tf(P.eyes, `translate(0 ${-52 * (p.blink || 0)}) scale(1 ${1 - 0.9 * (p.blink || 0)})`);
  const m = p.mouth || 'neutral', k = p.talk || 0;
  const d = m === 'smile' ? 'M20 -8 q12 10 24 -1' : m === 'worried' ? 'M22 -3 q10 -6 20 0'
    : m === 'talk' ? `M20 -7 q12 ${4 + 14 * k} 24 -1 q-12 -3 -24 1z` : 'M22 -6 q10 4 20 -1';
  if (P.mouth.getAttribute('d') !== d) P.mouth.setAttribute('d', d);
  P.mouth.setAttribute('fill', m === 'talk' ? '#7A3B2E' : 'none');
  tf(P.brows, m === 'worried' ? 'translate(0 -3) rotate(-7 18 -68)' : '');
  P.AF.phone.setAttribute('opacity', p.phone || 0);
  const hand = (x, a, e) => { const u = rot(UARM, -a), f = rot(FARM, -a - e); return { x: x + u.x + f.x, y: SH_Y + bob + u.y + f.y }; };
  return { F: hand(46, aF, eF), B: hand(-48, aB, eB) };
}

// ------------------------------------------------------------------ dog (corgi, faces right; origin = ground)
export function dog() {
  const root = g(`${GREEN ? '' : '<ellipse cx="0" cy="2" rx="86" ry="10" fill="#141826" opacity=".25" filter="url(#fBlur4)"/>'}`);
  const leg = (far) => g(`<path d="M-10 0 C -11 18, -10 32, -9 40 L 9 40 C 10 32, 11 18, 10 0 Z" fill="${far ? '#B86E2C' : 'url(#gFur)'}"/>
    <path d="M-11 34 C -12 44, 14 46, 14 38 L 10 32 L -9 32 Z" fill="${far ? '#E6E1DA' : '#fff'}"/>`);
  const legs = [leg(1), leg(0), leg(1), leg(0)];
  const tail = g(`<path d="M0 0 C -20 -10, -36 -6, -40 6 C -30 12, -14 10, 0 6 Z" fill="url(#gFur)"/><path d="M-30 2 C -36 4, -38 6, -40 6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  const head = g(`
    <path d="M-10 -26 L -4 -76 L 22 -38 Z" fill="url(#gFur)"/><path d="M-4 -34 L 0 -64 L 15 -40 Z" fill="#F7C2A4"/>
    <path d="M20 -34 L 40 -80 L 54 -34 Z" fill="url(#gFurH)"/><path d="M27 -38 L 40 -68 L 48 -38 Z" fill="#F7C2A4"/>
    <path d="M-18 -4 C -20 -30, 6 -42, 30 -38 C 52 -34, 62 -18, 62 -4 C 62 14, 44 26, 22 26 C 0 26, -16 14, -18 -4 Z" fill="url(#gFurH)"/>
    <path d="M24 -32 C 30 -20, 30 -6, 34 2 C 46 -4, 60 0, 78 6 C 80 18, 64 28, 40 28 C 24 28, 18 18, 22 6 C 18 -6, 18 -22, 24 -32 Z" fill="#fff"/>
    <ellipse cx="76" cy="6" rx="9" ry="7" fill="#1B1820"/><ellipse cx="74" cy="3" rx="3" ry="2" fill="#fff" opacity=".6"/>
    <path d="M60 18 q8 6 16 -1" stroke="#1B1820" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64 20 q4 12 10 0z" fill="#E86A7E"/>
    <ellipse cx="38" cy="-10" rx="6" ry="7" fill="#1B1820"/><circle cx="40" cy="-12" r="2.2" fill="#fff"/>
    <path d="M30 -20 q8 -4 14 0" stroke="#A9662A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  const body = g(`
    <path d="M-80 -4 C -80 -34, -40 -42, 0 -40 C 40 -40, 76 -34, 80 -6 C 82 20, 50 34, 0 34 C -50 34, -80 22, -80 -4 Z" fill="url(#gFur)"/>
    <path d="M-60 16 C -30 34, 30 36, 64 14 C 54 30, 30 36, 0 36 C -30 36, -52 30, -60 16 Z" fill="#fff"/>
    <path d="M40 -38 C 62 -32, 80 -18, 80 0 C 72 -10, 60 -20, 40 -24 Z" fill="#fff"/>
    <path d="M-60 -30 C -20 -40, 30 -40, 60 -30" stroke="#FFD29A" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>
    <path d="M44 -34 C 50 -20, 52 -6, 50 6" stroke="${C.purple}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="52" cy="10" r="6" fill="#F2C14E"/><circle cx="50" cy="8" r="2" fill="#fff" opacity=".6"/>`);
  const bodyG = g();
  bodyG.append(legs[0], legs[2], tail, body, legs[1], legs[3], head);
  root.appendChild(bodyG);
  root.parts = { bodyG, legs, tail, head };
  return root;
}
export function poseDog(d, p = {}) {
  const P = d.parts, w = p.walk;
  const bob = w != null ? -Math.abs(Math.sin(w * Math.PI * 2)) * 5 : Math.sin((p.t || 0) * 2.5) * 1.2;
  tf(P.bodyG, `translate(0 ${-76 + bob})`);
  const offs = [-52, -34, 36, 54];
  P.legs.forEach((l, i) => tf(l, `translate(${offs[i]} 30) rotate(${w != null ? 26 * Math.sin(w * Math.PI * 2 + ([0, 1, 1, 0][i] ? Math.PI : 0)) : 0})`));
  tf(P.tail, `translate(-76 -14) rotate(${-10 + 22 * Math.sin((p.t || 0) * 14)})`);
  tf(P.head, `translate(58 -40) rotate(${p.look || 0})`);
}
export const DOG_COLLAR = { x: 50, y: -110 };

// ------------------------------------------------------------------ HearHere post + mascot "Spud"
// Origin = ground at the post centre.  Pillar (enamel, wrap-around notices
// display) -> trapezoid console holding the touchscreen and the NFC pad ->
// chrome neck -> Spud's head.  ~560 units tall; scenes place it at 0.85.
export const POST = { screen: { x: -64, y: -386, w: 128, h: 64 }, nfc: { x: 0, y: -295 }, head: { x: 0, y: -470 } };
export function post() {
  const root = g();
  const glow = svgEl('ellipse', { cx: 0, cy: -300, rx: 280, ry: 320, fill: 'url(#gGlow)', opacity: 0 });
  const shadow = g(`${GREEN ? '' : '<ellipse cx="14" cy="4" rx="150" ry="20" fill="#141826" opacity=".32" filter="url(#fBlur4)"/>'}`);
  const body = g(`
    <path d="M-124 -20 v14 a124 22 0 0 0 248 0 v-14z" fill="url(#gGraphite)"/>
    <ellipse cx="0" cy="-20" rx="124" ry="22" fill="#3A4058"/>
    <path d="M-104 -250 v226 a104 20 0 0 0 208 0 v-226z" fill="url(#gEnamel)"/>
    <path d="M-104 -52 v10 a104 20 0 0 0 208 0 v-10 a104 20 0 0 1 -208 0z" fill="#B48CFF"/>
    <ellipse cx="0" cy="-36" rx="150" ry="34" fill="url(#gLed)" opacity=".6"/>
    <path d="M-98 -236 h196 v150 a98 18 0 0 1 -196 0z" fill="url(#gWrap)"/>
    <path d="M-110 -262 v12 a110 20 0 0 0 220 0 v-12z" fill="url(#gCapM)"/>
    <ellipse cx="0" cy="-262" rx="110" ry="20" fill="#A57CC4"/>
    <path d="M-92 -264 L 92 -264 L 74 -398 L -74 -398 Z" fill="url(#gConsole)"/>
    <path d="M-92 -264 L -74 -398 L -62 -398 L -78 -264 Z" fill="#1A1E2E" opacity=".55"/>
    <path d="M92 -264 L 74 -398 L 66 -398 L 82 -264 Z" fill="#fff" opacity=".08"/>
    <path d="M-74 -398 L 74 -398 L 68 -406 L -68 -406 Z" fill="#6B7392"/>
    <path d="M-74 -398 L 74 -398" stroke="#9AA2C4" stroke-width="2"/>
    <rect x="-70" y="-392" width="140" height="76" rx="10" fill="#0E1220"/>
    <rect x="-36" y="-310" width="72" height="30" rx="9" fill="${C.orange}"/>
    <rect x="-36" y="-310" width="72" height="12" rx="6" fill="#fff" opacity=".2"/>
    <path d="M-10 -301 q7 7 0 14 M-2 -305 q11 11 0 22 M6 -309 q15 15 0 30" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <rect x="-18" y="-436" width="36" height="34" rx="6" fill="url(#gChrome)"/>
    <ellipse cx="0" cy="-404" rx="26" ry="6" fill="#55516A"/>`);
  const scrClip = svgEl('clipPath', { id: 'clipScr' }, `<rect x="${POST.screen.x}" y="${POST.screen.y}" width="${POST.screen.w}" height="${POST.screen.h}" rx="7"/>`);
  const screen = g('', { 'clip-path': 'url(#clipScr)' });
  const S = POST.screen, sx = S.x + 6, sy = S.y;
  screen.appendChild(svgEl('rect', { x: S.x, y: S.y, width: S.w, height: S.h, fill: 'url(#gScreen)' }));
  const scrIdle = g(`<text x="0" y="${sy + 30}" font-family="'Baloo 2', Nunito" font-weight="800" font-size="20" fill="${C.purple}" text-anchor="middle">HearHere</text>
    <text x="0" y="${sy + 48}" font-family="Nunito" font-weight="800" font-size="9.5" fill="${C.navy2}" text-anchor="middle">Tap to see issues near you</text>`);
  const scrList = g(`<text x="${sx}" y="${sy + 13}" font-family="'Baloo 2', Nunito" font-weight="800" font-size="11" fill="${C.purple}">HearHere</text>
    ${[0, 1, 2].map(i => `<rect x="${sx}" y="${sy + 18 + i * 14}" width="${S.w - 12}" height="11" rx="3" fill="#fff"/>
      <circle cx="${sx + 7}" cy="${sy + 23.5 + i * 14}" r="3.5" fill="${[C.green, C.orange, C.purple][i]}"/>
      <rect x="${sx + 15}" y="${sy + 22 + i * 14}" width="${[74, 60, 52][i]}" height="3.5" rx="1.7" fill="#9AA0B4"/>`).join('')}`);
  const scrOk = g(`<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" fill="#DDF1F5"/>
    <circle cx="${S.x + 20}" cy="${sy + 32}" r="12" fill="#1E9BB0"/><path d="M${S.x + 15} ${sy + 32} l4 4 l8 -9" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${S.x + 38}" y="${sy + 30}" font-family="Nunito" font-weight="900" font-size="11" fill="${C.navy}">Nothing stored</text>
    <text x="${S.x + 38}" y="${sy + 43}" font-family="Nunito" font-weight="800" font-size="9" fill="${C.greenD}">session cleared</text>`, { opacity: 0 });
  screen.append(scrIdle, scrList, scrOk);
  screen.appendChild(svgEl('path', { d: `M${S.x} ${S.y} L${S.x + 50} ${S.y} L${S.x + 20} ${S.y + S.h} L${S.x} ${S.y + S.h}z`, fill: '#fff', opacity: .1 }));
  const wrapClip = svgEl('clipPath', { id: 'clipWrap' }, `<path d="M-98 -236 h196 v150 a98 18 0 0 1 -196 0z"/>`);
  const wrap = g('', { 'clip-path': 'url(#clipWrap)' });
  const poster = (x, bg, k, kc, title, art, foot) => `<g><rect x="${x}" y="-226" width="90" height="128" rx="8" fill="${bg}"/>
    <text x="${x + 45}" y="-206" font-family="Nunito" font-weight="900" font-size="10" fill="${kc}" text-anchor="middle" letter-spacing="1">${k}</text>
    <text x="${x + 45}" y="-188" font-family="'Baloo 2', Nunito" font-weight="800" font-size="14" fill="${C.navy}" text-anchor="middle">${title}</text>${art}
    <text x="${x + 45}" y="-108" font-family="Nunito" font-weight="800" font-size="9" fill="${C.navy2}" text-anchor="middle">${foot}</text></g>`;
  const set = (o) => poster(o - 148, '#FFE6CC', 'LIBRARY', C.orangeD, 'Book club', `<rect x="${o - 130}" y="-176" width="54" height="40" rx="6" fill="#FFC27A"/><rect x="${o - 122}" y="-168" width="10" height="26" fill="#C96A10"/><rect x="${o - 108}" y="-170" width="10" height="28" fill="${C.purple}"/>`, 'Saturday 2 pm')
    + poster(o - 45, '#fff', 'COUNCIL', C.purple, 'Have your say', `<path d="M${o - 20} -132 q20 -34 40 0z" fill="${C.green}"/><rect x="${o - 2}" y="-134" width="4" height="18" fill="#8A5A3B"/>`, 'Park rules · 5 days')
    + poster(o + 58, '#DDF1F5', 'COMMUNITY', C.greenD, 'Street fest', `<circle cx="${o + 92}" cy="-152" r="14" fill="#FFB0C8"/><circle cx="${o + 116}" cy="-146" r="10" fill="#FFD36E"/><circle cx="${o + 104}" cy="-132" r="8" fill="#9FD3F2"/>`, 'Sunday · free');
  const posters = g(set(0) + set(309));
  wrap.appendChild(posters);
  const wrapRefl = svgEl('path', { d: 'M-70 -236 L -40 -236 L -78 -80 L -98 -84 L -98 -150z', fill: '#fff', opacity: .12 });
  const pillarShine = svgEl('path', { d: 'M-76 -246 v200', stroke: '#fff', 'stroke-width': 12, opacity: .45, 'stroke-linecap': 'round', filter: 'url(#fSoft)' });

  const ears = g(`
    <path d="M-60 -42 L -74 -122 L -14 -80 Z" fill="url(#gEar)"/><path d="M-55 -54 L -64 -104 L -28 -78 Z" fill="url(#gEarIn)"/>
    <path d="M60 -42 L 74 -122 L 14 -80 Z" fill="url(#gEar)"/><path d="M55 -54 L 64 -104 L 28 -78 Z" fill="url(#gEarIn)"/>
    <path d="M-72 -116 L -66 -80" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>`);
  const shell = g(`<circle cx="0" cy="0" r="84" fill="url(#gHead)"/>
    <ellipse cx="-30" cy="-46" rx="34" ry="20" fill="#fff" opacity=".28" transform="rotate(-25 -30 -46)" filter="url(#fSoft)"/>
    <path d="M64 -40 A 84 84 0 0 1 60 58" stroke="#E7CCFF" stroke-width="4" fill="none" opacity=".5"/>
    <circle cx="0" cy="-62" r="4" fill="#2E1A3D"/>`);
  const visor = g(`<rect x="-62" y="-34" width="124" height="70" rx="32" fill="url(#gVisor)"/>
    <rect x="-62" y="-34" width="124" height="70" rx="32" fill="none" stroke="#5A3D74" stroke-width="3"/>
    <path d="M-48 -26 L 10 -26 L -20 28 L -50 20 Z" fill="#fff" opacity=".07"/>`);
  const eyeL = g(`<ellipse cx="0" cy="0" rx="9" ry="13" fill="#8FF0FF" filter="url(#fGlow)"/>`);
  const eyeR = g(`<ellipse cx="0" cy="0" rx="9" ry="13" fill="#8FF0FF" filter="url(#fGlow)"/>`);
  const happyL = svgEl('path', { d: 'M-11 4 q11 -16 22 0', stroke: '#8FF0FF', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', opacity: 0, filter: 'url(#fGlow)' });
  const happyR = happyL.cloneNode();
  const grille = g(`<circle cx="0" cy="0" r="20" fill="#2E1A3D"/><circle cx="0" cy="0" r="20" fill="none" stroke="#C9B3DD" stroke-width="2.5"/>${[-10, -3, 4, 11].map(x => `<rect x="${x - 1.5}" y="-12" width="3" height="24" rx="1.5" fill="#B79CCB"/>`).join('')}`);
  const cheek = g(`<ellipse cx="-46" cy="46" rx="11" ry="6" fill="#F4B6D2" opacity=".7"/><ellipse cx="46" cy="46" rx="11" ry="6" fill="#F4B6D2" opacity=".7"/>`);
  // LED mouth in the visor, only lit while Spud speaks
  const mouth = svgEl('path', { d: 'M-12 20 q12 4 24 0', stroke: '#8FF0FF', 'stroke-width': 4, fill: '#8FF0FF', 'fill-opacity': .35, 'stroke-linecap': 'round', opacity: 0, filter: 'url(#fGlow)' });
  const eyesG = g(); eyesG.append(eyeL, eyeR, happyL, happyR, mouth);
  const headG = g(); headG.append(ears, shell, cheek, visor, eyesG);
  const grilleG = g(); grilleG.appendChild(grille); headG.appendChild(grilleG);

  root.append(scrClip, wrapClip, glow, shadow, body, wrap, wrapRefl, pillarShine, screen, headG);
  root.parts = { glow, headG, eyeL, eyeR, happyL, happyR, mouth, grilleG, scrIdle, scrList, scrOk, posters };
  return root;
}
export function posePost(p, o = {}) {
  const P = p.parts;
  tf(P.headG, `translate(0 ${POST.head.y + (o.bob || 0)}) rotate(${o.tilt || 0}) scale(.84)`);
  const lx = o.look?.x || 0, ly = o.look?.y || 0;
  tf(P.eyeL, `translate(${-24 + lx} ${ly}) scale(1 ${1 - 0.92 * (o.blink || 0)})`);
  tf(P.eyeR, `translate(${24 + lx} ${ly}) scale(1 ${1 - 0.92 * (o.blink || 0)})`);
  const happy = o.mood === 'happy' ? 1 : 0;
  P.eyeL.setAttribute('opacity', 1 - happy); P.eyeR.setAttribute('opacity', 1 - happy);
  P.happyL.setAttribute('opacity', happy); P.happyR.setAttribute('opacity', happy);
  tf(P.happyL, `translate(${-24 + lx} ${ly})`); tf(P.happyR, `translate(${24 + lx} ${ly})`);
  const k = o.talk || 0;
  P.mouth.setAttribute('opacity', k > 0 ? 1 : 0);
  if (k > 0) P.mouth.setAttribute('d', `M${-12 + lx} 19 q12 ${3 + 12 * k} 24 0 q-12 ${-2 - 3 * k} -24 0z`);
  const ls = o.mood === 'listen' || k > 0 ? 1 + 0.1 * Math.sin((o.t || 0) * 18) : 1;
  tf(P.grilleG, `translate(72 30) scale(${0.8 * ls})`);
  P.glow.setAttribute('opacity', o.glow || 0);
  const s = o.screen || 'idle';
  P.scrIdle.setAttribute('opacity', s === 'idle' ? 1 : 0);
  P.scrList.setAttribute('opacity', s === 'list' ? 1 : 0);
  P.scrOk.setAttribute('opacity', s === 'ok' ? 1 : 0);
  tf(P.posters, `translate(${(o.posters || 0) % 309} 0)`);
}

// ------------------------------------------------------------------ environment pieces
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
export function skyline(w, seed, dusk) {
  const r = rng(seed); let x = 0, h = '';
  const col = dusk ? '#5E4170' : '#A9C6DA', win = dusk ? '#FFD58A' : '#C9DDEA';
  while (x < w) {
    const bw = 70 + r() * 130, bh = 160 + r() * 300;
    h += `<rect x="${x}" y="${-bh}" width="${bw}" height="${bh}" fill="${col}"/>`;
    for (let yy = -bh + 16; yy < -20; yy += 22) if (r() > 0.35) h += `<rect x="${x + 8}" y="${yy}" width="${bw - 16}" height="4" fill="${win}" opacity="${dusk ? 0.5 : 0.45}"/>`;
    if (r() > 0.8) h += `<rect x="${x + bw / 2 - 3}" y="${-bh - 50}" width="6" height="50" fill="${col}"/>`;
    x += bw + 8;
  }
  h += `<path d="M${w * 0.42} 0 v-560 l20 -26 l20 26 v560z" fill="${col}"/><rect x="${w * 0.42}" y="-560" width="40" height="70" fill="${dusk ? '#F2B45A' : '#D9C38A'}" opacity=".7"/>
    <path d="M${w * 0.62} 0 v-470 l70 -40 v510z" fill="${col}"/>`;
  return h;
}
const FACADES = [
  { wall: '#E9DCC4', trim: '#FFF7E8', acc: '#2E6B5A', name: 'CAFÉ' },
  { wall: 'url(#pBrick)', trim: '#F1E3CB', acc: '#7B4B94', name: 'BOOKS' },
  { wall: '#C9D6C3', trim: '#F4F1E6', acc: '#B5872A', name: 'BAKERY' },
  { wall: '#D8C2B2', trim: '#FBF2E6', acc: '#3A63D1', name: 'PHARMACY' },
  { wall: '#E5CFA8', trim: '#FFF5DF', acc: '#C0453A', name: 'NOODLES' },
  { wall: '#BFCAD6', trim: '#F2F4F7', acc: '#16707F', name: 'GROCER' },
];
// Victorian-era two-storey shopfronts, typical of Melbourne high streets
export function terraces(w, seed, dusk) {
  const r = rng(seed); let x = 0, h = '', i = Math.floor(r() * 6);
  while (x < w) {
    const F = FACADES[i++ % FACADES.length];
    const bw = 300 + Math.floor(r() * 90), bh = 430 + Math.floor(r() * 90);
    const wall = dusk && F.wall.startsWith('url') ? 'url(#pBrickD)' : F.wall;
    const nw = 3, ww = (bw - 80) / nw;
    const glass = dusk ? 'url(#gGlassN)' : 'url(#gGlass)';
    const ped = r() > 0.5;
    h += `<g transform="translate(${x} 0)">
      <rect x="0" y="${-bh}" width="${bw}" height="${bh}" fill="${wall}"/>
      ${dusk ? `<rect x="0" y="${-bh}" width="${bw}" height="${bh}" fill="#2B2350" opacity=".35"/>` : ''}
      <rect x="0" y="${-bh}" width="${bw}" height="${bh}" fill="url(#gTop)"/>
      <rect x="-6" y="${-bh - 26}" width="${bw + 12}" height="30" fill="${F.trim}"/>
      <rect x="-10" y="${-bh + 2}" width="${bw + 20}" height="10" fill="${F.trim}"/><rect x="-10" y="${-bh + 12}" width="${bw + 20}" height="4" fill="#000" opacity=".12"/>
      ${ped ? `<path d="M${bw / 2 - 60} ${-bh - 26} L ${bw / 2} ${-bh - 66} L ${bw / 2 + 60} ${-bh - 26}z" fill="${F.trim}"/><circle cx="${bw / 2}" cy="${-bh - 40}" r="8" fill="${F.acc}" opacity=".6"/>` : `<rect x="${bw / 2 - 50}" y="${-bh - 50}" width="100" height="26" rx="4" fill="${F.trim}"/>`}
      ${Array.from({ length: nw }, (_, k) => {
        const wx = 40 + k * ww + 12, wy = -bh + 48, wwd = ww - 24, wh = 120;
        return `<path d="M${wx - 6} ${wy + wh + 8} V ${wy + 20} A ${wwd / 2 + 6} ${wwd / 2 + 6} 0 0 1 ${wx + wwd + 6} ${wy + 20} V ${wy + wh + 8} Z" fill="${F.trim}"/>
        <path d="M${wx} ${wy + wh} V ${wy + 22} A ${wwd / 2} ${wwd / 2} 0 0 1 ${wx + wwd} ${wy + 22} V ${wy + wh} Z" fill="${glass}"/>
        <path d="M${wx + wwd / 2} ${wy + 2} V ${wy + wh} M${wx} ${wy + 66} H ${wx + wwd}" stroke="${F.trim}" stroke-width="4"/>
        <path d="M${wx + 6} ${wy + wh - 6} L ${wx + wwd * 0.55} ${wy + 30}" stroke="#fff" stroke-width="8" opacity="${dusk ? 0.1 : 0.3}"/>
        <rect x="${wx - 10}" y="${wy + wh + 6}" width="${wwd + 20}" height="8" fill="${F.trim}"/><rect x="${wx - 10}" y="${wy + wh + 14}" width="${wwd + 20}" height="3" fill="#000" opacity=".15"/>`;
      }).join('')}
      <rect x="14" y="-232" width="${bw - 28}" height="44" rx="4" fill="${F.acc}"/>
      <rect x="14" y="-232" width="${bw - 28}" height="10" rx="4" fill="#fff" opacity=".15"/>
      <text x="${bw / 2}" y="-201" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="#FFF7E8" text-anchor="middle" letter-spacing="4">${F.name}</text>
      <path d="M8 -186 H ${bw - 8} L ${bw - 22} -150 H 22 Z" fill="${F.acc}"/>
      ${Array.from({ length: Math.floor((bw - 44) / 30) }, (_, k) => `<rect x="${22 + k * 30}" y="-186" width="15" height="36" fill="#fff" opacity=".22"/><path d="M${22 + k * 30} -150 a15 10 0 0 0 30 0z" fill="${F.acc}"/>`).join('')}
      <rect x="20" y="-146" width="${bw - 40}" height="20" fill="#000" opacity=".18" filter="url(#fSoft)"/>
      <rect x="22" y="-142" width="${bw * 0.56}" height="142" fill="${glass}"/>
      <g opacity="${dusk ? 0.9 : 0.75}">
        <rect x="34" y="-60" width="${bw * 0.56 - 24}" height="8" fill="#6E5A4A"/>
        ${Array.from({ length: 5 }, (_, k) => `<rect x="${40 + k * (bw * 0.1)}" y="${-60 - 18 - (k % 3) * 8}" width="${bw * 0.07}" height="${18 + (k % 3) * 8}" rx="3" fill="${['#F28C28', '#1E9BB0', '#E0544B', '#7B4B94', '#F2C14E'][k]}"/>`).join('')}
        <rect x="34" y="-110" width="${bw * 0.56 - 24}" height="6" fill="#6E5A4A"/>
      </g>
      <path d="M30 -10 L ${30 + bw * 0.22} -142 L ${30 + bw * 0.3} -142 L ${30 + bw * 0.08} -10z" fill="#fff" opacity="${dusk ? 0.06 : 0.22}"/>
      <rect x="22" y="-142" width="${bw * 0.56}" height="142" fill="none" stroke="${F.trim}" stroke-width="6"/>
      <rect x="${bw * 0.66}" y="-142" width="${bw * 0.24}" height="142" fill="#4A3A30"/>
      <rect x="${bw * 0.69}" y="-130" width="${bw * 0.18}" height="70" fill="${glass}" opacity=".8"/>
      <circle cx="${bw * 0.86}" cy="-66" r="4" fill="#E2C27A"/>
      <rect x="${bw * 0.66}" y="-142" width="${bw * 0.24}" height="142" fill="none" stroke="${F.trim}" stroke-width="5"/>
      <rect x="0" y="-12" width="${bw}" height="12" fill="#000" opacity=".2"/>
      <rect x="0" y="${-bh}" width="4" height="${bh}" fill="#000" opacity=".12"/>
    </g>`;
    x += bw;
  }
  return h;
}
export function tree(x, s = 1, dusk = false) {
  const L = dusk ? 'url(#gLeafD)' : 'url(#gLeaf)', D = dusk ? '#2C4034' : '#3B7339';
  const cl = [[0, -330, 110], [-90, -280, 80], [90, -285, 86], [-50, -380, 70], [55, -385, 74], [-130, -220, 56], [130, -228, 60], [0, -250, 90]];
  return `<g transform="translate(${x} 0) scale(${s})">
    <ellipse cx="10" cy="4" rx="150" ry="16" fill="#141826" opacity=".18" filter="url(#fBlur4)"/>
    <path d="M-16 0 C -12 -80, -14 -160, -8 -230 L 10 -230 C 14 -160, 14 -80, 18 0 Z" fill="url(#gBark)"/>
    <path d="M-2 -150 C -30 -190, -60 -210, -80 -240 M4 -170 C 30 -200, 60 -220, 76 -250" stroke="#8B7A66" stroke-width="10" fill="none" stroke-linecap="round"/>
    <ellipse cx="-4" cy="-90" rx="6" ry="12" fill="#C9BBA4" opacity=".7"/><ellipse cx="8" cy="-150" rx="5" ry="9" fill="#5E503F" opacity=".6"/>
    ${cl.map(([cx, cy, rr]) => `<circle cx="${cx}" cy="${cy + 18}" r="${rr}" fill="${D}"/>`).join('')}
    ${cl.map(([cx, cy, rr]) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${L}"/>`).join('')}
    ${cl.slice(0, 5).map(([cx, cy, rr]) => `<circle cx="${cx - rr * 0.3}" cy="${cy - rr * 0.35}" r="${rr * 0.35}" fill="#fff" opacity="${dusk ? 0.05 : 0.12}"/>`).join('')}
  </g>`;
}
export function lamp(x, dusk = false) {
  return `<g transform="translate(${x} 0)">
    ${dusk ? '<circle cx="0" cy="-392" r="120" fill="url(#gLamp)"/>' : ''}
    <path d="M-16 0 L 16 0 L 10 -40 L -10 -40 Z" fill="#23463A"/><rect x="-5" y="-370" width="10" height="332" fill="#2C5446"/>
    <rect x="-2" y="-370" width="3" height="332" fill="#fff" opacity=".15"/>
    <path d="M-20 -372 L 20 -372 L 14 -416 L -14 -416 Z" fill="${dusk ? '#FFE3A3' : '#E9EEF0'}" opacity=".95"/>
    <path d="M-24 -416 L 24 -416 L 0 -440 Z" fill="#23463A"/><rect x="-22" y="-374" width="44" height="6" fill="#23463A"/></g>`;
}
export function bench(x) {
  return `<g transform="translate(${x} 0)"><rect x="-90" y="-62" width="180" height="12" rx="4" fill="#8A5A3B"/><rect x="-90" y="-96" width="180" height="10" rx="4" fill="#9C6A47"/><rect x="-90" y="-80" width="180" height="10" rx="4" fill="#9C6A47"/>
    <path d="M-80 0 V -100 M80 0 V -100" stroke="#2C3036" stroke-width="8"/><ellipse cx="0" cy="2" rx="100" ry="8" fill="#000" opacity=".15"/></g>`;
}
export function bin(x) {
  return `<g transform="translate(${x} 0)"><path d="M-26 0 L 26 0 L 30 -96 L -30 -96 Z" fill="#2C5446"/><rect x="-34" y="-104" width="68" height="12" rx="4" fill="#23463A"/>
    <rect x="-12" y="-78" width="24" height="30" rx="4" fill="#E9C46A"/><rect x="-26" y="-96" width="8" height="96" fill="#fff" opacity=".1"/></g>`;
}
export function fence(x0, x1, y = 0) {
  let h = `<rect x="${x0}" y="${y - 110}" width="${x1 - x0}" height="8" rx="3" fill="#24352C"/><rect x="${x0}" y="${y - 46}" width="${x1 - x0}" height="8" rx="3" fill="#24352C"/>`;
  for (let x = x0; x <= x1; x += 30) h += `<rect x="${x}" y="${y - 128}" width="7" height="128" rx="2" fill="#24352C"/><path d="M${x - 2} ${y - 128} l5.5 -12 l5.5 12z" fill="#24352C"/>`;
  return h;
}

// ------------------------------------------------------------------ the street (building line at bl; people stand ~bl+120)
let worldId = 0;
export function streetWorld(opt = {}) {
  const w = opt.width || 4200, bl = opt.bl ?? 760, dusk = !!opt.dusk;
  const id = ++worldId;
  const root = g();
  if (GREEN) {
    root.appendChild(svgEl('rect', { x: -4000, y: -4000, width: w + 8000, height: 9000, fill: GREEN }));
    const dof = svgEl('feGaussianBlur', { stdDeviation: 0 });
    root.parts = { farG: g(), clouds: g(), near: g(), bl, dof };
    return root;
  }
  root.appendChild(svgEl('rect', { x: -2400, y: -1600, width: w + 4800, height: 4200, fill: dusk ? 'url(#gDusk)' : 'url(#gSky)' }));
  const sun = g(dusk ? `<circle cx="1500" cy="${bl - 260}" r="300" fill="url(#gSun)" opacity=".8"/><circle cx="1500" cy="${bl - 260}" r="90" fill="#FFD27A"/>`
    : `<circle cx="1720" cy="120" r="380" fill="url(#gSun)"/>`);
  const clouds = g(Array.from({ length: 8 }, (_, k) => {
    const cx = k * 700 - 600, cy = 80 + (k % 3) * 70, s = 0.8 + (k % 2) * 0.5, col = dusk ? '#E7A6A0' : '#fff';
    return `<g transform="translate(${cx} ${cy}) scale(${s})" opacity="${dusk ? 0.35 : 0.85}" filter="url(#fSoft)"><ellipse cx="0" cy="0" rx="140" ry="34" fill="${col}"/><ellipse cx="-40" cy="-22" rx="70" ry="40" fill="${col}"/><ellipse cx="40" cy="-30" rx="80" ry="46" fill="${col}"/></g>`;
  }).join(''));
  const blur = svgEl('filter', { id: `fDof${id}`, x: '-10%', y: '-10%', width: '120%', height: '120%' }, `<feGaussianBlur stdDeviation="0"/>`);
  const blurFar = svgEl('filter', { id: `fFar${id}`, x: '-10%', y: '-10%', width: '120%', height: '120%' }, `<feGaussianBlur stdDeviation="1.3"/>`);
  const far = g(`<g transform="translate(-600 ${bl - 90})">${skyline(w + 1200, opt.seed || 3, dusk)}</g>
    <rect x="-1200" y="${bl - 700}" width="${w + 2400}" height="620" fill="${dusk ? 'url(#gHazeD)' : 'url(#gHaze)'}"/>`, { filter: `url(#fFar${id})` });
  const farG = g(); farG.appendChild(far);
  const mid = g(`<g transform="translate(0 ${bl})">${terraces(opt.shopsTo || w, opt.seed || 5, dusk)}</g>`);
  if (opt.park) {
    const [p0, p1] = opt.park;
    mid.insertAdjacentHTML('beforeend', `<rect x="${p0}" y="${bl - 520}" width="${p1 - p0}" height="520" fill="${dusk ? '#4E6A55' : '#9CCB8E'}"/>
      <rect x="${p0}" y="${bl - 60}" width="${p1 - p0}" height="60" fill="${dusk ? '#3E5A45' : '#86BB78'}"/>
      <g transform="translate(0 ${bl - 20})">${tree(p0 + 160, 1.15, dusk)}${tree(p0 + 560, 1.35, dusk)}${tree(p0 + 960, 1.1, dusk)}${tree(p0 + 1300, 1.3, dusk)}</g>`);
  }
  const midG = g('', { filter: `url(#fDof${id})` }); midG.append(farG, mid);
  const walk = dusk ? 'url(#gWalkD)' : 'url(#gWalk)';
  let tiles = '';
  for (const yy of [bl + 40, bl + 92, bl + 150]) tiles += `<rect x="-600" y="${yy}" width="${w + 1200}" height="2" fill="#000" opacity=".07"/>`;
  for (let x = -600; x < w + 600; x += 130) tiles += `<path d="M${x} ${bl} L ${x - 14} ${bl + 175}" stroke="#000" stroke-opacity=".06" stroke-width="2"/>`;
  const near = g(`
    <rect x="-600" y="${bl}" width="${w + 1200}" height="176" fill="${walk}"/>${tiles}
    <rect x="-600" y="${bl}" width="${w + 1200}" height="34" fill="#000" opacity=".12" filter="url(#fSoft)"/>
    <rect x="-600" y="${bl + 176}" width="${w + 1200}" height="18" fill="${dusk ? '#4A4252' : '#5C6370'}"/><rect x="-600" y="${bl + 176}" width="${w + 1200}" height="4" fill="#fff" opacity=".25"/>
    <rect x="-600" y="${bl + 194}" width="${w + 1200}" height="400" fill="${dusk ? 'url(#gRoadD)' : 'url(#gRoad)'}"/>
    ${[bl + 250, bl + 292, bl + 360, bl + 402].map(y => `<rect x="-600" y="${y}" width="${w + 1200}" height="5" fill="#A8ADB8" opacity=".55"/><rect x="-600" y="${y + 5}" width="${w + 1200}" height="2" fill="#2A2D34" opacity=".5"/>`).join('')}
    ${Array.from({ length: Math.ceil((w + 1200) / 260) }, (_, k) => `<rect x="${-600 + k * 260}" y="${bl + 214}" width="120" height="6" rx="3" fill="#fff" opacity=".55"/>`).join('')}`);
  const props = g(`<g transform="translate(0 ${bl + 6})">${(opt.lamps || []).map(x => lamp(x, dusk)).join('')}${(opt.trees || []).map(x => tree(x, 0.95, dusk)).join('')}${(opt.benches || []).map(x => bench(x)).join('')}${(opt.bins || []).map(x => bin(x)).join('')}</g>`);
  if (opt.park) props.insertAdjacentHTML('afterbegin', `<g>${fence(opt.park[0], opt.park[1], bl + 4)}</g>`);
  const wires = g(`<path d="M-600 ${bl - 470} Q ${w / 2} ${bl - 440} ${w + 600} ${bl - 470}" stroke="#2A2D34" stroke-width="2" fill="none" opacity=".55"/>
    <path d="M-600 ${bl - 452} Q ${w / 2} ${bl - 424} ${w + 600} ${bl - 452}" stroke="#2A2D34" stroke-width="2" fill="none" opacity=".45"/>`);
  root.append(blur, blurFar, sun, clouds, midG, wires, near, props);
  root.parts = { farG, clouds, near, bl, dof: blur.firstChild };
  return root;
}
// camera-dependent extras: parallax for the skyline, drifting clouds, depth of field
export function worldFx(world, c, t, dof = 0) {
  tf(world.parts.farG, `translate(${(c.x - 960) * 0.7} ${(c.y - 540) * 0.5})`);
  tf(world.parts.clouds, `translate(${(c.x - 960) * 0.85 + t * 10} ${(c.y - 540) * 0.6})`);
  const v = dof.toFixed(2);
  if (world.parts.dof.getAttribute('stdDeviation') !== v) world.parts.dof.setAttribute('stdDeviation', v);
}
