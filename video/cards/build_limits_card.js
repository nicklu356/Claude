// Full-frame (1920x1080) "Limitations & future work" card: sticky notes on a studio whiteboard,
// each limitation (pink) paired with the future work that answers it (green).
// Build: cd video && node cards/build_limits_card.js   -> output/problem_cards/limitations_future_work.svg
const fs = require('fs');
const path = require('path');
const { OUT, FONT_CSS, SANS, HAND, DEFS, EXTRA_DEFS, T, esc } = require('./build_problem_cards.js');

const PILLAR = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'pillar_still.png')).toString('base64');
const INK = '#1F2A44';

const PAIRS = [
  { icon: 'mic', lim: ['Speaking to a device', 'in public may feel', 'uncomfortable'],
    fut: ['Test whether residents', 'feel comfortable', 'speaking in public'] },
  { icon: 'translate', lim: ['The AI may make', 'mistakes when', 'translating'],
    fut: ['Test whether', 'translations keep', 'their meaning'] },
  { icon: 'phone', lim: ['Saving & tracking', 'an issue needs', 'a smartphone'],
    fut: ['Test whether people', 'without smartphones', 'can still use HearHere'] },
  { icon: 'council', lim: ['We didn\'t include', 'council staff in', 'our fieldwork'],
    fut: ['Learn how the council', 'would manage & answer', 'feedback, so residents', 'trust they\'re heard'] },
];

// marker-drawn icons, ~60px box centred on 0,0
const ICON = {
  mic: '<rect x="-11" y="-28" width="22" height="36" rx="11"/><path d="M-21 -2 a21 21 0 0 0 42 0 M0 19 v10 M-12 29 h24"/>',
  translate: '<path d="M-28 -24 h30 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-16 l-10 9 v-9 h-4 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6z"/><path d="M-20 -1 l7 -17 l7 17 M-17 -7 h8"/><path d="M14 -4 h12 a6 6 0 0 1 6 6 v16 a6 6 0 0 1 -6 6 h-2 v8 l-9 -8 h-9 a6 6 0 0 1 -6 -6 v-5"/><path d="M14 9 h10 M19 5 v4 M15 20 q6 -3 9 -11"/>',
  phone: '<rect x="-15" y="-28" width="30" height="56" rx="6"/><path d="M-5 20 h10"/><path d="M-26 -22 L26 24"/>',
  council: '<path d="M-30 -10 L0 -28 L30 -10z M-26 -10 v30 M-12 -10 v30 M2 -10 v30 M16 -10 v30 M28 -10 v30 M-32 22 h64"/>',
};
const icon = (k, x, y, c) => `<g transform="translate(${x} ${y}) scale(0.62)" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</g>`;

function sticky(x, y, w, h, rot, col, colTop, label, labelCol, lines, extra) {
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})">
    <g filter="url(#shadowLow)"><path d="M0 0 H${w} V${h - 10} Q${w - 4} ${h + 2} ${w - 40} ${h} H0z" fill="${col}"/></g>
    <path d="M0 0 H${w} V${h - 10} Q${w - 4} ${h + 2} ${w - 40} ${h} H0z" fill="${col}" filter="url(#paper)"/>
    <rect width="${w}" height="44" fill="${colTop}" opacity="0.5"/>
    <path d="M0 0 H${w} V${h - 10} Q${w - 4} ${h + 2} ${w - 40} ${h} H0z" fill="url(#stickyLight)"/>
    ${T(26, 36, label, { size: 17, w: 900, fill: labelCol, ls: 2.5 })}
    ${lines.map((l, i) => T(26, (lines.length > 3 ? 98 : 112) + i * 46, l, { ff: HAND, size: lines.length > 3 ? 39 : 42, w: 700, fill: INK })).join('')}
    ${extra}
  </g>`;
}

function build() {
  const W = 380, H = 268, X0 = 132, GAP = 438, YT = 318, YB = 676;
  const rotT = [-1.6, 1.2, -0.9, 1.8], rotB = [1.1, -1.4, 1.6, -1];
  const cols = PAIRS.map((p, i) => {
    const x = X0 + i * GAP;
    const top = sticky(x, YT, W, H, rotT[i], '#FFB8C6', '#F58CA3', `LIMITATION ${i + 1}`, '#9F1239', p.lim,
      icon(p.icon, W - 34, 23, '#9F1239'));
    const bot = sticky(x, YB, W, H, rotB[i], '#B5EBC8', '#7FD3A0', `FUTURE WORK ${i + 1}`, '#065F46', p.fut,
      `<rect x="${W - 50}" y="9" width="27" height="27" rx="4" fill="none" stroke="#065F46" stroke-width="3.5" transform="rotate(-4 ${W - 36} 22)"/>`);
    // hand-drawn arrow from the limitation to its future work
    const ax = x + W / 2 + (i % 2 ? 8 : -6);
    const arrow = `<g fill="none" stroke="#2B2F3A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.88">
      <path d="M${ax} ${YT + H + 14} C${ax - 10} ${YT + H + 30} ${ax + 10} ${YB - 34} ${ax} ${YB - 14}"/>
      <path d="M${ax - 14} ${YB - 30} L${ax} ${YB - 12} L${ax + 15} ${YB - 29}"/></g>`;
    return top + arrow + bot;
  }).join('');

  // ghosts of erased marker on the board
  const smudge = [
    'M180 300 q120 -40 260 10 t240 -20', 'M1180 260 q80 30 200 -10', 'M620 980 q140 -30 300 6 t260 -12',
    'M1500 640 q60 -40 140 0', 'M900 120 q60 20 140 -6',
  ].map((d) => `<path d="${d}" fill="none" stroke="#8A93A0" stroke-width="10" stroke-linecap="round" opacity="0.07" filter="url(#blur6)"/>`).join('');

  const polaroid = `<g transform="translate(1612 36) rotate(5 110 130)">
    <g filter="url(#shadow)"><rect width="220" height="262" fill="#FBFAF7"/></g>
    <rect width="220" height="262" fill="#FBFAF7" filter="url(#paper)"/>
    <svg x="14" y="14" width="192" height="192" viewBox="0 0 192 192">
      <rect width="192" height="192" fill="url(#dusk)"/>
      <ellipse cx="40" cy="70" rx="60" ry="40" fill="#F6C27A" opacity="0.35" filter="url(#blur6)"/>
      <rect y="150" width="192" height="42" fill="#6B6670"/><rect y="150" width="192" height="4" fill="#8E8994"/>
      <ellipse cx="98" cy="178" rx="44" ry="7" fill="#000" opacity="0.35" filter="url(#blur6)"/>
      <image href="${PILLAR}" x="60" y="10" width="${300 * 0.31}" height="${555 * 0.31}"/>
      <rect width="192" height="192" fill="url(#photoFade)"/>
    </svg>
    ${T(110, 240, 'our concept: HearHere', { ff: HAND, size: 27, w: 700, fill: '#374151', anchor: 'middle' })}
    <rect x="60" y="-16" width="100" height="32" fill="#EFE4C8" opacity="0.8" transform="rotate(-4 110 0)"/>
  </g>`;

  const tray = `<g filter="url(#shadowLow)"><rect x="70" y="1022" width="1780" height="34" rx="6" fill="url(#trayAlu)"/></g>
    <rect x="70" y="1022" width="1780" height="5" fill="#fff" opacity="0.6"/>
    ${[['#1F2937', 1220], ['#C0392B', 1420], ['#1D4ED8', 1600]].map(([c, x]) => `<g transform="translate(${x} 1018)" filter="url(#shadowLow)"><rect width="150" height="22" rx="10" fill="#F3F4F6"/><rect x="118" width="32" height="22" rx="8" fill="${c}"/><rect x="0" y="0" width="150" height="7" rx="4" fill="#fff" opacity="0.6"/></g>`).join('')}
    <g transform="translate(260 996)" filter="url(#shadowLow)"><rect width="170" height="48" rx="8" fill="#2B2F3A"/><rect y="34" width="170" height="14" rx="4" fill="#5B6170"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Limitations and future work</title>
<defs><style>${FONT_CSS}</style>${DEFS}${EXTRA_DEFS}
<linearGradient id="board" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FAFBFA"/><stop offset="1" stop-color="#E4E8E7"/></linearGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.35"><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="0.62" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.7" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="frameAlu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1F3F5"/><stop offset="0.5" stop-color="#B7BDC5"/><stop offset="1" stop-color="#8D949D"/></linearGradient>
<linearGradient id="trayAlu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE1E6"/><stop offset="1" stop-color="#8D949D"/></linearGradient>
<linearGradient id="stickyLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></linearGradient>
<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4A7A"/><stop offset="0.55" stop-color="#C77B6B"/><stop offset="1" stop-color="#F2B279"/></linearGradient>
<linearGradient id="photoFade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE7BF" stop-opacity="0.18"/><stop offset="1" stop-color="#3A2A1A" stop-opacity="0.18"/></linearGradient>
<radialGradient id="boardVig" cx="55%" cy="45%" r="75%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient>
</defs>
<rect width="1920" height="1080" fill="#2E2A27"/>
<rect x="14" y="10" width="1892" height="1016" rx="10" fill="url(#frameAlu)"/>
<rect x="34" y="28" width="1852" height="980" rx="4" fill="url(#board)"/>
<rect x="34" y="28" width="1852" height="980" rx="4" fill="url(#sheen)"/>
${smudge}
<rect x="34" y="28" width="1852" height="980" rx="4" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="3"/>
<g id="header">
  ${T(132, 104, 'LIMITATIONS & FUTURE WORK', { size: 22, w: 800, fill: '#C0453A', ls: 4 })}
  ${T(128, 186, 'HearHere still has limits', { size: 68, w: 900, fill: INK })}
  ${T(134, 254, '...so each one becomes something we test next', { ff: HAND, size: 50, w: 700, fill: '#D35F1A', tr: 'rotate(-1 134 254)' })}
</g>
${cols}
${polaroid}
${T(1840, 994, 'Team Sweet Potatoes · Group 14 · INFO90006 Fieldwork for Design', { size: 18, w: 800, fill: '#5B6170', op: 0.75, anchor: 'end' })}
${tray}
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" fill="url(#boardVig)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
</svg>`;
}

const svg = build();
const f = path.join(OUT, 'limitations_future_work.svg');
fs.writeFileSync(f, svg);
console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
