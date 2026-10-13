// Environment dressing: Victorian terrace (Jason's home), a Melbourne tram,
// CC0 trees/bushes/buildings (Quaternius) and shop-window interiors.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '/node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as SkeletonUtils from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js';
import { loadGLB } from './rigs.js';

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0, ...o });
const shadowAll = (obj, cast = true) => obj.traverse((m) => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = true; } });
function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

export async function loadEnvAssets() {
  const names = ['nature/CommonTree_1', 'nature/CommonTree_2', 'nature/CommonTree_5', 'nature/Bush_Common', 'nature/Bush_Common_Flowers',
    'nature/Flower_3_Group', 'nature/Grass_Common_Short', 'downtown/Building_Small_1', 'downtown/Building_Medium_2_001', 'downtown/Prop_Bollard',
    'downtown/Sidewalk_Planter', 'downtown/Prop_Planter_Single'];
  const out = {};
  await Promise.all(names.map(async (n) => { out[n] = await loadGLB(n); }));
  return out;
}

function place(A, name, x, y, z, s = 1, ry = 0, parent) {
  const o = SkeletonUtils.clone(A[name].scene);
  o.position.set(x, y, z); o.scale.setScalar(s); o.rotation.y = ry;
  shadowAll(o);
  parent.add(o);
  return o;
}

// ---------------------------------------------------------------- shop window interiors
const SHOP_ART = {
  'Fresh Grocer': (g, w, h) => { // crates of produce
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      const x = 20 + c * (w - 40) / 6, y = h * 0.3 + r * h * 0.22;
      g.fillStyle = '#B07A4A'; g.fillRect(x, y + 40, (w - 60) / 6, 26);
      const col = ['#E0544B', '#F2A33A', '#7CB342', '#FFD54F', '#8E5BA8', '#66BB6A'][(r * 6 + c) % 6];
      for (let k = 0; k < 4; k++) { g.fillStyle = col; g.beginPath(); g.arc(x + 14 + k * 16, y + 34, 11, 0, Math.PI * 2); g.fill(); }
    }
  },
  'Corner Café': (g, w, h) => {
    g.fillStyle = '#6D4C41'; g.fillRect(0, h * 0.62, w, 14);
    for (let i = 0; i < 5; i++) { const x = 40 + i * (w - 80) / 4; g.fillStyle = '#fff'; rr(g, x - 16, h * 0.5, 32, 34, 6); g.fill(); g.fillStyle = '#8D6E63'; g.fillRect(x - 12, h * 0.5 + 4, 24, 8); }
    g.fillStyle = '#2F3B2F'; rr(g, w * 0.55, h * 0.1, w * 0.38, h * 0.3, 10); g.fill();
    g.fillStyle = '#FFF4E0'; g.font = '700 26px Nunito'; g.fillText('flat white  4.5', w * 0.58, h * 0.22); g.fillText('long black  4.0', w * 0.58, h * 0.32);
  },
  Bakery: (g, w, h) => {
    for (let r = 0; r < 2; r++) { g.fillStyle = '#C9A27E'; g.fillRect(0, h * (0.45 + r * 0.25), w, 10);
      for (let c = 0; c < 7; c++) { g.fillStyle = r ? '#D9A35B' : '#E8B86B'; g.beginPath(); g.ellipse(30 + c * (w - 60) / 6, h * (0.42 + r * 0.25), 24, 13, 0, 0, Math.PI * 2); g.fill(); } }
  },
  Laundry: (g, w, h) => {
    for (let c = 0; c < 5; c++) { const x = 20 + c * (w - 40) / 5; g.fillStyle = '#ECEFF1'; g.fillRect(x, h * 0.35, (w - 60) / 5, h * 0.45);
      g.fillStyle = '#90A4AE'; g.beginPath(); g.arc(x + (w - 60) / 10, h * 0.6, 26, 0, Math.PI * 2); g.fill(); g.fillStyle = '#B3E5FC'; g.beginPath(); g.arc(x + (w - 60) / 10, h * 0.6, 18, 0, Math.PI * 2); g.fill(); }
  },
  'Books & Co': (g, w, h) => {
    for (let r = 0; r < 3; r++) { g.fillStyle = '#5D4037'; g.fillRect(0, h * (0.38 + r * 0.2), w, 8);
      let x = 6; let k = r * 7; while (x < w - 10) { const bw = 10 + (k * 7) % 12; g.fillStyle = ['#C0504D', '#3E8EC9', '#F2A33A', '#4CAF50', '#7B4B94', '#FFF4E0'][k % 6]; g.fillRect(x, h * (0.38 + r * 0.2) - 44 + (k % 3) * 4, bw, 44 - (k % 3) * 4); x += bw + 2; k++; } }
  },
  Pharmacy: (g, w, h) => {
    g.fillStyle = '#2E9E4F'; g.fillRect(w * 0.42, h * 0.12, w * 0.16, h * 0.08); g.fillRect(w * 0.47, h * 0.05, w * 0.06, h * 0.22);
    for (let r = 0; r < 3; r++) { g.fillStyle = '#E0E0E0'; g.fillRect(0, h * (0.45 + r * 0.17), w, 6);
      for (let c = 0; c < 12; c++) { g.fillStyle = ['#fff', '#B3E5FC', '#FFCDD2', '#C8E6C9'][(c + r) % 4]; g.fillRect(10 + c * (w - 20) / 12, h * (0.45 + r * 0.17) - 30, (w - 40) / 12, 30); } }
  },
};
export function windowTexture(name) {
  return canvasTex(512, 300, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#FFF1DC'); gr.addColorStop(1, '#E9D5BC');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    (SHOP_ART[name] || (() => {}))(g, w, h);
    // glass reflection streaks
    g.fillStyle = 'rgba(255,255,255,0.28)';
    g.beginPath(); g.moveTo(w * 0.1, 0); g.lineTo(w * 0.22, 0); g.lineTo(w * 0.07, h); g.lineTo(-w * 0.05, h); g.fill();
    g.beginPath(); g.moveTo(w * 0.62, 0); g.lineTo(w * 0.67, 0); g.lineTo(w * 0.52, h); g.lineTo(w * 0.47, h); g.fill();
  });
}

// ---------------------------------------------------------------- Victorian terrace (Jason's home)
export function buildHouse() {
  const g = new THREE.Group(); g.name = 'house';
  const wall = std('#E8D9C0', { roughness: 0.9 }), trim = std('#F7F1E6'), roofM = std('#7D8B96', { roughness: 0.6, metalness: 0.2 });
  const door = std('#2F5A4E'), iron = std('#2B2F36', { roughness: 0.5, metalness: 0.4 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(6, 4.4, 1), wall); body.position.set(0, 2.2, -0.5); g.add(body);
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.5, 0.3), trim); parapet.position.set(0, 4.55, 0); g.add(parapet);
  // veranda: curved corrugated roof + posts + iron lace frieze
  const vr = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 6, 32, 1, true, 0, Math.PI / 2), std('#9AA6AF', { side: THREE.DoubleSide, roughness: 0.5, metalness: 0.3 }));
  vr.rotation.z = Math.PI / 2; vr.position.set(0, 1.4, 0.0); vr.scale.set(1, 1, 1); g.add(vr);
  const lace = canvasTex(512, 64, (c, w, h) => {
    c.clearRect(0, 0, w, h); c.strokeStyle = '#2B2F36'; c.lineWidth = 4;
    for (let x = 0; x < w; x += 32) { c.beginPath(); c.arc(x + 16, 30, 13, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(x, 4); c.lineTo(x + 32, 4); c.stroke(); c.beginPath(); c.moveTo(x + 16, 44); c.lineTo(x + 16, 62); c.stroke(); }
  });
  const fr = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.42), new THREE.MeshStandardMaterial({ map: lace, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }));
  fr.position.set(0, 2.78, 1.58); g.add(fr);
  for (const x of [-2.9, 2.9]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 10), iron); p.position.set(x, 1.5, 1.58); g.add(p); }
  // door + fanlight + window
  const d = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.08), door); d.position.set(-1.6, 1.1, 0.02); g.add(d);
  const fan = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.06), std('#BFD7E6', { roughness: 0.1 })); fan.position.set(-1.6, 2.42, 0.02); g.add(fan);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), std('#C9A227', { metalness: 0.8, roughness: 0.3 })); knob.position.set(-1.25, 1.1, 0.08); g.add(knob);
  const winTex = canvasTex(256, 384, (c, w, h) => { c.fillStyle = '#9FC3D9'; c.fillRect(0, 0, w, h); c.fillStyle = '#F2E6D0'; c.fillRect(0, 0, w * 0.3, h); c.fillRect(w * 0.7, 0, w * 0.3, h); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(w * 0.35, 0, 20, h); });
  for (const x of [0.7, 1.9]) {
    const wf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, 0.08), trim); wf.position.set(x, 1.55, 0.01); g.add(wf);
    const wg = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 1.74), new THREE.MeshStandardMaterial({ map: winTex, roughness: 0.1 })); wg.position.set(x, 1.55, 0.06); g.add(wg);
  }
  // front garden + picket fence with gate and letterbox
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.9), std('#86BF6E', { roughness: 1 })); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, 0.012, 1.0); g.add(lawn);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.9), std('#C9B9A3', { roughness: 1 })); path.rotation.x = -Math.PI / 2; path.position.set(-1.6, 0.015, 1.0); g.add(path);
  const picket = std('#FFFFFF', { roughness: 0.6 });
  for (let x = -3; x <= 3.001; x += 0.16) {
    if (x > -2.1 && x < -1.1) continue; // gate gap
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.9, 0.03), picket); p.position.set(x, 0.45, 1.95); g.add(p);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 4), picket); tip.position.set(x, 0.94, 1.95); tip.rotation.y = Math.PI / 4; g.add(tip);
  }
  for (const y of [0.25, 0.7]) for (const [a, b] of [[-3, -2.1], [-1.1, 3]]) { const r = new THREE.Mesh(new THREE.BoxGeometry(b - a, 0.06, 0.03), picket); r.position.set((a + b) / 2, y, 1.93); g.add(r); }
  // letterbox on a post beside the gate
  const lb = new THREE.Group(); lb.position.set(-0.85, 0, 2.05); g.add(lb);
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), std('#8D6E63')); post.position.y = 0.5; lb.add(post);
  const box = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.28, 0.42, 3, 0.04), std('#C0392B', { roughness: 0.45 })); box.position.y = 1.12; lb.add(box);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, 0.01), std('#2b2b2b')); slot.position.set(0, 1.18, 0.215); lb.add(slot);
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.1), new THREE.MeshStandardMaterial({ map: canvasTex(128, 80, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1F2A44'; c.font = '900 60px Nunito'; c.textAlign = 'center'; c.fillText('14', w / 2, 62); }) }));
  num.position.set(0, 1.08, 0.215); lb.add(num);
  // hedge
  for (let x = 0.2; x < 3; x += 0.55) { const h = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10), std('#4C9A3E', { roughness: 1 })); h.scale.y = 0.75; h.position.set(x, 0.3, 1.55); g.add(h); }
  shadowAll(g);
  return { group: g, letterbox: lb };
}

// ---------------------------------------------------------------- Melbourne tram (E-class inspired)
export function buildTram() {
  const g = new THREE.Group(); g.name = 'tram';
  const green = std('#2E8B57', { roughness: 0.45 }), white = std('#F4F6F4', { roughness: 0.45 }), dark = std('#1F2A30', { roughness: 0.2, metalness: 0.2 });
  const glass = std('#9CC7DA', { roughness: 0.05, metalness: 0.1 });
  const L = 6.2;
  for (let i = 0; i < 3; i++) {
    const seg = new THREE.Group(); seg.position.x = (i - 1) * (L + 0.25); g.add(seg);
    const lower = new THREE.Mesh(new RoundedBoxGeometry(L, 1.25, 2.6, 4, 0.18), white); lower.position.y = 0.95; seg.add(lower);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(L - 0.1, 0.32, 2.62), green); stripe.position.y = 0.62; seg.add(stripe);
    const win = new THREE.Mesh(new RoundedBoxGeometry(L - 0.2, 1.05, 2.5, 4, 0.12), glass); win.position.y = 2.1; seg.add(win);
    for (let k = -2; k <= 2; k++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.06, 2.56), white); m.position.set(k * 1.2, 2.1, 0); seg.add(m); }
    const roof = new THREE.Mesh(new RoundedBoxGeometry(L, 0.32, 2.6, 4, 0.14), green); roof.position.y = 2.75; seg.add(roof);
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(L - 0.4, 0.3, 2.3), dark); skirt.position.y = 0.2; seg.add(skirt);
    if (i === 1) { // pantograph
      const pa = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), dark); pa.position.set(-0.3, 3.3, 0); pa.rotation.z = 0.6; seg.add(pa);
      const pb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), dark); pb.position.set(0, 3.7, 0); seg.add(pb);
    }
  }
  // destination sign
  const dst = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.3), new THREE.MeshStandardMaterial({ map: canvasTex(320, 60, (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); c.fillStyle = '#FFB300'; c.font = '800 34px Nunito'; c.fillText('96  St Kilda Beach', 10, 44); }), emissive: 0xffffff, emissiveIntensity: 0.4 }));
  dst.position.set(3 * (L + 0.25) / 2 + 0.02, 2.65, 0); dst.rotation.y = Math.PI / 2; g.add(dst);
  const dst2 = dst.clone(); dst2.position.z = 1.31; dst2.position.x = L + 0.25; dst2.rotation.y = 0; g.add(dst2);
  shadowAll(g);
  return { group: g };
}

// ---------------------------------------------------------------- dressing
export function dressStreet(A, street) {
  const g = new THREE.Group(); g.name = 'dress';
  // park trees behind the fence + a few street trees
  [[5, -6.5, 0.8, 0.3, 'nature/CommonTree_1'], [9, -8, 0.95, 1.2, 'nature/CommonTree_2'], [13, -6, 0.85, 2.1, 'nature/CommonTree_5'],
   [17, -8.5, 1.0, 0.7, 'nature/CommonTree_1'], [21, -6.5, 0.9, 2.6, 'nature/CommonTree_2'], [25, -8, 1.0, 1.4, 'nature/CommonTree_5'],
   [4.6, 2.4, 0.62, 0.9, 'nature/CommonTree_2'], [-13, 2.5, 0.6, 2.2, 'nature/CommonTree_1'], [-22, 2.5, 0.62, 0.4, 'nature/CommonTree_2'],
   [11, 2.5, 0.62, 1.7, 'nature/CommonTree_1']]
    .forEach(([x, z, s, r, n]) => place(A, n, x, 0, z, s, r, g));
  // bushes + flowers along the park fence
  for (let x = 3.6; x < 27; x += 2.3) place(A, x % 4.6 < 2.3 ? 'nature/Bush_Common_Flowers' : 'nature/Bush_Common', x, 0, -4.1, 0.55, x, g);
  for (let x = 4.5; x < 27; x += 3.1) place(A, 'nature/Flower_3_Group', x, 0, -3.75, 0.35, x * 2, g);
  // planters + bollards on the footpath
  place(A, 'downtown/Sidewalk_Planter', -6.2, 0, -2.9, 0.8, 0, g);
  place(A, 'downtown/Sidewalk_Planter', -15.4, 0, -2.9, 0.8, 0, g);
  for (const x of [-3.0, -1.8, 1.6, 2.6]) place(A, 'downtown/Prop_Bollard', x, 0, 2.75, 1, 0, g);
  // skyline behind the shops
  place(A, 'downtown/Building_Medium_2_001', -20, 0, -14, 0.75, 0, g);
  place(A, 'downtown/Building_Small_1', -8, 0, -13, 0.8, 0, g);
  place(A, 'downtown/Building_Medium_2_001', -32, 0, -14, 0.7, 0, g);
  street.group.add(g);
  return g;
}
