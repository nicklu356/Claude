// Flat-vector 2D art for the POTATO concept video.  Every builder returns an
// SVG <g> element whose moving parts are exposed as properties, so scenes can
// pose them per frame with plain transform attributes (deterministic).
export const C = {
  purple: '#7B4B94', purpleD: '#5A3370', purpleL: '#EDE3F3', purpleM: '#9C6DB8',
  orange: '#F28C28', orangeD: '#C96A10', orangeL: '#FFE6CC',
  green: '#4CAF50', greenD: '#2E7D32', greenL: '#E3F2E1',
  cream: '#FFF4E0', navy: '#1F2A44', navy2: '#46506A', red: '#E0544B',
  skin: '#F2C6A0', skinD: '#DFA67E', hair: '#22202A', hoodie: '#4F7DF3', hoodieD: '#3A63D1',
  pants: '#2F3B5C', shoe: '#F7F7F7', sky1: '#9FD3F2', sky2: '#DDF1FB',
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

// shared <defs>: gradients and soft shadow filter
export function defs() {
  return svgEl('defs', {}, `
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CCBF0"/><stop offset=".7" stop-color="#D8EFFA"/><stop offset="1" stop-color="#FFF4E0"/></linearGradient>
    <linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A5E"/><stop offset=".55" stop-color="#8E4D86"/><stop offset="1" stop-color="#F59A4A"/></linearGradient>
    <linearGradient id="gBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9E2EE"/><stop offset=".35" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D8CCE0"/></linearGradient>
    <linearGradient id="gHead" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A57CC0"/><stop offset=".6" stop-color="#7B4B94"/><stop offset="1" stop-color="#5A3370"/></linearGradient>
    <linearGradient id="gCap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A3F84"/><stop offset=".4" stop-color="#8F5FAA"/><stop offset="1" stop-color="#5A3370"/></linearGradient>
    <linearGradient id="gScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset="1" stop-color="#FFE2BC"/></linearGradient>
    <linearGradient id="gWrap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3557"/><stop offset="1" stop-color="#1F2A44"/></linearGradient>
    <radialGradient id="gGlow"><stop offset="0" stop-color="#FFD58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
    <filter id="fSh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1F2A44" flood-opacity=".18"/></filter>
  `);
}

// ------------------------------------------------------------------ Jason
// Origin = between the feet on the ground; ~520 units tall; faces right.
export function jason() {
  const root = g(`<ellipse cx="10" cy="4" rx="90" ry="14" fill="#1F2A44" opacity=".14"/>`);
  const legB = g(`<rect x="-24" y="0" width="46" height="215" rx="22" fill="#26304C"/>
    <path d="M-26 200 h62 a20 20 0 0 1 20 20 v6 h-82z" fill="#E6E6EA"/><rect x="-26" y="222" width="82" height="8" rx="4" fill="#B9BCC8"/>`);
  const legF = g(`<rect x="-24" y="0" width="46" height="215" rx="22" fill="${C.pants}"/>
    <path d="M-26 200 h62 a20 20 0 0 1 20 20 v6 h-82z" fill="${C.shoe}"/><rect x="-26" y="222" width="82" height="8" rx="4" fill="#C9CCD6"/>`);
  const armB = g(`<rect x="-21" y="-6" width="42" height="160" rx="21" fill="${C.hoodieD}"/><circle cx="0" cy="160" r="21" fill="${C.skinD}"/>`);
  const armF = g(`<rect x="-22" y="-6" width="44" height="160" rx="22" fill="${C.hoodie}"/><rect x="-22" y="128" width="44" height="18" rx="8" fill="${C.hoodieD}"/><circle cx="0" cy="162" r="22" fill="${C.skin}"/>`);
  const phone = g(`<rect x="-16" y="-30" width="32" height="56" rx="7" fill="#1C2133"/><rect x="-12" y="-25" width="24" height="44" rx="4" fill="#9C6DB8"/>`, { opacity: 0 });
  armF.appendChild(phone);
  const torso = g(`
    <path d="M-80 -425 q80 -34 160 0 l10 180 q-90 22 -180 0z" fill="${C.hoodie}"/>
    <path d="M-48 -428 q48 40 96 0 q-48 -22 -96 0z" fill="${C.hoodieD}"/>
    <path d="M-14 -410 l-4 50 M14 -410 l4 50" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <rect x="-52" y="-320" width="104" height="46" rx="18" fill="${C.hoodieD}" opacity=".55"/>
    <rect x="-90" y="-252" width="180" height="22" rx="10" fill="${C.hoodieD}"/>`);
  const eyes = g(`<ellipse cx="34" cy="-2" rx="7" ry="9.5" fill="${C.hair}"/><ellipse cx="-6" cy="-2" rx="6" ry="9" fill="${C.hair}"/>
    <circle cx="36" cy="-5" r="2.5" fill="#fff"/><circle cx="-4" cy="-5" r="2.2" fill="#fff"/>`);
  const brows = g(`<path d="M22 -24 q12 -7 24 -2" stroke="${C.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M-16 -23 q10 -6 20 -1" stroke="${C.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  const mouth = svgEl('path', { d: 'M8 30 q12 6 24 0', stroke: '#7A3B2E', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
  const head = g(`
    <rect x="-16" y="40" width="34" height="34" fill="${C.skinD}"/>
    <ellipse cx="6" cy="0" rx="70" ry="74" fill="${C.skin}"/>
    <ellipse cx="-50" cy="6" rx="14" ry="18" fill="${C.skinD}"/>
    <path d="M-68 -6 q-8 -70 60 -78 q70 -6 80 52 q-30 -32 -70 -28 q-30 4 -52 40 q-6 10 -18 14z" fill="${C.hair}"/>
    <ellipse cx="44" cy="22" rx="12" ry="7" fill="#F09A8A" opacity=".55"/>
    <path d="M44 6 q8 10 0 16" stroke="${C.skinD}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  head.append(eyes, brows, mouth);
  const headG = g(); headG.appendChild(head);
  const body = g();
  root.appendChild(body);
  body.append(armB, legB, legF, torso, headG, armF);
  root.parts = { body, legB, legF, armB, armF, torso, headG, eyes, brows, mouth, phone };
  return root;
}

// pose: {walk: phase or null, armF: deg, armB: deg, look: deg, mouth: 'smile'|'neutral'|'worried'|'talk', talk: 0..1, blink: 0..1, phone: 0..1}
export function poseJason(j, p = {}) {
  const P = j.parts;
  const w = p.walk;
  let lF = 0, lB = 0, aF = p.armF ?? 8, aB = p.armB ?? -8, bob = 0;
  if (w != null) {
    const s = Math.sin(w * Math.PI * 2);
    lF = 24 * s; lB = -24 * s; aF = p.armF ?? -22 * s; aB = p.armB ?? 22 * s; bob = -Math.abs(Math.cos(w * Math.PI * 2)) * 10;
  }
  tf(P.body, `translate(0 ${bob})`);
  tf(P.legF, `translate(8 -236) rotate(${lF})`);
  tf(P.legB, `translate(-8 -236) rotate(${lB})`);
  tf(P.armF, `translate(62 -402) rotate(${-aF})`);
  tf(P.armB, `translate(-58 -402) rotate(${-aB})`);
  tf(P.headG, `translate(4 -505) rotate(${p.look || 0})`);
  tf(P.eyes, `translate(0 ${-2 * (p.blink || 0)}) scale(1 ${1 - 0.9 * (p.blink || 0)})`);
  const m = p.mouth || 'neutral', k = p.talk || 0;
  const d = m === 'smile' ? 'M4 26 q16 16 32 0' : m === 'worried' ? 'M8 36 q12 -8 24 0'
    : m === 'talk' ? `M8 28 q12 ${6 + 18 * k} 24 0 q-12 ${-4} -24 0z` : 'M8 30 q12 5 24 0';
  if (P.mouth.getAttribute('d') !== d) P.mouth.setAttribute('d', d);
  P.mouth.setAttribute('fill', m === 'talk' ? '#7A3B2E' : 'none');
  tf(P.brows, m === 'worried' ? 'translate(0 -3) rotate(-6 14 -24)' : '');
  P.phone.setAttribute('opacity', p.phone || 0);
  tf(P.phone, 'translate(0 160)');
}

// ------------------------------------------------------------------ dog (corgi, faces right; origin = ground under body)
export function dog() {
  const root = g();
  const legs = [-48, -28, 34, 52].map((x, i) => g(`<rect x="-9" y="0" width="18" height="44" rx="9" fill="${i % 2 ? '#D88A3A' : '#C67A2E'}"/><ellipse cx="2" cy="44" rx="12" ry="6" fill="#fff"/>`));
  const tail = g(`<ellipse cx="-12" cy="-8" rx="20" ry="12" fill="#E8973F" transform="rotate(-30)"/>`);
  const head = g(`
    <path d="M-6 -30 l10 -42 l24 34z" fill="#E8973F"/><path d="M0 -36 l6 -24 l14 20z" fill="#F7C9A0"/>
    <path d="M22 -34 l20 -40 l16 40z" fill="#E8973F"/><path d="M28 -38 l14 -26 l8 24z" fill="#F7C9A0"/>
    <ellipse cx="22" cy="0" rx="40" ry="34" fill="#E8973F"/>
    <path d="M22 0 q30 -6 48 10 q-6 22 -40 20 q-20 -2 -20 -16z" fill="#fff"/>
    <ellipse cx="68" cy="8" rx="9" ry="7" fill="#22202A"/>
    <circle cx="34" cy="-6" r="6" fill="#22202A"/><circle cx="36" cy="-8" r="2" fill="#fff"/>
    <path d="M46 26 q8 6 14 0" stroke="#22202A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`);
  const body = g(`<ellipse cx="0" cy="0" rx="78" ry="38" fill="#E8973F"/><path d="M-60 14 q60 34 120 0 q-10 24 -60 26 q-50 -2 -60 -26z" fill="#fff"/>
    <rect x="40" y="-30" width="16" height="44" rx="6" fill="${C.purple}" transform="rotate(-20 48 -8)"/>`);
  const bodyG = g();
  bodyG.append(legs[1], legs[3], tail, body, legs[0], legs[2], head);
  root.appendChild(bodyG);
  root.parts = { bodyG, legs, tail, head };
  return root;
}
export function poseDog(d, p = {}) {
  const P = d.parts, w = p.walk;
  const bob = w != null ? -Math.abs(Math.sin(w * Math.PI * 2)) * 5 : 0;
  tf(P.bodyG, `translate(0 ${-80 + bob})`);
  const offs = [-48, -28, 34, 52];
  P.legs.forEach((l, i) => tf(l, `translate(${offs[i]} 22) rotate(${w != null ? 26 * Math.sin(w * Math.PI * 2 + (i % 2 ? Math.PI : 0)) : 0})`));
  tf(P.tail, `translate(-74 -14) rotate(${-20 + 25 * Math.sin((p.t || 0) * 14)})`);
  tf(P.head, `translate(54 -36) rotate(${p.look || 0})`);
}
// collar point in dog-local coords (for the leash)
export const DOG_COLLAR = { x: 50, y: -118 };

// ------------------------------------------------------------------ POTATO post + mascot "Melb"
// Origin = ground at the post centre; ~430 units tall.  The touchscreen is the
// rectangle on the pillar, directly above the NFC pad; the lower body is the
// wrap-around notice display; the head is the mascot Melb.
export const POST = { screen: { x: -78, y: -268, w: 156, h: 74 }, nfc: { x: 0, y: -168 }, head: { x: 0, y: -404 } };
export function post() {
  const root = g();
  const glow = svgEl('ellipse', { cx: 0, cy: -220, rx: 260, ry: 300, fill: 'url(#gGlow)', opacity: 0 });
  const shadow = svgEl('ellipse', { cx: 0, cy: 0, rx: 130, ry: 18, fill: '#1F2A44', opacity: .16 });
  const body = g(`
    <path d="M-110 -300 v280 a110 26 0 0 0 220 0 v-280z" fill="url(#gBody)"/>
    <path d="M-110 -40 v20 a110 26 0 0 0 220 0 v-20 a110 26 0 0 1 -220 0z" fill="${C.purple}"/>
    <ellipse cx="0" cy="-300" rx="110" ry="26" fill="url(#gCap)"/>
    <ellipse cx="0" cy="-304" rx="96" ry="19" fill="#A57CC0"/>
    <rect x="-16" y="-340" width="32" height="44" rx="8" fill="#B8A6C6"/><rect x="-16" y="-340" width="10" height="44" rx="5" fill="#fff" opacity=".4"/>
    <!-- wrap-around notice display (lower body) -->
    <path d="M-104 -138 h208 v86 a104 22 0 0 1 -208 0z" fill="url(#gWrap)"/>
    <!-- screen bezel -->
    <rect x="-86" y="-276" width="172" height="90" rx="14" fill="${C.navy}"/>
    <!-- NFC pad -->
    <rect x="-34" y="-180" width="68" height="34" rx="10" fill="${C.orange}"/>
    <path d="M-8 -171 q8 8 0 16 M0 -175 q12 12 0 24 M8 -179 q16 16 0 32" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 0)"/>
  `);
  // dynamic content on the little screen and wrap display (scenes fill these)
  const screen = g('', { 'clip-path': 'url(#clipScr)' });
  const clip = svgEl('clipPath', { id: 'clipScr' }, `<rect x="${POST.screen.x}" y="${POST.screen.y}" width="${POST.screen.w}" height="${POST.screen.h}" rx="9"/>`);
  const scrBase = svgEl('rect', { x: POST.screen.x, y: POST.screen.y, width: POST.screen.w, height: POST.screen.h, rx: 9, fill: 'url(#gScreen)' });
  screen.appendChild(scrBase);
  const scrList = g(`
    <text x="-68" y="-252" font-family="'Baloo 2', Nunito" font-weight="800" font-size="13" fill="${C.purple}">Hi Melb!</text>
    ${[0, 1, 2].map(i => `<rect x="-68" y="${-246 + i * 16}" width="136" height="12" rx="4" fill="#fff"/>
      <circle cx="-60" cy="${-240 + i * 16}" r="4" fill="${[C.green, C.orange, C.purple][i]}"/>
      <rect x="-50" y="${-242 + i * 16}" width="${[80, 64, 56][i]}" height="4" rx="2" fill="#9AA0B4"/>`).join('')}`);
  const scrIdle = g(`<text x="0" y="-238" font-family="'Baloo 2', Nunito" font-weight="800" font-size="22" fill="${C.purple}" text-anchor="middle">Hi Melb!</text>
    <text x="0" y="-216" font-family="Nunito" font-weight="800" font-size="11" fill="${C.navy2}" text-anchor="middle">Tap to see issues near you</text>`);
  const scrOk = g(`<rect x="${POST.screen.x}" y="${POST.screen.y}" width="${POST.screen.w}" height="${POST.screen.h}" fill="#E3F2E1"/>
    <circle cx="-54" cy="-231" r="14" fill="#2E9E4F"/><path d="M-60 -231 l5 5 l10 -11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="-34" y="-234" font-family="Nunito" font-weight="900" font-size="12" fill="${C.navy}">Nothing stored</text>
    <text x="-34" y="-220" font-family="Nunito" font-weight="800" font-size="10" fill="${C.greenD}">session cleared</text>`, { opacity: 0 });
  screen.append(scrIdle, scrList, scrOk);
  const wrap = g('', { 'clip-path': 'url(#clipWrap)' });
  const clipW = svgEl('clipPath', { id: 'clipWrap' }, `<path d="M-104 -138 h208 v86 a104 22 0 0 1 -208 0z"/>`);
  const posters = g(`
    <g><rect x="-150" y="-132" width="88" height="96" rx="8" fill="#FFE6CC"/><text x="-106" y="-112" font-family="Nunito" font-weight="900" font-size="10" fill="${C.orangeD}" text-anchor="middle">LIBRARY</text>
      <rect x="-140" y="-104" width="68" height="34" rx="6" fill="#FFC27A"/><text x="-106" y="-56" font-family="Nunito" font-weight="800" font-size="9" fill="${C.navy}" text-anchor="middle">Book club · Sat</text></g>
    <g><rect x="-44" y="-132" width="88" height="96" rx="8" fill="#fff"/><text x="0" y="-114" font-family="Nunito" font-weight="900" font-size="10" fill="${C.purple}" text-anchor="middle">COUNCIL</text>
      <text x="0" y="-96" font-family="'Baloo 2', Nunito" font-weight="800" font-size="14" fill="${C.navy}" text-anchor="middle">Have your say</text>
      <path d="M-18 -74 q18 -24 36 0z" fill="${C.green}"/><rect x="-2" y="-76" width="4" height="16" fill="#8A5A3B"/>
      <text x="0" y="-48" font-family="Nunito" font-weight="800" font-size="9" fill="${C.navy2}" text-anchor="middle">Park rules · 5 days</text></g>
    <g><rect x="62" y="-132" width="88" height="96" rx="8" fill="#E3F2E1"/><text x="106" y="-112" font-family="Nunito" font-weight="900" font-size="10" fill="${C.greenD}" text-anchor="middle">COMMUNITY</text>
      <circle cx="94" cy="-86" r="12" fill="#FFB0C8"/><circle cx="118" cy="-82" r="9" fill="#FFD36E"/><text x="106" y="-56" font-family="Nunito" font-weight="800" font-size="9" fill="${C.navy}" text-anchor="middle">Street fest</text></g>`);
  wrap.appendChild(posters);
  const shine = svgEl('path', { d: 'M-88 -296 v270', stroke: '#fff', 'stroke-width': 10, opacity: .5, 'stroke-linecap': 'round' });

  // ---- head: Melb (cat-ear robot)
  const ears = g(`
    <path d="M-62 -40 l-10 -78 l58 40z" fill="url(#gHead)"/><path d="M-56 -52 l-6 -48 l34 26z" fill="#F4B6D2"/>
    <path d="M62 -40 l10 -78 l-58 40z" fill="url(#gHead)"/><path d="M56 -52 l6 -48 l-34 26z" fill="#F4B6D2"/>`);
  const shell = g(`<circle cx="0" cy="0" r="82" fill="url(#gHead)"/>
    <circle cx="0" cy="-60" r="4" fill="#3E2552"/>
    <path d="M-78 18 a82 82 0 0 0 20 46" stroke="#4A2A60" stroke-width="10" fill="none" stroke-linecap="round" opacity=".5"/>`);
  const visor = svgEl('rect', { x: -60, y: -32, width: 120, height: 66, rx: 30, fill: '#1F2A44' });
  const eyeL = g(`<ellipse cx="0" cy="0" rx="9" ry="13" fill="#8FF0FF"/>`);
  const eyeR = g(`<ellipse cx="0" cy="0" rx="9" ry="13" fill="#8FF0FF"/>`);
  const happyL = svgEl('path', { d: 'M-11 4 q11 -16 22 0', stroke: '#8FF0FF', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', opacity: 0 });
  const happyR = happyL.cloneNode();
  const grille = g(`<circle cx="0" cy="0" r="20" fill="#3E2552"/>${[-10, -3, 4, 11].map(x => `<rect x="${x - 1.5}" y="-12" width="3" height="24" rx="1.5" fill="#B79CCB"/>`).join('')}`);
  const cheek = g(`<ellipse cx="-44" cy="44" rx="10" ry="6" fill="#F4B6D2" opacity=".7"/><ellipse cx="44" cy="44" rx="10" ry="6" fill="#F4B6D2" opacity=".7"/>`);
  const eyesG = g(); eyesG.append(eyeL, eyeR, happyL, happyR);
  const face = g(); face.append(visor, eyesG);
  const headG = g(); headG.append(ears, shell, cheek, face);
  const grilleG = g(); grilleG.appendChild(grille);
  headG.appendChild(grilleG);

  root.append(clip, clipW, glow, shadow, body, screen, wrap, shine, headG);
  root.parts = { glow, headG, eyesG, eyeL, eyeR, happyL, happyR, grilleG, scrIdle, scrList, scrOk, posters, face };
  return root;
}
// pose: {mood:'idle'|'happy'|'listen', blink, look:{x,y}, bob, talk, screen:'idle'|'list'|'ok', posters: offset}
export function posePost(p, o = {}) {
  const P = p.parts;
  const bob = o.bob || 0;
  tf(P.headG, `translate(0 ${POST.head.y + bob}) rotate(${o.tilt || 0}) scale(.84)`);
  const lx = o.look?.x || 0, ly = o.look?.y || 0;
  tf(P.eyeL, `translate(${-24 + lx} ${ly}) scale(1 ${1 - 0.92 * (o.blink || 0)})`);
  tf(P.eyeR, `translate(${24 + lx} ${ly}) scale(1 ${1 - 0.92 * (o.blink || 0)})`);
  const happy = o.mood === 'happy' ? 1 : 0;
  P.eyeL.setAttribute('opacity', 1 - happy); P.eyeR.setAttribute('opacity', 1 - happy);
  P.happyL.setAttribute('opacity', happy); P.happyR.setAttribute('opacity', happy);
  tf(P.happyL, `translate(${-24 + lx} ${ly})`); tf(P.happyR, `translate(${24 + lx} ${ly})`);
  const ls = o.mood === 'listen' ? 1 + 0.08 * Math.sin((o.t || 0) * 18) : 1;
  tf(P.grilleG, `translate(70 30) scale(${0.8 * ls})`);
  P.glow.setAttribute('opacity', o.glow || 0);
  const s = o.screen || 'idle';
  P.scrIdle.setAttribute('opacity', s === 'idle' ? 1 : 0);
  P.scrList.setAttribute('opacity', s === 'list' ? 1 : 0);
  P.scrOk.setAttribute('opacity', s === 'ok' ? 1 : 0);
  tf(P.posters, `translate(${o.posters || 0} 0)`);
}

// ------------------------------------------------------------------ backgrounds
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
export function skyline(w, seed = 3, color = '#C4DCEB') {
  const r = rng(seed); let x = 0, h = '';
  while (x < w) {
    const bw = 60 + r() * 120, bh = 120 + r() * 260;
    h += `<rect x="${x}" y="${-bh}" width="${bw}" height="${bh}" fill="${color}"/>`;
    if (r() > 0.75) h += `<rect x="${x + bw / 2 - 4}" y="${-bh - 60}" width="8" height="60" fill="${color}"/>`;
    x += bw + 6;
  }
  // Eureka-ish tower
  h += `<path d="M${w * 0.42} 0 v-520 l18 -24 l18 24 v520z" fill="${color}"/>`;
  return g(h);
}
const SHOPS = [
  ['#F6C28B', '#C96A10', 'CAFÉ'], ['#BFD9C4', '#2E7D32', 'GROCER'], ['#E8C9DA', '#7B4B94', 'BOOKS'],
  ['#F3E1B5', '#B5872A', 'BAKERY'], ['#C8D6EE', '#3A63D1', 'PHARMACY'], ['#F2C4BC', '#C0453A', 'NOODLES'],
];
export function shops(w, seed = 5) {
  const r = rng(seed); let x = 0, h = '', i = 0;
  while (x < w) {
    const [wall, acc, name] = SHOPS[i++ % SHOPS.length];
    const bw = 300 + Math.floor(r() * 120), bh = 330 + Math.floor(r() * 140);
    h += `<g transform="translate(${x} 0)">
      <rect x="0" y="${-bh}" width="${bw}" height="${bh}" fill="${wall}"/>
      <rect x="0" y="${-bh}" width="${bw}" height="16" fill="${acc}" opacity=".5"/>
      ${[0, 1, 2].map(k => `<rect x="${30 + k * (bw - 60) / 3}" y="${-bh + 40}" width="${(bw - 60) / 3 - 20}" height="70" rx="6" fill="#fff" opacity=".7"/>`).join('')}
      <rect x="20" y="-200" width="${bw - 40}" height="40" rx="6" fill="${acc}"/>
      <text x="${bw / 2}" y="-172" font-family="'Baloo 2', Nunito" font-weight="800" font-size="28" fill="#fff" text-anchor="middle" letter-spacing="3">${name}</text>
      <path d="M14 -160 h${bw - 28} l-14 30 h${-(bw - 56)}z" fill="${acc}" opacity=".85"/>
      ${Array.from({ length: Math.floor((bw - 28) / 36) }, (_, k) => `<path d="M${14 + k * 36} -130 h18 l-4 0" stroke="#fff" stroke-width="0"/><rect x="${14 + k * 36}" y="-160" width="18" height="30" fill="#fff" opacity=".35"/>`).join('')}
      <rect x="30" y="-125" width="${bw * 0.5}" height="125" rx="4" fill="#9FC7E0"/><rect x="30" y="-125" width="${bw * 0.5}" height="125" rx="4" fill="#fff" opacity=".25"/>
      <rect x="${bw * 0.62}" y="-130" width="${bw * 0.26}" height="130" rx="4" fill="#5B4636"/>
    </g>`;
    x += bw;
  }
  return g(h);
}
export function tree(x, s = 1, c = '#5DB55F') {
  return `<g transform="translate(${x} 0) scale(${s})"><rect x="-12" y="-150" width="24" height="150" rx="8" fill="#8A5A3B"/>
    <circle cx="0" cy="-200" r="80" fill="${c}"/><circle cx="-55" cy="-160" r="55" fill="${c}"/><circle cx="55" cy="-165" r="58" fill="${c}"/>
    <circle cx="-20" cy="-230" r="40" fill="#fff" opacity=".12"/></g>`;
}
export function fence(x0, x1, y = 0) {
  let h = `<rect x="${x0}" y="${y - 110}" width="${x1 - x0}" height="10" rx="4" fill="#2F4A3A"/><rect x="${x0}" y="${y - 50}" width="${x1 - x0}" height="10" rx="4" fill="#2F4A3A"/>`;
  for (let x = x0; x <= x1; x += 36) h += `<rect x="${x}" y="${y - 130}" width="9" height="130" rx="3" fill="#2F4A3A"/><circle cx="${x + 4.5}" cy="${y - 132}" r="7" fill="#2F4A3A"/>`;
  return h;
}
export function ground(w, y, dusk = false) {
  return `<rect x="-200" y="${y}" width="${w + 400}" height="400" fill="${dusk ? '#9C8A9A' : '#D9D2C5'}"/>
    <rect x="-200" y="${y}" width="${w + 400}" height="14" fill="${dusk ? '#7E6F80' : '#BDB3A3'}"/>
    ${Array.from({ length: Math.ceil((w + 400) / 160) }, (_, i) => `<rect x="${-200 + i * 160}" y="${y + 14}" width="4" height="120" fill="${dusk ? '#8A7B8C' : '#CBC2B3'}"/>`).join('')}
    <rect x="-200" y="${y + 135}" width="${w + 400}" height="300" fill="${dusk ? '#4E4660' : '#6E7480'}"/>
    ${Array.from({ length: Math.ceil((w + 400) / 220) }, (_, i) => `<rect x="${-200 + i * 220}" y="${y + 220}" width="110" height="10" rx="5" fill="#fff" opacity=".6"/>`).join('')}`;
}
// speech bubble (SVG) with tail at bottom-left
export function bubbleSVG(w, h, text, opt = {}) {
  const fs = opt.fs || 34;
  return g(`<g filter="url(#fSh)"><rect x="0" y="${-h}" width="${w}" height="${h}" rx="${Math.min(28, h / 2)}" fill="#fff"/>
    <path d="M${opt.tail ?? 34} -2 l-6 26 l30 -26z" fill="#fff"/></g>
    <text x="${w / 2}" y="${-h / 2 + fs * 0.36}" font-family="${opt.font || "'Baloo 2', 'Noto Sans TC'"}" font-weight="800" font-size="${fs}" fill="${opt.color || C.purple}" text-anchor="middle">${text}</text>`);
}
