// Full-frame (1920x1080) "Limitations & future work" card in the same style as the problem cards:
// text on a dark gradient on the left, a realistic scene on the right (a test-plan sheet on a
// clipboard, each limitation paired with the future work that answers it).
// Build: cd video && node cards/build_limits_card.js   -> output/problem_cards/limitations_future_work.svg
const fs = require('fs');
const path = require('path');
const { OUT, FONT_CSS, HAND, DEFS, EXTRA_DEFS, T, sheet, defs1 } = require('./build_problem_cards.js');

const ACCENT = '#6FD0C0';
const RED = '#B42318', TEAL = '#0F766E', INK = '#1F2937';
const PAIRS = [
  { lim: ['Speaking to a device in', 'public may feel', 'uncomfortable'],
    fut: ['Test whether residents', 'feel comfortable', 'speaking in public'] },
  { lim: ['The AI may make', 'mistakes when translating'],
    fut: ['Test whether translations', 'keep their meaning'] },
  { lim: ['Saving & tracking an', 'issue needs a smartphone'],
    fut: ['Test whether people', 'without smartphones can', 'still use HearHere'] },
  { lim: ['We didn\'t include council', 'staff in our fieldwork'],
    fut: ['Learn how the council', 'manages & answers', 'feedback, so residents', 'trust they\'re heard'] },
];

function plan() {
  const PW = 900, ROW = 172, R0 = 236;
  const rows = PAIRS.map((p, i) => {
    const y = R0 + i * ROW, mid = y + ROW / 2;
    const block = (lines, x) => {
      const lh = 33, y0 = mid - ((lines.length - 1) * lh) / 2 + 9;
      return lines.map((l, k) => T(x, y0 + k * lh, l, { size: 25, w: 700, fill: INK })).join('');
    };
    return `${i ? `<rect x="40" y="${y}" width="${PW - 80}" height="1.5" fill="#CBD2DC"/>` : ''}
      <circle cx="66" cy="${mid}" r="19" fill="${RED}" opacity="0.12"/>${T(66, mid + 8, String(i + 1), { size: 22, w: 900, fill: RED, anchor: 'middle' })}
      ${block(p.lim, 100)}
      <g fill="none" stroke="${TEAL}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
        <path d="M442 ${mid + 2} q22 -6 50 -1"/><path d="M482 ${mid - 9} l12 9 l-12 10"/></g>
      ${block(p.fut, 520)}
      <rect x="848" y="${mid - 15}" width="28" height="28" rx="5" fill="none" stroke="${TEAL}" stroke-width="3"/>`;
  }).join('');
  return sheet(PW, 950, '#FBF9F4', `
    ${T(40, 70, 'HearHere · what we test next', { size: 32, w: 900, fill: '#22344D' })}
    ${T(40, 104, 'Each limitation we found, paired with the future work that answers it', { size: 18, w: 700, fill: '#6B7280' })}
    <rect x="40" y="132" width="${PW - 80}" height="2" fill="#22344D" opacity="0.6"/>
    <rect x="40" y="160" width="380" height="44" rx="10" fill="${RED}" opacity="0.1"/>${T(58, 190, 'LIMITATION', { size: 18, w: 900, fill: RED, ls: 3 })}
    <rect x="510" y="160" width="350" height="44" rx="10" fill="${TEAL}" opacity="0.1"/>${T(528, 190, 'FUTURE WORK', { size: 18, w: 900, fill: TEAL, ls: 3 })}
    ${rows}`);
}

function scene() {
  const planks = [0, 290, 610, 905].map((py) => `<rect x="0" y="${py - 2}" width="1920" height="4" fill="#1E1008" opacity="0.55"/><rect x="0" y="${py + 2}" width="1920" height="1.5" fill="#F4C68C" opacity="0.18"/>`).join('');
  const clipboard = `<g transform="translate(900 34) rotate(-1.5 480 500)">
    <g filter="url(#shadow)"><rect width="960" height="1040" rx="26" fill="url(#hardboard)"/></g>
    <rect width="960" height="1040" rx="26" filter="url(#boardTex)" opacity="0.5"/>
    <rect x="2" y="2" width="956" height="1036" rx="24" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="3"/>
    <g transform="translate(30 70)" filter="url(#shadowLow)">${plan()}</g>
    <g filter="url(#shadowLow)">
      <rect x="320" y="18" width="320" height="96" rx="20" fill="url(#clipSteel)"/>
      <rect x="350" y="40" width="260" height="14" rx="7" fill="#000" opacity="0.18"/>
      <path d="M390 18 v-8 a12 12 0 0 1 12 -12 h156 a12 12 0 0 1 12 12 v8" fill="none" stroke="url(#clipSteel)" stroke-width="10"/>
    </g>
    <rect x="320" y="18" width="320" height="30" rx="15" fill="#fff" opacity="0.25"/>
  </g>`;
  return `<rect width="1920" height="1080" filter="url(#wood1)"/>${planks}${clipboard}`;
}

function build() {
  const x0 = 120;
  const legend = `<g transform="translate(${x0} 820)">
    <rect width="190" height="46" rx="23" fill="${RED}" opacity="0.9"/>${T(95, 30, 'LIMITATION', { size: 18, w: 900, fill: '#fff', anchor: 'middle', ls: 2 })}
    <g fill="none" stroke="#FFF7EE" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"><path d="M208 23 h44"/><path d="M242 13 l12 10 l-12 10"/></g>
    <rect x="272" width="210" height="46" rx="23" fill="${TEAL}"/>${T(377, 30, 'FUTURE WORK', { size: 18, w: 900, fill: '#fff', anchor: 'middle', ls: 2 })}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Limitations and future work</title>
<defs><style>${FONT_CSS}</style>${DEFS}${EXTRA_DEFS}${defs1}
<linearGradient id="textShadeL" x1="0" x2="1" y1="0" y2="0">
  <stop offset="0" stop-color="#140D08" stop-opacity="0.96"/><stop offset="0.3" stop-color="#140D08" stop-opacity="0.9"/>
  <stop offset="0.4" stop-color="#140D08" stop-opacity="0.5"/><stop offset="0.47" stop-color="#140D08" stop-opacity="0"/>
</linearGradient>
<linearGradient id="hardboard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9A6A3C"/><stop offset="0.5" stop-color="#7C512B"/><stop offset="1" stop-color="#5E3B1E"/></linearGradient>
<filter id="boardTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="8"/><feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0.55 0"/></filter>
<linearGradient id="clipSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F4F6"/><stop offset="0.45" stop-color="#A9AFB8"/><stop offset="0.55" stop-color="#C9CED5"/><stop offset="1" stop-color="#6B7280"/></linearGradient>
</defs>
<g id="scene">${scene()}</g>
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" fill="url(#vignette)"/>
<rect width="1920" height="1080" fill="url(#textShadeL)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
<g id="text">
  ${T(x0, 132, 'LIMITATIONS & FUTURE WORK', { size: 22, w: 800, fill: '#FFF7EE', op: 0.72, ls: 4 })}
  <rect x="${x0}" y="160" width="64" height="7" rx="3.5" fill="${ACCENT}"/>
  ${T(x0, 330, 'HONEST REFLECTION', { size: 30, w: 900, fill: ACCENT, ls: 7 })}
  ${T(x0, 430, 'HearHere', { size: 70, w: 900, fill: '#FFF7EE' })}
  ${T(x0, 510, 'still has limits', { size: 70, w: 900, fill: '#FFF7EE' })}
  <rect x="${x0}" y="564" width="96" height="7" rx="3.5" fill="${ACCENT}"/>
  ${['So each limitation becomes', 'something we need to', 'test next.'].map((l, i) => T(x0, 636 + i * 48, l, { size: 33, w: 700, fill: '#FFF7EE', op: 0.84 })).join('')}
  ${legend}
  ${T(x0, 1012, 'Team Sweet Potatoes · Group 14 · INFO90006 Fieldwork for Design', { size: 20, w: 800, fill: '#FFF7EE', op: 0.5 })}
</g>
</svg>`;
}

const svg = build();
const f = path.join(OUT, 'limitations_future_work.svg');
fs.writeFileSync(f, svg);
console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
