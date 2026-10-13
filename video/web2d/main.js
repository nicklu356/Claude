// 2D renderer entry: builds every scene once, then renderAt(t) poses the
// frame for time t (seconds).  render.js steps t frame by frame.
import { buildScenes, lowerThirds, ZH_STRINGS } from './scenes.js';
import { defs } from './art.js';
import { ic } from './icons.js';
import { clamp, easeOut } from './fx.js';

const TL = await (await fetch('../web/timeline.json?' + Date.now())).json();
window.TL = TL;

await document.fonts.load('800 40px "Baloo 2"');
await document.fonts.load('700 40px "Baloo 2"');
for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 40px Nunito`);
await document.fonts.load('italic 800 40px Nunito');
const zhAll = ZH_STRINGS.join('') + '中文';
for (const w of [500, 700, 900]) await document.fonts.load(`${w} 40px "Noto Sans TC"`, zhAll);
document.getElementById('fontwarm').textContent = zhAll;
await document.fonts.ready;

const world = document.getElementById('world');
world.appendChild(defs());
const ui = document.getElementById('ui');
const scenes = buildScenes({ TL, world, ui });
const LT = lowerThirds(TL);
const lt = document.getElementById('lt');
const subs = document.querySelector('#subs .bar');
const wipe = document.getElementById('wipe');

// film grain: one noise tile, jittered per frame
const grain = document.getElementById('grain');
{
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const gx = cv.getContext('2d'), im = gx.createImageData(256, 256);
  let sd = 12345; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  gx.putImageData(im, 0, 0);
  grain.style.backgroundImage = `url(${cv.toDataURL()})`;
}
let current = null;
function renderAt(t) {
  const S = TL.scenes.find((s) => t >= s.start && t < s.end) || TL.scenes[TL.scenes.length - 1];
  const sc = scenes[S.id];
  if (current !== S.id) {
    for (const id in scenes) { scenes[id].svg.style.display = 'none'; scenes[id].ui.style.display = 'none'; }
    sc.svg.style.display = ''; sc.ui.style.display = 'block';
    current = S.id;
  }
  sc.update(t - S.start, t);
  const f = Math.round(t * 30); grain.style.transform = `translate(${(f * 37) % 64}px, ${(f * 53) % 64}px)`;

  // feature label
  const it = LT.find((x) => t >= x.a && t < x.b);
  if (it) {
    const p = easeOut(clamp((t - it.a) / 0.4)), q = 1 - clamp((t - (it.b - 0.3)) / 0.3);
    lt.style.opacity = Math.min(p, q);
    lt.style.transform = `translateX(${(1 - p) * -60}px)`;
    const v = lt.querySelector('.v'); if (v.textContent !== it.text) v.textContent = it.text;
    lt.querySelector('.k').textContent = it.k;
    const icon = ic(it.icon, '#fff', 30, 3.6); const ie = lt.querySelector('.ic'); if (ie.dataset.k !== it.icon) { ie.innerHTML = icon; ie.dataset.k = it.icon; }
  } else lt.style.opacity = 0;

  // wipe across each scene cut (0.6 s centred on the cut)
  let wp = -1;
  for (const s of TL.scenes.slice(1)) { const d = t - s.start; if (d > -0.3 && d < 0.3) wp = (d + 0.3) / 0.6; }
  if (wp >= 0) { wipe.style.transform = `translateX(${-130 + 260 * wp}%) skewX(-12deg)`; wipe.style.display = 'flex'; }
  else wipe.style.display = 'none';

  // subtitles
  const cue = TL.cues.find((c) => t >= c.start && t < c.end);
  if (cue) {
    const html = cue.lines.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('<br>');
    if (subs.innerHTML !== html) subs.innerHTML = html;
    subs.style.display = 'block';
  } else subs.style.display = 'none';
}
window.renderAt = renderAt;
renderAt(0);
window.READY = true;
