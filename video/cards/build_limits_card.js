// Full-frame (1920x1080) "Limitations & future work" card: text only, on the same dark warm
// background as the problem cards' text panel.  Each limitation (left) points to the future work
// that answers it (right).  No title, no pictures.
// Build: cd video && node cards/build_limits_card.js   -> output/problem_cards/limitations_future_work.svg
const fs = require('fs');
const path = require('path');
const { OUT, FONT_CSS, DEFS, T } = require('./build_problem_cards.js');

const CORAL = '#F58A80', TEAL = '#6FD0C0', CREAM = '#FFF7EE';
const PAIRS = [
  { lim: ['Speaking to a device in public', 'may feel uncomfortable'],
    fut: ['Test whether residents feel', 'comfortable speaking in public'] },
  { lim: ['The AI may make mistakes', 'when translating'],
    fut: ['Test whether translations', 'keep their meaning'] },
  { lim: ['Saving & tracking an issue', 'needs a smartphone'],
    fut: ['Test whether people without', 'smartphones can still use HearHere'] },
  { lim: ['We didn\'t include council', 'staff in our fieldwork'],
    fut: ['Learn how the council manages feedback,', 'so residents trust they\'re heard'] },
];

function build() {
  const X_NUM = 130, X_LIM = 270, X_ARR = 945, X_FUT = 1046, ROW = 196, Y0 = 232;
  const head = `${T(X_LIM, 168, 'LIMITATION', { size: 22, w: 900, fill: CORAL, ls: 5 })}
    ${T(X_FUT, 168, 'FUTURE WORK', { size: 22, w: 900, fill: TEAL, ls: 5 })}
    <rect x="${X_NUM}" y="196" width="${1920 - 2 * X_NUM}" height="2" fill="${CREAM}" opacity="0.22"/>`;
  const rows = PAIRS.map((p, i) => {
    const top = Y0 + i * ROW, mid = top + ROW / 2;
    const lines = (ls, x, op) => ls.map((l, k) => T(x, mid - 10 + k * 50, l, { size: 37, w: 800, fill: CREAM, op })).join('');
    return `${T(X_NUM, mid + 22, String(i + 1).padStart(2, '0'), { size: 64, w: 900, fill: CORAL })}
      ${lines(p.lim, X_LIM, 1)}
      <g fill="none" stroke="${TEAL}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M${X_ARR - 34} ${mid} H${X_ARR + 30}"/><path d="M${X_ARR + 14} ${mid - 15} L${X_ARR + 30} ${mid} L${X_ARR + 14} ${mid + 15}"/></g>
      ${lines(p.fut, X_FUT, 0.92)}
      ${i < PAIRS.length - 1 ? `<rect x="${X_NUM}" y="${top + ROW}" width="${1920 - 2 * X_NUM}" height="1.5" fill="${CREAM}" opacity="0.1"/>` : ''}`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Limitations and future work</title>
<defs><style>${FONT_CSS}</style>${DEFS}
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22170F"/><stop offset="1" stop-color="#110A06"/></linearGradient>
</defs>
<rect width="1920" height="1080" fill="url(#bg)"/>
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" fill="url(#vignette)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
${head}${rows}
</svg>`;
}

const svg = build();
const f = path.join(OUT, 'limitations_future_work.svg');
fs.writeFileSync(f, svg);
console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
