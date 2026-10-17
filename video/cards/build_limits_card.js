// Full-frame (1920x1080) "Limitations & future work" card, same realistic look as the problem
// cards: four photo-like panels, one per limitation, each captioned with the limitation and the
// future work that answers it.  Content only, no title.
// Build: cd video && node cards/build_limits_card.js   -> output/problem_cards/limitations_future_work.svg
const fs = require('fs');
const path = require('path');
const { OUT, FONT_CSS, HAND, DEFS, EXTRA_DEFS, T, sheet, phone } = require('./build_problem_cards.js');

let seed = 5;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const PW = 474, GAP = 8;

const PAIRS = [
  { lim: ['Speaking to a device in', 'public may feel', 'uncomfortable'],
    fut: ['Test whether residents', 'feel comfortable', 'speaking in public'] },
  { lim: ['The AI may make', 'mistakes when translating'],
    fut: ['Test whether translations', 'keep their meaning'] },
  { lim: ['Saving & tracking an', 'issue needs a smartphone'],
    fut: ['Test whether people without', 'smartphones can still', 'use HearHere'] },
  { lim: ['We didn\'t include council', 'staff in our fieldwork'],
    fut: ['Learn how the council', 'manages feedback, so', 'residents trust they\'re heard'] },
];

// blurred passer-by silhouette
const person = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><circle cx="0" cy="-200" r="24"/><rect x="-34" y="-172" width="68" height="150" rx="28"/><rect x="-28" y="-40" width="24" height="120" rx="10"/><rect x="4" y="-40" width="24" height="120" rx="10"/></g>`;
// the HearHere mascot head (Spud) on top of the console
const spud = (x, y, r) => `<g transform="translate(${x} ${y})">
  <path d="M${-r * 0.8} ${-r * 0.45} L${-r * 0.7} ${-r * 1.25} L${-r * 0.2} ${-r * 0.85}z M${r * 0.8} ${-r * 0.45} L${r * 0.7} ${-r * 1.25} L${r * 0.2} ${-r * 0.85}z" fill="#8A5BB0"/>
  <path d="M${-r * 0.66} ${-r * 0.6} L${-r * 0.62} ${-r * 1.05} L${-r * 0.32} ${-r * 0.82}z M${r * 0.66} ${-r * 0.6} L${r * 0.62} ${-r * 1.05} L${r * 0.32} ${-r * 0.82}z" fill="#F4B6D2"/>
  <circle r="${r}" fill="url(#spudSkin)"/>
  <rect x="${-r * 0.62}" y="${-r * 0.28}" width="${r * 1.24}" height="${r * 0.62}" rx="${r * 0.3}" fill="#1A1530"/>
  <ellipse cx="${-r * 0.27}" cy="${r * 0.03}" rx="${r * 0.1}" ry="${r * 0.15}" fill="#7FF0FF"/><ellipse cx="${r * 0.27}" cy="${r * 0.03}" rx="${r * 0.1}" ry="${r * 0.15}" fill="#7FF0FF"/>
  <ellipse cx="${-r * 0.35}" cy="${-r * 0.55}" rx="${r * 0.28}" ry="${r * 0.14}" fill="#fff" opacity="0.35" transform="rotate(-25 ${-r * 0.35} ${-r * 0.55})"/></g>`;

// 1. speaking in public: the pillar's talk screen, a busy street behind
function panel1() {
  seed = 11;
  const shops = [[-20, 150, 170, '#8C7B6B'], [150, 110, 180, '#A2927F'], [330, 160, 170, '#6F6359']].map(([x, y, w, c]) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${560 - y}" fill="${c}"/>${Array.from({ length: 6 }, (_, k) => `<rect x="${x + 18 + (k % 3) * 50}" y="${y + 30 + Math.floor(k / 3) * 80}" width="34" height="50" fill="#F1E3C6" opacity="0.6"/>`).join('')}<rect x="${x}" y="430" width="${w}" height="26" fill="${['#B5543C', '#2F6B5E', '#C9A04A'][Math.floor(rnd() * 3)]}"/><rect x="${x + 10}" y="456" width="${w - 20}" height="104" fill="#FFE2A8" opacity="0.55"/>`).join('');
  const crowd = [[30, 760, 1.25, '#2B2F3A'], [120, 720, 1.05, '#5A4A42'], [360, 750, 1.2, '#3E5A7A'], [430, 700, 0.9, '#6B4E3D'], [250, 690, 0.8, '#4A4F5C'], [190, 760, 1.3, '#7A3E3E']]
    .map(([x, y, s, c]) => person(x, y, s, c)).join('');
  const grille = Array.from({ length: 30 }, (_, k) => `<circle cx="${172 + (k % 10) * 14}" cy="${508 + Math.floor(k / 10) * 14}" r="3.4" fill="#0B0D14"/>`).join('');
  return `<g filter="url(#blurBg)"><rect width="${PW}" height="560" fill="url(#overcast)"/>${shops}<rect y="560" width="${PW}" height="520" fill="url(#pave)"/>${crowd}</g>
  <rect width="${PW}" height="1080" fill="#1A1410" opacity="0.15"/>
  <g filter="url(#shadow)">
    ${spud(237, 120, 82)}
    <path d="M92 196 H382 L424 660 H50z" fill="url(#console)"/>
    <path d="M92 196 H382" stroke="#fff" stroke-opacity="0.25" stroke-width="3"/>
    <rect x="114" y="226" width="246" height="246" rx="18" fill="#0B0D14"/>
    <rect x="124" y="236" width="226" height="226" rx="12" fill="#FFF7EE"/>
    ${T(237, 278, 'Speak to Spud', { size: 23, w: 900, fill: '#2B1708', anchor: 'middle' })}
    ${T(237, 302, 'Hold to talk', { size: 14, w: 800, fill: '#8A6A55', anchor: 'middle' })}
    <circle cx="237" cy="384" r="70" fill="#F26B1D" opacity="0.12"/><circle cx="237" cy="384" r="56" fill="#F26B1D" opacity="0.2"/>
    <circle cx="237" cy="384" r="42" fill="#F26B1D"/>
    <g transform="translate(237 384)" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"><rect x="-8" y="-20" width="16" height="26" rx="8"/><path d="M-15 -2 a15 15 0 0 0 30 0 M0 13 v7"/></g>
    <rect x="124" y="236" width="226" height="226" rx="12" fill="url(#glass)"/>
    ${grille}
    <rect x="150" y="574" width="174" height="44" rx="12" fill="#F26B1D"/>
    <g transform="translate(237 596)" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"><path d="M-6 -10 a14 14 0 0 1 0 20 M2 -15 a21 21 0 0 1 0 30 M10 -20 a28 28 0 0 1 0 40"/></g>
  </g>
  ${T(300, 166, 'um... everyone', { ff: HAND, size: 29, w: 700, fill: '#FFF7EE', tr: 'rotate(-6 300 166)' })}
  ${T(312, 198, 'can hear me?', { ff: HAND, size: 29, w: 700, fill: '#FFF7EE', tr: 'rotate(-6 312 198)' })}`;
}

// 2. translation mistakes: the AI summary changes what the resident meant
function panel2() {
  seed = 23;
  const bokeh = Array.from({ length: 22 }, () => `<circle cx="${rnd() * PW}" cy="${rnd() * 700}" r="${20 + rnd() * 50}" fill="${['#F6B36B', '#FFD9A0', '#E07A4F', '#FFF0C8'][Math.floor(rnd() * 4)]}" opacity="${0.15 + rnd() * 0.3}"/>`).join('');
  const ph = phone(72, 28, 330, 660, -3, (w, h) => `
    <rect width="${w}" height="${h}" fill="#FFF7EE"/>
    <rect width="${w}" height="112" fill="#F26B1D"/>
    ${T(20, 84, 'Your comment', { size: 22, w: 900, fill: '#2B1708' })}
    ${T(20, 148, 'YOU SAID', { size: 13, w: 900, fill: '#8A6A55', ls: 2 })}
    <rect x="16" y="160" width="${w - 32}" height="104" rx="14" fill="#fff"/>
    ${T(30, 196, '"Please keep my morning', { size: 17, w: 800, fill: '#2B1708' })}
    ${T(30, 222, 'time for walking my dog."', { size: 17, w: 800, fill: '#2B1708' })}
    ${T(30, 250, 'translated from Mandarin', { size: 12, w: 800, fill: '#8A6A55' })}
    ${T(20, 306, 'AI SUMMARY FOR COUNCIL', { size: 13, w: 900, fill: '#8A6A55', ls: 2 })}
    <rect x="16" y="318" width="${w - 32}" height="104" rx="14" fill="#fff" stroke="#E0544B" stroke-width="2.5"/>
    ${T(30, 354, 'Resident wants dogs', { size: 17, w: 800, fill: '#2B1708' })}
    ${T(30, 380, 'walked every morning.', { size: 17, w: 800, fill: '#2B1708' })}
    <path d="M30 388 q6 5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#E0544B" stroke-width="2.5"/>
    <g transform="translate(16 440)"><rect width="${w - 32}" height="52" rx="26" fill="#FDE2DF"/>
      <path d="M26 36 L38 14 L50 36z" fill="none" stroke="#B42318" stroke-width="3" stroke-linejoin="round"/><path d="M38 22 v7 M38 32 v1" stroke="#B42318" stroke-width="3" stroke-linecap="round"/>
      ${T(62, 32, 'Meaning changed?', { size: 17, w: 900, fill: '#B42318' })}</g>
    <rect x="16" y="516" width="${(w - 44) / 2}" height="50" rx="25" fill="none" stroke="#2B1708" stroke-width="2"/>${T(16 + (w - 44) / 4, 547, 'Edit', { size: 17, w: 900, fill: '#2B1708', anchor: 'middle' })}
    <rect x="${28 + (w - 44) / 2}" y="516" width="${(w - 44) / 2}" height="50" rx="25" fill="#F26B1D"/>${T(28 + (w - 44) * 0.75, 547, 'Send', { size: 17, w: 900, fill: '#2B1708', anchor: 'middle' })}`);
  return `<rect width="${PW}" height="1080" fill="url(#cafe)"/><g filter="url(#blurBg)">${bokeh}</g>${ph}`;
}

// 3. no smartphone: the NFC pad next to an old keypad phone
function panel3() {
  seed = 37;
  const lights = Array.from({ length: 14 }, () => `<circle cx="${rnd() * PW}" cy="${60 + rnd() * 380}" r="${10 + rnd() * 26}" fill="${['#FFD38A', '#FFE9C2', '#9EC5FF'][Math.floor(rnd() * 3)]}" opacity="${0.35 + rnd() * 0.4}"/>`).join('');
  const keys = Array.from({ length: 12 }, (_, k) => {
    const cx = 34 + (k % 3) * 41, cy = 168 + Math.floor(k / 3) * 30;
    return `<rect x="${cx - 16}" y="${cy - 11}" width="32" height="22" rx="8" fill="url(#key)"/>${T(cx, cy + 6, '123456789*0#'[k], { size: 13, w: 900, fill: '#1F2937', anchor: 'middle' })}`;
  }).join('');
  return `<rect width="${PW}" height="1080" fill="url(#dusk3)"/><g filter="url(#blurBg)">${lights}<rect y="520" width="${PW}" height="560" fill="#2A2F3E"/></g>
  <g filter="url(#shadow)">
    <path d="M40 90 H434 V700 H40z" fill="url(#console)"/>
    <rect x="40" y="90" width="394" height="6" fill="#fff" opacity="0.18"/>
    <rect x="86" y="130" width="302" height="170" rx="26" fill="#F26B1D"/>
    <rect x="86" y="130" width="302" height="60" rx="26" fill="#fff" opacity="0.18"/>
    <g transform="translate(237 215)" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M-30 -24 a34 34 0 0 1 0 48 M-12 -38 a54 54 0 0 1 0 76 M6 -52 a74 74 0 0 1 0 104"/></g>
    ${T(237, 348, 'Tap your phone to', { size: 22, w: 900, fill: '#FFF7EE', anchor: 'middle' })}
    ${T(237, 376, 'save & track this issue', { size: 22, w: 900, fill: '#FFF7EE', anchor: 'middle' })}
  </g>
  <g transform="translate(250 418) rotate(-14 70 140) scale(0.85)" filter="url(#shadow)">
    <rect width="150" height="290" rx="30" fill="url(#oldPhone)"/>
    <rect x="3" y="3" width="144" height="284" rx="28" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="2"/>
    <rect x="46" y="18" width="58" height="6" rx="3" fill="#111"/>
    <rect x="20" y="38" width="110" height="86" rx="6" fill="#8FB8C9"/>
    <rect x="20" y="38" width="110" height="86" rx="6" fill="url(#glass)"/>
    ${T(75, 82, '08:12', { size: 24, w: 900, fill: '#173042', anchor: 'middle' })}${T(75, 106, 'No NFC', { size: 12, w: 900, fill: '#173042', anchor: 'middle' })}
    <rect x="44" y="134" width="62" height="18" rx="9" fill="url(#key)"/>
    ${keys}
  </g>`;
}

// 4. council side: a tray overflowing with resident feedback
function panel4() {
  const sheets = Array.from({ length: 9 }, (_, k) => `<g transform="translate(${92 + (k % 3) * 6 - 6} ${230 + k * 13}) rotate(${(k % 2 ? 1 : -1) * (1 + k % 4)} 150 100)"><rect width="290" height="230" fill="${k % 3 === 1 ? '#F6F1E4' : '#FFFFFF'}" filter="url(#paper)"/><rect width="290" height="1.5" fill="#000" opacity="0.08"/></g>`).join('');
  const top = `<g transform="translate(96 214) rotate(-3 145 110)" filter="url(#shadowLow)">${sheet(290, 220, '#FFFFFF', `
      ${T(20, 36, 'RESIDENT FEEDBACK', { size: 16, w: 900, fill: '#22344D', ls: 2 })}
      ${T(20, 58, 'Ref #1284 · Park rules', { size: 13, w: 800, fill: '#6B7280' })}
      ${[80, 98, 116, 134, 152].map((y, i) => `<rect x="20" y="${y}" width="${[230, 200, 240, 170, 210][i]}" height="6" rx="3" fill="#9CA3AF" opacity="0.5"/>`).join('')}
      <g transform="translate(160 170) rotate(-12)"><rect x="-70" y="-24" width="140" height="44" rx="6" fill="none" stroke="#C0392B" stroke-width="4" opacity="0.85"/>${T(0, 8, 'RECEIVED', { size: 22, w: 900, fill: '#C0392B', anchor: 'middle', ls: 2, op: 0.85 })}</g>`)}</g>`;
  const blinds = Array.from({ length: 14 }, (_, k) => `<rect x="70" y="${40 + k * 24}" width="334" height="14" fill="#FFFFFF" opacity="0.75"/>`).join('');
  return `<rect width="${PW}" height="1080" fill="url(#office)"/>
  <g filter="url(#blurBg)"><rect x="60" y="30" width="354" height="350" fill="#BFD6EA"/>${blinds}<rect x="320" y="300" width="160" height="300" rx="30" fill="#2B2F3A" opacity="0.7"/></g>
  <rect y="560" width="${PW}" height="520" fill="url(#deskTop)"/>
  <rect y="560" width="${PW}" height="4" fill="#fff" opacity="0.3"/>
  <ellipse cx="240" cy="640" rx="210" ry="22" fill="#000" opacity="0.3" filter="url(#blur6)"/>
  ${sheets}${top}
  <g filter="url(#shadowLow)"><path d="M56 420 H424 L410 640 H70z" fill="url(#tray)"/></g>
  <path d="M56 420 H424" stroke="#fff" stroke-opacity="0.3" stroke-width="3"/>
  ${T(176, 540, 'FEEDBACK', { size: 22, w: 900, fill: '#9CA3AF', anchor: 'middle', ls: 6, op: 0.7 })}
  <g transform="translate(300 446) rotate(6)" filter="url(#shadowLow)"><rect width="150" height="140" fill="#FFE768"/><rect width="150" height="22" fill="#000" opacity="0.05"/>
    ${T(14, 62, 'who replies?', { ff: HAND, size: 30, w: 700, fill: '#1E3A8A' })}${T(14, 100, 'when?', { ff: HAND, size: 30, w: 700, fill: '#1E3A8A' })}</g>`;
}

function caption(p, i) {
  const lh = 35;
  let y = 700;
  let out = `${T(34, y, 'LIMITATION', { size: 17, w: 900, fill: '#F58A80', ls: 3 })}`;
  y += 42;
  out += p.lim.map((l, k) => T(34, y + k * lh, l, { size: 27, w: 800, fill: '#FFF7EE' })).join('');
  y += 2 * lh + 34;   // same height for every panel so the future-work rows line up
  out += `<g fill="none" stroke="#6FD0C0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M44 ${y} v26"/><path d="M35 ${y + 18} l9 9 l9 -9"/></g>`;
  y += 64;
  out += T(34, y, 'FUTURE WORK', { size: 17, w: 900, fill: '#6FD0C0', ls: 3 });
  y += 42;
  out += p.fut.map((l, k) => T(34, y + k * lh, l, { size: 27, w: 800, fill: '#FFF7EE', op: 0.9 })).join('');
  return `<g transform="translate(34 40)"><circle r="24" fill="#140D08" opacity="0.75"/>${T(0, 9, String(i + 1), { size: 24, w: 900, fill: '#FFF7EE', anchor: 'middle' })}</g>${out}`;
}

function build() {
  const scenes = [panel1, panel2, panel3, panel4];
  const panels = PAIRS.map((p, i) => {
    const x = i * (PW + GAP);
    return `<svg x="${x}" y="0" width="${PW}" height="1080" viewBox="0 0 ${PW} 1080" overflow="hidden">
      ${scenes[i]()}
      <rect width="${PW}" height="1080" fill="url(#capShade)"/>
      <rect width="${PW}" height="1080" fill="url(#panelVig)"/>
      ${caption(p, i)}</svg>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<title>Limitations and future work</title>
<defs><style>${FONT_CSS}</style>${DEFS}${EXTRA_DEFS}
<filter id="blurBg" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
<linearGradient id="capShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#140D08" stop-opacity="0"/><stop offset="0.63" stop-color="#140D08" stop-opacity="0.9"/><stop offset="1" stop-color="#140D08" stop-opacity="0.97"/></linearGradient>
<radialGradient id="panelVig" cx="50%" cy="35%" r="80%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
<linearGradient id="overcast" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C3D1DE"/><stop offset="1" stop-color="#EEF2F5"/></linearGradient>
<linearGradient id="pave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A39D95"/><stop offset="1" stop-color="#5E5A55"/></linearGradient>
<linearGradient id="console" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1A1D2B"/><stop offset="0.35" stop-color="#363B55"/><stop offset="0.6" stop-color="#262A3E"/><stop offset="1" stop-color="#14161F"/></linearGradient>
<radialGradient id="spudSkin" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#C7A2E6"/><stop offset="0.6" stop-color="#8A5BB0"/><stop offset="1" stop-color="#4E2D6E"/></radialGradient>
<linearGradient id="cafe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2618"/><stop offset="1" stop-color="#1C120B"/></linearGradient>
<linearGradient id="dusk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C3A66"/><stop offset="0.5" stop-color="#6A5A86"/><stop offset="1" stop-color="#2A2F3E"/></linearGradient>
<linearGradient id="oldPhone" x1="0" x2="1"><stop offset="0" stop-color="#5B616B"/><stop offset="0.2" stop-color="#3A3F47"/><stop offset="0.8" stop-color="#2A2E35"/><stop offset="1" stop-color="#4A5058"/></linearGradient>
<linearGradient id="key" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F4F6"/><stop offset="1" stop-color="#B8BEC7"/></linearGradient>
<linearGradient id="office" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9E1E8"/><stop offset="1" stop-color="#A9B4C0"/></linearGradient>
<linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B49A"/><stop offset="1" stop-color="#8C765C"/></linearGradient>
<linearGradient id="tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3F47"/><stop offset="1" stop-color="#16181C"/></linearGradient>
</defs>
<rect width="1920" height="1080" fill="#0E0907"/>
${panels}
<rect width="1920" height="1080" fill="url(#warmLight)"/>
<rect width="1920" height="1080" filter="url(#grain)"/>
</svg>`;
}

const svg = build();
const f = path.join(OUT, 'limitations_future_work.svg');
fs.writeFileSync(f, svg);
console.log('wrote', f, (svg.length / 1024).toFixed(0) + ' KB');
