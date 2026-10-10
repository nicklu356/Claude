// Deterministic animation helpers (everything is a pure function of time).
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t) => Math.pow(clamp(t), 3);
export const ease = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const backOut = (t) => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const prog = (t, a, d) => clamp((t - a) / d);
export const smooth = (t, a, d) => ease(prog(t, a, d));

export function blink(t, period = 3.3, offset = 0) {
  const ph = (t + offset) % period;
  return ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
}

// Show/hide an element with an entrance animation.
export function show(el, t, a, opt = {}) {
  if (!el) return 0;
  const { d = 0.45, kind = 'up', out = null, od = 0.35, dist = 40 } = opt;
  const p = clamp((t - a) / d);
  const q = out == null ? 1 : 1 - clamp((t - out) / od);
  const e = kind === 'pop' ? backOut(p) : easeOut(p);
  let tr = '';
  if (kind === 'up') tr = `translateY(${(1 - e) * dist}px)`;
  else if (kind === 'down') tr = `translateY(${-(1 - e) * dist}px)`;
  else if (kind === 'left') tr = `translateX(${-(1 - e) * dist * 2}px)`;
  else if (kind === 'right') tr = `translateX(${(1 - e) * dist * 2}px)`;
  else if (kind === 'pop') tr = `scale(${0.5 + 0.5 * e})`;
  else if (kind === 'fade') tr = '';
  const op = Math.min(clamp(p * 1.8), q);
  el.style.opacity = op;
  el.style.transform = `${el.dataset.base || ''} ${tr}`;
  el.style.visibility = op <= 0.001 ? 'hidden' : 'visible';
  return op;
}

// Reveal text character by character (works for CJK too).
export function typeText(el, text, t, a, dur) {
  const chars = Array.from(text);
  const n = Math.round(clamp((t - a) / dur) * chars.length);
  const s = chars.slice(0, n).join('');
  if (el.textContent !== s) el.textContent = s;
  return n / chars.length;
}

export const $ = (root, sel) => root.querySelector(sel);
export const $$ = (root, sel) => Array.from(root.querySelectorAll(sel));
