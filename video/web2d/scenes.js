import { show, clamp, ease, easeOut, backOut, prog, smooth, blink, typeText, lerp } from './fx.js';
import * as A from './art.js';
import { ic } from './icons.js';

const { C, g, tf, svgEl } = A;

// ---------------------------------------------------------------- Traditional Chinese strings (preloaded + QA-scanned)
export const ZH = {
  jasonLine: '希望可以保留早上的遛狗時間。',
  issueTitle: '狗狗公園新規定',
  lang: '繁體中文',
  plain: '白話摘要',
  summary1: '市議會提議從下個月起，',
  term: '無牽繩區',
  summary2: '（狗狗公園）早上將不再開放。',
  termExp: '可以讓狗狗不繫牽繩、自由活動的指定區域。',
  closes: '5 天後截止',
  talk: '跟 Spud 說說你的想法',
  listening: '正在聆聽…',
  original: '原文',
  dept: '公園與開放空間處',
  edit: '編輯', confirm: '確認送出',
  recv: '已收到', review: '審核中', outcome: '結果',
  track: '追蹤這個議題',
  ask: '我該找哪個部門？',
  answer: '這屬於「公園與開放空間處」負責。新規定的草案在官方文件第 4 頁。',
  declined: '未採納',
  noAudio: '不保存錄音',
  saved: '已存到 HearHere',
  hello: '你好！',
  who: '要找誰說？', words: '該怎麼說？',
  notify: '狗狗公園新規定：已進入審核',
};
export const ZH_STRINGS = Object.values(ZH);

// ---------------------------------------------------------------- helpers
function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
const $ = (r, s) => r.querySelector(s);
const $$ = (r, s) => Array.from(r.querySelectorAll(s));
// SVG show: fades/pops a <g> whose base transform is in dataset.base
function sv(e, t, a, o = {}) {
  const { d = 0.45, kind = 'pop', out = null, od = 0.35 } = o;
  const p = clamp((t - a) / d), q = out == null ? 1 : 1 - clamp((t - out) / od);
  const k = kind === 'pop' ? backOut(p) : easeOut(p);
  const base = e.dataset.base || '';
  const ox = +(e.dataset.ox || 0), oy = +(e.dataset.oy || 0);
  const tr = kind === 'pop' ? `translate(${ox} ${oy}) scale(${0.4 + 0.6 * k}) translate(${-ox} ${-oy})` : kind === 'up' ? `translate(0 ${(1 - k) * 40})` : '';
  tf(e, `${base} ${tr}`);
  const op = Math.min(clamp(p * 1.8), q);
  e.setAttribute('opacity', op.toFixed(3));
  return op;
}
function place(e, x, y, s = 1, extra = '') { e.dataset.base = `translate(${x} ${y}) scale(${s}) ${extra}`; tf(e, e.dataset.base); return e; }
function cam(w, cx, cy, z) { tf(w, `translate(${960 - cx * z} ${540 - cy * z}) scale(${z})`); }
const toScr = (wx, wy, c) => ({ x: 960 + (wx - c.x) * c.z, y: 540 + (wy - c.y) * c.z });
const lerpCam = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k) });
function bgBlobs() {
  return `<div class="abs" style="inset:0;background:var(--cream);overflow:hidden">
    <div class="abs blob" style="width:760px;height:760px;border-radius:50%;filter:blur(60px);opacity:.55;background:#E7D4F1;left:-200px;top:-260px"></div>
    <div class="abs blob" style="width:640px;height:640px;border-radius:50%;filter:blur(60px);opacity:.55;background:#FFD9AE;right:-160px;top:380px"></div>
    <div class="abs blob" style="width:520px;height:520px;border-radius:50%;filter:blur(60px);opacity:.55;background:#CFE7F0;left:620px;top:640px"></div></div>`;
}
function animBlobs(root, t) {
  $$(root, '.blob').forEach((b, i) => { b.style.transform = `translate(${Math.sin(t * 0.33 + i * 2) * 70}px, ${Math.cos(t * 0.29 + i) * 50}px)`; });
}
// HearHere app icon (from the team's app-flow design: orange cat on a dark circle)
export const appIcon = (size) => `<svg viewBox="0 0 48 48" width="${size}" height="${size}"><circle cx="24" cy="24" r="24" fill="#2B1708"/>
  <path d="M12 19 C7 10 9 5 14 5 C18 5 21 10 22 14 Z" fill="#F26B1D"/><path d="M36 19 C41 10 39 5 34 5 C30 5 27 10 26 14 Z" fill="#F26B1D"/>
  <circle cx="24" cy="26" r="15" fill="#F26B1D"/><rect x="14" y="20" width="20" height="12" rx="6" fill="#FFF7EE"/>
  <ellipse cx="20" cy="26" rx="1.6" ry="2.4" fill="#2B1708"/><ellipse cx="28" cy="26" rx="1.6" ry="2.4" fill="#2B1708"/></svg>`;
const TABBAR = `<div class="tabbar">${[['Issues', 'doc'], ['Nearby', 'pin'], ['Ask Spud', 'chat'], ['Badges', 'check']].map(([n, i], k) => `<div class="tb${k === 0 ? ' on' : ''}">${ic(i, k === 0 ? '#F26B1D' : '#8A6A55', 24, 3.6)}<span>${n}</span></div>`).join('')}</div>`;
// Spud's face as a small HTML/SVG icon
export function melbIcon(size, mood = 'idle') {
  const eyes = mood === 'happy'
    ? '<path d="M-35 4 q11 -16 22 0 M13 4 q11 -16 22 0" stroke="#8FF0FF" stroke-width="7" fill="none" stroke-linecap="round"/>'
    : '<ellipse cx="-24" cy="0" rx="9" ry="13" fill="#8FF0FF"/><ellipse cx="24" cy="0" rx="9" ry="13" fill="#8FF0FF"/>';
  return `<svg width="${size}" height="${size}" viewBox="-100 -125 200 215">
    <path d="M-62 -40 l-10 -78 l58 40z" fill="#8F5FAA"/><path d="M-56 -52 l-6 -48 l34 26z" fill="#F4B6D2"/>
    <path d="M62 -40 l10 -78 l-58 40z" fill="#8F5FAA"/><path d="M56 -52 l6 -48 l-34 26z" fill="#F4B6D2"/>
    <circle r="82" fill="#7B4B94"/><circle cx="-26" cy="-40" r="34" fill="#fff" opacity=".12"/>
    <rect x="-60" y="-32" width="120" height="66" rx="30" fill="#1F2A44"/>${eyes}
    <ellipse cx="-44" cy="46" rx="10" ry="6" fill="#F4B6D2"/><ellipse cx="44" cy="46" rx="10" ry="6" fill="#F4B6D2"/></svg>`;
}
const tapAt = (e, t, a) => { // tap ripple
  const p = prog(t, a, 0.55);
  e.style.opacity = p > 0 && p < 1 ? 1 - p : 0;
  e.style.transform = `scale(${0.6 + 0.9 * p})`;
};

// ---------------------------------------------------------------- layout constants
const BL = 760, FEET = 960, POSTY = 950, PS = 0.85;   // feet low in frame: a pavement photo goes underneath
const leashTo = (leash, h, dx, ds) => {
  const cx = dx + A.DOG_COLLAR.x * ds, cy = FEET + A.DOG_COLLAR.y * ds;
  leash.setAttribute('d', `M${h.x} ${h.y} Q${(h.x + cx) / 2} ${Math.max(h.y, cy) + 50} ${cx} ${cy}`);
};
const toW = (hand, x, s) => ({ x: x + hand.x * s, y: FEET + hand.y * s });
// frosted street backdrop for the infographic scenes
function backdrop(svg, seed) {
  const w = A.streetWorld({ width: 2400, seed, lamps: [520, 1500], trees: [980, 1900] });
  svg.appendChild(w); return w;
}
const frost = (op = 1) => A.GREEN ? '<div class="abs" style="inset:0;opacity:0"></div>' : `<div class="abs frost" style="inset:0;opacity:${op}"></div>`;

// ================================================================= SCENES
export function buildScenes(ctx) {
  const { TL } = ctx;
  const S = Object.fromEntries(TL.scenes.map(s => [s.id, s]));
  const L = (sid, id) => { const s = S[sid]; const l = s.lines.find(x => x.id === id); return l.start - s.start; };
  const LE = (sid, id) => { const s = S[sid]; const l = s.lines.find(x => x.id === id); return l.end - s.start; };
  const out = {};
  const mk = (id) => {
    const svg = g('', { style: 'display:none' }); ctx.world.appendChild(svg);
    const ui = el('<div class="scene-ui"></div>'); ctx.ui.appendChild(ui);
    return { svg, ui };
  };

  // ------------------------------------------------------------ 1 Title: who we are and what we studied
  {
    const { svg, ui } = mk(1);
    const BG = A.streetWorld({ width: 2400 }); svg.appendChild(BG);
    const potato = `<svg width="150" height="100" viewBox="-135 -75 270 150"><path d="M-120 0 C -110 -60, 90 -70, 130 -10 C 150 30, 40 70, -40 60 C -100 52, -130 30, -120 0z" fill="#B5487A"/>
      <path d="M-80 -20 q30 -14 60 -6 M10 10 q30 -10 60 4" stroke="#8E3560" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="-30" cy="-18" r="9" fill="#fff" opacity=".3"/>
      <path d="M118 -18 C 130 -50, 150 -60, 168 -56 C 160 -36, 144 -22, 118 -18z" fill="#1E9BB0" transform="translate(-30 0)"/></svg>`;
    const team = el(`<div class="abs card" style="left:360px;top:230px;width:1200px;height:420px;padding:40px 56px">
      <div style="display:flex;align-items:center;gap:30px">${potato}
        <div><div class="k">Group 14 · INFO90006 Fieldwork for Design</div><div style="font:800 86px/1 'Baloo 2';color:var(--purple)">Team Sweet Potatoes</div></div></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:40px">
        ${[['Jia-Ying Lee', '1790130'], ['Xintong FU', '1840227'], ['Yu-Hao LU', '1781474'], ['Yen-Chu OU YANG', '1801365']].map(([n, id], i) => `<div class="mb mb${i}" style="background:var(--cream);border-radius:20px;padding:18px 20px;text-align:center">
          <div style="width:64px;height:64px;margin:0 auto;border-radius:50%;background:${['#7B4B94', '#F28C28', '#16707F', '#3A63D1'][i]};display:grid;place-items:center">${ic('user', '#fff', 38, 3.4)}</div>
          <div style="font:900 24px Nunito;margin-top:10px">${n}</div><div style="font:800 19px Nunito;color:var(--navy-2)">${id}</div></div>`).join('')}</div></div>`);
    const rq = el(`<div class="abs card" style="left:360px;top:690px;width:1200px;height:150px;padding:0 40px;display:flex;align-items:center;gap:26px">
      <span style="width:84px;height:84px;border-radius:24px;background:var(--orange);display:grid;place-items:center;flex:none">${ic('search', '#fff', 48, 3.6)}</span>
      <div><div class="k">Our project</div><div style="font:900 34px/1.2 Nunito">How can we help international residents take part in local government decisions?</div></div></div>`);
    ui.append(team, rq);
    out[1] = {
      svg, ui, update(t) {
        const a = L(1, 's1a'), b = L(1, 's1b');
        cam(BG, 960, 540, 1);
        show(team, t, 0.1, { kind: 'pop' });
        [0, 1, 2, 3].forEach(i => show($(team, '.mb' + i), t, a + 0.8 + i * 0.25, { kind: 'up', dist: 20 }));
        show(rq, t, b + 0.2, { kind: 'up' });
      },
    };
  }

  // ------------------------------------------------------------ 2 Five problems (the five fieldwork themes)
  {
    const { svg, ui } = mk(2);
    const BG = backdrop(svg, 21); A.worldFx(BG, { x: 960, y: 540, z: 1 }, 0, 0);
    ui.insertAdjacentHTML('beforeend', frost());
    const h = el(`<div class="abs" style="left:0;right:0;top:96px;text-align:center"><span class="card h1" style="display:inline-block;padding:10px 34px;font-size:54px">Five problems from our fieldwork</span></div>`);
    const stats = el(`<div class="abs" style="left:0;right:0;top:196px;display:flex;justify-content:center;gap:24px">
      ${[['people', '8 interviews'], ['camera', '4 observation sites'], ['dashboard', '5 themes']].map(([i, t]) => `<div class="chip card st" style="width:300px;justify-content:center;font-size:26px;padding:10px 20px">${ic(i, '#7B4B94', 32, 3.6)}${t}</div>`).join('')}</div>`);
    const ART = [
      `<svg width="150" height="120" viewBox="0 0 240 190"><rect x="40" y="10" width="160" height="170" rx="12" fill="#fff" stroke="#E9DCC4" stroke-width="4"/>${[34, 60, 86, 112, 138].map((y, i) => `<rect x="60" y="${y}" width="${[110, 90, 120, 70, 100][i]}" height="10" rx="5" fill="#D6D9E2"/>`).join('')}
        <rect x="56" y="54" width="104" height="24" rx="6" fill="#FFE08A"/><text x="108" y="72" font-family="Nunito" font-weight="900" font-size="16" fill="#B85C00" text-anchor="middle">consultation</text>
        <rect x="80" y="106" width="110" height="24" rx="6" fill="#FFE08A"/><text x="135" y="124" font-family="Nunito" font-weight="900" font-size="16" fill="#B85C00" text-anchor="middle">off-leash area</text></svg>`,
      `<svg width="150" height="120" viewBox="0 0 240 190"><circle cx="90" cy="95" r="66" fill="#fff" stroke="#3A63D1" stroke-width="10"/><path d="M90 52 v45 l30 18" stroke="#1F2A44" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M196 60 c-22 0 -36 16 -36 34 c0 26 36 62 36 62 s36 -36 36 -62 c0 -18 -14 -34 -36 -34z" fill="#E0544B"/><circle cx="196" cy="94" r="12" fill="#fff"/></svg>`,
      `<svg width="150" height="120" viewBox="0 0 240 190"><circle cx="120" cy="95" r="80" fill="#FFE6CC"/><path d="M120 150 C 60 110, 60 60, 92 52 C 108 48, 118 58, 120 66 C 122 58, 132 48, 148 52 C 180 60, 180 110, 120 150z" fill="#F28C28"/>
        <circle cx="168" cy="48" r="20" fill="#7B4B94"/><path d="M160 48 l6 6 l10 -12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
      `<svg width="150" height="120" viewBox="0 0 240 190"><path d="M30 80 L120 30 L210 80z" fill="#7B4B94"/><rect x="40" y="80" width="160" height="90" fill="#FFF4E0"/>${[0, 1, 2, 3].map(i => `<rect x="${56 + i * 38}" y="90" width="18" height="70" rx="4" fill="#E9DCC4"/>`).join('')}
        <circle cx="190" cy="40" r="30" fill="#fff" stroke="#E0544B" stroke-width="6"/><text x="190" y="54" font-family="Baloo 2" font-weight="800" font-size="42" fill="#E0544B" text-anchor="middle">?</text></svg>`,
      `<svg width="150" height="120" viewBox="0 0 240 190"><rect x="44" y="110" width="12" height="70" fill="#8A5A3B"/><path d="M14 70 a36 36 0 0 1 72 0 v46 h-72z" fill="#E0544B"/><rect x="14" y="96" width="72" height="20" fill="#C0453A"/>
        <text x="120" y="110" font-family="Baloo 2" font-weight="800" font-size="56" fill="#E0544B" text-anchor="middle">≠</text>
        <rect x="160" y="30" width="70" height="140" rx="14" fill="#1C2133"/><rect x="166" y="40" width="58" height="120" rx="8" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${170 + (i % 2) * 26}" y="${46 + Math.floor(i / 2) * 36}" width="22" height="30" rx="4" fill="${['#FFD9AE', '#CFE7F0', '#E7D4F1', '#BFD9F2', '#FFC7C2', '#FFE08A'][i]}"/>`).join('')}</svg>`,
    ];
    const P5 = [
      ['Language', 'Hard-to-understand policy terms', 'Residents lose confidence when sharing their opinions', '#F28C28', 1],
      ['Time', 'Hard to attend in person', 'In-person discussions clash with busy daily lives', '#3A63D1', 2],
      ['Relevance', 'Less attention to unrelated topics', 'Topics that don\'t feel personal get less attention', '#C96A10', 3],
      ['Communication', 'Stuck finding the right department', 'Who should I send my opinion to?', '#7B4B94', 4],
      ['Channels', 'Social media vs physical channels', 'Newer residents rely on social media; councils use mail and flyers', '#E0544B', 5],
    ];
    const cards = P5.map(([k, t2, d2, c, n], i) => el(`<div class="abs card" style="left:${110 + i * 346}px;top:290px;width:316px;height:520px;padding:0;overflow:hidden">
      <div style="height:190px;background:var(--cream);display:grid;place-items:center;position:relative">${ART[i]}
        <span style="position:absolute;left:16px;top:16px;width:52px;height:52px;border-radius:50%;background:${c};color:#fff;display:grid;place-items:center;font:900 30px Nunito">${n}</span></div>
      <div style="padding:20px 22px"><div class="k" style="color:${c}">${k}</div><div style="font:900 28px/1.15 Nunito;margin-top:6px">${t2}</div>
        <div style="font:700 21px/1.35 Nunito;color:var(--navy-2);margin-top:10px">${d2}</div>
        <span class="tag" style="position:absolute;left:22px;bottom:20px;background:var(--navy);color:#fff;font-size:17px">Theme ${n}</span></div></div>`));
    ui.append(h, stats, ...cards);
    out[2] = {
      svg, ui, update(t) {
        A.worldFx(BG, { x: 960, y: 540, z: 1 }, t, 0);
        const a = L(2, 's2a');
        show(h, t, a - 0.2, { kind: 'down' });
        $$(stats, '.st').forEach((e, i) => show(e, t, a + 0.4 + i * 0.3, { kind: 'up' }));
        ['s2b', 's2c', 's2d', 's2e', 's2f'].forEach((id, i) => show(cards[i], t, L(2, id) - 0.1, { kind: 'up' }));
      },
    };
  }

  // ------------------------------------------------------------ 3 Persona
  {
    const { svg, ui } = mk(3);
    const world = A.streetWorld({ width: 2400, shopsTo: 1000, park: [1000, 2400], seed: 9, lamps: [120, 860], bins: [300] });
    svg.appendChild(world);
    const sign = g(`<rect x="-8" y="-200" width="16" height="200" fill="#46506A"/>
      <path d="M-70 -300 a70 70 0 0 1 140 0 v100 h-140z" fill="#E0544B"/><rect x="-70" y="-240" width="140" height="40" fill="#C0453A"/>
      <rect x="70" y="-300" width="12" height="70" fill="#46506A"/><path d="M82 -300 h40 v24 h-40z" fill="#F28C28"/>
      <g transform="rotate(-12 -20 -300)"><rect x="-60" y="-336" width="96" height="62" rx="6" fill="#fff" stroke="#E9DCC4" stroke-width="3"/><rect x="-48" y="-322" width="60" height="8" rx="4" fill="#7B4B94"/><rect x="-48" y="-306" width="44" height="6" rx="3" fill="#D6D9E2"/></g>
      <g style="display:none">
      <rect x="-130" y="-330" width="260" height="140" rx="16" fill="#fff" stroke="#16707F" stroke-width="8"/>
      <text x="0" y="-292" font-family="Nunito" font-weight="900" font-size="22" fill="#E0544B" text-anchor="middle" letter-spacing="2">NEW PARK RULE</text>
      <text x="0" y="-255" font-family="'Baloo 2', Nunito" font-weight="800" font-size="30" fill="#1F2A44" text-anchor="middle">Dogs on leash</text>
      <text x="0" y="-222" font-family="Nunito" font-weight="800" font-size="22" fill="#46506A" text-anchor="middle">Sat–Sun · 7–10 am</text>
      <rect x="-96" y="-182" width="192" height="28" rx="14" fill="#E0544B"/>
      <text x="0" y="-162" font-family="Nunito" font-weight="900" font-size="16" fill="#fff" text-anchor="middle" letter-spacing="1.5">FICTIONAL EXAMPLE</text></g>`);
    sign.setAttribute('class', 'actor'); place(sign, 1150, FEET - 30); world.appendChild(sign);
    const leash = svgEl('path', { class: 'actor', stroke: C.purple, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
    const dog = A.dog(), jas = A.jason();
    world.append(leash, dog, jas);
    const card = el(`<div class="abs card" style="left:1230px;top:120px;width:640px;padding:0;overflow:hidden;transform-origin:0 0">
      <div style="display:flex;gap:22px;align-items:center;padding:26px 30px;background:linear-gradient(135deg,#7B4B94,#9C6DB8);color:#fff">
        <svg class="av" width="132" height="132" viewBox="-110 -112 220 220" style="border-radius:50%;background:#FFE6CC;flex:none;border:5px solid #fff">${A.jasonBust()}</svg>
        <div><div style="font:800 17px Nunito;letter-spacing:2px;opacity:.85">PERSONA</div><div style="font:800 48px/1.05 'Baloo 2'">Jason Lee</div>
        <div style="font:800 24px Nunito;margin-top:4px">34 · from Taiwan · 8 years in Melbourne</div></div></div>
      <div style="padding:22px 30px 26px">
        <div style="display:flex;gap:10px;margin-bottom:14px"><span class="chip" style="background:var(--orange-l);color:#B85C00;font-size:21px;padding:6px 16px">${ic('dog', '#B85C00', 24, 3.6)}Has a dog</span><span class="chip" style="background:#DDE8FF;color:#3A63D1;font-size:21px;padding:6px 16px">${ic('calendar', '#3A63D1', 24, 3.6)}Works full time</span></div>
        <div style="padding:14px 18px;border-radius:16px;background:var(--purple-l);font:800 italic 24px/1.35 Nunito;color:var(--purple-d)">“I know they want to help, but I don't always know who to ask, or how to say it right.”</div>
        <div style="display:flex;gap:14px;align-items:flex-start;margin-top:18px"><span style="width:48px;height:48px;border-radius:14px;background:#FFE1DE;display:grid;place-items:center;flex:none">${ic('warn', '#E0544B', 30, 3.6)}</span>
          <div><div class="k" style="color:#E0544B">Pain point</div><div style="font:800 24px/1.3 Nunito">Doesn't know who to send his opinion to, or if he's saying it right</div></div></div>
        <div style="display:flex;gap:14px;align-items:flex-start;margin-top:14px"><span style="width:48px;height:48px;border-radius:14px;background:var(--orange-l);display:grid;place-items:center;flex:none">${ic('mic', '#C96A10', 30, 3.6)}</span>
          <div><div class="k">Goal</div><div style="font:800 24px Nunito">To be heard and taken seriously</div></div></div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:16px;flex-wrap:wrap"><span class="k" style="color:var(--navy-2)">Mainly uses</span>
          <span class="chip" style="background:var(--purple);color:#fff;font-size:21px;padding:6px 16px">${ic('mic', '#fff', 24, 3.6)}AI helper</span>
          <span class="chip" style="background:#16707F;color:#fff;font-size:21px;padding:6px 16px">${ic('steps', '#fff', 24, 3.6)}Issue tracker</span></div></div></div>`);
    { // avatar: Jason's own illustration, cropped to the head and shoulders
      // (bust drawn inline above; gradients come from the page-level <defs>)
    }
    const th = el(`<div class="thought" style="left:300px;top:170px;text-align:center">
      <div class="zh" style="font:900 34px 'Noto Sans TC'">${ZH.who}<span style="font:800 26px Nunito;color:var(--navy-2)"> Who do I tell?</span></div>
      <div class="zh" style="font:900 34px 'Noto Sans TC';margin-top:6px">${ZH.words}<span style="font:800 26px Nunito;color:var(--navy-2)"> Which words?</span></div></div>`);
    const dots = el(`<div class="abs" style="left:440px;top:300px"><div style="position:absolute;left:0;top:0;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 6px 16px rgba(31,42,68,.15)"></div><div style="position:absolute;left:30px;top:50px;width:20px;height:20px;border-radius:50%;background:#fff"></div></div>`);
    const flyer = el(`<div class="abs card" style="left:1340px;top:240px;width:500px;height:300px;padding:26px 30px">
      <div class="k" style="color:var(--purple)">Council notice</div>
      <div style="font:900 36px/1.15 Nunito;margin-top:8px">Dog park closed in the mornings</div>
      <div style="font:700 22px/1.4 Nunito;color:var(--navy-2);margin-top:10px">From next month, the dog park will no longer open in the mornings.</div>
      <span class="tag" style="position:absolute;left:30px;bottom:24px;background:#E0544B;color:#fff;font-size:17px">FICTIONAL EXAMPLE</span></div>`);
    const mail = el(`<div class="abs card" style="left:1340px;top:590px;width:500px;height:130px;padding:0 26px;display:flex;align-items:center;gap:20px">
      <span style="width:66px;height:66px;border-radius:20px;background:#E6E8EE;display:grid;place-items:center;flex:none">${ic('mail', '#46506A', 38, 3.6)}</span>
      <div><div style="font:800 19px Nunito;color:var(--navy-2)">Email to the council · last year</div><div style="font:900 30px Nunito;color:#E0544B">No reply</div></div></div>`);
    ui.append(card, th, dots, flyer, mail);
    out[3] = {
      svg, ui, update(t) {
        const c = { x: 960, y: 540, z: 1 }; cam(world, c.x, c.y, c.z); A.worldFx(world, c, t, 0);
        const wk = clamp((t - L(3, 's3b') - 1.2) / 2.4), jx = lerp(-520, 560, easeOut(wk)), walking = wk > 0 && wk < 1;
        const ph = t * 1.6;
        const look = t > L(3, 's3c') + 0.6 ? -4 : 0;
        const hands = A.poseJason(jas, { walk: walking ? ph : null, mouth: t > L(3, 's3d') ? 'worried' : 'neutral', blink: blink(t, 3.4), armF: walking ? null : 16, elbowF: walking ? null : 30, look });
        place(jas, jx, FEET, 0.9);
        const dx = jx + 250;
        A.poseDog(dog, { walk: walking ? ph * 1.3 : null, t, look: walking ? 0 : Math.sin(t * 2) * 4 });
        place(dog, dx, FEET, 0.75);
        leashTo(leash, toW(hands.F, jx, 0.9), dx, 0.75);
        // persona card: centred and large for the first ~2.5 s, then docks top-right
        const k = ease(prog(t, L(3, 's3b') + 1.0, 0.8)), op = Math.min(easeOut(prog(t, 0.1, 0.4)), 1 - clamp((t - L(3, 's3c') + 0.1) / 0.35));
        card.style.opacity = op; card.style.visibility = op > 0 ? 'visible' : 'hidden';
        card.style.transform = `translate(${lerp(-648, 0, k)}px, ${lerp(40, 0, k)}px) scale(${lerp(1.18, 0.86, k)})`;
        show(dots, t, L(3, 's3d') + 0.6, { kind: 'pop' });
        show(th, t, L(3, 's3d') + 0.9, { kind: 'pop' });
        sv(sign, t, L(3, 's3c') + 0.2, { kind: 'pop' });
        show(flyer, t, L(3, 's3c') + 0.8, { kind: 'pop' });
        show(mail, t, L(3, 's3e') + 0.1, { kind: 'up' });
      },
    };
  }

  // ------------------------------------------------------------ shared street with the post (scenes 4, 5)
  const POSTX = 2600;
  const SIDE = { x: 2950, y: 580, z: 1.15 };       // composition: Jason + post on the left, screen panel on the right
  function streetWithPost() {
    const world = A.streetWorld({ width: 4200, seed: 5, trees: [700, 1500, 3300, 3900], lamps: [1100, 2000, 3050, 3650], benches: [1750], bins: [2950] });
    const post = A.post(); place(post, POSTX, POSTY, PS);
    const leash = svgEl('path', { class: 'actor', stroke: C.purple, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
    const dog = A.dog(), jas = A.jason();
    world.append(post, leash, dog, jas);
    return { world, post, leash, dog, jas };
  }
  function poseWalkers(W, t, jx, walking, opt = {}) {
    const ph = t * 1.6;
    const hands = A.poseJason(W.jas, { walk: walking ? ph : null, blink: blink(t, 3.4), armF: opt.armF ?? null, elbowF: opt.elbowF ?? null, mouth: opt.mouth, talk: opt.talk, look: opt.look || 0, phone: opt.phone || 0 });
    place(W.jas, jx, FEET, 1);
    const dx = jx - 270;
    A.poseDog(W.dog, { walk: walking ? ph * 1.3 : null, t, look: walking ? 0 : Math.sin(t * 2) * 4 });
    place(W.dog, dx, FEET, 0.8);
    leashTo(W.leash, toW(hands.B, jx, 1), dx, 0.8);
  }
  // enlarged touchscreen with leader lines from the real screen on the pillar
  const SCR = { x: 820, y: 130, w: 1040, h: 600 };
  function screenPanel(ui, inner, label) {
    const lines = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">
      <path class="ll" d="" stroke="#7B4B94" stroke-width="3" fill="rgba(123,75,148,.08)" stroke-dasharray="10 8"/>
      <rect class="sr" fill="none" stroke="#F28C28" stroke-width="5" rx="8"/></svg>`);
    const p = el(`<div class="scr" style="left:${SCR.x}px;top:${SCR.y}px"><div class="lbl">${label}</div><div class="in">${inner}</div></div>`);
    ui.append(lines, p);
    return {
      p, lines, set(t, a, c, out = null) {
        const r = POST.screenRect(c);
        const k = easeOut(prog(t, a, 0.6)), q = out == null ? 1 : 1 - clamp((t - out) / 0.35);
        const sx = lerp(r.x / SCR.w, 1, 0) ; // unused
        const x = lerp(r.x, SCR.x, k), y = lerp(r.y, SCR.y, k), sw = lerp(r.w / SCR.w, 1, k);
        p.style.transform = `translate(${x - SCR.x}px, ${y - SCR.y}px) scale(${sw})`;
        p.style.opacity = Math.min(clamp(k * 3), q); p.style.visibility = k > 0 && q > 0 ? 'visible' : 'hidden';
        const ll = $(lines, '.ll'), sr = $(lines, '.sr');
        const pw = SCR.w * sw, ph = SCR.h * sw;
        ll.setAttribute('d', `M${r.x + r.w} ${r.y} L${x} ${y} L${x} ${y + ph} L${r.x + r.w} ${r.y + r.h}z`);
        sr.setAttribute('x', r.x); sr.setAttribute('y', r.y); sr.setAttribute('width', r.w); sr.setAttribute('height', r.h);
        lines.style.opacity = Math.min(clamp(k * 2), q);
      },
    };
  }
  const POST = {
    screenRect(c) {
      const a = toScr(POSTX + A.POST.screen.x * PS, POSTY + A.POST.screen.y * PS, c);
      return { x: a.x, y: a.y, w: A.POST.screen.w * PS * c.z, h: A.POST.screen.h * PS * c.z };
    },
  };
  const issueList = `<div class="pane pl">
      <div class="hdr"><span class="melb">${melbIcon(58, 'happy')}</span>
        <div><div style="font:800 34px 'Baloo 2';color:var(--purple);line-height:1">HearHere</div><div style="font:800 21px Nunito;color:var(--navy-2)">Issues near this post</div></div>
        <span class="chip" style="margin-left:auto;background:#fff;font-size:21px;padding:6px 16px">${ic('globe', '#7B4B94', 24, 3.6)}EN / 中文 / +12</span></div>
      <div style="display:flex;gap:10px;margin:14px 0 6px">
        <span class="chip" style="background:var(--navy);color:#fff;font-size:20px;padding:6px 16px">All</span>
        <span class="chip" style="background:#fff;font-size:20px;padding:6px 16px">${ic('tree', '#16707F', 22, 4)}Parks</span>
        <span class="chip" style="background:#fff;font-size:20px;padding:6px 16px">${ic('house', '#F28C28', 22, 4)}Housing</span>
        <span class="chip" style="background:#fff;font-size:20px;padding:6px 16px">${ic('people', '#7B4B94', 22, 4)}Student life</span></div>
      <div style="font:800 18px Nunito;color:var(--orange);margin:6px 0 10px;letter-spacing:.5px">RANKED BY DISTANCE + CLOSING DATE</div>
      <div class="issue i0" style="border-color:var(--orange)"><div class="rank">1</div><div class="ico" style="background:var(--green-l)">${ic('tree', '#16707F', 38)}</div>
        <div><div class="t">Dog park opening hours</div><div class="m">120 m · closes in 5 days · Parks</div></div><span class="tag" style="margin-left:auto;background:#FFE1DE;color:#C0453A">Fictional</span><span class="tag" style="background:var(--orange-l);color:#B85C00">Dogs</span></div>
      <div class="issue i1"><div class="rank" style="background:#9C82AE">2</div><div class="ico" style="background:var(--orange-l)">${ic('house', '#F28C28', 38)}</div>
        <div><div class="t">Rental housing standards</div><div class="m">450 m · closes in 9 days · Housing</div></div></div>
      <div class="issue i2"><div class="rank" style="background:#B9A7C7">3</div><div class="ico" style="background:var(--purple-l)">${ic('people', '#7B4B94', 38)}</div>
        <div><div class="t">Library study hours</div><div class="m">800 m · closes in 21 days · Student life</div></div></div>
      <div class="tap tp0" style="left:560px;top:335px"></div></div>`;

  // pane templates for the enlarged touchscreen (scenes 4 and 5)
  const detail = `<div class="pane pd" style="opacity:0">
        <div class="hdr"><div style="width:58px;height:58px;border-radius:16px;background:var(--green-l);display:grid;place-items:center">${ic('tree', '#16707F', 38)}</div>
          <div><div class="zh" style="font:900 34px 'Noto Sans TC';line-height:1.1">${ZH.issueTitle}</div><div style="font:800 19px Nunito;color:var(--navy-2)">Dog park opening hours · 120 m · <span style="color:#C0453A">fictional example</span></div></div>
          <span class="chip" style="margin-left:auto;background:var(--purple);color:#fff;font-size:21px">${ic('globe', '#fff', 24, 3.6)}<span class="zh">${ZH.lang}</span></span></div>
        <div style="margin-top:16px"><span class="tag" style="background:var(--green);color:#fff;font-size:19px"><span class="zh">${ZH.plain}</span> · Plain-language summary</span></div>
        <div class="zh" style="font:500 31px/1.6 'Noto Sans TC';margin-top:10px">${ZH.summary1}<span style="background:#FFE08A;border-radius:10px;padding:0 8px;font-weight:900;border-bottom:4px solid var(--orange)">${ZH.term}</span>${ZH.summary2}</div>
        <div style="display:flex;gap:12px;margin-top:14px">
          <span class="chip" style="background:var(--orange-l);color:#B85C00;font-size:20px">${ic('calendar', '#B85C00', 22, 4)}<span class="zh">${ZH.closes}</span></span>
          <span class="chip" style="background:var(--purple-l);color:var(--purple);font-size:20px">${ic('building', '#7B4B94', 22, 4)}Parks &amp; Open Space</span>
          <span class="chip" style="background:var(--green-l);color:var(--green-d);font-size:20px">${ic('doc', '#16707F', 22, 4)}Source: council notice</span></div>
        <div class="tip card" style="position:absolute;left:420px;top:296px;width:560px;padding:18px 24px;border:3px solid var(--orange);opacity:0">
          <div class="k" style="font-size:16px">Key term explained</div>
          <div class="zh" style="font:900 29px 'Noto Sans TC'">${ZH.term} <span style="font:800 23px Nunito;color:var(--navy-2)">= off-leash area</span></div>
          <div class="zh" style="font:500 23px/1.5 'Noto Sans TC';color:var(--navy-2)">${ZH.termExp}</div></div>
        <div class="chip" style="position:absolute;left:40px;bottom:26px;background:var(--purple);color:#fff;font-size:24px;padding:12px 26px">${ic('mic', '#fff', 28, 3.6)}<span class="zh">${ZH.talk}</span></div>
        <div class="tap tp1" style="left:230px;top:510px"></div></div>`;
  const listen = `<div class="pane pn" style="opacity:0;display:flex;flex-direction:column;align-items:center">
        <div style="position:relative;width:260px;height:250px"><svg class="wave abs" width="260" height="250" viewBox="0 0 260 250" style="left:0;top:0"></svg>
          <div class="abs" style="left:55px;top:40px">${melbIcon(150)}</div></div>
        <div style="font:900 28px Nunito;color:var(--purple)"><span class="zh">${ZH.listening}</span> Listening</div>
        <div class="card" style="width:860px;min-height:150px;margin-top:14px;padding:16px 24px">
          <div class="k" style="font-size:16px;color:var(--navy-2)">Live transcript</div>
          <div class="zh tx" style="font:700 31px/1.5 'Noto Sans TC';margin-top:4px"></div></div></div>`;
  const comment = `<div class="pane pc" style="opacity:0">
        <div class="hdr"><span class="melb">${melbIcon(54, 'happy')}</span><div style="font:900 30px Nunito">Your comment, structured</div>
          <span class="chip" style="margin-left:auto;background:var(--green-l);color:var(--green-d);font-size:19px">${ic('lock', '#16707F', 22, 4)}<span class="zh">${ZH.noAudio}</span> · No audio stored</span></div>
        <div class="card r0" style="margin-top:16px;padding:14px 22px;box-shadow:none;border:2px solid #EADFCB"><div class="k" style="font-size:15px"><span class="zh">${ZH.original}</span> · Original (中文)</div>
          <div class="zh" style="font:700 26px/1.45 'Noto Sans TC'">${ZH.jasonLine}</div></div>
        <div class="card r1" style="margin-top:12px;padding:14px 22px;box-shadow:none;border:2px solid #EADFCB"><div class="k" style="font-size:15px">English</div>
          <div style="font:700 26px/1.4 Nunito">Please keep the morning dog walking hours.</div></div>
        <div class="r2" style="display:flex;align-items:center;gap:12px;margin-top:14px">
          <span class="chip" style="background:var(--purple-l);color:var(--purple);font-size:21px">${ic('building', '#7B4B94', 24, 3.6)}To: Parks &amp; Open Space · <span class="zh">${ZH.dept}</span></span>
          <span class="chip" style="margin-left:auto;background:#fff;border:3px solid var(--purple);color:var(--purple);font-size:21px"><span class="zh">${ZH.edit}</span> Edit</span>
          <span class="chip cf" style="background:var(--green);color:#fff;font-size:21px">${ic('send', '#fff', 22, 3.6)}<span class="zh">${ZH.confirm}</span></span></div>
        <div class="tap tp2" style="left:900px;top:520px"></div></div>`;

  // ------------------------------------------------------------ 4 Discover
  {
    const { svg, ui } = mk(4);
    const W = streetWithPost(); svg.appendChild(W.world);
    const badge = el(`<div class="abs card" style="left:1180px;top:330px;width:620px;padding:28px 32px">
      <div class="k">Side panel</div><div class="h2">Verified notices only</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
        <div class="chip" style="background:var(--purple-l);color:var(--purple)">${ic('building', '#7B4B94', 28, 3.6)}City council</div>
        <div class="chip" style="background:var(--orange-l);color:var(--orange-d)">${ic('doc', '#C96A10', 28, 3.6)}Library events</div>
        <div class="chip" style="background:var(--green-l);color:var(--green-d)">${ic('people', '#16707F', 28, 3.6)}Community groups</div></div>
      <div style="margin-top:16px;font:800 22px Nunito;color:var(--green-d)">${ic('check', '#16707F', 26, 4)} No commercial ads</div></div>`);
    const when = el(`<div class="abs card" style="left:56px;top:150px;padding:12px 24px;display:flex;align-items:center;gap:12px;font:900 30px Nunito">${ic('calendar', '#7B4B94', 34, 3.6)}Saturday · 8:00 am</div>`);
    const bub = el(`<div class="bubble" style="left:0;top:0;font-size:36px">Hi! <span class="zh">${ZH.hello}</span> I'm all ears!</div>`);
    const panel = screenPanel(ui, issueList + detail, 'POST TOUCHSCREEN');
    out[4] = {
      svg, ui, update(t) {
        const b = L(4, 's4b'), c = L(4, 's4c');
        const wk = clamp(t / 3.8), jx = lerp(1050, 2300, ease(wk)), walking = wk < 1;
        const walkCam = { x: Math.min(jx + 380, 2700), y: 540, z: 1 };
        const cm = t > b - 0.3 ? lerpCam(walkCam, SIDE, ease(prog(t, b - 0.3, 1.0))) : walkCam;
        cam(W.world, cm.x, cm.y, cm.z); A.worldFx(W.world, cm, t, 0);
        const tapping = (t > b + 0.5 && t < b + 1.4) || (t > b + 2.9 && t < b + 3.8);
        poseWalkers(W, t, jx, walking, { armF: tapping ? 62 : null, elbowF: tapping ? 8 : null, look: t > b ? -3 : 0, mouth: t > c + 1.0 ? 'smile' : 'neutral' });
        A.posePost(W.post, { mood: 'idle', t, blink: blink(t, 3.1), bob: Math.sin(t * 2.2) * 3, screen: t > b + 0.8 ? 'list' : 'idle', look: { x: -8, y: 2 } });
        panel.set(t, b + 0.9, cm);
        const P = (q) => $(panel.p, q);
        const pane = (cls, a0, a1) => { const p = P(cls); const v = Math.min(easeOut(prog(t, a0, 0.35)), a1 == null ? 1 : 1 - clamp((t - a1) / 0.3)); p.style.opacity = v; p.style.transform = `translateX(${(1 - easeOut(prog(t, a0, 0.35))) * 40}px)`; };
        pane('.pl', -1, c - 0.1); pane('.pd', c - 0.1, null);
        $$(panel.p, '.issue').forEach((e, n) => show(e, t, b + 1.4 + n * 0.3, { kind: 'left', dist: 30 }));
        tapAt(P('.tp0'), t, b + 3.2);
        show(P('.tip'), t, c + 1.8, { kind: 'pop' });
      },
    };
  }

  // ------------------------------------------------------------ 5 Understand & speak
  {
    const { svg, ui } = mk(5);
    const W = streetWithPost(); svg.appendChild(W.world);
    const panel = screenPanel(ui, issueList.replace('class="pane pl"', 'class="pane pl"') + detail + listen + comment, 'POST TOUCHSCREEN');
    const lock = el(`<div class="abs card" style="left:1180px;top:780px;padding:14px 24px;display:flex;align-items:center;gap:14px;font:900 30px Nunito;color:var(--green-d)">${ic('lock', '#16707F', 40, 3.6)}No audio is stored on the post</div>`);
    ui.append(lock);
    const P = (s) => $(panel.p, s);
    const wave = P('.wave');
    out[5] = {
      svg, ui, update(t) {
        const c = L(5, 's5c'), j = L(5, 's5j'), je = LE(5, 's5j'), d = L(5, 's5d'), e = L(5, 's5e');
        cam(W.world, SIDE.x, SIDE.y, SIDE.z); A.worldFx(W.world, SIDE, t, 0);
        const tapping = (t > c + 0.2 && t < c + 1.1) || (t > e + 1.4 && t < e + 2.3);
        const talking = t > j && t < je;
        poseWalkers(W, t, 2300, false, { armF: tapping ? 62 : null, elbowF: tapping ? 8 : null, mouth: talking ? 'talk' : 'smile', talk: talking ? Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5)) : 0, look: -3 });
        A.posePost(W.post, { mood: t > c && t < je + 0.2 ? 'listen' : (t > d && t < d + 2 ? 'happy' : 'idle'), t, blink: blink(t, 3.1), bob: Math.sin(t * 2.2) * 3, screen: 'list', look: { x: -8, y: 2 } });
        panel.set(t, -1, SIDE);
        // panes
        const pane = (cls, a0, a1) => { const p = P(cls); const v = Math.min(easeOut(prog(t, a0, 0.35)), a1 == null ? 1 : 1 - clamp((t - a1) / 0.3)); p.style.opacity = v; p.style.transform = `translateX(${(1 - easeOut(prog(t, a0, 0.35))) * 40}px)`; };
        pane('.pl', -1, -0.5); pane('.pd', -1, c + 0.9); pane('.pn', c + 0.9, d - 0.1); pane('.pc', d - 0.1, null);
        tapAt(P('.tp1'), t, c + 0.4); tapAt(P('.tp2'), t, e + 1.7);
        show(P('.tip'), t, -1, { kind: 'pop', out: c + 0.6 });
        typeText(P('.tx'), ZH.jasonLine, t, j + 0.1, je - j - 0.2);
        let svgW = '';
        if (t > c + 0.9 && t < d) for (let k = 0; k < 3; k++) { const ph = ((t * 0.9 + k / 3) % 1); svgW += `<circle cx="130" cy="125" r="${70 + ph * 60}" fill="none" stroke="#7B4B94" stroke-width="5" opacity="${(1 - ph) * (talking ? 0.7 : 0.3)}"/>`; }
        if (wave.innerHTML !== svgW) wave.innerHTML = svgW;
        ['.r0', '.r1', '.r2'].forEach((s, k) => show(P(s), t, d + 0.3 + k * 1.3, { kind: 'up', dist: 20 }));
        const cf = P('.cf'); cf.style.transform = t > e + 1.7 ? `scale(${1 + 0.12 * Math.sin(prog(t, e + 1.7, 0.4) * Math.PI)})` : '';
        show(lock, t, e, { kind: 'up' });
      },
    };
  }

  // ------------------------------------------------------------ 6 NFC & tracking
  {
    const { svg, ui } = mk(6);
    const W = streetWithPost(); svg.appendChild(W.world);
    // post on the left third (Jason just off-frame); the phone works in the space to its right
    const C6 = { x: POSTX + 420, y: POSTY - 307, z: 1.5 };
    const phone = el(`<div class="phone" style="left:0;top:0">
      <div class="ps"><div class="notch"></div>
        <div class="app-h">${appIcon(56)}<div><div class="s">HearHere</div><div class="n">My issues</div></div></div>
        <div class="v0 abs" style="left:0;right:0;top:140px;bottom:0;display:grid;place-items:center;text-align:center">
          <div><svg width="170" height="170" viewBox="0 0 170 170"><circle cx="85" cy="85" r="78" fill="var(--orange-l)"/><path d="M60 60 q25 25 0 50 M80 45 q40 40 0 80 M100 30 q55 55 0 110" stroke="#F28C28" stroke-width="10" fill="none" stroke-linecap="round"/></svg>
          <div style="font:800 26px Nunito;margin-top:10px">Hold near the post</div></div></div>
        <div class="v1 abs" style="left:0;right:0;top:140px;bottom:0;padding:24px 24px;opacity:0">
          <div class="saved" style="display:flex;align-items:center;gap:12px;background:var(--green-l);border-radius:18px;padding:12px 16px;font:900 22px Nunito;color:var(--green-d)">${ic('check', '#16707F', 30, 4)}<span class="zh">${ZH.saved}</span></div>
          <div class="card" style="margin-top:16px;padding:18px 20px;box-shadow:0 6px 16px rgba(31,42,68,.08)">
            <div class="zh" style="font:900 26px 'Noto Sans TC'">${ZH.issueTitle}</div><div style="font:800 17px Nunito;color:var(--navy-2)">Dog park opening hours · Parks &amp; Open Space</div>
            <div style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#FFF1E3"><div style="font:800 13px Nunito;color:#8A3300">YOUR COMMENT</div><div class="zh" style="font:700 17px 'Noto Sans TC'">${ZH.jasonLine}</div>
              <div style="font:800 13px Nunito;color:#8A3300;margin-top:6px">SENT IN ENGLISH</div><div style="font:700 16px Nunito">Please keep the morning dog walking hours.</div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;font:800 20px Nunito"><span><span class="zh">${ZH.track}</span><br><span style="font-size:16px;color:var(--navy-2)">Track this issue</span></span>
              <span class="tg" style="width:76px;height:42px;border-radius:21px;background:#CFD3DC;position:relative;display:inline-block"><span class="kn" style="position:absolute;left:4px;top:4px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)"></span></span></div></div>
          <div class="steps" style="margin-top:8px;padding:0 6px">
            ${[['Received', ZH.recv, 'Ref #CASE-2026-0417'], ['In review', ZH.review, 'Parks &amp; Open Space team'], ['Outcome', ZH.outcome, 'Decision + reasons']].map(([e, z, s], i) => `
            <div class="step s${i}"><span class="dot">${i + 1}</span><div><div style="font:900 23px Nunito">${e} <span class="zh" style="font-weight:700;color:var(--navy-2)">${z}</span></div><div style="font:700 16px Nunito;color:var(--navy-2)">${s}</div></div></div>
            ${i < 2 ? '<div style="margin-left:21px;width:3px;height:6px;background:#E1E3EA"></div>' : ''}`).join('')}</div></div>
        ${TABBAR}<div class="notif abs" style="left:14px;right:14px;top:14px;padding:14px 16px;border-radius:20px;background:rgba(255,255,255,.97);box-shadow:0 10px 30px rgba(31,42,68,.25);display:flex;gap:12px;align-items:center;z-index:6;opacity:0">
          <span style="width:46px;height:46px;border-radius:12px;background:var(--purple);display:grid;place-items:center">${ic('bell', '#fff', 28, 3.6)}</span>
          <div><div style="font:900 18px Nunito">HearHere · now</div><div class="zh" style="font:700 17px 'Noto Sans TC'">${ZH.notify}</div></div></div></div></div>`);
    const outs = el(`<div class="abs" style="left:1250px;top:190px;width:620px">
      <div class="k" style="display:inline-block;background:#fff;border-radius:999px;padding:4px 14px">Outcome · fictional examples</div>
      <div class="card o0" style="margin-top:12px;padding:20px 26px;height:150px;border-left:12px solid var(--green)"><div style="font:900 28px Nunito">${ic('check', '#16707F', 30, 4)} Decision: opens 6–9 am on weekends</div>
        <div style="margin-top:8px"><span class="tag" style="background:var(--navy);color:#fff">Case no. CASE-2026-0417</span> <span class="tag" style="background:var(--purple-l);color:var(--purple)">Parks &amp; Open Space</span></div></div>
      <div class="card o1" style="margin-top:16px;padding:20px 26px;height:150px;border-left:12px solid var(--red)"><div style="font:900 28px Nunito"><span class="zh" style="color:var(--red)">${ZH.declined}</span> Declined: reasons are shown</div>
        <div style="font:700 24px Nunito;color:var(--navy-2);margin-top:6px">“Morning maintenance; a temporary dog area opens nearby.”</div></div>
      <div class="ft card" style="margin-top:16px;padding:12px 18px;font:800 21px Nunito;color:var(--navy-2)">${ic('steps', '#46506A', 28, 3.6)} Shows the issue's status, not a promise that a comment is accepted.</div></div>`);
    const nfcTxt = el(`<div class="abs card" style="left:56px;top:140px;padding:12px 22px;font:900 26px Nunito;display:flex;gap:12px;align-items:center">${ic('lock', '#16707F', 32, 3.6)}The post keeps nothing</div>`);
    // badge collection: one badge per HearHere post visited
    const BADGES = [['Riverside Park', '#1E9BB0', 'tree', 1], ['State Library', '#7B4B94', 'doc', 1], ['Campus Gate', '#F28C28', 'people', 1], ['Town Hall', '#3A63D1', 'building', 0],
      ['Market Lane', '#E0544B', 'house', 0], ['Tram Stop 12', '#16707F', 'tram', 0], ['Fitzroy Gardens', '#9C6DB8', 'sprout', 0], ['Docklands', '#C96A10', 'pin', 0]];
    const badges = el(`<div class="abs card" style="left:1250px;top:190px;width:620px;padding:26px 30px">
      <div class="k">HearHere badges</div><div class="h2" style="font-size:38px">Collect a badge at every post</div>
      <div class="bnew" style="display:flex;align-items:center;gap:16px;margin-top:16px;padding:14px 18px;border-radius:20px;background:var(--orange-l)">
        <span style="width:74px;height:74px;border-radius:50%;background:#1E9BB0;display:grid;place-items:center;box-shadow:0 0 0 6px #fff,0 0 0 9px #F28C28">${ic('tree', '#fff', 40, 3.6)}</span>
        <div><div style="font:900 26px Nunito">Badge unlocked!</div><div style="font:800 21px Nunito;color:var(--navy-2)">Riverside Park post · 3 of 24 collected</div></div></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px">
        ${BADGES.map(([n, c, i, got], k) => `<div class="bd bd${k}" style="text-align:center"><div style="width:84px;height:84px;margin:0 auto;border-radius:50%;display:grid;place-items:center;background:${got ? c : '#E6E8EE'};${got ? '' : 'border:3px dashed #C9CCD6'}">${ic(i, got ? '#fff' : '#B9BDC9', 40, 3.6)}</div>
          <div style="font:800 15px Nunito;color:${got ? 'var(--navy)' : '#9AA0B4'};margin-top:6px">${n}</div></div>`).join('')}</div>
      <div style="margin-top:14px;font:800 19px Nunito;color:var(--navy-2)">${ic('lock', '#46506A', 22, 4)} Badges stay on Jason's phone</div></div>`);
    ui.append(phone, outs, badges, nfcTxt);
    const Q = s => $(phone, s);
    out[6] = {
      svg, ui, update(t) {
        const a = L(6, 's6a'), b = L(6, 's6b'), d = L(6, 's6d'), c = d - 0.2, f = 1e9, e = d + 6.2;
        const cm = lerpCam(SIDE, C6, ease(prog(t, 0, 0.9)));
        cam(W.world, cm.x, cm.y, cm.z); A.worldFx(W.world, cm, t, 0);
        poseWalkers(W, t, 2300, false, { mouth: 'smile', look: -3 });
        const tapT = a + 1.25;
        A.posePost(W.post, { mood: t > tapT && t < b + 2 ? 'happy' : 'idle', t, blink: blink(t, 3.1), bob: Math.sin(t * 2.2) * 3, screen: t > b + 0.5 ? 'ok' : 'list', glow: 0, look: { x: 8, y: 2 } });
        // phone: comes in from the right, taps the NFC pad, then moves to the middle-right for the tracker
        const nfc = toScr(POSTX + A.POST.nfc.x * PS, POSTY + A.POST.nfc.y * PS, cm);
        const k1 = ease(prog(t, a + 0.2, 1.0)), bump = Math.sin(clamp((t - tapT + 0.15) / 0.3) * Math.PI) * 16;
        const nearX = nfc.x + 8, nearY = nfc.y - 26;
        const k2 = ease(prog(t, c - 0.2, 0.9));
        const px = lerp(lerp(2000, nearX, k1) - bump, 760, k2), py = lerp(lerp(nearY - 360, nearY, k1), 100, k2);
        const sc = lerp(0.5, 1, k2), rot = lerp(lerp(14, -8, k1), 0, k2);
        const fl = Math.sin(t * 1.4) * 5 * k2;
        phone.style.transform = `translate(${px}px, ${py + fl}px) rotate(${rot}deg) scale(${sc})`;
        phone.style.transformOrigin = '0 0';
        Q('.v0').style.opacity = 1 - prog(t, tapT, 0.3);
        Q('.saved').style.display = t > c + 0.6 ? 'none' : '';   // make room for all three tracker steps above the tab bar
        Q('.v1').style.opacity = prog(t, tapT, 0.3);
        show(nfcTxt, t, b + 0.6, { kind: 'pop' });
        const on = prog(t, c + 0.9, 0.25);
        Q('.tg').style.background = on > 0.5 ? 'var(--green)' : '#CFD3DC'; Q('.kn').style.left = `${4 + 34 * on}px`;
        [0, 1, 2].forEach(i => {
          const st = Q('.s' + i), dt = $(st, '.dot'), lit = t > d + [1.6, 3.0, 4.6][i];
          dt.style.background = lit ? ['var(--green)', 'var(--purple)', 'var(--orange)'][i] : '#CFD3DC';
          dt.style.transform = lit ? `scale(${backOut(prog(t, d + [1.6, 3.0, 4.6][i], 0.35))})` : '';
          dt.innerHTML = lit && i === 0 ? '✓' : String(i + 1);
          st.style.opacity = t > c + 0.9 ? 1 : 0.45;
        });
        show($(outs, '.o0'), t, d + 4.6, { kind: 'right', out: f - 0.3 });
        show($(outs, '.o1'), t, d + 5.4, { kind: 'right', out: f - 0.3 });
        const ko = Math.min(clamp((t - d - 4.5) * 3), 1 - clamp((t - f + 0.3) * 3));
        $(outs, '.k').style.opacity = ko; $(outs, '.ft').style.opacity = Math.min(clamp((t - d - 6.0) * 3), 1 - clamp((t - f + 0.3) * 3));
        const n = Q('.notif'); const np = Math.min(easeOut(prog(t, e + 0.15, 0.4)), 1 - clamp((t - f) / 0.4));
        n.style.opacity = np; n.style.transform = `translateY(${(1 - np) * -80}px)`;
        show(badges, t, f, { kind: 'right' });
        show($(badges, '.bnew'), t, f + 0.5, { kind: 'pop' });
        $$(badges, '.bd').forEach((e2, k) => show(e2, t, f + 0.8 + k * 0.12, { kind: 'pop' }));
      },
    };
  }

  const SYS_HTML = (card3) => {
    return el(`<div class="abs" style="inset:0">
      <div class="hd abs" style="left:0;right:0;top:112px;text-align:center"><span class="card" style="display:inline-block;padding:12px 30px;font:800 46px 'Baloo 2'">One post, three connected channels</span></div>
      <div class="abs" style="left:110px;top:230px">${card3('c0', 'Official social media', '@hearhere.spud · official account', `
        <div style="display:flex;align-items:center;gap:12px"><span style="width:58px;height:58px;border-radius:50%;background:var(--cream);display:grid;place-items:center">${melbIcon(48, 'happy')}</span>
          <div><div style="font:900 22px Nunito">HearHere Spud <span style="background:#3A63D1;color:#fff;border-radius:50%;padding:0 7px;font-size:16px">✓</span></div><div style="font:700 17px Nunito;color:var(--navy-2)">Verified council posts only</div></div></div>
        <div style="margin-top:14px;height:120px;border-radius:14px;background:linear-gradient(135deg,#FFE6CC,#EDE3F3);display:grid;place-items:center;font:800 22px Nunito;color:var(--purple)">Have your say: park rules</div>
        <div style="margin-top:12px;font:800 19px Nunito;color:#16707F">${ic('lock', '#16707F', 22, 4)} Verified content only, so it can't be impersonated</div>`, 'linear-gradient(135deg,#E1306C,#F77737)')}</div>
      <div class="plus abs p0" style="left:600px;top:420px;font:900 70px Nunito;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.3)">+</div>
      <div class="abs" style="left:725px;top:230px">${card3('c1', 'AI agent', 'Answers from official documents', `
        <div class="msg me" style="margin:0 0 10px auto;font-size:19px">Which department do I contact?</div>
        <div class="msg bot" style="font-size:19px;margin:0">Parks &amp; Open Space. See the draft rule, p. 4.<div><span class="src">${ic('doc', '#16707F', 16, 4)}Source cited</span></div></div>
        <div style="margin-top:12px;font:800 19px Nunito;color:var(--navy-2)">${ic('user', '#46506A', 22, 4)} Hands over to a person when unsure</div>`, 'linear-gradient(135deg,#7B4B94,#9C6DB8)')}</div>
      <div class="plus abs p1" style="left:1215px;top:420px;font:900 70px Nunito;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.3)">+</div>
      <div class="abs" style="left:1340px;top:230px">${card3('c2', 'HearHere app', 'Saved issues + tracker', `
        ${[['Received', '#1E9BB0', '✓'], ['In review', '#7B4B94', '2'], ['Outcome', '#CFD3DC', '3']].map(([n, c, m]) => `<div class="step" style="padding:6px 0"><span class="dot" style="background:${c}">${m}</span><div style="font:900 22px Nunito">${n}</div></div>`).join('')}
        <div style="margin-top:8px;font:800 19px Nunito;color:var(--navy-2)">${ic('bell', '#46506A', 22, 4)} Notifies when the status changes</div>`, 'linear-gradient(135deg,#16707F,#1E9BB0)')}</div>
      <div class="th5 abs card" style="left:110px;top:770px;padding:14px 24px;display:flex;align-items:center;gap:14px;font:800 24px Nunito">${ic('globe', '#C96A10', 32, 3.6)}<span><b style="color:var(--orange-d)">Theme 5:</b> reach residents on the channels they already use</span></div>
      <div class="sk abs card" style="left:1340px;top:740px;padding:10px 14px;display:flex;align-items:center;gap:12px"><img src="img/sk_three.png" style="height:96px"><span style="font:800 18px/1.3 Nunito;color:var(--navy-2)">From our<br>concept sketch</span></div></div>`);
  };
  // ------------------------------------------------------------ 12 Introducing HearHere: pillar + AI helper, Spud, product views
  {
    const { svg, ui } = mk(12);
    const BG = A.streetWorld({ width: 2400 }); svg.appendChild(BG);
    const post = A.post(); svg.appendChild(post);
    // Spud's head from four angles, redrawn from the sketch's side / front / top / down views
    const head = (inner) => `<svg width="170" height="170" viewBox="-110 -130 220 220">${inner}</svg>`;
    const ears = '<path d="M-62 -40 l-12 -80 l60 40z" fill="#8F5FAA"/><path d="M-56 -52 l-7 -50 l35 27z" fill="#F4B6D2"/><path d="M62 -40 l12 -80 l-60 40z" fill="#8F5FAA"/><path d="M56 -52 l7 -50 l-35 27z" fill="#F4B6D2"/>';
    const views = [
      ['Side', head(`<path d="M10 -40 l-6 -82 l52 46z" fill="#8F5FAA"/><path d="M14 -52 l-3 -52 l30 28z" fill="#F4B6D2"/><circle r="82" fill="#7B4B94"/><circle cx="-26" cy="-40" r="30" fill="#fff" opacity=".14"/>
        <path d="M-84 -30 h52 a32 32 0 0 1 0 64 h-52z" fill="#1F2A44"/><ellipse cx="-50" cy="0" rx="8" ry="12" fill="#8FF0FF"/>
        <circle cx="30" cy="30" r="26" fill="#3E2552"/>${[-12, -4, 4, 12].map(x => `<rect x="${30 + x - 1.5}" y="16" width="3" height="28" rx="1.5" fill="#B79CCB"/>`).join('')}`)],
      ['Front', melbIcon(170)],
      ['Top', head(`${ears}<circle r="82" fill="#7B4B94"/><circle cx="0" cy="0" r="58" fill="#8F5FAA"/><circle cx="0" cy="-8" r="5" fill="#2E1A3D"/>
        <path d="M-52 52 a70 40 0 0 0 104 0" fill="#1F2A44"/><ellipse cx="-24" cy="62" rx="7" ry="5" fill="#8FF0FF"/><ellipse cx="24" cy="62" rx="7" ry="5" fill="#8FF0FF"/>`)],
      ['Down', head(`<circle r="82" fill="#7B4B94"/><circle r="30" fill="#2B2350"/><circle r="16" fill="#9AA2C4"/>
        <circle cx="-58" cy="0" r="18" fill="#3E2552"/><circle cx="58" cy="0" r="18" fill="#3E2552"/>${[-6, 0, 6].map(x => `<rect x="${-58 + x - 1}" y="-10" width="2" height="20" fill="#B79CCB"/><rect x="${58 + x - 1}" y="-10" width="2" height="20" fill="#B79CCB"/>`).join('')}`)],
    ];
    const prod = el(`<div class="abs card" style="left:1000px;top:150px;width:860px;padding:26px 32px">
      <div class="k">Product views</div><div class="h2" style="font-size:40px">Spud from every side</div>
      <div style="display:flex;justify-content:space-between;margin-top:12px">${views.map(([n, v]) => `<div style="text-align:center"><div style="width:180px;height:180px;border-radius:24px;background:var(--cream);display:grid;place-items:center">${v.replace(/width="170" height="170"/, 'width="160" height="160"')}</div>
        <div style="font:900 22px Nunito;margin-top:6px">${n}</div></div>`).join('')}</div>
      <div style="display:flex;align-items:flex-end;gap:14px;margin-top:16px;padding-top:14px;border-top:2px dashed #E9DCC4">
        <img src="img/sk_side.png" style="height:200px"><img src="img/sk_front.png" style="height:200px">
        <div><img src="img/sk_views.png" style="height:92px;display:block"><div style="font:800 20px/1.3 Nunito;color:var(--navy-2);margin-top:10px">Redrawn from our concept sketch</div></div></div></div>`);
    // callouts on the hero post (positions in screen px; post at x=430, ground y=1000, scale 1.0625)
    const HS = PS * 1.25, HX = 430, HY = 1000;
    const parts = [['Spud: talk in any language', -470, '#7B4B94', 'mic'], ['Touchscreen: local issues', -354, '#3A63D1', 'pin'], ['NFC pad: save to your phone', -295, '#F28C28', 'lock'], ['Pillar: verified notices', -160, '#16707F', 'doc']];
    const callY = [430, 560, 690, 820];
    const calls = el(`<div class="abs" style="inset:0">
      <svg class="abs" width="1920" height="1080" style="left:0;top:0">${parts.map(([, py, c], i) => `<path class="cl cl${i}" d="M${HX + 70} ${HY + py * HS} L ${HX + 150} ${HY + py * HS} L 690 ${callY[i] + 30}" stroke="${c}" stroke-width="3.5" fill="none"/><circle class="cl cl${i}" cx="${HX + 70}" cy="${HY + py * HS}" r="7" fill="${c}"/>`).join('')}</svg>
      ${parts.map(([n, , c, i], k) => `<div class="abs card co co${k}" style="left:690px;top:${callY[k]}px;width:280px;height:60px;padding:0 16px;display:flex;align-items:center;gap:10px;font:900 19px/1.15 Nunito;border-left:8px solid ${c}">${ic(i, c, 28, 3.6)}${n}</div>`).join('')}</div>`);
    // --- intro cards: physical pillar + AI customised helper = HearHere, then Spud
    const intro = el(`<div class="abs" style="inset:0">
      <div class="ti abs card" style="left:1000px;top:130px;width:860px;height:190px;padding:26px 34px">
        <div class="k">Introducing</div>
        <div style="font:800 92px/1 'Baloo 2'"><span style="color:var(--purple)">Hear</span><span style="color:var(--orange)">Here</span></div>
        <div style="font:800 24px Nunito;color:var(--navy-2);margin-top:8px">A digital device for local council decisions</div></div>
      ${[['ea', 'Street pillar', 'Local decisions on the street', '#16707F', 'doc'], ['eq', 'Mobile app', 'Save and track issues', '#3A63D1', 'steps'], ['eb', 'AI helper inside', 'Speaks your language', '#7B4B94', 'chat']].map(([c, t, d, col, i], n) => `
      <div class="${c} abs card" style="left:${1000 + n * 300}px;top:350px;width:260px;height:230px;padding:22px 22px">
        <span style="width:62px;height:62px;border-radius:18px;background:${col};display:grid;place-items:center">${ic(i, '#fff', 36, 3.6)}</span>
        <div style="font:900 27px/1.15 Nunito;margin-top:14px">${t}</div>
        <div style="font:700 19px Nunito;color:var(--navy-2);margin-top:6px">${d}</div></div>`).join('')}
      <div class="ac abs card" style="left:1000px;top:610px;width:860px;height:130px;padding:0 30px;display:flex;align-items:center;gap:22px">
        <span style="flex:none">${melbIcon(86, 'happy')}</span>
        <div><div class="k">The AI helper</div><div style="font:900 32px Nunito">Spud listens, explains and translates</div></div></div>
      </div>`);
    ui.append(intro, prod, calls);
    out[12] = {
      svg, ui, update(t) {
        const a = L(12, 'i1'), c = L(12, 'i2'), b = a + 4.6;
        cam(BG, 960, 540, 1);
        const pin = backOut(prog(t, 0.1, 0.7));
        place(post, 430, 1000, PS * 1.25 * (0.4 + 0.6 * pin));
        post.setAttribute('opacity', clamp(t / 0.3));
        const talking = false;
        A.posePost(post, { mood: t > b ? 'happy' : 'idle', talk: talking ? Math.abs(Math.sin(t * 12)) : 0, t, blink: blink(t, 3.1), bob: Math.sin(t * 2.2) * 3, screen: 'idle', tilt: Math.sin(t * 0.9) * 3, look: { x: 8, y: 0 } });
        const out1 = 1e9;
        show($(intro, '.ti'), t, a + 0.3, { kind: 'down', out: out1 });
        show($(intro, '.ea'), t, a + 1.6, { kind: 'up', out: out1 });
        show($(intro, '.eq'), t, a + 2.4, { kind: 'up', out: out1 });
        show($(intro, '.eb'), t, a + 3.2, { kind: 'up', out: out1 });
        show($(intro, '.ac'), t, a + 4.0, { kind: 'up', out: out1 });
        prod.style.opacity = 0; calls.style.opacity = 0;
      },
    };
  }

  // ------------------------------------------------------------ 11 How it works: one post, three channels (sketch: social + AI agent + app)
  {
    const { svg, ui } = mk(11);
    const BG = A.streetWorld({ width: 2400 }); svg.appendChild(BG);
    const card3 = (cls, title, sub, body, c) => `<div class="abs card ${cls}" style="width:470px;height:430px;padding:0;overflow:hidden">
      <div style="padding:18px 24px;background:${c};color:#fff"><div style="font:900 30px Nunito">${title}</div><div style="font:800 19px Nunito;opacity:.9">${sub}</div></div>
      <div style="padding:20px 24px">${body}</div></div>`;
    const sys = SYS_HTML(card3);
    ui.append(sys);
    out[11] = {
      svg, ui, update(t) {
        const a = L(11, 'h2'), b = L(11, 'h3');
        cam(BG, 960, 540, 1);
        show($(sys, '.hd'), t, a - 0.2, { kind: 'down' });
        show($(sys, '.c0'), t, a + 1.6, { kind: 'up' });
        show($(sys, '.th5'), t, a + 3.4, { kind: 'left' });
        show($(sys, '.p0'), t, b - 0.2, { kind: 'pop' });
        show($(sys, '.c1'), t, b, { kind: 'up' });
        show($(sys, '.p1'), t, b + 1.6, { kind: 'pop' });
        show($(sys, '.c2'), t, b + 1.8, { kind: 'up' });
        show($(sys, '.sk'), t, b + 2.6, { kind: 'pop' });
      },
    };
  }

  // ------------------------------------------------------------ 7 Share to social
  {
    const { svg, ui } = mk(7);
    const BG = backdrop(svg, 27); A.worldFx(BG, { x: 960, y: 540, z: 1 }, 0, 0);
    ui.insertAdjacentHTML('beforeend', frost());
    const phone = el(`<div class="phone" style="left:300px;top:150px">
      <div class="ps"><div class="notch"></div>
        <div class="app-h">${appIcon(56)}<div><div class="s">HearHere</div><div class="n">My issues</div></div></div>
        <div style="padding:22px 22px">
          <div class="card" style="padding:18px 20px;box-shadow:0 6px 16px rgba(31,42,68,.08)">
            <div class="zh" style="font:900 26px 'Noto Sans TC'">${ZH.issueTitle}</div><div style="font:800 17px Nunito;color:var(--navy-2)">Dog park opening hours · fictional example</div>
            <div style="display:flex;gap:8px;margin-top:12px"><span class="tag" style="background:#DDF1F5;color:#16707F">Received ✓</span><span class="tag" style="background:var(--purple-l);color:var(--purple)">In review</span></div></div>
          <div class="card" style="margin-top:16px;padding:16px 20px;box-shadow:0 6px 16px rgba(31,42,68,.08);font:800 19px/1.4 Nunito;color:var(--navy-2)">
            Closes in 5 days. Neighbours can still have their say.</div>
          <div class="shb" style="margin-top:22px;display:flex;align-items:center;justify-content:center;gap:12px;background:linear-gradient(135deg,#E1306C,#F77737);color:#fff;border-radius:18px;padding:16px;font:900 24px Nunito">${ic('share', '#fff', 30, 3.6)}Share to Instagram</div>
          <div class="tap tp7" style="left:220px;top:470px"></div></div>${TABBAR}</div></div>`);
    const share = el(`<div class="abs" style="left:880px;top:100px;width:900px;height:760px">
      <div class="story card" style="position:absolute;left:250px;top:40px;width:400px;height:640px;padding:0;overflow:hidden;background:linear-gradient(160deg,#7B4B94,#F28C28)">
        <div style="padding:30px;color:#fff"><div style="display:flex;align-items:center;gap:10px;font:800 20px Nunito"><span style="width:44px;height:44px;border-radius:50%;background:var(--cream);display:grid;place-items:center">${melbIcon(38, 'happy')}</span>@hearhere.spud</div>
          <div style="font:800 54px/1.05 'Baloo 2';margin-top:70px">Have your say!</div>
          <div class="zh" style="font:900 34px 'Noto Sans TC';margin-top:14px">${ZH.issueTitle}</div>
          <div style="font:800 24px Nunito;margin-top:8px;opacity:.95">Dog park opening hours · closes in 5 days<br><span style="font-size:18px;opacity:.85">(fictional example)</span></div>
          <div style="margin-top:60px;background:#fff;color:var(--purple);border-radius:999px;padding:14px 20px;text-align:center;font:900 24px Nunito">Open in HearHere</div></div></div>
      ${[[40, 60], [740, 60], [40, 320], [740, 320], [40, 580], [740, 580]].map(([x, y], i) => `
        <div class="nb nb${i}" style="position:absolute;left:${x}px;top:${y}px;width:120px;text-align:center"><div style="width:110px;height:110px;margin:0 auto;border-radius:50%;background:${['#FFD9AE', '#CFE7F0', '#E7D4F1', '#BFD9F2', '#FFC7C2', '#FFE08A'][i]};display:grid;place-items:center;box-shadow:0 8px 20px rgba(31,42,68,.15)">${ic('user', '#46506A', 60, 3.4)}</div>
        <div style="margin-top:8px"><span class="card" style="display:inline-block;padding:2px 12px;font:900 22px Nunito;color:var(--red)">♥</span></div></div>`).join('')}</div>`);
    ui.append(phone, share);
    out[7] = {
      svg, ui, update(t) {
        A.worldFx(BG, { x: 960, y: 540, z: 1 }, t, 0);
        const c = L(7, 's7c');
        show(phone, t, 0.0, { kind: 'up' });
        tapAt($(phone, '.tp7'), t, c + 0.6);
        $(phone, '.shb').style.transform = t > c + 0.6 ? `scale(${1 - 0.06 * Math.sin(prog(t, c + 0.6, 0.3) * Math.PI)})` : '';
        show($(share, '.story'), t, c + 0.9, { kind: 'pop' });
        [0, 1, 2, 3, 4, 5].forEach(i => show($(share, '.nb' + i), t, c + 1.8 + i * 0.3, { kind: 'pop' }));
      },
    };
  }

  // ------------------------------------------------------------ 8 Benefits
  {
    const { svg, ui } = mk(8);
    const BG = backdrop(svg, 33); A.worldFx(BG, { x: 960, y: 540, z: 1 }, 0, 0);
    ui.insertAdjacentHTML('beforeend', frost());
    const h = el(`<div class="abs" style="left:0;right:0;top:90px;text-align:center"><span class="card h1" style="display:inline-block;padding:10px 34px;font-size:56px">What HearHere means for Jason</span></div>`);
    const cards = [['translate', 'Understands the policy in his own language', C.orange, ['R1 Multilingual']], ['building', 'Finds the right department', C.purple, ['R4 Q&A support']],
      ['check', 'Knows his opinion has been received', '#3A63D1', ['R5 Trackable']]]
      .map(([i, s, c, r], n) => el(`<div class="feat card" style="left:${280 + n * 480}px;top:240px;height:330px"><div class="ic" style="background:${c}">${ic(i, '#fff', 54, 3.6)}</div>
        <div class="t">${s}</div><div>${r.map(x => `<span class="req">${x}</span>`).join('')}</div></div>`));
    const strip = el(`<div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center;align-items:center;gap:40px">
      <div class="card bf" style="display:flex;align-items:center;gap:18px;padding:16px 30px 16px 16px"><span style="width:84px;height:84px;border-radius:50%;background:#FFE1DE;display:grid;place-items:center;font:900 44px 'Baloo 2';color:var(--red)">?</span><div><div class="k" style="color:var(--red)">Before</div><div style="font:900 32px Nunito">Confused, unheard</div></div></div>
      <div class="ar" style="font:900 60px Nunito;color:var(--purple)">→</div>
      <div class="card af" style="display:flex;align-items:center;gap:18px;padding:16px 30px 16px 16px"><span style="width:84px;height:84px;border-radius:50%;background:var(--green-l);display:grid;place-items:center">${ic('check', '#16707F', 50, 4)}</span><div><div class="k" style="color:var(--green-d)">After</div><div style="font:900 32px Nunito">Confident, informed</div></div></div>
      <div class="card nm" style="display:flex;align-items:center;gap:14px;padding:18px 28px;background:var(--purple);color:#fff;font:900 30px Nunito">${ic('meeting', '#fff', 40, 3.6)}No meeting needed</div></div>`);
    const foot = el(`<div class="abs" style="left:0;right:0;top:800px;text-align:center"><span class="card" style="display:inline-block;padding:10px 26px;font:800 22px Nunito;color:var(--navy-2)">Also designed for R6 Privacy · R7 Trustworthy sources · R8 Simple to use</span></div>`);
    ui.append(h, ...cards, strip, foot);
    out[8] = {
      svg, ui, update(t) {
        A.worldFx(BG, { x: 960, y: 540, z: 1 }, t, 0);
        const a = L(8, 's8a'), b = a + 7.0;
        show(h, t, a - 0.2, { kind: 'down' });
        [0.4, 2.4, 4.4].forEach((o, i) => show(cards[i], t, a + o, { kind: 'pop' }));
        show($(strip, '.bf'), t, b - 1.4, { kind: 'left' }); show($(strip, '.ar'), t, b - 1.1, { kind: 'fade' });
        show($(strip, '.af'), t, b - 0.8, { kind: 'right' }); show($(strip, '.nm'), t, b - 0.2, { kind: 'pop' });
        show(foot, t, b + 0.4, { kind: 'up' });
      },
    };
  }

  // ------------------------------------------------------------ 9 Limits & next steps
  {
    const { svg, ui } = mk(9);
    const BG = backdrop(svg, 41); A.worldFx(BG, { x: 960, y: 540, z: 1 }, 0, 0);
    ui.insertAdjacentHTML('beforeend', frost());
    const lim = el(`<div class="abs card" style="left:120px;top:220px;width:800px;height:580px;padding:34px 38px">
      <div class="k" style="color:var(--red)">Honest limitations</div><div class="h2">HearHere has limits</div>
      ${[['mic', 'Speaking to a device in public may feel uncomfortable', 'Typed input as an alternative'], ['translate', 'The AI may make mistakes when translating', 'Review & edit before sending']].map(([i, s, m], n) => `
      <div class="l${n}" style="display:flex;gap:18px;align-items:flex-start;margin-top:24px"><span style="width:60px;height:60px;border-radius:18px;background:#FFE1DE;display:grid;place-items:center;flex:none">${ic(i, '#E0544B', 34, 3.6)}</span>
      <div><div style="font:900 30px Nunito">${s}</div><div style="font:800 23px Nunito;color:var(--green-d);margin-top:4px">→ ${m}</div></div></div>`).join('')}</div>`);
    const nx = el(`<div class="abs card" style="left:1000px;top:220px;width:800px;height:580px;padding:34px 38px">
      <div class="k" style="color:var(--green-d)">Future work</div><div class="h2">What we need to test</div>
      ${[['mic', 'Comfort speaking in public', 'Do residents feel OK talking to the pillar?'], ['globe', 'Translation keeps the meaning', 'Checked by bilingual reviewers'], ['people', 'People without smartphones', 'Can they still use HearHere?'], ['building', 'Council workflow', 'How feedback is managed and answered']].map(([i, s, m], n) => `
      <div class="n${n}" style="display:flex;gap:18px;align-items:flex-start;margin-top:24px"><span style="width:60px;height:60px;border-radius:18px;background:var(--green-l);display:grid;place-items:center;flex:none">${ic(i, '#16707F', 34, 3.6)}</span>
      <div><div style="font:900 30px Nunito">${s}</div><div style="font:800 23px Nunito;color:var(--navy-2);margin-top:4px">${m}</div></div></div>`).join('')}</div>`);
    ui.append(lim, nx);
    out[9] = {
      svg, ui, update(t) {
        A.worldFx(BG, { x: 960, y: 540, z: 1 }, t, 0);
        const a = L(9, 's9a'), b = L(9, 's9b'), c = L(9, 's9c'), d9 = L(9, 's9d');
        show(lim, t, a - 0.2, { kind: 'left' });
        [0.2, 3.0].forEach((o, i) => show($(lim, '.l' + i), t, b + o, { kind: 'up', dist: 20 }));
        show(nx, t, c - 0.1, { kind: 'right' });
        [c + 1.2, c + 4.2, c + 7.2, d9 + 0.3].forEach((o, i) => show($(nx, '.n' + i), t, o, { kind: 'up', dist: 20 }));
      },
    };
  }

  // ------------------------------------------------------------ 10 Tagline
  {
    const { svg, ui } = mk(10);
    const world = A.streetWorld({ width: 2400, dusk: true, seed: 11, trees: [300, 2000], lamps: [760, 1720], bins: [560] });
    svg.appendChild(world);
    const post = A.post(); place(post, 1450, POSTY, PS * 1.05);
    const leash = svgEl('path', { class: 'actor', stroke: C.purple, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
    const dog = A.dog(), jas = A.jason();
    world.append(post, leash, dog, jas);

    const title = el(`<div class="abs" style="left:110px;top:150px;width:900px">
      <div class="word" style="font:800 170px/1 'Baloo 2';white-space:nowrap"><span style="color:#fff;text-shadow:0 6px 0 var(--purple-d),0 12px 24px rgba(0,0,0,.25)">Hear</span><span style="color:var(--orange);text-shadow:0 6px 0 #8A4A08,0 12px 24px rgba(0,0,0,.25)">Here</span></div>
      <div class="full card" style="display:inline-block;margin-top:12px;padding:12px 22px;font:800 30px Nunito">the street pillar for understanding local decisions</div><br>
      <div class="tag2 chip" style="margin-top:22px;background:var(--orange);color:#fff;font-size:44px;padding:14px 32px">${ic('mic', '#fff', 44, 3.6)}Speak here, be heard.</div></div>`);
    const bub = el(`<div class="bubble" style="left:1290px;top:330px">Speak here, be heard!</div>`);
    const team = el(`<div class="abs" style="left:0;right:0;top:130px;display:none"></div>`);
    const foot = el(`<div class="abs" style="left:110px;top:560px;width:820px;display:grid;grid-template-columns:1fr 1fr;gap:10px 30px;background:rgba(255,255,255,.95);border-radius:22px;padding:18px 28px;font:800 24px Nunito">
      <span>Jia-Ying Lee <b style="color:var(--purple)">1790130</b></span><span>Xintong FU <b style="color:var(--purple)">1840227</b></span><span>Yu-Hao LU <b style="color:var(--purple)">1781474</b></span><span>Yen-Chu OU YANG <b style="color:var(--purple)">1801365</b></span></div>`);
    const credit = el(`<div class="abs" style="left:110px;top:690px;width:820px"><span style="display:block;background:rgba(255,255,255,.95);border-radius:14px;padding:8px 18px;font:700 18px/1.4 Nunito;color:var(--navy-2)">Team Sweet Potatoes · Group 14 · INFO90006 Fieldwork for Design<br>Concept prototype; narration is AI-generated (Kokoro TTS)</span></div>`);
    ui.append(title, bub, team, foot, credit);
    out[10] = {
      svg, ui, update(t) {
        const a = L(10, 's10a'), b = L(10, 's10b');
        const c = { x: 960, y: 540, z: 1 }; cam(world, c.x, c.y, c.z); A.worldFx(world, c, t, 0);
        A.posePost(post, { mood: t > b ? 'happy' : 'idle', talk: t > b && t < LE(10, 's10b') ? Math.abs(Math.sin(t * 12)) : 0, t, blink: blink(t, 3.1), bob: Math.sin(t * 2.2) * 4, screen: 'idle', glow: 0, look: { x: -6, y: 0 } });
        const jx = 1130;
        const hands = A.poseJason(jas, { mouth: 'smile', blink: blink(t, 3.4), armF: t > b ? 150 : null, elbowF: t > b ? 25 + 22 * Math.sin(t * 9) : null });
        place(jas, jx, FEET, 0.9);
        A.poseDog(dog, { t, look: Math.sin(t * 2) * 4 });
        place(dog, jx - 240, FEET, 0.75);
        leashTo(leash, toW(hands.B, jx, 0.9), jx - 240, 0.75);
        show($(title, '.word'), t, a - 0.2, { kind: 'pop' });
        show($(title, '.full'), t, a + 0.6, { kind: 'up' });
        show($(title, '.tag2'), t, b, { kind: 'pop' });
        show(bub, t, b, { kind: 'pop' });
        show(foot, t, b + 0.9, { kind: 'up' });
        show(credit, t, b + 1.1, { kind: 'fade' });
      },
    };
  }
  return out;
}

// feature labels (top-left pill), scene-relative
export function lowerThirds(TL) {
  const S = Object.fromEntries(TL.scenes.map(s => [s.id, s]));
  const at = (id) => TL.scenes.flatMap(s => s.lines).find(l => l.id === id).start;
  const end = (sid) => S[sid].end - 0.3;
  return [
    { a: at('s3b') + 1.0, b: at('s3c'), k: 'Persona', text: 'Jason Lee', icon: 'user' },
    { a: at('s3c'), b: end(3), k: 'Scenario', text: 'A new dog park rule (fictional)', icon: 'warn' },
    { a: at('i1') + 0.3, b: at('i2'), k: 'Our concept', text: 'HearHere', icon: 'box' },
    { a: at('i2'), b: end(12), k: 'Product', text: 'The HearHere pillar', icon: 'box' },
    { a: at('s4a') + 0.3, b: at('s4b'), k: 'Scenario', text: 'On the way to the park', icon: 'pin' },
    { a: at('s4b'), b: at('s4c'), k: 'Feature', text: 'Decisions near you', icon: 'pin' },
    { a: at('s4c'), b: end(4), k: 'Feature', text: 'Plain-language summary', icon: 'translate' },
    { a: at('s5c'), b: at('s5d'), k: 'Feature', text: 'Talk to the AI helper', icon: 'mic' },
    { a: at('s5d'), b: end(5), k: 'Feature', text: 'Clear English comment', icon: 'chat' },
    { a: at('s6a'), b: at('s6d'), k: 'Feature', text: 'NFC hand-off', icon: 'lock' },
    { a: at('s6d'), b: end(6), k: 'Feature', text: 'Progress tracker', icon: 'steps' },
    { a: at('s7c'), b: end(7), k: 'Feature', text: 'Share to social', icon: 'share' },
  ];
}
