import { show, clamp, ease, easeOut, backOut, prog, smooth, blink, typeText, lerp, $, $$ } from './fx.js';
import { POSTERS, roundRect, drawNfcIcon, C } from './world.js';

// ---------------------------------------------------------------- Chinese strings (Traditional) — preloaded + QA-scanned
export const ZH = {
  jasonLine: '新的公園規定讓遛狗變得很不方便，我希望可以重新考慮。',
  issueTitle: '公園狗狗新規定',
  lang: '繁體中文',
  plain: '白話摘要',
  summary1: '市議會打算縮小公園裡的',
  term: '無牽繩區',
  summary2: '。平日早上 7 點到晚上 7 點，狗狗都必須繫上牽繩。',
  termExp: '可以讓狗狗不繫牽繩、自由活動的指定區域。',
  closes: '5 天後截止',
  talk: '跟 Spud 說說你的想法',
  listening: '正在聆聽…',
  original: '原文',
  dept: '公園與開放空間處',
  edit: '編輯', confirm: '確認',
  recv: '已收到', review: '審核中', outcome: '結果',
  track: '追蹤這個議題',
  ask: '我該找哪個部門？',
  answer: '這屬於「公園與開放空間處」負責。新規定的草案在官方文件第 4 頁。',
  declined: '未採納',
  qa: '問答助理',
  noAudio: '不保存錄音',
  nothing: '此裝置不保存任何資料',
};
export const ZH_STRINGS = Object.values(ZH);

// ---------------------------------------------------------------- icons
const P = {
  tree: '<circle cx="24" cy="18" r="11"/><path d="M24 29v13M17 42h14"/>',
  house: '<path d="M7 22L24 8l17 14"/><path d="M11 19v21h26V19"/><path d="M20 40V29h8v11"/>',
  tram: '<rect x="11" y="8" width="26" height="26" rx="6"/><path d="M11 22h26M18 34l-4 7M30 34l4 7M19 4h10M24 4v4"/><circle cx="18" cy="28" r="1.5"/><circle cx="30" cy="28" r="1.5"/>',
  search: '<circle cx="21" cy="21" r="12"/><path d="M30 30l10 10"/>',
  translate: '<path d="M6 10h18M15 6v4M10 10c1 6 5 11 11 14M20 10c-1 6-5 11-11 14"/><path d="M26 42l7-18 7 18M28.5 36h9"/>',
  send: '<path d="M6 24L42 8 30 42l-7-14z"/><path d="M23 28l19-20"/>',
  pin: '<path d="M24 43s13-12.5 13-23a13 13 0 0 0-26 0c0 10.5 13 23 13 23z"/><circle cx="24" cy="20" r="5"/>',
  building: '<path d="M6 42h36M9 42V18M39 42V18M5 18L24 6l19 12z"/><path d="M16 22v14M24 22v14M32 22v14"/>',
  steps: '<circle cx="10" cy="24" r="5"/><circle cx="24" cy="24" r="5"/><circle cx="38" cy="24" r="5"/><path d="M15 24h4M29 24h4"/>',
  mic: '<rect x="17" y="5" width="14" height="24" rx="7"/><path d="M10 22a14 14 0 0 0 28 0M24 36v7"/>',
  lock: '<rect x="10" y="21" width="28" height="21" rx="5"/><path d="M16 21v-6a8 8 0 0 1 16 0v6"/>',
  check: '<path d="M10 25l9 9 19-20"/>',
  bell: '<path d="M12 34V22a12 12 0 0 1 24 0v12l4 4H8z"/><path d="M20 42a4 4 0 0 0 8 0"/>',
  chat: '<path d="M8 10h32v22H22l-9 8v-8H8z"/>',
  share: '<circle cx="12" cy="24" r="5"/><circle cx="36" cy="12" r="5"/><circle cx="36" cy="36" r="5"/><path d="M16.5 21.5l15-7M16.5 26.5l15 7"/>',
  mail: '<rect x="6" y="12" width="36" height="26" rx="4"/><path d="M6 15l18 13 18-13"/>',
  user: '<circle cx="24" cy="16" r="8"/><path d="M8 42c2-9 9-13 16-13s14 4 16 13"/>',
  doc: '<path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9M18 24h14M18 31h14"/>',
  warn: '<path d="M24 6l19 34H5z"/><path d="M24 19v10M24 34v1"/>',
  people: '<circle cx="17" cy="17" r="6"/><circle cx="33" cy="17" r="6"/><path d="M5 40c1-7 6-10 12-10s11 3 12 10M23 33c2-2 6-3 10-3 6 0 11 3 12 10"/>',
  dashboard: '<rect x="6" y="8" width="36" height="32" rx="4"/><path d="M14 32v-8M22 32V18M30 32v-12M38 32v-5"/>',
  globe: '<circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c6 6 6 28 0 34M24 7c-6 6-6 28 0 34"/>',
  box: '<path d="M8 15l16-8 16 8v18l-16 8-16-8z"/><path d="M8 15l16 8 16-8M24 23v18"/>',
  sprout: '<path d="M24 42V22"/><path d="M24 26c-9 0-14-6-14-14 9 0 14 5 14 14zM24 22c0-8 5-13 14-13 0 8-5 13-14 13z"/>',
  calendar: '<rect x="7" y="10" width="34" height="31" rx="5"/><path d="M7 19h34M16 6v8M32 6v8"/>',
  dog: '<path d="M10 20l4-10 6 6h8l6-6 4 10v8c0 8-6 13-14 13S10 36 10 28z"/><circle cx="19" cy="25" r="1.6"/><circle cx="29" cy="25" r="1.6"/><path d="M22 32h4"/>',
  flyer: '<path d="M10 6h28v36H10z"/><path d="M16 14h16M16 21h16M16 28h10"/>',
  camera: '<rect x="6" y="14" width="36" height="26" rx="6"/><circle cx="24" cy="27" r="7"/><path d="M17 14l3-6h8l3 6"/>',
  meeting: '<rect x="8" y="22" width="32" height="6" rx="2"/><circle cx="14" cy="14" r="4"/><circle cx="24" cy="14" r="4"/><circle cx="34" cy="14" r="4"/><path d="M12 28v12M36 28v12"/>',
};
export const ic = (n, color = '#fff', size = 44, sw = 3.4) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
function bg2d(extra = '') {
  return `<div class="bg2d">
    <div class="blob b1" style="width:760px;height:760px;background:#E7D4F1;left:-200px;top:-260px"></div>
    <div class="blob b2" style="width:640px;height:640px;background:#FFD9AE;right:-160px;top:380px"></div>
    <div class="blob b3" style="width:520px;height:520px;background:#CFEBCB;left:620px;top:640px"></div>
    <div class="dots"></div>${extra}</div>`;
}
function animBg(root, t) {
  const b = $$(root, '.blob');
  if (b[0]) b[0].style.transform = `translate(${Math.sin(t * 0.35) * 70}px, ${Math.cos(t * 0.3) * 50}px)`;
  if (b[1]) b[1].style.transform = `translate(${Math.cos(t * 0.28) * 80}px, ${Math.sin(t * 0.33) * 60}px)`;
  if (b[2]) b[2].style.transform = `translate(${Math.sin(t * 0.4 + 1) * 90}px, ${Math.cos(t * 0.25) * 40}px)`;
  const d = $(root, '.dots'); if (d) d.style.transform = `translate(${(t * 9) % 46}px, ${(t * 5) % 46}px)`;
}
const spudImg = (W, t, mode = 'idle', off = 0) => {
  if (mode === 'idle' && blink(t, 3.1, off) > 0.5) return W.IMG.spud.blink;
  return W.IMG.spud[mode];
};
function setSrc(img, src) { if (img && img.getAttribute('src') !== src) img.setAttribute('src', src); }

// ---------------------------------------------------------------- body display (wraparound poster screen)
function drawDisplay(W, t, opt = {}) {
  const tex = W.post.dispTex, { g, cv } = tex.userData, w = cv.width, h = cv.height;
  const period = opt.period || 2.4;
  const idx = Math.floor(t / period), f = (t % period) / period;
  const fade = clamp((f - 0.82) / 0.18);
  const key = `${opt.mode}|${idx}|${fade.toFixed(2)}|${(opt.wipe || 0).toFixed(3)}|${opt.glow || 0}`;
  if (tex.userData.key === key) return;
  tex.userData.key = key;
  g.fillStyle = '#18203A'; g.fillRect(0, 0, w, h);
  const pw = 560, ph = 700, py = 34;
  const slots = [1024 - pw / 2, 1024 - pw / 2 - 690, 1024 - pw / 2 + 690];
  const order = [idx % 3, (idx + 1) % 3, (idx + 2) % 3];
  slots.forEach((x, s) => {
    const a = order[s], b = (a + 1) % 3;
    g.globalAlpha = 1; POSTERS[a](g, x, py, pw, ph);
    if (fade > 0) { g.globalAlpha = fade; POSTERS[b](g, x, py, pw, ph); }
  });
  g.globalAlpha = 1;
  if (opt.mode === 'stored') {
    const k = opt.wipe; // 0..1 covers, >1 stays
    const ww = w * clamp(k);
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#E3F2E1'); gr.addColorStop(1, '#C8E6C9');
    g.fillStyle = gr; g.fillRect(1024 - ww / 2, 0, ww, h);
    if (k > 0.6) {
      g.globalAlpha = clamp((k - 0.6) / 0.3);
      g.fillStyle = '#2E9E4F'; g.beginPath(); g.arc(1024, 230, 90, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = 22; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(980, 232); g.lineTo(1012, 266); g.lineTo(1072, 196); g.stroke();
      g.fillStyle = '#1F2A44'; g.textAlign = 'center'; g.font = '900 64px Nunito';
      g.fillText('Nothing is stored', 1024, 430); g.fillText('on this post', 1024, 505);
      g.font = '700 34px Nunito'; g.fillStyle = '#2E7D32'; g.fillText('Session cleared · ready for the next person', 1024, 590);
      g.globalAlpha = 1;
    }
  }
  tex.needsUpdate = true;
}

function drawPhoneTex(W, mode) {
  const tex = W.jason.phoneTex, { g, cv } = tex.userData;
  if (tex.userData.key === mode) return; tex.userData.key = mode;
  const w = cv.width, h = cv.height;
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9567AE'); gr.addColorStop(1, '#7B4B94');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFF4E0'; g.textAlign = 'center'; g.font = '800 46px "Baloo 2"'; g.fillText('POTATO', w / 2, 150);
  if (mode === 'mail') {
    g.fillStyle = '#FFF4E0'; g.fillRect(14, 190, w - 28, h - 230);
    g.fillStyle = '#1F2A44'; g.textAlign = 'left'; g.font = '800 22px Nunito'; g.fillText('To: enquiries@council', 28, 228);
    g.fillStyle = '#C9C3B8'; for (let i = 0; i < 6; i++) g.fillRect(28, 252 + i * 28, 170 + ((i * 37) % 30), 10);
    g.fillStyle = '#F28C28'; roundRect(g, 28, 440, 120, 40, 20); g.fill(); g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.fillText('Send', 56, 467);
    g.textAlign = 'center';
  } else if (mode === 'done') {
    g.fillStyle = '#4CAF50'; g.beginPath(); g.arc(w / 2, 280, 60, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(w / 2 - 28, 282); g.lineTo(w / 2 - 6, 304); g.lineTo(w / 2 + 30, 258); g.stroke();
    g.fillStyle = '#FFF4E0'; g.font = '800 30px Nunito'; g.fillText('Issue saved', w / 2, 390);
  } else {
    drawNfcIcon(g, w / 2, 230, 150, '#FFF4E0');
    g.font = '700 26px Nunito'; g.fillText('Hold near the pad', w / 2, 420);
  }
  tex.needsUpdate = true;
}

// ---------------------------------------------------------------- visor panel (shared by scenes 4 & 5)
function visorHTML(W) {
  return `<div class="visor">
    <div class="ear l"></div><div class="ear r"></div>
    <div class="shell"></div><div class="sensor"></div>
    <div class="bezel"><div class="screen">
      <div class="pane p-list">
        <div style="display:flex;align-items:center;gap:16px">
          <img class="sp" style="width:64px;height:64px" src="${W.IMG.spud.happy}">
          <div><div style="font:900 34px 'Baloo 2';color:var(--purple);line-height:1">Hi, Melb!</div>
          <div style="font:800 22px Nunito;color:var(--navy-2)">Issues near this post</div></div>
          <div style="margin-left:auto" class="chip" style="background:#fff">${ic('globe', '#7B4B94', 26, 3.6)}<span style="font:800 22px Nunito;color:var(--purple)">EN</span></div>
        </div>
        <div class="filters" style="display:flex;gap:12px;margin:12px 0 4px">
          <span class="chip f0" style="background:var(--navy);color:#fff;font-size:21px;padding:6px 18px">All</span>
          <span class="chip f1" style="background:#fff;font-size:21px;padding:6px 18px">${ic('tree', '#2E7D32', 24, 4)}Parks</span>
          <span class="chip f2" style="background:#fff;font-size:21px;padding:6px 18px">${ic('house', '#F28C28', 24, 4)}Housing</span>
          <span class="chip f3" style="background:#fff;font-size:21px;padding:6px 18px">${ic('people', '#7B4B94', 24, 4)}Student life</span>
        </div>
        <div class="sortnote" style="font:800 19px Nunito;color:var(--orange);margin:4px 0 10px;letter-spacing:.5px">RANKED BY DISTANCE + CLOSING DATE</div>
        <div class="issue i0" style="border-color:var(--orange)"><div class="rank">1</div><div class="ico" style="background:var(--green-l)">${ic('tree', '#2E7D32', 40)}</div>
          <div><div class="t">Park rule changes</div><div class="m">120 m · closes in 5 days · Parks</div></div>
          <span class="tag" style="margin-left:auto;background:var(--orange-l);color:#B85C00">Dogs</span></div>
        <div class="issue i1"><div class="rank" style="background:#9C82AE">2</div><div class="ico" style="background:var(--orange-l)">${ic('house', '#F28C28', 40)}</div>
          <div><div class="t">Rental housing standards</div><div class="m">450 m · closes in 9 days · Housing</div></div></div>
        <div class="issue i2"><div class="rank" style="background:#B9A7C7">3</div><div class="ico" style="background:var(--purple-l)">${ic('people', '#7B4B94', 40)}</div>
          <div><div class="t">Library study hours</div><div class="m">800 m · closes in 21 days · Student life</div></div></div>
        <div class="tapdot" style="position:absolute;width:70px;height:70px;border-radius:50%;background:rgba(242,140,40,.35);border:4px solid var(--orange);left:540px;top:300px;opacity:0"></div>
      </div>
      <div class="pane p-detail" style="opacity:0">
        <div style="display:flex;align-items:center;gap:14px">
          <div class="ico" style="width:60px;height:60px;border-radius:18px;background:var(--green-l);display:grid;place-items:center">${ic('tree', '#2E7D32', 38)}</div>
          <div><div class="zh" style="font:900 36px 'Noto Sans TC';line-height:1.1">${ZH.issueTitle}</div>
          <div style="font:800 20px Nunito;color:var(--navy-2)">Park rule changes · 120 m</div></div>
          <div class="chip langchip" style="margin-left:auto;background:var(--purple);color:#fff;font-size:22px">${ic('globe', '#fff', 26, 3.6)}<span class="zh">${ZH.lang}</span></div>
        </div>
        <div style="margin-top:20px" class="chip"><span class="tag" style="background:var(--green);color:#fff;font-size:20px"><span class="zh">${ZH.plain}</span> · Plain-language summary</span></div>
        <div class="zh sum" style="font:500 33px/1.6 'Noto Sans TC';margin-top:12px;color:var(--navy)">${ZH.summary1}<span class="term" style="background:#FFE08A;border-radius:10px;padding:0 8px;font-weight:900;border-bottom:4px solid var(--orange)">${ZH.term}</span>${ZH.summary2}</div>
        <div style="display:flex;gap:12px;margin-top:16px">
          <span class="chip" style="background:var(--orange-l);color:#B85C00;font-size:21px">${ic('calendar', '#B85C00', 24, 4)}<span class="zh">${ZH.closes}</span></span>
          <span class="chip" style="background:var(--purple-l);color:var(--purple);font-size:21px">${ic('building', '#7B4B94', 24, 4)}Parks &amp; Open Space</span>
        </div>
        <div class="tip card" style="position:absolute;left:250px;top:120px;width:560px;padding:20px 26px;border:3px solid var(--orange);opacity:0">
          <div style="font:800 18px Nunito;color:var(--orange);letter-spacing:1.5px">KEY TERM EXPLAINED</div>
          <div class="zh" style="font:900 30px 'Noto Sans TC'">${ZH.term} <span style="font:800 24px Nunito;color:var(--navy-2)">= Off-leash area</span></div>
          <div class="zh" style="font:500 24px/1.5 'Noto Sans TC';color:var(--navy-2)">${ZH.termExp}</div>
        </div>
        <div class="talk chip" style="position:absolute;left:46px;bottom:28px;background:var(--purple);color:#fff;font-size:24px;padding:12px 26px">${ic('mic', '#fff', 28, 3.6)}<span class="zh">${ZH.talk}</span></div>
        <div class="tapdot2" style="position:absolute;width:70px;height:70px;border-radius:50%;background:rgba(242,140,40,.35);border:4px solid var(--orange);left:190px;bottom:20px;opacity:0"></div>
      </div>
      <div class="pane p-listen" style="opacity:0;display:flex;flex-direction:column;align-items:center">
        <div style="position:relative;width:300px;height:300px;margin-top:4px">
          <svg class="wave" width="300" height="300" viewBox="0 0 300 300" style="position:absolute;inset:0"></svg>
          <img class="sp" style="position:absolute;left:55px;top:50px;width:190px;height:190px" src="${W.IMG.spud.listen}">
        </div>
        <div style="font:900 30px Nunito;color:var(--purple)"><span class="zh">${ZH.listening}</span> Listening</div>
        <div class="card" style="width:820px;min-height:120px;margin-top:16px;padding:18px 26px">
          <div style="font:800 18px Nunito;color:var(--navy-2);letter-spacing:1.5px">LIVE TRANSCRIPT</div>
          <div class="zh transcript" style="font:700 32px/1.45 'Noto Sans TC'"></div>
        </div>
      </div>
      <div class="pane p-comment" style="opacity:0">
        <div style="display:flex;align-items:center;gap:14px">
          <img style="width:64px;height:64px" src="${W.IMG.spud.happy}">
          <div style="font:900 30px 'Baloo 2';color:var(--purple);white-space:nowrap">Your comment, structured</div>
          <span class="chip noaudio" style="margin-left:auto;background:var(--navy);color:#fff;font-size:20px">${ic('lock', '#fff', 24, 4)}No audio stored · <span class="zh">${ZH.noAudio}</span></span>
        </div>
        <div class="card r0" style="margin-top:16px;padding:14px 22px"><div style="font:800 17px Nunito;color:var(--orange);letter-spacing:1.5px">ORIGINAL · <span class="zh">${ZH.original}</span> (中文)</div>
          <div class="zh" style="font:700 27px/1.4 'Noto Sans TC'">${ZH.jasonLine}</div></div>
        <div class="card r1" style="margin-top:12px;padding:14px 22px"><div style="font:800 17px Nunito;color:var(--orange);letter-spacing:1.5px">ENGLISH</div>
          <div style="font:700 26px/1.35 Nunito">The new park rule makes walking my dog really inconvenient. I hope it can be reconsidered.</div></div>
        <div class="card r2" style="margin-top:12px;padding:12px 22px;display:flex;align-items:center;gap:14px">${ic('building', '#7B4B94', 38)}
          <div><div style="font:800 17px Nunito;color:var(--orange);letter-spacing:1.5px">RESPONSIBLE DEPARTMENT</div>
          <div style="font:900 27px Nunito">Parks &amp; Open Space · <span class="zh" style="font-weight:700">${ZH.dept}</span></div></div></div>
        <div class="btns" style="display:flex;gap:16px;margin-top:16px;justify-content:flex-end">
          <span class="chip bedit" style="background:#fff;border:3px solid var(--purple);color:var(--purple);font-size:24px;padding:10px 30px">Edit · <span class="zh">${ZH.edit}</span></span>
          <span class="chip bok" style="background:var(--green);color:#fff;font-size:24px;padding:10px 30px">${ic('check', '#fff', 26, 4.5)}Confirm · <span class="zh">${ZH.confirm}</span></span>
        </div>
      </div>
    </div></div></div>`;
}
function waveSVG(svg, t, amp) {
  let s = '';
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const v = 0.5 + 0.5 * Math.sin(t * 9 + i * 1.7) * Math.sin(t * 5.3 + i * 0.6);
    const L = 10 + amp * 42 * v;
    const r0 = 118, x0 = 150 + Math.cos(a) * r0, y0 = 150 + Math.sin(a) * r0, x1 = 150 + Math.cos(a) * (r0 + L), y1 = 150 + Math.sin(a) * (r0 + L);
    s += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${i % 3 ? '#F28C28' : '#7B4B94'}" stroke-width="6" stroke-linecap="round"/>`;
  }
  s += `<circle cx="150" cy="150" r="${112 + 4 * Math.sin(t * 6)}" fill="none" stroke="#4CAF50" stroke-width="4" opacity=".6"/>`;
  svg.innerHTML = s;
}

// ---------------------------------------------------------------- phone shell
function phoneHTML(W, inner, sub = 'Public Opinion Translation And Tracking Outpost') {
  return `<div class="phone"><div class="scr"><div class="notch"></div>
    <div class="app-h"><img class="hav" src="${W.IMG.spud.happy}"><div><div class="n">POTATO</div><div class="s">${sub}</div></div></div>
    ${inner}
    <div class="notif card" style="position:absolute;left:14px;right:14px;top:56px;padding:14px 18px;display:flex;gap:12px;align-items:center;opacity:0;z-index:4">
      <img style="width:54px;height:54px" src="${W.IMG.spud.happy}">
      <div><div style="font:800 16px Nunito;color:var(--navy-2)">POTATO · now</div>
      <div style="font:800 20px/1.25 Nunito">“Park rule changes” is now In review · <span class="zh">${ZH.review}</span></div></div></div>
  </div></div>`;
}

// ================================================================ scenes
export function buildScenes(W) {
  const { THREE, post, jason, dog, street, soil, stage } = W;
  const scenes = [];
  const add = (html, update) => {
    const root = el(`<div class="scene">${html}</div>`);
    W.ui.appendChild(root);
    scenes.push({ root, update: (t, S, T) => update(root, t, S, T) });
  };
  const setWorld = (o) => {
    street.group.visible = !!o.street; stage.visible = !!o.stage; soil.group.visible = !!o.soil;
    post.group.visible = !o.home;
    W.home.visible = !!o.home; W.tram.group.visible = !!o.tram; W.crowd.update(0, !!o.crowd);
    jason.root.visible = !!o.jason; dog.root.visible = !!o.dog; dog.collar.visible = !!o.dog;
    jason.phone.visible = false; jason.letter.visible = false;
    W.ripples.forEach((r) => (r.visible = false));
    W.canvasFilter('');
    W.setSky(o.sky || 'day');
  };
  // yaw that makes a model (facing +z) look from `from` towards `to`
  const faceAngle = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
  const POSTPOS = new THREE.Vector3(0, 0, -0.4);
  const bubbleAt = (b, off, dx = 0, dy = 0) => {
    const p = W.project(W.spudWorld(off));
    b.style.left = `${p.x + dx}px`; b.style.top = `${p.y + dy}px`;
  };
  const spudIdle = (t, extra = {}) => post.spud.setFace({ mode: 'idle', blink: blink(t, 3.1), pulse: 0, perk: 0.3, wave: 0, ...extra });

  // ------------------------------------------------------------ 1 TITLE
  add(`
    <div class="abs" id="t1" style="left:990px;top:190px;width:900px">
      <div class="wm" style="font:800 200px/0.9 'Baloo 2';letter-spacing:6px;color:var(--purple);display:flex">
        ${'POTATO'.split('').map((c, i) => `<span class="L L${i}" style="display:inline-block">${c}</span>`).join('')}
      </div>
      <div class="acr" style="margin-top:22px;display:flex;flex-wrap:wrap;gap:4px 12px;font:800 36px 'Baloo 2';color:var(--navy);flex-wrap:nowrap;white-space:nowrap">
        ${['Public', 'Opinion', 'Translation', 'And', 'Tracking', 'Outpost'].map((w, i) => `<span class="w w${i}" style="display:inline-block"><span style="color:var(--orange)">${w[0]}</span>${w.slice(1)}</span>`).join('')}
      </div>
      <div class="chip grow" style="margin-top:34px;background:var(--green);color:#fff;font-size:28px;padding:12px 28px">${ic('sprout', '#fff', 34, 3.6)}Good ideas grow from the ground up</div>
    </div>
    <div class="bubble b1">Hi, Melb!</div>`,
  (root, t, S) => {
    setWorld({ stage: true, soil: true, sky: 'stage' });
    drawDisplay(W, t);
    // post pops from the soil then rises
    const pop = backOut(prog(t, 0.15, 0.7)), rise = ease(prog(t, 2.0, 2.4));
    const py = t < 2.0 ? lerp(-1.35, -0.86, pop) : lerp(-0.86, 0, rise);
    post.group.position.set(0, py, 0); post.group.rotation.y = 0;
    soil.group.position.set(0, 0, 0);
    const ms = lerp(1, 0.82, rise); soil.mound.scale.set(ms, lerp(0.35, 0.18, rise), ms);
    const grow = ease(prog(t, 1.4, 3.6));
    const ic3 = soil.vineGeo.index.count; soil.vineGeo.setDrawRange(0, Math.floor((grow * ic3) / 6) * 6);
    soil.leaves.forEach((l) => l.scale.setScalar(backOut(clamp((grow - l.userData.k) * 6)) * 1.3));
    // Spud
    const hi = S.cue('s1a');
    const happy = t > hi && t < hi + 2.6;
    post.spud.setFace({ mode: happy ? 'happy' : 'idle', blink: blink(t, 3.0), perk: happy ? 1 : 0.3, wave: happy ? (t - hi) * 9 : 0 });
    post.spud.group.rotation.z = happy ? Math.sin((t - hi) * 6) * 0.08 : 0;
    // camera
    const k = ease(prog(t, 0, 6.0));
    const drift = Math.max(0, t - 6) * 0.018;
    const ang = lerp(0.05, 0.42, k) + drift;
    const rad = lerp(1.7, 3.3, k), hgt = lerp(0.42, 1.05, k);
    W.cam([Math.sin(ang) * rad, hgt, Math.cos(ang) * rad], [0, lerp(0.25, 0.68, k), 0], 35, lerp(0, -470, k));
    W.sunAt(new THREE.Vector3(0, 0, 0), [2.5, 5, 3.5]);
    // title
    const tw = S.at('s1b', 'POTATO');
    $$(root, '.L').forEach((L, i) => { L.dataset.base = ''; show(L, t, tw + i * 0.07, { kind: 'pop', d: 0.5 }); });
    const words = ['Public', 'Opinion', 'Translation', 'And Tracking', 'Tracking', 'Outpost'];
    const letterFor = [0, 1, 2, 3, 4, 5];
    $$(root, '.w').forEach((w, i) => {
      const a = S.at('s1b', words[i]) - 0.1;
      show(w, t, a, { kind: 'up', d: 0.35, dist: 20 });
      const L = $(root, `.L${letterFor[i]}`);
      const k = clamp((t - a) / 0.6);
      L.style.color = k > 0 && k < 1 ? 'var(--orange)' : 'var(--purple)';
      L.style.borderBottom = t > a ? '10px solid var(--orange)' : '10px solid transparent';
      if (k > 0 && k < 1) L.style.transform = `scale(${1 + 0.15 * Math.sin(k * Math.PI)})`;
    });
    show($(root, '.grow'), t, S.at('s1d', 'good ideas'), { kind: 'pop' });
    const b = $(root, '.b1');
    show(b, t, hi, { kind: 'pop', out: hi + 2.8 });
    bubbleAt(b, [0.13, 0.17, 0], 0, -90);
    W.lowerThird(t, [{ a: 1.4, b: S.dur, k: 'INFO90006 · Fieldwork for Design', text: 'Team Sweet Potatoes · Group 14', icon: ic('sprout', '#fff', 30, 3.6) }]);
    return { gl: true };
  });

  // ------------------------------------------------------------ 2 PROBLEM
  const card2 = (cls, color, light, icon, title, desc, barrier) => `
    <div class="card ${cls}" style="position:absolute;width:500px;height:330px;padding:30px 34px">
      <div style="display:flex;align-items:center;gap:20px"><div style="width:84px;height:84px;border-radius:26px;background:${color};display:grid;place-items:center">${ic(icon, '#fff', 50)}</div>
      <div style="font:800 52px 'Baloo 2';color:${color}">${title}</div></div>
      <div style="font:800 30px/1.3 Nunito;margin-top:18px">${desc}</div>
      <div class="bar" style="position:absolute;left:-18px;right:-18px;bottom:34px;height:66px;border-radius:14px;background:repeating-linear-gradient(-45deg,#E0544B 0 34px,#fff 34px 68px);box-shadow:0 8px 20px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center">
        <span style="background:#fff;border-radius:10px;padding:4px 16px;font:900 26px Nunito;color:#C2372F">${barrier}</span></div>
    </div>`;
  add(`${bg2d()}
    <div class="abs s2a" style="left:0;right:0;top:70px;text-align:center">
      <div class="h1">Council decisions shape daily life</div>
      <div style="display:flex;gap:26px;justify-content:center;margin-top:24px">
        ${[['tree', 'Parks', '#4CAF50'], ['house', 'Housing', '#F28C28'], ['tram', 'Transport', '#7B4B94']].map(([i, l, c], k) => `<div class="chip t${k}" style="background:#fff;box-shadow:0 8px 20px rgba(31,42,68,.1);font-size:30px;padding:10px 28px 10px 12px"><span style="width:56px;height:56px;border-radius:50%;background:${c};display:grid;place-items:center">${ic(i, '#fff', 32)}</span>${l}</div>`).join('')}
      </div>
    </div>
    <div class="abs s2b" style="left:0;right:0;top:290px;display:flex;gap:22px;justify-content:center;align-items:center">
      ${[['8', 'interviews'], ['4', 'observations'], ['5', 'themes']].map(([n, l], k) => `<div class="chip st${k}" style="background:var(--navy);color:#fff;font-size:28px;padding:10px 26px"><b style="font:900 38px Nunito;color:#FFC07A">${n}</b>${l}</div>`).join('')}
      <div class="chip st3" style="background:var(--orange-l);color:#B85C00;font-size:28px;padding:10px 26px">Not a lack of interest</div>
    </div>
    <div class="cards">
      ${card2('c0', '#4CAF50', '', 'search', 'FIND', 'Relevant local issues are hard to find', 'Can’t find it')}
      ${card2('c1', '#F28C28', '', 'translate', 'UNDERSTAND', 'Translated, but jargon remains', 'Unfamiliar terms')}
      ${card2('c2', '#7B4B94', '', 'send', 'RESPOND', 'Feedback disappears into a void', 'Where does it go?')}
    </div>
    <div class="abs quote card" style="left:620px;top:780px;width:680px;padding:16px 28px;border-left:10px solid var(--orange)">
      <div style="font:800 italic 28px/1.3 Nunito">“If there are technical terms, I still need to look them up.”</div>
      <div style="font:800 20px Nunito;color:var(--navy-2);margin-top:4px">— Participant P8, fieldwork interview</div>
    </div>
    <div class="abs split" style="left:90px;right:90px;top:90px;height:760px;display:flex;gap:40px">
      <div class="card sl" style="flex:1;padding:40px;position:relative;overflow:hidden;background:#FFF">
        <div style="font:800 24px Nunito;color:var(--purple);letter-spacing:2px">HOW COUNCIL NEWS ARRIVES</div>
        <div class="h2" style="margin-top:6px">Mail &amp; flyers</div>
        <div style="position:absolute;left:90px;top:250px;width:230px;height:300px">
          <div style="position:absolute;left:40px;top:0;width:160px;height:120px;border-radius:80px 80px 12px 12px;background:#E0544B"></div>
          <div style="position:absolute;left:62px;top:40px;width:116px;height:16px;border-radius:8px;background:#7A1F1A"></div>
          <div style="position:absolute;left:110px;top:120px;width:20px;height:180px;background:#5C6474"></div>
          <div class="letter" style="position:absolute;left:75px;top:-10px;width:90px;height:60px;background:#fff;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,.2)"></div>
        </div>
        <div class="fly" style="position:absolute;left:380px;top:230px;width:250px;height:330px;background:var(--cream);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:24px;transform:rotate(-6deg)">
          <div style="font:900 30px 'Baloo 2';color:var(--navy)">Public notice</div>
          ${[1, 2, 3, 4, 5, 6].map((i) => `<div style="height:12px;border-radius:6px;background:#D8CFC2;margin-top:16px;width:${60 + (i * 37) % 40}%"></div>`).join('')}
        </div>
      </div>
      <div class="vs" style="align-self:center;width:110px;height:110px;border-radius:50%;background:var(--orange);color:#fff;font:900 64px Nunito;display:grid;place-items:center;flex:none;box-shadow:0 10px 30px rgba(242,140,40,.4)">≠</div>
      <div class="card sr" style="flex:1;padding:40px;position:relative;overflow:hidden">
        <div style="font:800 24px Nunito;color:var(--purple);letter-spacing:2px">WHERE NEWER RESIDENTS LOOK</div>
        <div class="h2" style="margin-top:6px">Instagram &amp; social feeds</div>
        <div style="position:absolute;left:190px;top:200px;width:300px;height:520px;border-radius:44px;background:#1C2133;padding:12px">
          <div class="feed" style="width:100%;height:100%;border-radius:34px;background:#fff;overflow:hidden;position:relative">
            <div class="feedin" style="position:absolute;left:0;right:0;top:0">
            ${[0, 1, 2, 3, 4, 5].map((i) => `<div style="padding:14px"><div style="display:flex;gap:8px;align-items:center"><div style="width:34px;height:34px;border-radius:50%;background:${['#F28C28', '#7B4B94', '#4CAF50'][i % 3]}"></div><div style="height:10px;width:90px;border-radius:5px;background:#ddd"></div></div><div style="height:150px;border-radius:16px;margin-top:10px;background:linear-gradient(135deg,${['#FFD9AE,#F28C28', '#E7D4F1,#7B4B94', '#CFEBCB,#4CAF50'][i % 3]})"></div><div style="display:flex;gap:10px;margin-top:8px">${ic('chat', '#46506A', 22, 4)}${ic('share', '#46506A', 22, 4)}</div></div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`,
  (root, t, S) => {
    animBg(root, t);
    const f = S.cue('s2f');
    const out1 = f - 0.1;
    show($(root, '.s2a .h1'), t, 0.35, { out: out1 });
    $$(root, '.s2a .chip').forEach((c, i) => show(c, t, S.at('s2a', ['parks', 'housing', 'transport'][i]) - 0.15, { kind: 'pop', out: out1 }));
    $$(root, '.s2b .chip').forEach((c, i) => show(c, t, i < 3 ? S.at('s2b', 'eight') + i * 0.35 : S.at('s2b', 'isn\'t'), { kind: 'pop', out: out1 }));
    const cs = $$(root, '.cards .card');
    const ca = [S.cue('s2c'), S.cue('s2d'), S.cue('s2e')];
    cs.forEach((c, i) => {
      c.style.left = `${150 + i * 560}px`; c.style.top = '400px';
      show(c, t, ca[i] - 0.1, { kind: 'up', out: out1, dist: 60 });
      const bar = $(c, '.bar'); const bp = backOut(prog(t, ca[i] + 0.7, 0.4));
      bar.style.transform = `translateY(${(1 - bp) * -160}px) rotate(${(1 - bp) * -8 - 2}deg)`; bar.style.opacity = clamp((t - ca[i] - 0.7) * 5);
    });
    show($(root, '.quote'), t, S.cue('s2d') + 0.9, { out: out1 });
    const sp = $(root, '.split');
    show(sp, t, f, { kind: 'fade', d: 0.4 });
    show($(root, '.sl'), t, f, { kind: 'left', dist: 60 });
    show($(root, '.vs'), t, f + 0.5, { kind: 'pop' });
    show($(root, '.sr'), t, S.at('s2f', 'but newer'), { kind: 'right', dist: 60 });
    const lt2 = $(root, '.letter'); lt2.style.transform = `translateY(${Math.max(0, Math.sin((t - f) * 2)) * 30}px)`;
    $(root, '.fly').style.transform = `rotate(${-6 + Math.sin(t * 1.2) * 2}deg)`;
    $(root, '.feedin').style.transform = `translateY(${-((Math.max(0, t - f) * 70) % 400)}px)`;
    return { gl: false };
  });

  // ------------------------------------------------------------ 3 PERSONA + BEFORE (at Jason's home)
  const HOME = W.home.position;
  const LB = new THREE.Vector3(HOME.x - 0.85, 1.18, HOME.z + 2.27);      // letterbox slot (world)
  const JH = new THREE.Vector3(HOME.x - 0.45, 0, HOME.z + 2.85);          // Jason's spot on the footpath
  const jargon = (w) => `<span class="jg" style="position:relative;background:#FFF0B3;border-bottom:3px solid #E0544B;border-radius:6px;padding:0 4px">${w}<b class="qb" style="position:absolute;right:-14px;top:-22px;width:30px;height:30px;border-radius:50%;background:#E0544B;color:#fff;font:900 22px/30px Nunito;text-align:center;opacity:0">?</b></span>`;
  add(`
    <div class="card pc" style="position:absolute;left:1040px;top:90px;width:800px;padding:36px 40px">
      <div style="display:flex;gap:22px;align-items:center">
        <img class="jav" style="width:110px;height:110px;border-radius:50%;background:var(--purple-l)" src="${W.IMG.jason.happy}">
        <div><div style="font:800 22px Nunito;color:var(--orange);letter-spacing:2px">PERSONA</div>
        <div class="h1" style="font-size:66px">Jason Lee</div>
        <div style="font:800 26px Nunito;color:var(--navy-2)">Early 30s · immigrant resident</div></div>
      </div>
      <div class="facts" style="margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px 22px;font:700 26px/1.25 Nunito">
        <div class="fx">${ic('house', '#7B4B94', 32, 4)} Lives outside the CBD</div>
        <div class="fx">${ic('translate', '#7B4B94', 32, 4)} English isn’t his first language</div>
        <div class="fx">${ic('dog', '#7B4B94', 32, 4)} Walks his dog, shops locally</div>
        <div class="fx">${ic('mail', '#7B4B94', 32, 4)} Gets council news by mail</div>
      </div>
      <div class="q" style="margin-top:24px;padding:18px 24px;border-radius:20px;background:var(--purple-l);font:800 italic 29px/1.35 Nunito;color:var(--purple-d)">“I know they want to help, but I don’t always know who to ask, or how to say it right.”</div>
    </div>
    <div class="card letter" style="position:absolute;left:1010px;top:96px;width:800px;padding:0;overflow:hidden">
      <div style="background:#2E7D32;color:#fff;padding:18px 34px;display:flex;align-items:center;gap:14px">${ic('building', '#fff', 36, 3.6)}<div style="font:900 28px Nunito;letter-spacing:2px">CITY COUNCIL</div><div style="margin-left:auto;font:700 20px Nunito;opacity:.9">Ref. LL3/2026/114</div></div>
      <div style="padding:26px 34px 30px">
        <div style="font:900 34px/1.2 Nunito">Notice of proposed amendment: Riverside Park</div>
        <div style="font:600 27px/1.75 Nunito;margin-top:14px;color:#33405A">Pursuant to ${jargon('Local Law 3 (Amenity)')}, the ${jargon('off-leash designation')} will be ${jargon('rescinded')} during ${jargon('prescribed hours')}. Submissions may be lodged within the ${jargon('statutory consultation period')}.</div>
        <div style="margin-top:16px;height:12px;width:80%;border-radius:6px;background:#E4DED3"></div>
        <div style="margin-top:12px;height:12px;width:64%;border-radius:6px;background:#E4DED3"></div>
      </div>
    </div>
    <div class="montage abs" style="left:1000px;top:90px;width:830px">
      <div class="card mA" style="padding:26px 30px;display:flex;gap:22px;align-items:flex-start">
        <div style="width:84px;height:84px;border-radius:24px;background:var(--purple);display:grid;place-items:center;flex:none">${ic('building', '#fff', 50)}</div>
        <div style="flex:1"><div style="font:800 20px Nunito;color:var(--orange);letter-spacing:2px">VISIT · COUNCIL OFFICE</div>
          <div style="font:900 34px/1.2 Nunito;margin-top:4px">“That’s a different department…”</div>
          <div class="hops" style="display:flex;gap:10px;margin-top:14px;font:800 21px Nunito">
            ${['Customer service', 'Local laws', 'Parks?'].map((d, i) => `<span class="chip hop h${i}" style="background:${i === 2 ? '#FDE4E1' : '#EEF0F4'};color:${i === 2 ? '#C2372F' : 'var(--navy-2)'};font-size:21px;padding:6px 16px">${d}</span>${i < 2 ? '<span class="ar" style="font:900 26px Nunito;color:var(--navy-2)">→</span>' : ''}`).join('')}
          </div></div>
      </div>
      <div class="card mB" style="margin-top:22px;padding:26px 30px;display:flex;gap:22px;align-items:flex-start">
        <div style="width:84px;height:84px;border-radius:24px;background:var(--orange);display:grid;place-items:center;flex:none">${ic('mail', '#fff', 50)}</div>
        <div style="flex:1"><div style="font:800 20px Nunito;color:var(--orange);letter-spacing:2px">EMAIL · GENERAL ENQUIRIES</div>
          <div style="font:900 30px/1.25 Nunito;margin-top:4px">Subject: Concern about the new park rule</div>
          <div style="display:flex;gap:14px;margin-top:14px;align-items:center">
            <span class="chip sent" style="background:var(--green-l);color:var(--green-d);font-size:22px">${ic('check', '#2E7D32', 24, 4.5)}Sent</span>
            ${['Day 3', 'Day 10', 'Day 21'].map((d, i) => `<span class="chip day d${i}" style="background:#EEF0F4;color:var(--navy-2);font-size:21px;padding:6px 16px;white-space:nowrap">${d} · <b style="color:#C2372F">no reply</b></span>`).join('')}
          </div></div>
      </div>
    </div>
    <div class="pains abs" style="left:64px;top:64px;display:flex;flex-direction:column;gap:12px;align-items:flex-start">
      <span class="chip p0" style="background:#FDE4E1;color:#C2372F;box-shadow:0 8px 20px rgba(31,42,68,.12)">${ic('chat', '#C2372F', 28, 4)}Unsure which words</span>
      <span class="chip p1" style="background:#FDE4E1;color:#C2372F;box-shadow:0 8px 20px rgba(31,42,68,.12)">${ic('user', '#C2372F', 28, 4)}Unsure who to ask</span>
      <span class="chip p2" style="background:#FDE4E1;color:#C2372F;box-shadow:0 8px 20px rgba(31,42,68,.12)">${ic('bell', '#C2372F', 28, 4)}Never hears back</span>
    </div>
    <div class="bubble qm" style="font:900 54px Nunito;color:#E0544B;padding:6px 26px">?</div>
    <div class="bubble qm2" style="font:900 40px Nunito;color:#E0544B;padding:4px 20px">?</div>`,
  (root, t, S) => {
    setWorld({ home: true, jason: true, dog: true });
    W.sunAt(new THREE.Vector3(JH.x, 0, JH.z), [3, 6, 4]);
    const tc = S.cue('s3c'), td = S.cue('s3d'), te = S.cue('s3e'), tf = S.cue('s3f');
    // --- Jason
    const turn = smooth(t, tc + 0.1, 0.8);
    jason.root.position.copy(JH);
    jason.root.rotation.y = lerp(lerp(0.45, faceAngle(JH, LB) + 0.15, turn), 0.55, smooth(t, te - 0.1, 0.9)) + (t > tf ? smooth(t, tf + 0.3, 1.2) * 0.4 : 0);
    const reachBox = clamp(1 - Math.abs(t - (tc + 1.0)) / 0.55) * (t < tc + 1.4 ? 1 : 0);
    const reading = t > tc + 1.25 && t < te - 0.1;
    const onPhone = t > te + 0.15 && t < tf + 0.1;
    const slump = Math.max(smooth(t, te + 0.5, 1.5) * 0.35, smooth(t, tf - 0.1, 0.8));
    const o = { slump, look: [0, 0] };
    if (t < tc) o.look = [0.15 * Math.sin(t * 0.7), -0.05];
    if (reachBox > 0) { o.reachR = LB.clone().add(new THREE.Vector3(0.05, 0.02, 0.05)); o.reachW = ease(reachBox); o.look = [0, 0.25]; }
    if (reading) {
      o.letter = true; o.reachR = jason.local(-0.1, 1.12, 0.3, new THREE.Vector3()); o.reachL = jason.local(0.12, 1.12, 0.3, new THREE.Vector3());
      o.look = [t > td ? 0.12 * Math.sin((t - td) * 2.2) : 0, 0.42]; o.tilt = t > td ? 0.16 * smooth(t, td, 0.5) : 0;
    }
    if (onPhone) { o.phone = true; o.reachR = jason.local(-0.05, 1.18, 0.32, new THREE.Vector3()); o.look = [0, 0.5]; }
    if (t > tf) o.look = [0.25, 0.35];
    jason.pose(t, o);
    if (onPhone) drawPhoneTex(W, 'mail');
    dog.root.position.set(JH.x + 0.45, 0, JH.z + 0.5); dog.root.rotation.y = t < tc ? 0.6 : -1.9;
    dog.pose(t, 0, t > tf ? 'look' : t > te ? 'sniff' : 'idle');
    // --- camera
    const C0 = new THREE.Vector3(JH.x + 0.1, 0.95, JH.z);
    const a = 0.3 + t * 0.012;
    const pA = [C0.x + Math.sin(a) * 3.6, 1.3, C0.z + Math.cos(a) * 3.6], lA = [C0.x + 0.1, 0.95, C0.z];
    const pB = [JH.x + 1.55, 1.5, JH.z + 1.9], lB = [JH.x - 0.25, 1.15, JH.z - 0.35];
    const pC = [JH.x + 0.35, 1.55, JH.z + 1.55], lC = [JH.x + 0.05, 1.3, JH.z];
    const pD = [JH.x + 2.4, 2.3, JH.z + 4.4], lD = [JH.x - 0.2, 0.85, JH.z - 0.5];
    const mix = (A, B, k) => A.map((v, i) => lerp(v, B[i], k));
    const k1 = smooth(t, tc - 0.2, 1.2), k2 = smooth(t, te - 0.2, 1.0), k3 = smooth(t, tf - 0.2, 1.6);
    const cp = mix(mix(mix(pA, pB, k1), pC, k2), pD, k3), cl = mix(mix(mix(lA, lB, k1), lC, k2), lD, k3);
    W.cam(cp, cl, 32, lerp(-430, -390, k1) * (1 - k3));
    W.canvasFilter(`saturate(${1 - 0.65 * smooth(t, tf, 1.2)}) brightness(${1 - 0.08 * smooth(t, tf, 1.2)})`);
    // --- 2D
    show($(root, '.pc'), t, S.cue('s3a'), { kind: 'right', dist: 50, out: tc - 0.2 });
    $$(root, '.fx').forEach((f, i) => show(f, t, S.cue('s3a') + 0.4 + i * 0.3, { kind: 'up', dist: 15 }));
    show($(root, '.q'), t, S.cue('s3b'), { kind: 'up' });
    const L = $(root, '.letter');
    show(L, t, tc + 1.0, { kind: 'up', dist: 60, out: te - 0.2 });
    L.style.transform += ` rotate(${lerp(-3, -1, smooth(t, tc + 1, 1))}deg)`;
    $$(L, '.qb').forEach((q, i) => show(q, t, td + 0.45 + i * 0.42, { kind: 'pop', d: 0.35 }));
    $$(L, '.jg').forEach((j, i) => (j.style.background = t > td + 0.45 + i * 0.42 ? '#FFD7D2' : '#FFF0B3'));
    const M = $(root, '.montage');
    show(M, t, te - 0.1, { kind: 'fade', d: 0.3, out: tf + 0.2 });
    show($(M, '.mA'), t, te, { kind: 'right', dist: 40 });
    $$(M, '.hop').forEach((h, i) => show(h, t, te + 0.5 + i * 0.45, { kind: 'pop' }));
    $$(M, '.ar').forEach((h, i) => show(h, t, te + 0.7 + i * 0.45, { kind: 'fade' }));
    show($(M, '.mB'), t, S.at('s3e', 'then sends'), { kind: 'right', dist: 40 });
    show($(M, '.sent'), t, S.at('s3e', 'email') + 0.2, { kind: 'pop' });
    $$(M, '.day').forEach((d, i) => show(d, t, S.at('s3e', 'never learns') + i * 0.45, { kind: 'pop' }));
    show($(root, '.p0'), t, td + 1.2, { kind: 'left', dist: 30 });
    show($(root, '.p1'), t, te + 1.2, { kind: 'left', dist: 30 });
    show($(root, '.p2'), t, S.at('s3e', 'never learns') + 0.6, { kind: 'left', dist: 30 });
    const hp = W.project(jason.headPos(new THREE.Vector3()).add(new THREE.Vector3(0, 0.22, 0)));
    const qm = $(root, '.qm'), qm2 = $(root, '.qm2');
    show(qm, t, td + 0.3, { kind: 'pop', out: te - 0.2 }); show(qm2, t, td + 0.9, { kind: 'pop', out: te - 0.2 });
    qm.style.left = `${hp.x - 40}px`; qm.style.top = `${hp.y - 90 + Math.sin(t * 3) * 6}px`;
    qm2.style.left = `${hp.x + 40}px`; qm2.style.top = `${hp.y - 140 + Math.sin(t * 3 + 1) * 6}px`;
    W.lowerThird(t, [
      { a: tc + 0.3, b: te - 0.1, k: 'Before POTATO', text: 'Council letter, unfamiliar terms', icon: ic('mail', '#fff', 30, 3.6) },
      { a: te, b: S.dur, k: 'Before POTATO', text: 'No clear contact, no reply', icon: ic('warn', '#fff', 30, 3.6) },
    ]);
    return { gl: true };
  });

  // ------------------------------------------------------------ 4 DISCOVER
  add(`<div class="bubble b4">Hi, Melb!</div>
    <div class="vwrap abs" style="left:0;top:0;width:1000px;height:700px;transform-origin:0 0">${visorHTML(W)}</div>
    <div class="callout chip" style="position:absolute;background:#fff;box-shadow:0 8px 24px rgba(31,42,68,.2);font-size:26px;color:var(--green-d)">${ic('check', '#2E9E4F', 30, 4.5)}Verified council &amp; community notices</div>`,
  (root, t, S) => {
    setWorld({ street: true, jason: true, dog: true, tram: true, crowd: true });
    post.group.position.copy(POSTPOS); post.group.rotation.y = 0;
    drawDisplay(W, t, { period: 2.0 });
    const tb = S.cue('s4b'), tc = S.cue('s4c');
    // Jason walks along the footpath and stops in front of the post
    const arrive = tb + 1.6;
    const STOP = new THREE.Vector3(-0.42, 0, 0.36);
    const WAIT = new THREE.Vector3(-0.85, 0, 0.55);
    const pw = prog(t, 0, arrive);
    const x = lerp(-7.0, STOP.x, pw);
    const walk = 1 - smooth(t, arrive - 0.35, 0.45);
    const turn = smooth(t, arrive - 0.3, 0.8);
    jason.root.position.set(x, 0, lerp(0.75, STOP.z, smooth(t, arrive - 1.2, 1.2)));
    jason.root.rotation.y = lerp(Math.PI / 2, faceAngle(jason.root.position, POSTPOS), turn);
    const waving = t > tc + 0.5 && t < tc + 2.3;
    jason.pose(t, {
      walk, walkT: pw * (arrive / 1.0) * 0.82,
      look: [lerp(0, -0.55, smooth(t, tb - 1.0, 0.6)) * (1 - turn), turn > 0.5 ? -0.12 : 0],
      wave: waving ? (t - tc - 0.5) * 1.1 : null,
    });
    dog.root.position.set(x + lerp(0.75, 0.75, turn), 0, lerp(1.2, 0.95, turn)); dog.root.rotation.y = lerp(Math.PI / 2, -0.3, turn);
    dog.pose(t, walk, 'look');
    // tram crosses the foreground during the establishing shot
    W.tram.group.position.x = lerp(-34, 30, prog(t, -0.6, 5.2));
    W.crowd.update(t + 20);
    // Spud wakes at s4c
    const wake = t > tc;
    post.spud.setFace({ mode: wake && t < tc + 2.2 ? 'happy' : 'idle', blink: wake ? blink(t, 3) : 0.75, perk: wake ? 1 : 0, wave: wake ? (t - tc) * 8 * (t < tc + 2 ? 1 : 0) : 0 });
    // camera: establishing across the road -> post display -> over-shoulder -> push in to visor
    const mix = (A, B, k) => A.map((v, i) => lerp(v, B[i], k));
    const pEst = [-2.6 + t * 0.15, 7.2, 15.5], lEst = [-3.0 + t * 0.3, 0.6, -0.8];
    const pDisp = [2.3, 1.0, 2.0], lDisp = [-0.05, 0.72, -0.4];
    const pOs = [0.5, 1.6, 1.75], lOs = [-0.15, 1.02, -0.4];
    const pIn = [0.06, 1.12, 0.42], lIn = [0, 1.1, -0.4];
    const cut = t < tb - 0.15;
    const k2 = smooth(t, tc - 0.3, 1.2), k3 = smooth(t, tc + 2.3, 1.0);
    let cp, cl;
    if (cut) { cp = pEst; cl = lEst; W.cam(cp, cl, 30); }
    else {
      const k1 = smooth(t, tb - 0.15, 3.0);
      const pD = mix([2.6, 1.1, 3.2], pDisp, k1), lD = mix([-0.6, 0.85, -0.3], lDisp, k1);
      cp = mix(mix(pD, pOs, k2), pIn, k3); cl = mix(mix(lD, lOs, k2), lIn, k3);
      W.cam(cp, cl, 34);
    }
    W.sunAt(new THREE.Vector3(cut ? -2 : 0, 0, 0), [3, 6, 4]);
    const b = $(root, '.b4'); show(b, t, tc + 0.1, { kind: 'pop', out: tc + 2.3 }); bubbleAt(b, [0.13, 0.17, 0], 0, -90);
    const co = $(root, '.callout'); show(co, t, tb + 0.8, { kind: 'pop', out: tc - 0.2 });
    const dp = W.project(new THREE.Vector3(0.23, 0.62, -0.4)); co.style.left = `${dp.x + 40}px`; co.style.top = `${dp.y - 40}px`;
    // visor panel zooms out of the head
    const vw = $(root, '.vwrap');
    const z = ease(prog(t, tc + 2.4, 0.8));
    const hp = W.project(W.spudWorld([0, 0, 0.15]));
    const sc = lerp(0.12, 0.92, z);
    const X = lerp(hp.x - 500 * sc, 960 - 500 * 0.92, z), Y = lerp(hp.y - 350 * sc, 70, z);
    vw.style.transform = `translate(${X}px, ${Y}px) scale(${sc})`; vw.style.opacity = clamp((t - tc - 2.3) * 4);
    vw.style.visibility = t > tc + 2.3 ? 'visible' : 'hidden';
    $$(vw, '.issue').forEach((c, i) => show(c, t, tc + 2.9 + i * 0.25, { kind: 'left', dist: 30 }));
    $(vw, '.f1').style.background = t > S.at('s4c', 'ranked') ? 'var(--green-l)' : '#fff';
    $(vw, '.sp').setAttribute('src', spudImg(W, t, 'happy'));
    W.lowerThird(t, [
      { a: 0.4, b: tb - 0.3, k: 'Scenario', text: 'A grocery walk past a POTATO post', icon: ic('pin', '#fff', 30, 3.6) },
      { a: tb + 0.5, b: tc - 0.1, text: 'Verified notices display', icon: ic('check', '#fff', 30, 4) },
      { a: tc + 2.5, b: S.dur, text: 'Local issues panel', icon: ic('pin', '#fff', 30, 3.6) },
    ]);
    return { gl: true };
  });

  // ------------------------------------------------------------ 5 UNDERSTAND + SPEAK
  add(`<div class="scrim abs" style="inset:0;background:linear-gradient(90deg,rgba(255,244,224,0) 30%,rgba(255,244,224,.55) 60%)"></div>
    <div class="vwrap abs" style="left:870px;top:70px;width:1000px;height:700px;transform-origin:0 0" data-base="scale(.98)">${visorHTML(W)}</div>
    <div class="jb bubble" style="font:700 30px 'Noto Sans TC';color:var(--navy);padding:14px 24px;white-space:normal;width:420px"><span class="zh">${ZH.jasonLine}</span></div>`,
  (root, t, S) => {
    setWorld({ street: true, jason: true, dog: true, crowd: true });
    post.group.position.copy(POSTPOS);
    drawDisplay(W, t + 20);
    W.crowd.update(t + 40);
    const ta = S.cue('s5a'), tb = S.cue('s5b'), tcue = S.cue('s5c'), tj = S.cue('s5j'), tje = S.end('s5j'), td = S.cue('s5d'), te = S.cue('s5e');
    const listening = t > tcue + 0.5 && t < td;
    const thinking = t > tje && t < td + 0.5;
    post.spud.setFace({ mode: thinking ? 'think' : listening ? 'listen' : 'panel', blink: blink(t, 3.2), pulse: (t * 1.5) % 1, perk: listening ? 1 : 0.35 });
    const JP = new THREE.Vector3(-0.42, 0, 0.36);
    jason.root.position.copy(JP); jason.root.rotation.y = faceAngle(JP, POSTPOS);
    // three taps on the visor: pick the issue, start talking, confirm
    const screen = W.spudWorld([0, -0.01, 0.17]);
    const taps = [ta + 0.15, tcue - 0.05, te - 0.1];
    let reachW = 0;
    for (const a of taps) reachW = Math.max(reachW, clamp(1 - Math.abs(t - a - 0.45) / 0.55));
    jason.pose(t, {
      reachR: screen, reachW: ease(Math.min(1, reachW * 1.6)),
      talk: t > tj && t < tje, look: [0.05, t > tj && t < tje ? -0.12 : -0.05],
    });
    dog.root.position.set(0.55, 0, 0.85); dog.root.rotation.y = -0.5 + Math.sin(t * 0.3) * 0.2; dog.pose(t, 0, t > td ? 'sniff' : 'idle');
    const a = 0.62 + t * 0.004;
    W.cam([-0.25 + Math.sin(a) * 3.3, 1.3, 0.05 + Math.cos(a) * 3.3], [-0.2, 0.92, 0.0], 34, -500);
    W.sunAt(new THREE.Vector3(0, 0, 0), [3, 6, 4]);
    const vw = $(root, '.vwrap'); vw.dataset.base = 'scale(.98)'; show(vw, t, 0.0, { kind: 'fade', d: 0.3 });
    const pl = $(vw, '.p-list'), pd = $(vw, '.p-detail'), pli = $(vw, '.p-listen'), pc = $(vw, '.p-comment');
    $$(vw, '.issue').forEach((c) => { c.style.opacity = 1; c.style.transform = ''; c.style.visibility = 'visible'; });
    $(vw, '.f1').style.background = 'var(--green-l)';
    const td0 = ta + 0.9;
    const tap = $(vw, '.tapdot'); const tp = prog(t, ta + 0.5, 0.5);
    tap.style.opacity = tp > 0 && tp < 1 ? 1 - tp : 0; tap.style.transform = `scale(${0.5 + tp})`;
    $(vw, '.i0').style.transform = t > ta + 0.5 && t < ta + 0.9 ? 'scale(.97)' : '';
    show(pl, t, -1, { kind: 'fade', out: td0, od: 0.3 });
    show(pd, t, td0, { kind: 'right', d: 0.4, dist: 30, out: tcue + 0.4, od: 0.3 });
    show($(vw, '.tip'), t, S.at('s5b', 'difficult terms') - 0.1, { kind: 'pop' });
    const term = $(vw, '.term'); term.style.background = t > S.at('s5b', 'difficult') - 0.2 ? '#FFD54F' : '#FFF0B3';
    show($(vw, '.langchip'), t, td0 + 0.2, { kind: 'pop' });
    const tap2 = $(vw, '.tapdot2'); const tp2 = prog(t, tcue + 0.3, 0.45);
    tap2.style.opacity = tp2 > 0 && tp2 < 1 ? 1 - tp2 : 0; tap2.style.transform = `scale(${0.5 + tp2})`;
    show(pli, t, tcue + 0.5, { kind: 'fade', d: 0.3, out: td, od: 0.3 });
    const lAmp = t > tj && t < tje ? 1 : 0.25;
    if (t > tcue && t < td + 0.4) waveSVG($(vw, '.wave'), t, lAmp);
    setSrc($(vw, '.p-listen .sp'), thinking ? W.IMG.spud.think : W.IMG.spud.listen);
    $(vw, '.p-listen .sp').style.transform = `translateY(${-6 * Math.abs(Math.sin(t * 3))}px)`;
    typeText($(vw, '.transcript'), ZH.jasonLine, t, tj + 0.15, Math.max(0.5, tje - tj - 0.2));
    show(pc, t, td, { kind: 'up', d: 0.4, dist: 30 });
    // all three result rows land within the first second so the panel never sits half-empty
    $$(vw, '.p-comment .card').forEach((c, i) => show(c, t, td + 0.15 + i * 0.35, { kind: 'up', dist: 20 }));
    $$(vw, '.p-comment .card').forEach((c, i) => (c.style.boxShadow = t > [td + 0.2, S.at('s5d', 'plus English'), S.at('s5d', 'names the')][i] && t < [td + 0.2, S.at('s5d', 'plus English'), S.at('s5d', 'names the')][i] + 1.4 ? '0 0 0 4px rgba(242,140,40,.55)' : ''));
    show($(vw, '.btns'), t, td + 1.2, { kind: 'up', dist: 20 });
    const be = $(vw, '.bedit'); be.style.boxShadow = t > S.at('s5d', 'review and edit') && t < S.at('s5d', 'review and edit') + 1.2 ? '0 0 0 6px rgba(123,75,148,.3)' : 'none';
    show($(vw, '.noaudio'), t, te, { kind: 'pop' });
    const ok = $(vw, '.bok'); ok.style.transform = t > te + 0.3 && t < te + 0.55 ? 'scale(.92)' : '';
    const jb = $(root, '.jb'); show(jb, t, tj, { kind: 'pop', out: tje + 0.3 });
    const hp = W.project(jason.headPos(new THREE.Vector3()));
    jb.style.left = `${Math.max(40, hp.x - 260)}px`; jb.style.top = `${Math.max(40, hp.y - 250)}px`;
    W.lowerThird(t, [
      { a: tb, b: tcue - 0.1, text: 'Plain-language summary', icon: ic('translate', '#fff', 30, 3.4) },
      { a: tcue, b: td - 0.1, text: 'Speak to Spud, any language', icon: ic('mic', '#fff', 30, 3.4) },
      { a: td, b: S.dur, text: 'Structured comment', icon: ic('doc', '#fff', 30, 3.4) },
    ]);
    return { gl: true };
  });

  // ------------------------------------------------------------ 6 NFC + TRACKER
  const phone6 = `
    <div style="padding:22px 26px">
      <div class="card" style="padding:18px 20px;border-radius:24px">
        <div style="display:flex;gap:12px;align-items:center">${ic('tree', '#2E7D32', 40)}<div><div style="font:900 25px Nunito">Park rule changes</div><div style="font:700 17px Nunito;color:var(--navy-2)">Parks &amp; Open Space · comment attached</div></div></div>
      </div>
      <div class="card trk" style="margin-top:16px;padding:16px 20px;border-radius:24px;display:flex;align-items:center;gap:14px">
        <div style="flex:1"><div style="font:900 23px Nunito">Track this issue · <span class="zh">${ZH.track}</span></div><div style="font:700 16px Nunito;color:var(--navy-2)">Your choice — saved on your phone only</div></div>
        <div class="sw" style="width:84px;height:46px;border-radius:23px;background:#CFD3DC;position:relative;flex:none"><div class="knob" style="position:absolute;top:5px;left:5px;width:36px;height:36px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)"></div></div>
      </div>
      <div class="tracker" style="margin-top:18px;padding:6px 6px">
        <div style="font:800 17px Nunito;letter-spacing:1.5px;color:var(--orange)">PROGRESS</div>
        ${[['Received', ZH.recv], ['In review', ZH.review], ['Outcome', ZH.outcome]].map(([e, z], i) => `
          <div class="step s${i}"><div class="dot">${i + 1}</div><div><div style="font:900 25px Nunito">${e}</div><div class="zh" style="font:700 20px 'Noto Sans TC';color:var(--navy-2)">${z}</div></div></div>
          ${i < 2 ? `<div class="ln l${i}" style="margin-left:21px;width:4px;height:26px;background:#CFD3DC"></div>` : ''}`).join('')}
      </div>
    </div>`;
  add(`<div class="ov abs" style="inset:0">${bg2d()}
      <div class="ph abs" style="left:330px;top:44px;transform-origin:0 0" data-base="scale(.91)">${phoneHTML(W, phone6)}</div>
      <div class="optin abs" style="left:900px;top:300px;width:820px">
        <div style="font:800 24px Nunito;color:var(--green-d);letter-spacing:2px">PRIVACY BY DESIGN</div>
        <div class="h1" style="font-size:66px">Tracking is opt-in</div>
        <div style="font:700 32px/1.35 Nunito;color:var(--navy-2);margin-top:12px">The post forgets everything. Jason chooses to keep the issue on his own phone.</div>
      </div>
      <div class="oc0 card abs" style="left:880px;top:170px;width:820px;padding:28px 34px;border-left:12px solid var(--green)">
        <div style="font:800 20px Nunito;letter-spacing:1.5px;color:var(--green-d)">OUTCOME · <span class="zh">${ZH.outcome}</span> — EXAMPLE A</div>
        <div style="font:900 36px/1.2 Nunito;margin-top:6px">Decision: off-leash hours extended to 6–9 am</div>
        <div style="display:flex;gap:12px;margin-top:14px"><span class="chip" style="background:var(--navy);color:#fff;font-size:22px">Case no. CASE-2026-0417</span><span class="chip" style="background:var(--green-l);color:var(--green-d);font-size:22px">Parks &amp; Open Space</span></div>
      </div>
      <div class="oc1 card abs" style="left:880px;top:420px;width:820px;padding:28px 34px;border-left:12px solid var(--red)">
        <div style="font:800 20px Nunito;letter-spacing:1.5px;color:#C2372F">OUTCOME — EXAMPLE B · DECLINED · <span class="zh">${ZH.declined}</span></div>
        <div style="font:900 32px/1.25 Nunito;margin-top:6px">Reasons given: wildlife protection zone; a new off-leash area is proposed nearby instead.</div>
      </div>
    </div>
    <div class="nfcLbl chip" style="position:absolute;background:#fff;font-size:26px;box-shadow:0 8px 24px rgba(31,42,68,.2);color:var(--navy)">${ic('lock', '#7B4B94', 30, 4)}Post keeps nothing</div>`,
  (root, t, S) => {
    const ta = S.cue('s6a'), tb = S.cue('s6b'), tc = S.cue('s6c'), td = S.cue('s6d'), te = S.cue('s6e');
    const tap = ta + 1.25;
    const in3D = t < tc + 0.15;
    if (in3D) {
      setWorld({ street: true, jason: true, dog: true, crowd: true });
      W.crowd.update(t + 70);
      post.group.position.copy(POSTPOS);
      const wipeK = t > tb ? prog(t, tb + 0.2, 0.7) : 0;
      drawDisplay(W, t + 40, t > tb ? { mode: 'stored', wipe: wipeK } : {});
      post.spud.setFace({ mode: t > tap && t < tap + 1.6 ? 'happy' : 'panel', blink: blink(t, 3), perk: 0.5 });
      const JP = new THREE.Vector3(-0.3, 0, 0.12);
      jason.root.position.copy(JP); jason.root.rotation.y = faceAngle(JP, POSTPOS) + 0.1;
      // phone comes out, touches the tilted NFC pad, then returns to a reading position
      const pad = new THREE.Vector3(0, 0.865, -0.285);
      const padN = new THREE.Vector3(0, Math.cos(0.42), Math.sin(0.42));
      const k = ease(prog(t, ta + 0.1, 1.1)), back = ease(prog(t, tap + 0.5, 0.8));
      const rest = jason.local(-0.06, 1.15, 0.3, new THREE.Vector3());
      // wrist hovers just above/behind the pad so the phone (held past the knuckles) lies on it
      const touch = pad.clone().addScaledVector(padN, 0.045).add(new THREE.Vector3(-0.03, 0, 0.07));
      const hand = rest.clone().lerp(touch, k * (1 - back));
      jason.pose(t, { reachR: hand, reachW: 1, phone: true, phoneFace: k * (1 - back) > 0.5 ? padN : null, look: [0, 0.35] });
      drawPhoneTex(W, t > tap + 0.3 ? 'done' : 'nfc');
      W.ripples.forEach((r, i) => {
        r.visible = true;
        const p = prog(t, tap + i * 0.22, 1.0);
        r.position.copy(pad).addScaledVector(padN, 0.03); r.rotation.set(-Math.PI / 2 + 0.42, 0, 0);
        r.scale.setScalar(1 + p * 5); r.material.opacity = p > 0 && p < 1 ? (1 - p) * 0.9 : 0;
      });
      dog.root.position.set(0.6, 0, 0.75); dog.root.rotation.y = -0.6; dog.pose(t, 0, 'look');
      const kc = smooth(t, tb - 0.2, 1.3);
      const cp = [lerp(1.2, 0.75, kc) + Math.sin(t * 0.6) * 0.02, lerp(1.7, 0.95, kc), lerp(1.25, 2.3, kc)];
      const cl = [lerp(-0.2, 0.0, kc), lerp(1.02, 0.62, kc), lerp(-0.15, -0.4, kc)];
      W.cam(cp, cl, lerp(36, 34, kc));
      W.sunAt(new THREE.Vector3(0, 0, 0), [3, 6, 4]);
    } else W.ripples.forEach((r) => (r.visible = false));
    const nl = $(root, '.nfcLbl');
    show(nl, t, tb + 1.0, { kind: 'pop', out: tc - 0.1 });
    if (in3D) { const p = W.project(new THREE.Vector3(0.25, 0.75, -0.17)); nl.style.left = `${p.x + 40}px`; nl.style.top = `${p.y - 30}px`; }
    const ov = $(root, '.ov');
    ov.style.display = t > tc - 0.3 ? 'block' : 'none';
    show(ov, t, tc - 0.25, { kind: 'fade', d: 0.4 });
    animBg(ov, t);
    const ph = $(root, '.ph'); show(ph, t, tc - 0.2, { kind: 'up', dist: 80 });
    const on = smooth(t, tc + 0.9, 0.3);
    $(ph, '.sw').style.background = on > 0.5 ? 'var(--green)' : '#CFD3DC';
    $(ph, '.knob').style.left = `${5 + on * 38}px`;
    $(ph, '.trk').style.boxShadow = t > tc + 0.8 && t < tc + 2 ? '0 0 0 5px rgba(76,175,80,.35)' : '';
    const st = [td + 0.9, td + 2.6, td + 4.4];
    $$(ph, '.step').forEach((s, i) => {
      const d = $(s, '.dot'); const done = t > st[i];
      d.style.background = done ? ['#4CAF50', '#F28C28', '#7B4B94'][i] : '#CFD3DC';
      d.style.transform = done && t < st[i] + 0.3 ? `scale(${1 + 0.25 * Math.sin(prog(t, st[i], 0.3) * Math.PI)})` : '';
      d.innerHTML = done && i === 0 ? '✓' : String(i + 1);
    });
    $$(ph, '.ln').forEach((l, i) => (l.style.background = t > st[i + 1] ? '#F28C28' : '#CFD3DC'));
    show($(ph, '.tracker'), t, td, { kind: 'up', dist: 20 });
    show($(root, '.optin'), t, tc + 0.4, { kind: 'right', dist: 30, out: td - 0.1 });
    show($(root, '.oc0'), t, S.at('s6d', 'an outcome'), { kind: 'right', dist: 40 });
    show($(root, '.oc1'), t, S.at('s6d', 'or reasons'), { kind: 'right', dist: 40 });
    const n = $(ph, '.notif'); show(n, t, te, { kind: 'down', dist: 60 });
    W.lowerThird(t, [
      { a: ta + 0.2, b: tb, text: 'NFC to app', icon: ic('share', '#fff', 30, 3.6) },
      { a: tb, b: tc - 0.1, k: 'Privacy', text: 'Nothing stored on the post', icon: ic('lock', '#fff', 30, 3.6) },
      { a: tc + 0.3, b: td - 0.1, k: 'Privacy', text: 'Opt-in tracking', icon: ic('check', '#fff', 30, 4) },
      { a: td, b: te - 0.1, text: 'Progress tracker', icon: ic('steps', '#fff', 30, 3.6) },
      { a: te, b: S.dur, text: 'Notifications', icon: ic('bell', '#fff', 30, 3.6) },
    ]);
    return { gl: in3D };
  });

  // ------------------------------------------------------------ 7 Q&A + SHARE + TRIPTYCH
  const chat7 = `
    <div class="chat" style="padding:16px 22px">
      <div style="text-align:center;font:800 16px Nunito;color:var(--navy-2)">Q&amp;A assistant · <span class="zh">${ZH.qa}</span></div>
      <div class="msg me m0"><span class="zh" style="font-size:24px">${ZH.ask}</span><div style="font:700 15px Nunito;opacity:.85">Which department should I contact?</div></div>
      <div class="msg bot typing m1" style="width:96px;display:flex;gap:8px;justify-content:center"><i></i><i></i><i></i></div>
      <div class="msg bot m2"><span class="zh">${ZH.answer}</span>
        <div><span class="src s0">${ic('doc', '#2E7D32', 18, 4)}Source: official council document</span><span class="src s1">Dog Off-Leash Policy Review · p.4</span></div></div>
      <div class="card m3" style="padding:14px 16px;border:3px solid var(--orange);border-radius:20px;margin-top:8px">
        <div style="font:800 14px Nunito;color:var(--orange);letter-spacing:1.2px">NOT SURE? TALK TO A PERSON</div>
        <div style="display:flex;gap:10px;align-items:center;margin-top:4px"><div style="width:46px;height:46px;border-radius:50%;background:var(--purple-l);display:grid;place-items:center">${ic('user', '#7B4B94', 28, 4)}</div>
        <div><div style="font:900 19px Nunito">Contact: Alex Chen</div><div style="font:700 15px Nunito;color:var(--navy-2)">Named officer · Parks &amp; Open Space</div></div></div>
      </div>
    </div>
    <div class="share abs" style="left:0;right:0;bottom:0;top:150px;background:rgba(31,42,68,.35);opacity:0">
      <div class="sheet" style="position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:34px 34px 0 0;padding:24px 26px 34px">
        <div style="font:900 22px Nunito;text-align:center">Share this issue</div>
        <div class="scard" style="margin-top:14px;border-radius:26px;background:linear-gradient(135deg,#9567AE,#7B4B94);padding:20px;color:#fff;display:flex;gap:14px;align-items:center">
          <img style="width:110px;height:110px" src="${W.IMG.spud.happy}">
          <div><div style="font:800 15px Nunito;opacity:.9">HAVE YOUR SAY</div><div style="font:900 26px/1.15 'Baloo 2'">Park rule changes</div><div style="font:700 16px Nunito">Closes in 5 days · via POTATO</div></div>
        </div>
        <div class="sbtn" style="margin-top:18px;border-radius:999px;background:var(--orange);color:#fff;font:900 24px Nunito;text-align:center;padding:14px">Share to Instagram</div>
        <div class="done" style="margin-top:12px;text-align:center;font:900 22px Nunito;color:var(--green-d);opacity:0">✓ Shared — neighbours can join in</div>
      </div>
    </div>`;
  const tri = (title, inner) => `<div class="tc card" style="width:470px;height:600px;padding:26px;position:relative;overflow:hidden">
      <div style="font:800 40px 'Baloo 2';color:var(--purple);text-align:center">${title}</div>${inner}</div>`;
  add(`${bg2d()}
    <div class="ph abs" style="left:300px;top:44px;transform-origin:0 0" data-base="scale(.91)">${phoneHTML(W, chat7)}</div>
    <div class="callouts abs" style="left:860px;top:220px;width:900px">
      ${[['doc', 'Answers from official documents', '#4CAF50'], ['check', 'Cites its sources', '#F28C28'], ['user', 'Hands over to a named contact', '#7B4B94']].map(([i, l, c], k) => `<div class="chip co${k}" style="background:#fff;box-shadow:0 10px 26px rgba(31,42,68,.12);font-size:34px;padding:14px 34px 14px 14px;margin-bottom:26px"><span style="width:66px;height:66px;border-radius:50%;background:${c};display:grid;place-items:center">${ic(i, '#fff', 36, 4)}</span>${l}</div><br>`).join('')}
      <div class="chip co3" style="background:var(--orange-l);color:#B85C00;font-size:30px;padding:12px 30px">${ic('share', '#B85C00', 34, 4)}One tap to share with neighbours</div>
    </div>
    <div class="trip abs" style="left:0;right:0;top:110px;display:flex;justify-content:center;align-items:center;gap:22px">
      ${tri('Social media', `
        <div style="display:flex;gap:16px;align-items:center;margin-top:18px"><img style="width:110px;height:110px;border-radius:50%;background:var(--cream)" src="${W.IMG.spud.happy}"><div><div style="font:900 26px Nunito">@spud.potato</div><div class="chip" style="background:var(--green-l);color:var(--green-d);font-size:18px;padding:4px 14px;margin-top:6px">✓ Official account</div></div></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:22px">${[0, 1, 2, 3, 4, 5].map((i) => `<div style="aspect-ratio:1;border-radius:14px;background:linear-gradient(135deg,${['#FFD9AE,#F28C28', '#E7D4F1,#7B4B94', '#CFEBCB,#4CAF50'][i % 3]})"></div>`).join('')}</div>`)}
      <div class="plus" style="font:900 64px Nunito;color:var(--orange)">+</div>
      ${tri('AI agent', `
        <div style="margin-top:18px;background:var(--cream);border-radius:22px;padding:18px">${[86, 70, 92, 60].map((w) => `<div style="height:16px;border-radius:8px;background:#D8C9E2;margin:12px 0;width:${w}%"></div>`).join('')}</div>
        <div class="msg bot" style="max-width:none;margin-top:16px;font-size:22px">Ask Spud anything about local issues.</div>
        <img style="position:absolute;right:22px;bottom:18px;width:130px;height:130px" src="${W.IMG.spud.happy}">`)}
      <div class="plus" style="font:900 64px Nunito;color:var(--orange)">+</div>
      ${tri('Application', `
        <img style="display:block;margin:18px auto 0;width:170px;height:170px" src="${W.IMG.spud.happy}">
        <div style="display:flex;gap:12px;margin-top:22px">${[['tree', '#4CAF50'], ['house', '#F28C28'], ['people', '#7B4B94']].map(([i, c]) => `<div style="flex:1;height:200px;border-radius:20px;background:#fff;border:3px solid ${c};display:grid;place-items:center">${ic(i, c, 54)}</div>`).join('')}</div>`)}
    </div>
    <div class="tripcap abs" style="left:0;right:0;top:760px;text-align:center;font:800 32px Nunito;color:var(--navy)">One mascot, three touchpoints — the same Spud everywhere</div>`,
  (root, t, S) => {
    animBg(root, t);
    const ta = S.cue('s7a'), tb = S.cue('s7b'), tc = S.cue('s7c');
    const triT = S.at('s7c', 'so Jason') + 0.2;
    const ph = $(root, '.ph'); show(ph, t, 0, { kind: 'up', d: 0.4, dist: 60, out: triT, od: 0.4 });
    show($(ph, '.m0'), t, ta + 0.3, { kind: 'pop' });
    const ty = $(ph, '.m1'); show(ty, t, tb + 0.2, { kind: 'fade', out: tb + 1.4, od: 0.15 });
    ty.style.display = t > tb + 1.55 ? 'none' : 'flex';
    $$(ty, 'i').forEach((d, i) => { d.style.cssText = `display:block;width:12px;height:12px;border-radius:50%;background:#7B4B94;opacity:${0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 8 - i))}`; });
    show($(ph, '.m2'), t, tb + 1.5, { kind: 'up', dist: 20 });
    show($(ph, '.s0'), t, S.at('s7b', 'cites'), { kind: 'pop' });
    show($(ph, '.s1'), t, S.at('s7b', 'cites') + 0.3, { kind: 'pop' });
    show($(ph, '.m3'), t, S.at('s7b', 'hands over'), { kind: 'up', dist: 20 });
    setSrc($(ph, '.hav'), spudImg(W, t, t > tb + 0.2 && t < tb + 1.5 ? 'think' : 'idle'));
    const callouts = $$(root, '.callouts .chip');
    [S.at('s7b', 'answers'), S.at('s7b', 'cites'), S.at('s7b', 'hands over'), tc + 0.4].forEach((a, i) => show(callouts[i], t, a, { kind: 'right', dist: 30, out: triT, od: 0.3 }));
    const sh = $(ph, '.share'); show(sh, t, tc + 0.2, { kind: 'fade' });
    const sheet = $(ph, '.sheet'); sheet.style.transform = `translateY(${(1 - easeOut(prog(t, tc + 0.2, 0.5))) * 100}%)`;
    const sb = $(ph, '.sbtn'); sb.style.transform = t > tc + 1.05 && t < tc + 1.3 ? 'scale(.94)' : '';
    show($(ph, '.done'), t, tc + 1.3, { kind: 'pop' });
    const trip = $(root, '.trip');
    show(trip, t, triT, { kind: 'fade', d: 0.3 });
    $$(trip, '.tc').forEach((c, i) => { c.dataset.base = ''; show(c, t, triT + 0.1 + i * 0.25, { kind: 'up', dist: 60 }); c.style.transform += ` translateY(${Math.sin(t * 1.4 + i) * 5}px)`; });
    $$(trip, '.plus').forEach((p, i) => show(p, t, triT + 0.3 + i * 0.25, { kind: 'pop' }));
    show($(root, '.tripcap'), t, triT + 0.9, { kind: 'up', dist: 20 });
    W.lowerThird(t, [
      { a: ta, b: tc - 0.1, text: 'Q&A assistant', icon: ic('chat', '#fff', 30, 3.6) },
      { a: tc, b: triT - 0.1, text: 'One-tap share', icon: ic('share', '#fff', 30, 3.6) },
    ]);
    return { gl: false };
  });

  // ------------------------------------------------------------ 8 BENEFITS
  const feat = (k, icon, color, light, title, reqs) => `<div class="feat card f${k}" style="left:${90 + k * 440}px;top:240px">
      <div class="ic" style="background:${color}">${ic(icon, '#fff', 56)}</div>
      <div class="t">${title}</div>
      <div>${reqs.map((r) => `<span class="req">${r}</span>`).join('')}</div></div>`;
  add(`${bg2d()}
    <div class="abs ttl" style="left:0;right:0;top:80px;text-align:center"><div class="h1">What POTATO means for Jason</div></div>
    ${feat(0, 'pin', '#4CAF50', '', 'Finds relevant issues on his everyday route', ['R2 Relevance', 'R3 Visibility'])}
    ${feat(1, 'translate', '#F28C28', '', 'Understands them in his own language', ['R1 Multilingual'])}
    ${feat(2, 'building', '#7B4B94', '', 'Knows which department hears him', ['R4 Q&A support'])}
    ${feat(3, 'steps', '#3E8EC9', '', 'Sees what happens next', ['R5 Trackable'])}
    <div class="abs ba" style="left:0;right:0;top:600px;display:flex;justify-content:center;align-items:center;gap:30px">
      <div class="card bef" style="display:flex;align-items:center;gap:16px;padding:14px 30px 14px 14px"><img style="width:150px;height:150px;border-radius:50%;background:#FDE4E1" src="${W.IMG.jason.confused}"><div><div style="font:800 20px Nunito;color:#C2372F;letter-spacing:1.5px">BEFORE</div><div style="font:900 32px Nunito">Confused, unheard</div></div></div>
      <div class="arr" style="font:900 70px Nunito;color:var(--orange)">→</div>
      <div class="card aft" style="display:flex;align-items:center;gap:16px;padding:14px 30px 14px 14px"><img style="width:150px;height:150px;border-radius:50%;background:var(--green-l)" src="${W.IMG.jason.happy}"><div><div style="font:800 20px Nunito;color:var(--green-d);letter-spacing:1.5px">AFTER</div><div style="font:900 32px Nunito">Confident, informed</div></div></div>
      <div class="chip nm" style="background:var(--navy);color:#fff;font-size:28px;padding:14px 28px">${ic('meeting', '#fff', 34, 3.6)}No meeting needed</div>
    </div>
    <div class="abs also" style="left:0;right:0;top:800px;text-align:center;font:800 24px Nunito;color:var(--navy-2)">Also designed for <b style="color:var(--purple)">R6 Privacy</b> · <b style="color:var(--purple)">R7 Trustworthy sources</b> · <b style="color:var(--purple)">R8 Simple to use</b></div>`,
  (root, t, S) => {
    animBg(root, t);
    show($(root, '.ttl'), t, 0.3);
    const at = [S.at('s8a', 'finding'), S.at('s8a', 'understanding'), S.at('s8a', 'knowing'), S.at('s8a', 'seeing')];
    $$(root, '.feat').forEach((f, i) => { show(f, t, at[i] - 0.2, { kind: 'up', dist: 60 }); f.style.transform += ` translateY(${Math.sin(t * 1.3 + i) * 4}px)`; });
    $$(root, '.feat .req').forEach((r, i) => show(r, t, at[Math.min(3, [0, 0, 1, 2, 3][i])] + 0.5 + (i === 1 ? 0.2 : 0), { kind: 'pop' }));
    const tb = S.cue('s8b');
    show($(root, '.bef'), t, at[3] + 1.0, { kind: 'left', dist: 30 });
    show($(root, '.arr'), t, tb - 0.2, { kind: 'pop' });
    show($(root, '.aft'), t, tb, { kind: 'right', dist: 30 });
    show($(root, '.nm'), t, tb + 0.5, { kind: 'pop' });
    show($(root, '.also'), t, at[3] + 1.4, { kind: 'up', dist: 15 });
    W.lowerThird(t, []);
    return { gl: false };
  });

  // ------------------------------------------------------------ 9 LIMITS + NEXT
  add(`${bg2d()}
    <div class="abs lim card" style="left:90px;top:90px;width:760px;height:700px;padding:40px 44px">
      <div style="font:800 22px Nunito;color:#C2372F;letter-spacing:2px">HONEST LIMITATIONS</div>
      <div class="h1" style="font-size:58px">POTATO has limits</div>
      ${[['mic', 'Speaking in public may feel exposing', 'Offer typed input too'], ['translate', 'AI can mistranslate', 'Review & edit before sending'], ['building', 'No council staff in our fieldwork', 'Consult council before launch']].map(([i, a, b], k) => `
        <div class="li l${k}" style="display:flex;gap:20px;align-items:center;margin-top:34px"><div style="width:80px;height:80px;border-radius:24px;background:#FDE4E1;display:grid;place-items:center;flex:none">${ic(i, '#C2372F', 46)}</div>
        <div><div style="font:900 32px/1.15 Nunito">${a}</div><div style="font:700 24px Nunito;color:var(--green-d);margin-top:4px">→ ${b}</div></div></div>`).join('')}
    </div>
    <div class="abs nx" style="left:920px;top:90px;width:910px;height:700px;padding:40px 10px">
      <div style="font:800 22px Nunito;color:var(--green-d);letter-spacing:2px">FUTURE WORK</div>
      <div class="h1" style="font-size:58px">Next steps</div>
      <div style="position:relative;margin-top:26px">
        <div class="rail" style="position:absolute;left:44px;top:30px;width:8px;height:480px;border-radius:4px;background:#E2D6EA"><div class="railf" style="width:100%;height:0;border-radius:4px;background:var(--orange)"></div></div>
        ${[['box', 'Low-fi prototype', 'Figma app + cardboard post'], ['people', 'Test across languages', 'Do residents trust and correct the AI output?'], ['pin', '2–3 pilot sites', 'Library entrance, street near campus'], ['dashboard', 'Council dashboard + more languages', 'Feedback grouped by topic & department']].map(([i, a, b], k) => `
          <div class="rm r${k}" style="display:flex;gap:22px;align-items:center;margin-bottom:26px;position:relative"><div style="width:96px;height:96px;border-radius:50%;background:${['#4CAF50', '#F28C28', '#7B4B94', '#3E8EC9'][k]};display:grid;place-items:center;flex:none;border:6px solid var(--cream)">${ic(i, '#fff', 48)}</div>
          <div class="card" style="padding:16px 26px;flex:1"><div style="font:900 31px/1.15 Nunito">${a}</div><div style="font:700 23px Nunito;color:var(--navy-2)">${b}</div></div></div>`).join('')}
      </div>
    </div>`,
  (root, t, S) => {
    animBg(root, t);
    show($(root, '.lim'), t, S.cue('s9a') - 0.2, { kind: 'left', dist: 30 });
    const la = [S.at('s9b', 'Speaking'), S.at('s9b', 'AI can'), S.at('s9b', 'and our')];
    $$(root, '.li').forEach((l, i) => show(l, t, la[i] - 0.1, { kind: 'up', dist: 20 }));
    const tc = S.cue('s9c');
    show($(root, '.nx'), t, tc - 0.3, { kind: 'right', dist: 30 });
    const ra = [S.at('s9c', 'test a'), S.at('s9c', 'with residents'), S.at('s9c', 'and check') , S.at('s9c', 'correct')];
    $$(root, '.rm').forEach((r, i) => show(r, t, ra[i] - 0.1, { kind: 'right', dist: 25 }));
    $(root, '.railf').style.height = `${clamp((t - ra[0]) / (ra[3] - ra[0] + 0.6)) * 100}%`;
    W.lowerThird(t, []);
    return { gl: false };
  });

  // ------------------------------------------------------------ 10 TAGLINE + CREDITS
  add(`
    <div class="abs tag10" style="left:930px;top:120px;width:920px;text-align:center">
      <div class="wm" style="font:800 190px/0.9 'Baloo 2';letter-spacing:6px;color:#FFF4E0;text-shadow:0 8px 40px rgba(123,75,148,.8)">POTATO</div>
      <div class="acr" style="margin-top:14px;font:800 34px 'Baloo 2';color:#FFF4E0;white-space:nowrap">${['Public', 'Opinion', 'Translation', 'And', 'Tracking', 'Outpost'].map((w) => `<span style="color:#FFB15C">${w[0]}</span>${w.slice(1)}`).join(' ')}</div>
      <div class="tg" style="margin-top:28px;display:inline-block;background:var(--orange);color:#fff;border-radius:999px;padding:12px 44px;font:800 52px 'Baloo 2'">Voices from the ground up.</div>
    </div>
    <div class="abs cred" style="left:60px;right:60px;top:690px;padding:20px 34px;border-radius:26px;background:rgba(31,42,68,.82);color:#fff">
      <div style="display:flex;justify-content:space-between;font:800 26px Nunito">
        ${[['Jia-Ying Lee', '1790130'], ['Xintong FU', '1840227'], ['Yu-Hao LU', '1781474'], ['Yen-Chu OU YANG', '1801365']].map(([n, id]) => `<div>${n} <span style="color:#FFB15C;font-weight:700">${id}</span></div>`).join('')}
      </div>
      <div style="margin-top:8px;font:700 20px Nunito;opacity:.85;text-align:center">Team Sweet Potatoes · Group 14 · INFO90006 · Concept prototype, demo data · AI tools were used to help produce visuals and narration</div>
    </div>
    <div class="bubble b10">See you, Melb!</div>`,
  (root, t, S) => {
    setWorld({ street: true, sky: 'dusk', jason: true, dog: true });
    post.group.position.copy(POSTPOS);
    drawDisplay(W, t + 60);
    post.dispMat.emissiveIntensity = 1.0;
    post.spud.setFace({ mode: 'happy', blink: 0, perk: 1, wave: t * 7 });
    post.spud.group.rotation.z = Math.sin(t * 3.5) * 0.07;
    // Jason and his dog wave goodbye beside the post
    const JP = new THREE.Vector3(-0.95, 0, 0.05);
    jason.root.position.copy(JP); jason.root.rotation.y = 0.35;
    jason.pose(t, { wave: t * 1.05 + 0.2, look: [-0.1, -0.05] });
    dog.root.position.set(-0.35, 0, 0.45); dog.root.rotation.y = 0.2; dog.pose(t, 0, 'look');
    const a = 0.5 - t * 0.025;
    W.cam([-0.45 + Math.sin(a) * 3.6, 0.95, -0.2 + Math.cos(a) * 3.6], [-0.45, 0.9, -0.2], 36, -470);
    W.sunAt(new THREE.Vector3(0, 0, 0), [-4, 3, 3]);
    show($(root, '.wm'), t, 0.3, { kind: 'pop' });
    show($(root, '.acr'), t, S.at('s10a', 'Public'), { kind: 'up', dist: 20 });
    show($(root, '.tg'), t, S.cue('s10b'), { kind: 'pop' });
    show($(root, '.cred'), t, 0.8, { kind: 'up', dist: 30 });
    const b = $(root, '.b10'); show(b, t, 0.5, { kind: 'pop' }); bubbleAt(b, [0.13, 0.17, 0], 0, -90);
    W.lowerThird(t, []);
    return { gl: true };
  });

  // reset per-scene material tweaks
  const origUpdate = scenes.map((s) => s.update);
  scenes.forEach((s, i) => {
    s.update = (t, S, T) => {
      post.dispMat.emissiveIntensity = 0.55; post.spud.group.rotation.z = 0; post.group.rotation.y = 0;
      return origUpdate[i](t, S, T);
    };
  });
  return scenes;
}
