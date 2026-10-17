// Full-frame (1920x1080) "Limitations & future work" card, same realistic look as the problem
// cards: index cards on a wooden desk, each limitation (left) paired with the future work that
// answers it (right).  Content only, no title.
// Build: cd video && node cards/build_limits_card.js   -> output/problem_cards/limitations_future_work.svg
const fs = require('fs');
const path = require('path');
const { OUT, FONT_CSS, DEFS, EXTRA_DEFS, T, defs1 } = require('./build_problem_cards.js');

const INK = '#1F2937';
const PAIRS = [
  { icon: 'mic', lim: ['Speaking to a device in public', 'may feel uncomfortable'],
    fut: ['Test whether residents feel', 'comfortable speaking in public'] },
  { icon: 'translate', lim: ['The AI may make mistakes', 'when translating'],
    fut: ['Test whether translations', 'keep their meaning'] },
  { icon: 'phone', lim: ['Saving & tracking an issue', 'needs a smartphone'],
    fut: ['Test whether people without', 'smartphones can still use HearHere'] },
  { icon: 'council', lim: ['We didn\'t include council', 'staff in our fieldwork'],
    fut: ['Learn how the council manages feedback,', 'so residents trust they\'re heard'] },
];

// marker-drawn icons, ~60px box centred on 0,0
const ICON = {
  mic: '<rect x="-11" y="-28" width="22" height="36" rx="11"/><path d="M-21 -2 a21 21 0 0 0 42 0 M0 19 v10 M-12 29 h24"/>',
  translate: '<path d="M-28 -24 h30 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-16 l-10 9 v-9 h-4 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6z"/><path d="M-20 -1 l7 -17 l7 17 M-17 -7 h8"/><path d="M14 -4 h12 a6 6 0 0 1 6 6 v16 a6 6 0 0 1 -6 6 h-2 v8 l-9 -8 h-9 a6 6 0 0 1 -6 -6 v-5"/><path d="M14 9 h10 M19 5 v4 M15 20 q6 -3 9 -11"/>',
  phone: '<rect x="-15" y="-28" width="30" height="56" rx="6"/><path d="M-5 20 h10"/><path d="M-26 -22 L26 24"/>',
  council: '<path d="M-30 -10 L0 -28 L30 -10z M-26 -10 v30 M-12 -10 v30 M2 -10 v30 M16 -10 v30 M28 -10 v30 M-32 22 h64"/>',
};

// a ruled index card; text sits on the blue lines
function card(x, y, w, h, rot, o) {
  const rules = [100, 142].map((ry) => `<rect x="0" y="${ry + 8}" width="${w}" height="1.6" fill="${o.rule}" opacity="0.55"/>`).join('');
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})">
    <g filter="url(#shadow)"><rect width="${w}" height="${h}" rx="4" fill="${o.bg}"/></g>
    <rect width="${w}" height="${h}" rx="4" fill="${o.bg}" filter="url(#paper)"/>
    ${rules}<rect x="0" y="56" width="${w}" height="2.4" fill="${o.line}" opacity="0.8"/>
    <rect width="${w}" height="${h}" rx="4" fill="url(#paperShade)"/>
    ${T(34, 40, o.label, { size: 18, w: 900, fill: o.labelCol, ls: 3 })}
    ${o.lines.map((l, i) => T(34, 100 + i * 42, l, { size: 32, w: 800, fill: INK })).join('')}
    ${o.extra || ''}
  </g>`;
}

function build() {
  const W = 790, H = 180, GAP = 50, Y0 = Math.round((1080 - (4 * H + 3 * GAP)) / 2);
  const XL = 100, XR = 1920 - 100 - W;
  const rotL = [-1.1, 0.8, -0.6, 1], rotR = [0.8, -0.9, 1.1, -0.6];
  const rows = PAIRS.map((p, i) => {
    const y = Y0 + i * (H + GAP), mid = y + H / 2;
    const lim = card(XL, y, W, H, rotL[i], { bg: '#FCFBF7', rule: '#9DBBE3', line: '#E0544B', label: `LIMITATION ${i + 1}`, labelCol: '#B42318', lines: p.lim,
      extra: `<g transform="translate(${W - 50} 30) scale(0.6)" fill="none" stroke="#B42318" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${ICON[p.icon]}</g>` });
    const fut = card(XR, y, W, H, rotR[i], { bg: '#E9F5EE', rule: '#93C7B8', line: '#1E9B8A', label: `FUTURE WORK ${i + 1}`, labelCol: '#0F766E', lines: p.fut,
      extra: `<rect x="${W - 66}" y="16" width="30" height="30" rx="5" fill="none" stroke="#0F766E" stroke-width="3.5" transform="rotate(-3 ${W - 51} 31)"/>` });
    const badge = `<g transform="translate(960 ${mid})" filter="url(#shadowLow)"><circle r="36" fill="#FFF7EE"/>
      <g fill="none" stroke="#0F766E" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"><path d="M-16 0 H15"/><path d="M4 -12 L16 0 L4 12"/></g></g>`;
    return lim + badge + fut;
  }).join('');
  const planks = [0, 290, 610, 905].map((py) => `<rect x="0" y="${py - 2}" width="1920" height="4" fill="#1E1008" opacity="0.55"/><rect x="0" y="${py + 2}" width="1920" height="1.5" fill="#F4C68C" opacity="0.18"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Limitations and future work</title>
<defs><style>${FONT_CSS}</style>${DEFS}${EXTRA_DEFS}${defs1}
<radialGradient id="deskVig" cx="50%" cy="50%" r="72%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>
</defs>
<rect width="1920" height="1080" filter="url(#wood1)"/>${planks}
<rect width="1920" height="1080" fill="#1A0F08" opacity="0.18"/>
${rows}
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" fill="url(#deskVig)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
</svg>`;
}

const svg = build();
const f = path.join(OUT, 'limitations_future_work.svg');
fs.writeFileSync(f, svg);
console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
