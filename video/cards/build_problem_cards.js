// Full-frame (1920x1080) problem cards for the "five problems" part of the video.
// Each card = a realistic illustrated scene on the right + the problem text on a dark
// gradient on the left.  Fonts (Nunito, Caveat) are embedded so the SVGs are self-contained.
// Build: cd video && node cards/build_problem_cards.js   -> output/problem_cards/*.svg
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../../output/problem_cards');
fs.mkdirSync(OUT, { recursive: true });
const FONTS = path.resolve(__dirname, '../node_modules/@fontsource');
const font = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, file)).toString('base64')}) format('woff2')}`;
const FONT_CSS = [
  font('Nunito', 'nunito/files/nunito-latin-600-normal.woff2', 600),
  font('Nunito', 'nunito/files/nunito-latin-700-normal.woff2', 700),
  font('Nunito', 'nunito/files/nunito-latin-800-normal.woff2', 800),
  font('Nunito', 'nunito/files/nunito-latin-900-normal.woff2', 900),
  font('Caveat', 'caveat/files/caveat-latin-600-normal.woff2', 600),
  font('Caveat', 'caveat/files/caveat-latin-700-normal.woff2', 700),
].join('');
const SANS = "Nunito, 'Segoe UI', Helvetica, Arial, sans-serif";
const HAND = "Caveat, 'Segoe Print', 'Bradley Hand', cursive";
const SERIF = "Georgia, 'Times New Roman', serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const r1 = (v) => Math.round(v * 10) / 10;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="${o.ff || SANS}" font-size="${o.size || 20}" font-weight="${o.w || 700}"${o.fill ? ` fill="${o.fill}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.italic ? ' font-style="italic"' : ''}${o.tr ? ` transform="${o.tr}"` : ''}>${esc(s)}</text>`;

// ---------- shared defs: shadows, grain, light ----------
const DEFS = `
<filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="b1"/><feOffset in="b1" dx="16" dy="26" result="o1"/>
  <feComponentTransfer in="o1" result="s1"><feFuncA type="linear" slope="0.42"/></feComponentTransfer>
  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b2"/><feOffset in="b2" dx="3" dy="4" result="o2"/>
  <feComponentTransfer in="o2" result="s2"><feFuncA type="linear" slope="0.38"/></feComponentTransfer>
  <feMerge><feMergeNode in="s1"/><feMergeNode in="s2"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="shadowLow" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b1"/><feOffset in="b1" dx="6" dy="10" result="o1"/>
  <feComponentTransfer in="o1" result="s1"><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b2"/><feOffset in="b2" dx="1.5" dy="2" result="o2"/>
  <feComponentTransfer in="o2" result="s2"><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
  <feMerge><feMergeNode in="s1"/><feMergeNode in="s2"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="paper" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0.09 0" result="g"/>
  <feComposite in="g" in2="SourceGraphic" operator="in" result="gi"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gi"/></feMerge>
</filter>
<filter id="grain" x="0" y="0" width="1920" height="1080" filterUnits="userSpaceOnUse">
  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="11"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.07 0"/>
</filter>
<filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur18" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="26" result="b"/><feFlood flood-color="#FFD58A" flood-opacity="0.75"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<radialGradient id="vignette" cx="62%" cy="45%" r="75%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
<radialGradient id="warmLight" cx="85%" cy="0%" r="80%"><stop offset="0" stop-color="#FFE7BF" stop-opacity="0.32"/><stop offset="1" stop-color="#FFE7BF" stop-opacity="0"/></radialGradient>
<linearGradient id="textShade" x1="0" x2="1" y1="0" y2="0">
  <stop offset="0" stop-color="#140D08" stop-opacity="0.96"/><stop offset="0.33" stop-color="#140D08" stop-opacity="0.9"/>
  <stop offset="0.47" stop-color="#140D08" stop-opacity="0.55"/><stop offset="0.6" stop-color="#140D08" stop-opacity="0"/>
</linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.45" stop-color="#fff" stop-opacity="0.04"/><stop offset="0.46" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="phoneBody" x1="0" x2="1"><stop offset="0" stop-color="#2A2D33"/><stop offset="0.06" stop-color="#0E0F12"/><stop offset="0.94" stop-color="#0E0F12"/><stop offset="1" stop-color="#34373E"/></linearGradient>`;

// ---------- reusable objects ----------
let uid = 0;
// phone at (x,y) size w*h, rotated rot deg about its centre; content drawn in screen coords (0..sw, 0..sh)
function phone(x, y, w, h, rot, content, bg = '#FFFFFF') {
  const id = 'scr' + (++uid), b = 14, sw = w - 2 * b, sh = h - 2 * b;
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})" filter="url(#shadow)">
  <rect width="${w}" height="${h}" rx="${w * 0.15}" fill="url(#phoneBody)"/>
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${w * 0.15 - 1.5}" fill="none" stroke="#5A5E66" stroke-width="2" opacity="0.8"/>
  <rect x="${w - 1}" y="${h * 0.22}" width="4" height="${h * 0.12}" rx="2" fill="#2B2E35"/>
  <clipPath id="${id}"><rect x="${b}" y="${b}" width="${sw}" height="${sh}" rx="${w * 0.15 - b}"/></clipPath>
  <g clip-path="url(#${id})"><rect x="${b}" y="${b}" width="${sw}" height="${sh}" fill="${bg}"/><g transform="translate(${b} ${b})">${content(sw, sh)}</g>
    <rect x="${sw / 2 + b - 46}" y="${b + 12}" width="92" height="26" rx="13" fill="#050506"/>
    <rect x="${b}" y="${b}" width="${sw}" height="${sh}" fill="url(#glass)"/></g>
</g>`;
}
// a sheet of paper with grain; inner drawn in paper coords
const sheet = (w, h, fill, inner, curl = true) => `<rect width="${w}" height="${h}" fill="${fill}" filter="url(#paper)"/>${curl ? `<rect width="${w}" height="${h}" fill="url(#paperShade)"/>` : ''}${inner}`;
const pin = (x, y, c) => `<g transform="translate(${x} ${y})"><ellipse cx="7" cy="12" rx="13" ry="7" fill="#000" opacity="0.28" filter="url(#blur6)"/><circle r="15" fill="${c}"/><circle r="15" fill="url(#pinShade)"/><ellipse cx="-5" cy="-6" rx="5" ry="3.5" fill="#fff" opacity="0.7"/></g>`;
// lines of text with [[highlighted phrases]]: a highlighter layer underneath (same text flow, only the phrases painted)
function marked(lines, x, y, lh, o) {
  const tsp = (ln, hl) => ln.split(/(\[\[.*?\]\])/).filter(Boolean).map((p) => {
    const on = p.startsWith('[[');
    const t = esc(on ? p.slice(2, -2) : p);
    if (!hl) return `<tspan>${t}</tspan>`;
    return on ? `<tspan fill="#FFE34D" stroke="#FFE34D" stroke-width="15" stroke-linejoin="round">${t}</tspan>` : `<tspan fill="none">${t}</tspan>`;
  }).join('');
  const attrs = `font-family="${o.ff}" font-size="${o.size}" font-weight="${o.w || 400}" xml:space="preserve"`;
  return lines.map((ln, i) => `<text x="${x}" y="${y + i * lh}" ${attrs} opacity="0.62">${tsp(ln, true)}</text><text x="${x}" y="${y + i * lh}" ${attrs} fill="${o.fill}">${tsp(ln, false)}</text>`).join('');
}
// hand-drawn red question mark
const qmark = (x, y, s = 1, c = '#D0312D') => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"><path d="M-9 -12 C-9 -26 12 -27 12 -13 C12 -4 1 -2 1 8"/><circle cx="1" cy="19" r="1.2" fill="${c}"/></g>`;

const EXTRA_DEFS = `
<linearGradient id="paperShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.25"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#6B5A45" stop-opacity="0.16"/></linearGradient>
<radialGradient id="pinShade" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>`;

// ---------- frame: scene + text panel ----------
function frame(c) {
  uid = 0;
  const x0 = 120;
  let y = 560;
  const title = c.title.map((l, i) => T(x0, y + i * 80, l, { size: 70, w: 900, fill: '#FFF7EE' })).join('');
  y += (c.title.length - 1) * 80 + 54;
  const div = `<rect x="${x0}" y="${y}" width="96" height="7" rx="3.5" fill="${c.accent}"/>`;
  y += 72;
  const desc = c.desc.map((l, i) => T(x0, y + i * 48, l, { size: 33, w: 700, fill: '#FFF7EE', op: 0.84 })).join('');
  const prog = [1, 2, 3, 4, 5].map((i) => `<rect x="${x0 + (i - 1) * 76}" y="160" width="64" height="7" rx="3.5" fill="${i === c.n ? c.accent : '#FFF7EE'}" opacity="${i === c.n ? 1 : i < c.n ? 0.55 : 0.2}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Problem ${c.n}: ${esc(c.title.join(' '))}</title>
<defs><style>${FONT_CSS}</style>${DEFS}${EXTRA_DEFS}${c.defs || ''}</defs>
<g id="scene">${c.scene}</g>
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" fill="url(#vignette)"/>
<rect width="1920" height="1080" fill="url(#textShade)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
<g id="text">
  ${T(x0, 132, 'FIVE PROBLEMS FROM OUR FIELDWORK', { size: 22, w: 800, fill: '#FFF7EE', op: 0.72, ls: 4 })}
  ${prog}
  ${T(x0 - 8, 410, String(c.n).padStart(2, '0'), { size: 230, w: 900, fill: c.accent })}
  ${T(x0, 468, c.theme.toUpperCase(), { size: 30, w: 900, fill: c.accent, ls: 7 })}
  ${title}${div}${desc}
  ${T(x0, 1012, 'Team Sweet Potatoes · Group 14 · INFO90006 Fieldwork for Design', { size: 20, w: 800, fill: '#FFF7EE', op: 0.5 })}
  <g transform="translate(1880 1012)"><text x="0" y="0" text-anchor="end" font-family="${SANS}" font-size="18" font-weight="800" fill="#FFF7EE" opacity="0.7" stroke="#140D08" stroke-opacity="0.5" stroke-width="4" paint-order="stroke">${esc(c.note || 'Illustration · documents shown are fictional examples')}</text></g>
</g>
</svg>`;
}

// =====================================================================
// 1. LANGUAGE: a council planning notice full of jargon, on a wooden desk
// =====================================================================
function woodDesk(id, sd) {
  return `<filter id="${id}" x="0" y="0" width="1920" height="1080" filterUnits="userSpaceOnUse">
  <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.05" numOctaves="4" seed="${sd}"/>
  <feColorMatrix type="matrix" values="0.62 0 0 0 0.2  0.40 0 0 0 0.1  0.22 0 0 0 0.04  0 0 0 0 1"/></filter>`;
}
function scene1() {
  const planks = [0, 290, 610, 905].map((py) => `<rect x="0" y="${py - 2}" width="1920" height="4" fill="#1E1008" opacity="0.55"/><rect x="0" y="${py + 2}" width="1920" height="1.5" fill="#F4C68C" opacity="0.18"/>`).join('');
  const L = [
    'Council has prepared Amendment C214 to the Planning Scheme.',
    'The amendment proposes to apply the [[Development Contributions]]',
    '[[Plan Overlay (DCPO2)]] and to rezone land from Mixed Use Zone',
    'to Commercial 1 Zone, [[pursuant to Section 19 of the Act]].',
    '',
    'The amendment is on [[statutory exhibition]] until 14 April. Any',
    'person who may be affected by the amendment may make a',
    'submission. Submissions must address the [[relevant planning]]',
    '[[provisions]] and must be lodged in writing.',
    '',
    'Where submissions cannot be resolved, Council may request',
    'the Minister to appoint an [[independent Planning Panel]] under',
    'Part 8 of the Act. Submitters will be notified of the [[Directions]]',
    '[[Hearing]] and may be heard at the Panel.',
    '',
    'The Explanatory Report, Instruction Sheet and the draft',
    '[[Schedule to Clause 45.06]] are available on Council\'s website.',
  ];
  const letter = sheet(600, 848, '#FBF9F4', `
    <circle cx="66" cy="72" r="27" fill="#2F4A6B"/><path d="M52 84 h28 v-3 h-28z M54 80 v-14 h4 v14z M62 80 v-14 h4 v14z M70 80 v-14 h4 v14z M51 64 l15 -9 l15 9z" fill="#fff"/>
    ${T(108, 68, 'Local Council', { size: 25, w: 800, fill: '#22344D' })}
    ${T(108, 92, 'Strategic Planning Unit', { size: 14, w: 700, fill: '#6B7280' })}
    ${T(556, 68, 'Ref: AM-C214', { size: 12, w: 700, fill: '#6B7280', anchor: 'end' })}
    ${T(556, 86, '12 March', { size: 12, w: 700, fill: '#6B7280', anchor: 'end' })}
    <rect x="44" y="116" width="512" height="1.5" fill="#22344D" opacity="0.5"/>
    ${T(44, 160, 'NOTICE OF PREPARATION OF AMENDMENT C214', { size: 17, w: 700, ff: SERIF, fill: '#1F2937' })}
    ${T(44, 184, 'Planning and Environment Act 1987 · Planning Scheme', { size: 13.5, ff: SERIF, fill: '#4B5563', italic: true })}
    ${marked(L, 44, 228, 25, { ff: SERIF, size: 14.6, fill: '#2A2F38' })}
    ${T(44, 712, 'Yours sincerely,', { size: 14.6, ff: SERIF, fill: '#2A2F38', w: 400 })}
    <path d="M50 760 c14 -30 26 -30 22 -6 c-4 20 10 -20 22 -16 c10 4 -4 22 8 18 c12 -4 18 -22 30 -14 c8 6 6 14 22 6 c10 -5 20 -6 34 -2" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/>
    ${T(44, 796, 'Manager, Strategic Planning', { size: 13.5, ff: SERIF, fill: '#4B5563', w: 400 })}
    ${qmark(578, 268, 0.9)}${qmark(578, 420, 0.9)}${qmark(578, 565, 0.9)}`);
  // reading glasses
  const lens = (cx) => `<rect x="${cx - 62}" y="-43" width="124" height="86" rx="38" fill="#CFE0F5" fill-opacity="0.16" stroke="#1B1B1D" stroke-width="8"/><path d="M${cx - 44} -24 q20 -14 46 -8" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.55"/>`;
  const glasses = `<g transform="translate(1215 958) rotate(-6) scale(0.9)" filter="url(#shadowLow)">
    ${lens(-80)}${lens(80)}<path d="M-18 -10 q18 -16 36 0" stroke="#1B1B1D" stroke-width="7" fill="none"/>
    <path d="M-142 -22 L-150 -30 Q-120 -58 40 -52" stroke="#1B1B1D" stroke-width="6.5" fill="none" stroke-linecap="round"/>
    <path d="M142 -26 L150 -34 Q120 -66 -40 -60" stroke="#2A2A2D" stroke-width="6.5" fill="none" stroke-linecap="round"/></g>`;
  // coffee mug, top view
  const mug = `<g transform="translate(1790 170)" filter="url(#shadow)">
    <rect x="-200" y="-24" width="110" height="48" rx="24" fill="#E9E4DC" transform="rotate(-25)"/>
    <rect x="-180" y="-10" width="70" height="20" rx="10" fill="#8C7F70" opacity="0.5" transform="rotate(-25)"/>
    <circle r="122" fill="url(#mugCeramic)"/><circle r="101" fill="#D8D1C6"/><circle r="96" fill="url(#coffee)"/>
    <ellipse cx="-22" cy="-30" rx="46" ry="16" fill="#F4D9B8" opacity="0.18" transform="rotate(-30)"/>
    <path d="M-80 -70 a112 112 0 0 1 120 -48" stroke="#fff" stroke-width="7" fill="none" opacity="0.7" stroke-linecap="round"/></g>`;
  const pen = `<g transform="translate(1690 470) rotate(58)" filter="url(#shadowLow)">
    <rect x="0" y="-13" width="330" height="26" rx="12" fill="url(#penBody)"/>
    <path d="M330 -11 L384 -2 Q390 0 384 2 L330 11z" fill="url(#penTip)"/>
    <rect x="18" y="-17" width="110" height="9" rx="4" fill="#C9CED6"/><rect x="0" y="-13" width="34" height="26" rx="12" fill="#B91C1C"/></g>`;
  const sticky = `<g transform="translate(1610 735) rotate(7)" filter="url(#shadowLow)">
    <path d="M0 0 H250 V232 Q240 246 210 252 H0z" fill="#FFE768"/><path d="M0 0 H250 V232 Q240 246 210 252 H0z" fill="url(#stickyShade)"/>
    <rect width="250" height="26" fill="#000" opacity="0.05"/>
    ${T(22, 92, 'What does', { ff: HAND, size: 46, w: 700, fill: '#1E3A8A' })}
    ${T(22, 146, 'this mean??', { ff: HAND, size: 46, w: 700, fill: '#1E3A8A' })}
    <path d="M28 168 q90 14 180 -4" stroke="#1E3A8A" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
  return `<rect width="1920" height="1080" filter="url(#wood1)"/>${planks}
  <g transform="translate(990 66) rotate(-3.5)" filter="url(#shadow)">${letter}</g>
  ${glasses}${mug}${pen}${sticky}`;
}
const defs1 = `${woodDesk('wood1', 7)}
<radialGradient id="mugCeramic" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.7" stop-color="#EDE8E0"/><stop offset="1" stop-color="#BDB4A7"/></radialGradient>
<radialGradient id="coffee" cx="45%" cy="42%" r="60%"><stop offset="0" stop-color="#5A3520"/><stop offset="0.75" stop-color="#36200F"/><stop offset="0.95" stop-color="#7A5636"/><stop offset="1" stop-color="#C9A27A"/></radialGradient>
<linearGradient id="penBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4C7E"/><stop offset="0.3" stop-color="#6F82B8"/><stop offset="0.55" stop-color="#1D2A52"/><stop offset="1" stop-color="#0B1230"/></linearGradient>
<linearGradient id="penTip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5E7EB"/><stop offset="0.4" stop-color="#FFFFFF"/><stop offset="1" stop-color="#8B9099"/></linearGradient>
<linearGradient id="stickyShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#8A6A00" stop-opacity="0.25"/></linearGradient>`;

// =====================================================================
// 2. TIME: a packed weekly planner vs an evening consultation session
// =====================================================================
function scene2() {
  const days = [['MON', '14'], ['TUE', '15'], ['WED', '16'], ['THU', '17'], ['FRI', '18'], ['SAT', '19'], ['SUN', '20']];
  const entries = {
    MON: [['7:00', 'Dog walk', '#8FB996'], ['8:30', 'Work till 5:30', '#9DB4E8'], ['6:30', 'Groceries', '#F2C48D']],
    TUE: [['7:00', 'Dog walk', '#8FB996'], ['8:30', 'Work late till 7:30', '#9DB4E8']],
    WED: [['8:30', 'Work till 5:30', '#9DB4E8'], ['6:00', 'English class', '#E7A6B8'], ['8:00', 'Cook for week', '#F2C48D']],
    THU: [['7:00', 'Dog walk', '#8FB996'], ['8:30', 'Work till 5:30', '#9DB4E8'], ['6:00', 'Gym', '#C7B2E6']],
    FRI: [['8:30', 'Work till 6:00', '#9DB4E8'], ['7:00', 'Dinner w/ team', '#F2C48D']],
    SAT: [['8:00', 'Dog park', '#8FB996'], ['10:00', 'Laundry', '#C7B2E6']],
    SUN: [['9:00', 'Call family', '#E7A6B8'], ['2:00', 'Meal prep', '#F2C48D']],
  };
  const pageW = 400, rowH = 168;
  const page = (list, px) => list.map(([d, n], i) => {
    const y = 40 + i * rowH;
    const es = (entries[d] || []).map(([tm, what, col], k) => `<rect x="96" y="${y + 16 + k * 44}" width="10" height="34" rx="3" fill="${col}"/>
      ${T(116, y + 42 + k * 44, tm, { ff: HAND, size: 25, w: 700, fill: '#5B6170' })}${T(170, y + 42 + k * 44, what, { ff: HAND, size: 30, w: 700, fill: '#1F2A44' })}`).join('');
    return `<rect x="24" y="${y + rowH - 2}" width="${pageW - 48}" height="1.5" fill="#B8AE9C" opacity="0.7"/>
      ${T(30, y + 44, d, { size: 17, w: 900, fill: '#A0452B', ls: 1.5 })}${T(30, y + 84, n, { size: 34, w: 900, fill: '#3A3226' })}${es}`;
  }).join('');
  const ring = (y) => `<g transform="translate(${pageW} ${y})"><ellipse cx="0" cy="0" rx="22" ry="9" fill="none" stroke="url(#ring)" stroke-width="6"/></g>`;
  const planner = `<g transform="translate(905 128) rotate(-2.5)" filter="url(#shadow)">
    <rect x="-14" y="-14" width="${pageW * 2 + 28}" height="${rowH * 4 + 108}" rx="18" fill="#3C2A1E"/>
    <g>${sheet(pageW, rowH * 4 + 80, '#F7F1E3', page(days.slice(0, 4), 0), false)}<rect width="${pageW}" height="${rowH * 4 + 80}" fill="url(#gutterL)"/></g>
    <g transform="translate(${pageW} 0)">${sheet(pageW, rowH * 4 + 80, '#F7F1E3', page(days.slice(4), 0) + `<rect x="24" y="${40 + 3 * rowH - 2}" width="352" height="${rowH}" fill="none"/>${T(30, 40 + 3 * rowH + 50, 'NOTES', { size: 17, w: 900, fill: '#A0452B', ls: 1.5 })}`, false)}<rect width="${pageW}" height="${rowH * 4 + 80}" fill="url(#gutterR)"/></g>
    ${Array.from({ length: 16 }, (_, i) => ring(40 + i * 44)).join('')}
    <ellipse cx="236" cy="${40 + rowH + 82}" rx="176" ry="30" fill="none" stroke="#D0312D" stroke-width="4" transform="rotate(-2 236 ${40 + rowH + 82})" opacity="0.9"/>
    ${T(250, 40 + rowH + 150, 'clash!', { ff: HAND, size: 46, w: 700, fill: '#D0312D', tr: `rotate(-6 250 ${40 + rowH + 150})` })}
  </g>`;
  // the consultation flyer clipped over Tuesday
  const flyer = `<g transform="translate(1330 650) rotate(4)" filter="url(#shadow)">
    ${sheet(330, 210, '#FFFFFF', `<rect width="330" height="52" fill="#1F6F78"/>
      ${T(18, 34, 'HAVE YOUR SAY', { size: 20, w: 900, fill: '#fff', ls: 2 })}
      ${T(18, 88, 'Community consultation', { size: 22, w: 900, fill: '#1F2A44' })}
      ${T(18, 120, 'Tuesday 15 · 6:00 – 8:00 pm', { size: 18, w: 800, fill: '#B42318' })}
      ${T(18, 148, 'Town Hall, Level 2 (in person only)', { size: 15, w: 700, fill: '#4B5563' })}
      ${T(18, 180, 'Light refreshments provided', { size: 14, w: 700, fill: '#6B7280' })}`)}
    <path d="M250 -24 v86 a14 14 0 0 0 28 0 v-70 a9 9 0 0 0 -18 0 v62" fill="none" stroke="url(#clip)" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  <path d="M1336 690 C1290 640 1300 520 1306 440" fill="none" stroke="#D0312D" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10" opacity="0.9"/>
  <path d="M1292 458 l14 -20 l12 22" fill="none" stroke="#D0312D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
  const watch = `<g transform="translate(1785 190)" filter="url(#shadow)">
    <rect x="-58" y="-260" width="116" height="200" rx="14" fill="url(#strap)"/><rect x="-58" y="60" width="116" height="220" rx="14" fill="url(#strap)"/>
    <circle r="112" fill="url(#steel)"/><circle r="98" fill="#15181D"/><circle r="98" fill="url(#dial)"/>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="-90" width="6" height="${i % 3 ? 12 : 22}" rx="2" fill="#E8E2D2" transform="rotate(${i * 30})"/>`).join('')}
    <rect x="-4.5" y="-56" width="9" height="62" rx="4" fill="#F3EDE0" transform="rotate(${(5 + 42 / 60) * 30})"/>
    <rect x="-3" y="-82" width="6" height="88" rx="3" fill="#F3EDE0" transform="rotate(${42 * 6})"/>
    <rect x="-1" y="-84" width="2" height="96" fill="#E0544B" transform="rotate(118)"/>
    <circle r="7" fill="#C9CED6"/><path d="M-70 -50 a90 90 0 0 1 90 -48" stroke="#fff" stroke-width="5" fill="none" opacity="0.18"/>
    <rect x="108" y="-14" width="18" height="28" rx="4" fill="url(#steel)"/></g>`;
  const ph = phone(1665, 545, 240, 480, 9, (w, h) => `
    <rect width="${w}" height="${h}" fill="url(#wall2)"/>
    ${T(w / 2, 104, '5:42', { size: 64, w: 800, fill: '#fff', anchor: 'middle' })}
    ${T(w / 2, 132, 'Tuesday 15', { size: 16, w: 700, fill: '#fff', anchor: 'middle', op: 0.85 })}
    <g transform="translate(10 168)"><rect width="${w - 20}" height="104" rx="18" fill="#fff" opacity="0.88"/>
      <rect x="12" y="12" width="26" height="26" rx="7" fill="#E0544B"/>${T(46, 31, 'CALENDAR · now', { size: 11, w: 800, fill: '#6B7280' })}
      ${T(12, 60, 'Community consultation', { size: 15, w: 900, fill: '#111827' })}
      ${T(12, 82, 'Starts in 18 min · Town Hall', { size: 13, w: 700, fill: '#374151' })}</g>
    <g transform="translate(10 282)"><rect width="${w - 20}" height="104" rx="18" fill="#fff" opacity="0.88"/>
      <rect x="12" y="12" width="26" height="26" rx="7" fill="#3A63D1"/>${T(46, 31, 'WORK · 2h ago', { size: 11, w: 800, fill: '#6B7280' })}
      ${T(12, 60, 'Shift extended', { size: 15, w: 900, fill: '#111827' })}
      ${T(12, 82, 'Please stay until 7:30 pm', { size: 13, w: 700, fill: '#374151' })}</g>`);
  return `<rect width="1920" height="1080" filter="url(#slate)"/><rect width="1920" height="1080" fill="url(#slateLight)"/>${planner}${flyer}${watch}${ph}`;
}
const defs2 = `
<filter id="slate" x="0" y="0" width="1920" height="1080" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="5" seed="3"/><feColorMatrix type="matrix" values="0.32 0 0 0 0.12  0.32 0 0 0 0.13  0.32 0 0 0 0.15  0 0 0 0 1"/></filter>
<radialGradient id="slateLight" cx="70%" cy="40%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></radialGradient>
<linearGradient id="gutterL" x1="0" x2="1"><stop offset="0.82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3B2C18" stop-opacity="0.32"/></linearGradient>
<linearGradient id="gutterR" x1="0" x2="1"><stop offset="0" stop-color="#3B2C18" stop-opacity="0.3"/><stop offset="0.16" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.05"/></linearGradient>
<linearGradient id="ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5F6F8"/><stop offset="0.5" stop-color="#8E949E"/><stop offset="1" stop-color="#3D4148"/></linearGradient>
<linearGradient id="clip" x1="0" x2="1"><stop offset="0" stop-color="#9AA0AA"/><stop offset="0.5" stop-color="#F4F5F7"/><stop offset="1" stop-color="#7C828C"/></linearGradient>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2F4F7"/><stop offset="0.45" stop-color="#9AA1AC"/><stop offset="0.55" stop-color="#C7CCD3"/><stop offset="1" stop-color="#5E646E"/></linearGradient>
<radialGradient id="dial" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#2E3440"/><stop offset="1" stop-color="#0B0D11"/></radialGradient>
<linearGradient id="strap" x1="0" x2="1"><stop offset="0" stop-color="#4A2C1A"/><stop offset="0.5" stop-color="#7A4A2C"/><stop offset="1" stop-color="#3E2414"/></linearGradient>
<linearGradient id="wall2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E3B6E"/><stop offset="0.6" stop-color="#7A4E86"/><stop offset="1" stop-color="#E7895B"/></linearGradient>`;

// =====================================================================
// 3. RELEVANCE: a crowded noticeboard; only the personal notice stands out
// =====================================================================
function scene3() {
  seed = 42;
  const bx = 780, by = 96, bw = 1090, bh = 860;
  const flyer = (x, y, w, h, rot, col, head, sub, lines, pc, extra = '') => `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} 0)"><g filter="url(#shadowLow)">${sheet(w, h, col, `
      ${T(18, 40, head[0], { size: 21, w: 900, fill: '#1F2A44' })}${head[1] ? T(18, 66, head[1], { size: 21, w: 900, fill: '#1F2A44' }) : ''}
      ${T(18, head[1] ? 94 : 70, sub, { size: 13, w: 800, fill: '#6B7280' })}
      ${Array.from({ length: lines }, (_, i) => `<rect x="18" y="${(head[1] ? 112 : 88) + i * 16}" width="${(w - 36) * (0.62 + rnd() * 0.38)}" height="6" rx="3" fill="#9CA3AF" opacity="0.55"/>`).join('')}${extra}`)}</g>${pin(w / 2, 14, pc)}</g>`;
  const dim = [
    flyer(820, 140, 250, 300, -4, '#FFFFFF', ['Road resurfacing', 'works: Ward 7'], 'Traffic management notice', 8, '#3A63D1', `<rect x="18" y="246" width="214" height="34" rx="6" fill="#F59E0B" opacity="0.8"/>`),
    flyer(1100, 128, 270, 250, 3, '#EAF2FB', ['Draft Budget', '2026–27'], 'Submissions now open', 6, '#E0544B'),
    flyer(1400, 150, 240, 330, -2, '#FFFBEA', ['Amendment C209:', 'industrial precinct'], 'Rezoning · Planning Scheme', 10, '#16A34A'),
    flyer(1660, 120, 190, 270, 5, '#FFFFFF', ['Council', 'meeting'], 'Agenda · 24 June · 7 pm', 9, '#7B4B94'),
    flyer(830, 500, 240, 270, 4, '#F0F7EE', ['Stormwater', 'drainage upgrade'], 'Capital works program', 8, '#F28C28', `<rect x="18" y="200" width="204" height="52" rx="6" fill="#5B8C6A" opacity="0.35"/>`),
    flyer(1480, 520, 250, 300, -3, '#EAF2FB', ['Heritage overlay', 'review'], 'Stage 2 · technical study', 10, '#3A63D1'),
    flyer(1100, 760, 280, 170, -1.5, '#FFFFFF', ['Waste collection', 'changes'], 'From 1 July', 3, '#E0544B'),
    flyer(1690, 430, 170, 220, 6, '#FFF1E6', ['Local Law', 'review'], 'Community Amenity', 7, '#16A34A'),
    flyer(1740, 700, 150, 220, -5, '#FFFFFF', ['Lost cat'], 'Call 04xx xxx xxx', 6, '#F28C28'),
  ].join('');
  // the one that feels personal: lit and in full colour
  const hot = `<g transform="translate(1110 420) rotate(-2 170 0)" filter="url(#glow)"><g filter="url(#shadow)">${sheet(340, 300, '#FFFFFF', `
      <rect width="340" height="118" fill="url(#parkPhoto)"/>
      <circle cx="60" cy="74" r="34" fill="#2F6B3A"/><circle cx="98" cy="64" r="44" fill="#3E8A4B"/><rect x="92" y="80" width="10" height="38" fill="#5B3A22"/>
      <circle cx="270" cy="70" r="40" fill="#397F45"/><rect x="266" y="88" width="9" height="30" fill="#5B3A22"/>
      <path d="M0 118 Q120 96 340 108 V118z" fill="#7DBB5E"/>
      <rect x="0" y="118" width="340" height="6" fill="#F26B1D"/>
      ${T(20, 162, 'Changes to the park', { size: 26, w: 900, fill: '#1F2A44' })}
      ${T(20, 194, 'on YOUR street', { size: 26, w: 900, fill: '#F26B1D' })}
      ${T(20, 224, 'Tell us what you think · 2 min survey', { size: 14, w: 800, fill: '#4B5563' })}
      <rect x="20" y="244" width="150" height="38" rx="19" fill="#1F2A44"/>${T(95, 269, 'Have your say', { size: 15, w: 900, fill: '#fff', anchor: 'middle' })}`)}</g>${pin(170, 14, '#F26B1D')}</g>`;
  const frameW = 30;
  return `<rect width="1920" height="1080" fill="url(#wall3)"/><rect width="1920" height="1080" filter="url(#plaster)" opacity="0.6"/>
  <g filter="url(#shadow)"><rect x="${bx - frameW}" y="${by - frameW}" width="${bw + 2 * frameW}" height="${bh + 2 * frameW}" rx="8" fill="url(#oak)"/></g>
  <rect x="${bx - frameW + 4}" y="${by - frameW + 4}" width="${bw + 2 * frameW - 8}" height="${bh + 2 * frameW - 8}" rx="6" fill="none" stroke="#F3D3A6" stroke-opacity="0.35" stroke-width="2"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" filter="url(#cork)"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#2A1A0E" stroke-opacity="0.5" stroke-width="6"/>
  <svg x="${bx}" y="${by}" width="${bw}" height="${bh}" viewBox="${bx} ${by} ${bw} ${bh}" overflow="hidden">${dim}
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#120B06" opacity="0.5"/>
    <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#spot)"/></svg>
  ${hot}
  ${T(1468, 410, 'this one', { ff: HAND, size: 46, w: 700, fill: '#FFE7A8', tr: 'rotate(-8 1468 410)' })}
  <path d="M1470 420 q-6 30 -24 48" fill="none" stroke="#FFE7A8" stroke-width="4" stroke-linecap="round"/><path d="M1436 456 l10 14 l12 -12" fill="none" stroke="#FFE7A8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const defs3 = `
<linearGradient id="wall3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9BBA6"/><stop offset="1" stop-color="#8E7E68"/></linearGradient>
<filter id="plaster" x="0" y="0" width="1920" height="1080" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.35 0"/></filter>
<filter id="cork" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="5"/><feColorMatrix type="matrix" values="0.75 0 0 0 0.36  0.55 0 0 0 0.24  0.35 0 0 0 0.12  0 0 0 0 1"/></filter>
<linearGradient id="oak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9C6B3E"/><stop offset="0.5" stop-color="#7A4F2A"/><stop offset="1" stop-color="#5A381C"/></linearGradient>
<radialGradient id="spot" cx="45%" cy="62%" r="40%"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/></radialGradient>
<linearGradient id="parkPhoto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD3F0"/><stop offset="1" stop-color="#DDF0F8"/></linearGradient>`;

// =====================================================================
// 4. COMMUNICATION: a long council directory + an email forwarded around
// =====================================================================
function scene4() {
  const depts = [
    ['Customer Service', 'G', '→'], ['Planning & Building', '1', '↑'], ['Strategic Planning', '1', '↑'],
    ['Parks & Open Space', '2', '↑'], ['Traffic & Transport', '2', '↑'], ['Community Services', '3', '↑'],
    ['Local Laws', '3', '↑'], ['Waste & Recycling', '3', '↑'], ['Arts & Culture', '4', '↑'],
    ['Governance & Engagement', '4', '↑'], ['Economic Development', '5', '↑'], ['Environment & Climate', '5', '↑'],
  ];
  const dx = 870, dy = 118, dw = 640, dh = 820;
  const rows = depts.map(([n, lv, ar], i) => {
    const y = 176 + i * 52;
    return `<rect x="34" y="${y - 34}" width="${dw - 68}" height="44" rx="4" fill="#0F1B2D" opacity="${i % 2 ? 0.0 : 0.05}"/>
      ${T(48, y, n, { size: 25, w: 800, fill: '#1B2638' })}
      <rect x="${dw - 132}" y="${y - 28}" width="44" height="34" rx="6" fill="#1B2638"/>${T(dw - 110, y - 3, lv, { size: 20, w: 900, fill: '#fff', anchor: 'middle' })}
      ${T(dw - 54, y, ar, { size: 26, w: 900, fill: '#1B2638', anchor: 'middle' })}`;
  }).join('');
  const sign = `<g transform="translate(${dx} ${dy})" filter="url(#shadow)">
    <rect width="${dw}" height="${dh}" rx="10" fill="url(#alu)"/><rect width="${dw}" height="${dh}" rx="10" filter="url(#brushed)" opacity="0.5"/>
    <rect width="${dw}" height="${dh}" rx="10" fill="url(#aluSheen)"/>
    <rect x="3" y="3" width="${dw - 6}" height="${dh - 6}" rx="8" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="2"/>
    <rect x="34" y="34" width="${dw - 68}" height="62" rx="6" fill="#1B2638"/>
    ${T(56, 77, 'CIVIC CENTRE DIRECTORY', { size: 26, w: 900, fill: '#fff', ls: 3 })}
    ${T(dw - 110, 77, 'LEVEL', { size: 14, w: 900, fill: '#9FB1CC', anchor: 'middle', ls: 1 })}
    ${rows}
    ${[22, dw - 22].map((sx) => [22, dh - 22].map((sy) => `<circle cx="${sx}" cy="${sy}" r="6" fill="url(#steel4)"/>`).join('')).join('')}
  </g>`;
  const mail = (y, from, dept, body, col) => `<g transform="translate(12 ${y})"><rect width="288" height="118" rx="16" fill="#fff"/>
    <circle cx="28" cy="30" r="16" fill="${col}"/>${T(28, 36, from[0], { size: 15, w: 900, fill: '#fff', anchor: 'middle' })}
    ${T(54, 27, from, { size: 14, w: 900, fill: '#111827' })}${T(54, 45, dept, { size: 12, w: 800, fill: '#6B7280' })}
    ${body.map((l, i) => T(16, 74 + i * 20, l, { size: 13.5, w: 700, fill: '#374151' })).join('')}</g>`;
  const ph = phone(1548, 250, 340, 720, -6, (w, h) => `
    <rect width="${w}" height="${h}" fill="#F2F3F7"/>
    ${T(22, 74, '‹ Inbox', { size: 17, w: 800, fill: '#3A63D1' })}
    ${T(22, 112, 'Re: Fwd: Fwd: My feedback', { size: 19, w: 900, fill: '#111827' })}
    ${T(22, 136, 'about the park', { size: 19, w: 900, fill: '#111827' })}
    ${T(22, 160, '4 messages · 3 weeks', { size: 13, w: 800, fill: '#6B7280' })}
    ${mail(178, 'Customer Service', 'to: me', ['Thanks for your feedback. We have', 'forwarded it to Parks & Open Space.'], '#3A63D1')}
    ${mail(306, 'Parks & Open Space', 'to: me', ['This isn\'t managed by our team.', 'Forwarding to Local Laws.'], '#16A34A')}
    ${mail(434, 'Local Laws', 'to: me', ['Please contact Customer Service', 'so they can direct your enquiry.'], '#E0544B')}
    <g transform="translate(12 562)"><rect width="288" height="96" rx="16" fill="#FFF4E5" stroke="#F28C28" stroke-width="2"/>
      ${T(20, 40, 'So who should I send', { size: 19, w: 900, fill: '#9A3412' })}${T(20, 68, 'my opinion to?', { size: 19, w: 900, fill: '#9A3412' })}</g>`);
  return `<rect width="1920" height="1080" fill="url(#lobby)"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 240}" y="0" width="2" height="860" fill="#fff" opacity="0.06"/>`).join('')}
  <rect y="860" width="1920" height="220" fill="url(#floor)"/>
  <ellipse cx="1220" cy="70" rx="420" ry="160" fill="#FFE9C7" opacity="0.14" filter="url(#blur18)"/>
  <rect x="${dx}" y="${dy + dh + 6}" width="${dw}" height="110" fill="url(#reflect)"/>
  ${sign}${ph}`;
}
const defs4 = `
<linearGradient id="reflect" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9C1CB" stop-opacity="0.22"/><stop offset="1" stop-color="#B9C1CB" stop-opacity="0"/></linearGradient>
<linearGradient id="lobby" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4658"/><stop offset="0.8" stop-color="#232C3A"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C4741"/><stop offset="1" stop-color="#25221F"/></linearGradient>
<linearGradient id="alu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9ECEF"/><stop offset="0.5" stop-color="#C5CBD2"/><stop offset="1" stop-color="#A3AAB3"/></linearGradient>
<linearGradient id="aluSheen" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="brushed" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.003 0.9" numOctaves="2" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.52  0 0 0 0 0.55  0.9 0 0 0 -0.2"/></filter>
<radialGradient id="steel4" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#6B7280"/></radialGradient>`;

// =====================================================================
// 5. CHANNELS: council flyers in the letterbox vs a social media feed
// =====================================================================
function scene5() {
  seed = 7;
  let bricks = '';
  const BW = 120, BH = 40;
  for (let r = 0; r * BH < 1080; r++) {
    for (let c = -1; c * BW < 1920; c++) {
      const x = c * BW + (r % 2 ? BW / 2 : 0), y = 200 + r * BH;
      if (y > 1080) continue;
      const k = rnd(), base = [[150, 62, 42], [128, 52, 36], [168, 78, 52], [116, 58, 44], [142, 70, 50]][Math.floor(k * 5)];
      const j = (v) => Math.max(0, Math.min(255, Math.round(v + (rnd() - 0.5) * 18)));
      bricks += `<rect x="${x + 3}" y="${y + 3}" width="${BW - 6}" height="${BH - 6}" rx="3" fill="rgb(${j(base[0])},${j(base[1])},${j(base[2])})"/>`;
    }
  }
  const trees = Array.from({ length: 14 }, (_, i) => `<circle cx="${i * 150 + rnd() * 60}" cy="${90 + rnd() * 90}" r="${80 + rnd() * 60}" fill="${['#2F5D3A', '#3F7A47', '#527F4B', '#26492E'][i % 4]}"/>`).join('');
  const letterbox = `<g transform="translate(1000 330)" filter="url(#shadow)">
    <rect x="30" y="-36" width="300" height="40" rx="6" fill="#2A2C30"/>
    <rect width="360" height="420" rx="22" fill="url(#boxMetal)"/>
    <rect x="18" y="18" width="324" height="384" rx="14" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="3"/>
    <rect x="50" y="70" width="260" height="40" rx="8" fill="#0B0C0E"/>
    <g transform="translate(70 92)">
      <g transform="rotate(-8)">${sheet(170, 120, '#FFFFFF', `<rect width="170" height="30" fill="#1F6F78"/>${T(10, 21, 'COUNCIL NEWS', { size: 15, w: 900, fill: '#fff', ls: 1 })}${T(10, 54, 'Have your say on', { size: 14, w: 900, fill: '#1F2A44' })}${T(10, 72, 'local changes', { size: 14, w: 900, fill: '#1F2A44' })}`, false)}</g>
      <g transform="translate(110 -10) rotate(6)">${sheet(130, 110, '#FFF6D6', `${T(10, 26, 'NOTICE OF', { size: 13, w: 900, fill: '#7C2D12' })}${T(10, 44, 'PROPOSED WORKS', { size: 13, w: 900, fill: '#7C2D12' })}<rect x="10" y="56" width="100" height="5" rx="2" fill="#B45309" opacity="0.4"/><rect x="10" y="68" width="80" height="5" rx="2" fill="#B45309" opacity="0.4"/>`, false)}</g>
    </g>
    <rect x="50" y="108" width="260" height="10" rx="4" fill="#0B0C0E"/>
    <rect x="50" y="108" width="260" height="6" fill="url(#boxMetal)"/>
    <rect x="130" y="250" width="100" height="60" rx="10" fill="#C8A04A"/>${T(180, 292, '14', { size: 34, w: 900, fill: '#3B2A0B', anchor: 'middle' })}
    <circle cx="300" cy="360" r="14" fill="url(#steel5)"/><rect x="296" y="352" width="8" height="16" rx="2" fill="#2A2C30"/>
    <rect width="360" height="420" rx="22" fill="url(#boxSheen)"/>
  </g>
  <g transform="translate(1010 860) rotate(-12)" filter="url(#shadowLow)">${sheet(200, 130, '#FFFFFF', `<rect width="200" height="34" fill="#1F6F78"/>${T(12, 24, 'COMMUNITY UPDATE', { size: 14, w: 900, fill: '#fff', ls: 1 })}<rect x="12" y="50" width="170" height="7" rx="3" fill="#9CA3AF" opacity="0.6"/><rect x="12" y="66" width="140" height="7" rx="3" fill="#9CA3AF" opacity="0.6"/><rect x="12" y="82" width="160" height="7" rx="3" fill="#9CA3AF" opacity="0.6"/>`, false)}</g>
  ${T(1180, 820, 'paper flyers', { ff: HAND, size: 44, w: 700, fill: '#FFF2D6', anchor: 'middle', tr: 'rotate(-4 1180 820)' })}`;
  const story = (x, c1, c2, name) => `<g transform="translate(${x} 104)"><circle r="31" fill="none" stroke="url(#ring5)" stroke-width="4"/><circle r="26" fill="${c1}"/><circle cx="-6" cy="-6" r="12" fill="${c2}" opacity="0.7"/>${T(0, 50, name, { size: 11, w: 800, fill: '#374151', anchor: 'middle' })}</g>`;
  const post = (y, name, a, b, cap, likes) => `<g transform="translate(0 ${y})">
    <circle cx="30" cy="24" r="16" fill="${a}"/>${T(56, 30, name, { size: 15, w: 900, fill: '#111827' })}${T(310, 30, '···', { size: 18, w: 900, fill: '#6B7280', anchor: 'end' })}
    <rect x="0" y="50" width="332" height="250" fill="url(#${b})"/>
    ${b === 'food' ? '<ellipse cx="166" cy="180" rx="110" ry="76" fill="#F7F3EC"/><ellipse cx="166" cy="176" rx="80" ry="52" fill="#E39B4A"/><circle cx="140" cy="166" r="16" fill="#7BB661"/><circle cx="190" cy="186" r="14" fill="#C2410C"/><circle cx="172" cy="158" r="10" fill="#FDE68A"/>' : '<circle cx="250" cy="110" r="30" fill="#FDE68A" opacity="0.9"/><path d="M0 300 L70 190 L120 240 L190 140 L332 300z" fill="#1E293B" opacity="0.8"/><rect x="40" y="230" width="18" height="70" fill="#F59E0B"/><rect x="250" y="210" width="22" height="90" fill="#F472B6"/>'}
    <path d="M22 326 c-6 -8 -18 -2 -12 8 l12 12 l12 -12 c6 -10 -6 -16 -12 -8z" fill="#E0544B"/>
    <path d="M52 318 h20 a8 8 0 0 1 8 8 v8 a8 8 0 0 1 -8 8 h-10 l-8 6 v-6 a8 8 0 0 1 -8 -8 v-8 a8 8 0 0 1 8 -8z" fill="none" stroke="#111827" stroke-width="2.5"/>
    ${T(14, 372, likes, { size: 14, w: 900, fill: '#111827' })}${T(14, 394, cap, { size: 13.5, w: 700, fill: '#374151' })}</g>`;
  const ph = phone(1465, 140, 340, 730, 6, (w, h) => `
    <rect width="${w}" height="${h}" fill="#fff"/>
    ${T(18, 66, 'Feed', { size: 28, w: 900, fill: '#111827' })}
    <path d="M286 48 c-6 -8 -18 -2 -12 8 l12 12 l12 -12 c6 -10 -6 -16 -12 -8z" fill="none" stroke="#111827" stroke-width="2.5"/>
    ${story(48, '#F59E0B', '#FDE68A', 'melb.eats')}${story(124, '#3B82F6', '#BFDBFE', 'city.events')}${story(200, '#EC4899', '#FBCFE8', 'lane.cafe')}${story(276, '#10B981', '#A7F3D0', 'run.club')}
    <rect y="172" width="${w}" height="1" fill="#E5E7EB"/>
    ${post(182, 'melb.eats', '#F59E0B', 'food', 'new brunch spot on Smith St', '2,418 likes')}
    ${post(590, 'city.events', '#3B82F6', 'night', 'night market this weekend', '1,903 likes')}`);
  return `<rect width="1920" height="1080" fill="#8FB5CC"/><g filter="url(#blur18)">${trees}</g>
  <rect y="200" width="1920" height="880" fill="#5C5650"/>${bricks}
  <rect y="200" width="1920" height="880" fill="url(#brickShade)"/>
  <rect y="176" width="1920" height="30" fill="#6E6A64"/><rect y="200" width="1920" height="8" fill="#000" opacity="0.25"/>
  ${letterbox}
  <g transform="translate(1395 520)"><circle r="44" fill="#140D08" opacity="0.82"/>${T(0, 12, 'vs', { size: 34, w: 900, fill: '#FFF7EE', anchor: 'middle' })}</g>
  ${ph}
  ${T(1640, 950, 'where newer residents look', { ff: HAND, size: 40, w: 700, fill: '#FFF2D6', anchor: 'middle', tr: 'rotate(-3 1640 950)' })}`;
}
const defs5 = `
<linearGradient id="brickShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.25" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></linearGradient>
<linearGradient id="boxMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2B2E33"/><stop offset="0.2" stop-color="#4A4F57"/><stop offset="0.5" stop-color="#33373D"/><stop offset="1" stop-color="#1C1E22"/></linearGradient>
<linearGradient id="boxSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.35" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="steel5" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#F2F4F7"/><stop offset="1" stop-color="#6B7280"/></radialGradient>
<linearGradient id="ring5" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F59E0B"/><stop offset="0.5" stop-color="#E0544B"/><stop offset="1" stop-color="#A855F7"/></linearGradient>
<linearGradient id="food" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5E3C"/><stop offset="1" stop-color="#4A2F1E"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#312E81"/><stop offset="1" stop-color="#9D174D"/></linearGradient>`;

// =====================================================================
const CARDS = [
  { n: 1, key: 'language', theme: 'Language', accent: '#F7A04B', title: ['Policy terms are', 'hard to understand'],
    desc: ['Residents lose confidence when', 'sharing their opinions.'], scene: scene1, defs: defs1 },
  { n: 2, key: 'time', theme: 'Time', accent: '#7FA0F5', title: ['Hard to attend', 'in-person', 'discussions'],
    desc: ['Sessions clash with', 'a busy daily life.'], scene: scene2, defs: defs2 },
  { n: 3, key: 'relevance', theme: 'Relevance', accent: '#F2B45C', title: ['Unrelated topics', 'get less attention'],
    desc: ['Topics that don\'t feel personally', 'relevant get less attention.'], scene: scene3, defs: defs3 },
  { n: 4, key: 'communication', theme: 'Communication', accent: '#C49BE0', title: ['Stuck finding the', 'right department'],
    desc: ['"Who should I send', 'my opinion to?"'], scene: scene4, defs: defs4 },
  { n: 5, key: 'channels', theme: 'Channels', accent: '#F58A80', title: ['Social media vs', 'physical channels'],
    desc: ['Newer residents rely on social media,', 'but official information is mostly', 'shared through physical channels.'], scene: scene5, defs: defs5 },
];
for (const c of CARDS) {
  const svg = frame({ ...c, scene: c.scene() });
  const f = path.join(OUT, `problem_${c.n}_${c.key}.svg`);
  fs.writeFileSync(f, svg);
  console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
}
