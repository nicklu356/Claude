// Procedural 3D world: POTATO post + Spud, Jason + dog, Melbourne-style street.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '/node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const C = {
  purple: '#7B4B94', purpleDark: '#5A3370', orange: '#F28C28', green: '#4CAF50', greenDark: '#2E7D32',
  cream: '#FFF4E0', navy: '#1F2A44', screen: '#FFE9C7',
};

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.0, ...o });
const shadowAll = (obj) => obj.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

function canvasTex(w, h, draw, opts = {}) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  Object.assign(t, opts);
  t.userData = { cv, g };
  return t;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

export function drawNfcIcon(g, cx, cy, s, color) {
  g.save();
  g.strokeStyle = color; g.lineCap = 'round'; g.lineWidth = s * 0.09;
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.arc(cx, cy + s * 0.25, s * (0.18 + i * 0.17), -Math.PI * 0.78, -Math.PI * 0.22);
    g.stroke();
  }
  g.fillStyle = color;
  g.beginPath(); g.arc(cx, cy + s * 0.25, s * 0.06, 0, Math.PI * 2); g.fill();
  g.font = `800 ${s * 0.3}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('NFC', cx, cy + s * 0.55);
  g.restore();
}

// ---------------------------------------------------------------- posters
function drawFlower(g, x, y, s, petal, center) {
  g.save();
  g.strokeStyle = '#3D8B40'; g.lineWidth = s * 0.12; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - s * 0.2, y + s * 1.2, x + s * 0.1, y + s * 2.2); g.stroke();
  g.fillStyle = '#4CAF50';
  g.beginPath(); g.ellipse(x + s * 0.35, y + s * 1.3, s * 0.35, s * 0.15, -0.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.beginPath(); g.ellipse(x + Math.cos(a) * s * 0.45, y + Math.sin(a) * s * 0.45, s * 0.36, s * 0.26, a, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = center; g.beginPath(); g.arc(x, y, s * 0.3, 0, Math.PI * 2); g.fill();
  g.restore();
}

function verifiedBadge(g, x, y, s) {
  g.save();
  g.font = `800 ${s}px Nunito`;
  const txt = 'Verified council source';
  const w = g.measureText(txt).width + s * 2.4;
  g.fillStyle = '#2E9E4F'; roundRect(g, x, y, w, s * 1.7, s * 0.85); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(x + s * 0.95, y + s * 0.85, s * 0.55, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#2E9E4F'; g.lineWidth = s * 0.18; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x + s * 0.7, y + s * 0.88); g.lineTo(x + s * 0.9, y + s * 1.08); g.lineTo(x + s * 1.22, y + s * 0.62); g.stroke();
  g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(txt, x + s * 1.75, y + s * 0.9);
  g.restore();
}

export const POSTERS = [
  (g, x, y, w, h) => { // New Activities!
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#FFF4E0'); gr.addColorStop(1, '#FFE0B8');
    g.fillStyle = gr; roundRect(g, x, y, w, h, 24); g.fill();
    g.fillStyle = C.purple; g.font = `900 ${h * 0.13}px "Baloo 2"`; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.fillText('New Activities!', x + w * 0.07, y + h * 0.2);
    g.fillStyle = C.navy; g.font = `700 ${h * 0.055}px Nunito`;
    g.fillText('Community garden planting day', x + w * 0.07, y + h * 0.3);
    g.fillText('Sat 10am · Riverside Park', x + w * 0.07, y + h * 0.37);
    drawFlower(g, x + w * 0.22, y + h * 0.55, h * 0.09, C.orange, '#FFD54F');
    drawFlower(g, x + w * 0.42, y + h * 0.62, h * 0.07, '#E57373', '#FFF59D');
    drawFlower(g, x + w * 0.62, y + h * 0.56, h * 0.08, C.purple, '#FFD54F');
    drawFlower(g, x + w * 0.8, y + h * 0.64, h * 0.06, '#FF8A65', '#FFF');
    verifiedBadge(g, x + w * 0.07, y + h * 0.87, h * 0.04);
  },
  (g, x, y, w, h) => { // Council consultation
    g.fillStyle = '#E8F5E9'; roundRect(g, x, y, w, h, 24); g.fill();
    g.fillStyle = C.green; roundRect(g, x, y, w, h * 0.2, 24); g.fill(); g.fillRect(x, y + h * 0.1, w, h * 0.1);
    g.fillStyle = '#fff'; g.font = `900 ${h * 0.075}px Nunito`; g.textAlign = 'left';
    g.fillText('COUNCIL NOTICE', x + w * 0.07, y + h * 0.13);
    g.fillStyle = C.navy; g.font = `900 ${h * 0.1}px "Baloo 2"`;
    g.fillText('Have your say:', x + w * 0.07, y + h * 0.36);
    g.fillText('Park rules for dogs', x + w * 0.07, y + h * 0.47);
    g.font = `700 ${h * 0.055}px Nunito`; g.fillStyle = '#37474F';
    g.fillText('Consultation closes in 5 days', x + w * 0.07, y + h * 0.58);
    // simple park icon
    g.fillStyle = C.green; g.beginPath(); g.arc(x + w * 0.78, y + h * 0.7, h * 0.09, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#8D6E63'; g.fillRect(x + w * 0.77, y + h * 0.75, h * 0.025, h * 0.08);
    g.fillStyle = C.orange; g.beginPath(); g.arc(x + w * 0.6, y + h * 0.78, h * 0.035, 0, Math.PI * 2); g.fill();
    verifiedBadge(g, x + w * 0.07, y + h * 0.87, h * 0.04);
  },
  (g, x, y, w, h) => { // Library
    g.fillStyle = '#EDE3F3'; roundRect(g, x, y, w, h, 24); g.fill();
    g.fillStyle = C.purple; g.font = `900 ${h * 0.1}px "Baloo 2"`; g.textAlign = 'left';
    g.fillText('Free English', x + w * 0.07, y + h * 0.2);
    g.fillText('conversation club', x + w * 0.07, y + h * 0.31);
    g.fillStyle = C.navy; g.font = `700 ${h * 0.055}px Nunito`;
    g.fillText('Local library · Wednesdays 6pm', x + w * 0.07, y + h * 0.42);
    const cols = [C.orange, C.green, C.purple, '#42A5F5'];
    for (let i = 0; i < 4; i++) { g.fillStyle = cols[i]; roundRect(g, x + w * (0.12 + i * 0.13), y + h * (0.52 + (i % 2) * 0.03), w * 0.1, h * 0.25, 8); g.fill(); }
    verifiedBadge(g, x + w * 0.07, y + h * 0.87, h * 0.04);
  },
];

// ---------------------------------------------------------------- Spud face texture
export function drawSpudFace(g, w, h, st) {
  // st: {blink 0..1, mode: 'idle'|'listen'|'happy'|'think', pulse 0..1, glow}
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#FFF4E0'); gr.addColorStop(1, '#FFD9A8');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  // subtle orange screen vignette
  const rg = g.createRadialGradient(w / 2, h * 0.6, h * 0.1, w / 2, h * 0.6, w * 0.6);
  rg.addColorStop(0, 'rgba(242,140,40,0)'); rg.addColorStop(1, 'rgba(242,140,40,0.35)');
  g.fillStyle = rg; g.fillRect(0, 0, w, h);
  if (st.mode === 'panel') { // visor showing the issues panel: tiny eyes + three issue cards
    g.fillStyle = '#1B1B24';
    for (const s of [-1, 1]) { g.beginPath(); g.ellipse(w * 0.2 + s * w * 0.035, h * 0.24, w * 0.016, h * 0.075 * (1 - (st.blink || 0) * 0.9), 0, 0, Math.PI * 2); g.fill(); }
    const cols = ['#F28C28', '#FFFFFF', '#FFFFFF'];
    for (let i = 0; i < 3; i++) {
      g.fillStyle = '#FFFFFF'; roundRect(g, w * 0.32, h * (0.12 + i * 0.27), w * 0.5, h * 0.21, 14); g.fill();
      g.strokeStyle = cols[i]; g.lineWidth = 6; if (i === 0) g.stroke();
      g.fillStyle = ['#4CAF50', '#F28C28', '#7B4B94'][i]; roundRect(g, w * 0.34, h * (0.15 + i * 0.27), w * 0.06, h * 0.15, 8); g.fill();
      g.fillStyle = '#1F2A44'; roundRect(g, w * 0.43, h * (0.17 + i * 0.27), w * 0.28, h * 0.04, 6); g.fill();
      g.fillStyle = '#9AA0AE'; roundRect(g, w * 0.43, h * (0.24 + i * 0.27), w * 0.2, h * 0.03, 6); g.fill();
    }
    return;
  }
  const ex = w * 0.17, ey = h * 0.5, ew = w * 0.045, eh = h * 0.2;
  g.fillStyle = '#1B1B24';
  const blink = st.blink || 0;
  const pulse = st.mode === 'listen' ? 1 + 0.12 * Math.sin((st.pulse || 0) * Math.PI * 2) : 1;
  for (const s of [-1, 1]) {
    const cx = w / 2 + s * ex;
    if (st.mode === 'happy') {
      g.strokeStyle = '#1B1B24'; g.lineWidth = w * 0.022; g.lineCap = 'round';
      g.beginPath(); g.arc(cx, ey + eh * 0.25, ew * 1.2, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    } else {
      g.beginPath(); g.ellipse(cx, ey, ew * pulse, Math.max(eh * (1 - blink) * pulse, h * 0.012), 0, 0, Math.PI * 2); g.fill();
      if (blink < 0.6) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(cx + ew * 0.3, ey - eh * 0.35, ew * 0.28, eh * 0.16, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#1B1B24'; }
    }
    // cheeks
    g.fillStyle = 'rgba(242,120,90,0.35)'; g.beginPath(); g.ellipse(cx + s * ew * 1.6, ey + eh * 0.85, ew * 1.1, eh * 0.28, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1B1B24';
  }
  if (st.mode === 'think') {
    g.fillStyle = C.purple;
    for (let i = 0; i < 3; i++) { const a = 0.5 + 0.5 * Math.sin((st.pulse || 0) * Math.PI * 2 - i); g.globalAlpha = 0.3 + 0.7 * a; g.beginPath(); g.arc(w / 2 + (i - 1) * w * 0.05, h * 0.86, w * 0.014, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------- POTATO post + Spud
export function buildPost() {
  const post = new THREE.Group(); post.name = 'post';
  const R = 0.225;
  const navy = std(C.navy, { roughness: 0.45 });
  const purple = std(C.purple, { roughness: 0.45 });
  const cream = std(C.cream, { roughness: 0.4 });
  const orange = std(C.orange, { roughness: 0.4 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.012, R + 0.02, 0.06, 64), navy); base.position.y = 0.03; post.add(base);
  const lower = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.1, 64), purple); lower.position.y = 0.11; post.add(lower);

  // wraparound display
  const dispTex = canvasTex(2048, 768, () => {});
  const dispMat = new THREE.MeshStandardMaterial({ map: dispTex, emissive: 0xffffff, emissiveMap: dispTex, emissiveIntensity: 0.55, roughness: 0.25 });
  const disp = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.003, R + 0.003, 0.54, 96, 1, true), dispMat);
  disp.position.y = 0.43; disp.rotation.y = Math.PI; post.add(disp);
  const ringGeo = new THREE.TorusGeometry(R + 0.004, 0.008, 12, 96);
  for (const y of [0.16, 0.70]) { const r = new THREE.Mesh(ringGeo, y > 0.5 ? orange : navy); r.rotation.x = Math.PI / 2; r.position.y = y; post.add(r); }
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.12, 64), cream); collar.position.y = 0.76; post.add(collar);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), cream);
  cap.scale.y = 0.22; cap.position.y = 0.82; post.add(cap);

  // NFC pad: tilted rounded block on the upper front, icon on its face
  const nfcTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = C.orange; g.fillRect(0, 0, w, h);
    drawNfcIcon(g, w / 2, h * 0.32, w * 0.62, '#FFFFFF');
  });
  const nfcGroup = new THREE.Group();
  const nfcBox = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.035, 0.11, 4, 0.012), std(C.orange, { roughness: 0.35 }));
  nfcGroup.add(nfcBox);
  const nfcFace = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.085), new THREE.MeshStandardMaterial({ map: nfcTex, roughness: 0.3, emissive: 0xffffff, emissiveMap: nfcTex, emissiveIntensity: 0.25 }));
  nfcFace.rotation.x = -Math.PI / 2; nfcFace.position.y = 0.0181; nfcGroup.add(nfcFace);
  nfcGroup.position.set(0, 0.865, 0.115); nfcGroup.rotation.x = 0.42;
  post.add(nfcGroup);

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.042, 0.1, 32), std('#9AA3B5', { metalness: 0.6, roughness: 0.35 }));
  neck.position.y = 0.9; post.add(neck);

  const spud = buildSpud();
  spud.group.position.y = 1.1;
  post.add(spud.group);

  shadowAll(post);
  disp.castShadow = false;
  return { group: post, spud, dispTex, dispMat, nfcGroup, R };
}

export function buildSpud() {
  const group = new THREE.Group(); group.name = 'spud';
  const head = new THREE.Group(); group.add(head);
  const r = 0.155;
  // sweet-potato skin texture
  const skin = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = C.purple; g.fillRect(0, 0, w, h);
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(70,30,90,${0.15 + rnd() * 0.2})`; g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 2 + rnd() * 5, 1 + rnd() * 2, 0, 0, Math.PI * 2); g.fill(); }
    for (let i = 0; i < 30; i++) { g.strokeStyle = `rgba(160,110,185,${0.15 + rnd() * 0.15})`; g.lineWidth = 2; g.beginPath(); const x = rnd() * w, y = rnd() * h; g.moveTo(x, y); g.lineTo(x + 20 + rnd() * 30, y + (rnd() - 0.5) * 6); g.stroke(); }
  });
  const headGeo = new THREE.SphereGeometry(r, 96, 64);
  const p = headGeo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { // gentle sweet-potato lumpiness
    v.fromBufferAttribute(p, i);
    const n = 1 + 0.018 * Math.sin(v.x * 40 + 1.3) * Math.sin(v.y * 33) + 0.012 * Math.sin(v.z * 51 + v.y * 20);
    v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z);
  }
  headGeo.computeVertexNormals();
  const headMesh = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ map: skin, roughness: 0.55, color: '#ffffff' }));
  headMesh.scale.set(1.02, 0.97, 0.97);
  head.add(headMesh);

  // visor: bezel + screen as sphere segments facing +z
  const w = 1.45, th0 = 1.05, thL = 0.95;
  const bezel = new THREE.Mesh(new THREE.SphereGeometry(r * 1.035, 64, 32, Math.PI / 2 - (w + 0.18) / 2, w + 0.18, th0 - 0.09, thL + 0.18), std(C.navy, { roughness: 0.3 }));
  head.add(bezel);
  const faceTex = canvasTex(512, 256, (g, ww, hh) => drawSpudFace(g, ww, hh, { blink: 0, mode: 'idle' }));
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 0.6, roughness: 0.15 });
  const screen = new THREE.Mesh(new THREE.SphereGeometry(r * 1.05, 64, 32, Math.PI / 2 - w / 2, w, th0, thL), faceMat);
  head.add(screen);

  // forehead sensor dot
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 12), std('#14141c', { roughness: 0.2 }));
  dot.position.set(0, Math.cos(0.72) * r * 1.0, Math.sin(0.72) * r * 1.0); head.add(dot);
  // underside speaker/sensor dot (small, unlabelled)
  const under = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 12), std('#111', { roughness: 0.4 }));
  under.position.set(0, -r * 0.95, 0.03); head.add(under);
  // side grilles (hatched)
  const grilleTex = canvasTex(128, 128, (g, ww, hh) => {
    g.fillStyle = '#2b2b35'; g.fillRect(0, 0, ww, hh); g.strokeStyle = '#5c5c6c'; g.lineWidth = 3;
    for (let i = -hh; i < ww * 2; i += 14) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i - hh, hh); g.stroke(); g.beginPath(); g.moveTo(i - hh, 0); g.lineTo(i, hh); g.stroke(); }
  });
  for (const s of [-1, 1]) {
    const gr = new THREE.Mesh(new THREE.CircleGeometry(0.03, 32), new THREE.MeshStandardMaterial({ map: grilleTex, roughness: 0.7 }));
    const a = new THREE.Vector3(s * 0.83, -0.42, 0.36).normalize();
    gr.position.copy(a.clone().multiplyScalar(r * 1.005)); gr.lookAt(a.clone().multiplyScalar(2)); head.add(gr);
  }

  // leaf ears
  const leaf = new THREE.Shape();
  leaf.moveTo(0, 0); leaf.bezierCurveTo(0.055, 0.03, 0.05, 0.1, 0, 0.16); leaf.bezierCurveTo(-0.05, 0.1, -0.055, 0.03, 0, 0);
  const leafGeo = new THREE.ExtrudeGeometry(leaf, { depth: 0.006, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 4, curveSegments: 24 });
  leafGeo.translate(0, 0, -0.003);
  const leafMat = std(C.green, { roughness: 0.45 });
  const veinMat = std('#2E7D32', { roughness: 0.5 });
  const ears = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.085, r * 0.82, -0.01);
    const ear = new THREE.Mesh(leafGeo, leafMat);
    const vein = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.004, 0.13, 8), veinMat);
    vein.position.set(0, 0.065, 0.011);
    const e = new THREE.Group(); e.add(ear, vein);
    pivot.add(e);
    pivot.userData = { side: s, inner: e };
    head.add(pivot); ears.push(pivot);
  }

  const state = { blink: 0, mode: 'idle', pulse: 0, perk: 0, last: '' };
  function setFace(st) {
    Object.assign(state, st);
    const key = `${state.mode}|${state.blink.toFixed(2)}|${state.pulse.toFixed(2)}`;
    if (key !== state.last) {
      const { g, cv } = faceTex.userData; drawSpudFace(g, cv.width, cv.height, state); faceTex.needsUpdate = true; state.last = key;
    }
    for (const e of ears) {
      const s = e.userData.side;
      e.rotation.z = -s * (0.5 - 0.28 * state.perk) + (st.wave ? s * 0.25 * Math.sin(st.wave) : 0);
      e.rotation.x = -0.15 + 0.1 * state.perk;
      e.scale.setScalar(1 + 0.12 * state.perk);
    }
  }
  setFace({});
  shadowAll(group);
  return { group, head, ears, faceTex, faceMat, setFace, state, r };
}

// ---------------------------------------------------------------- Jason + dog
export function buildJason() {
  const root = new THREE.Group(); root.name = 'jason';
  const body = new THREE.Group(); root.add(body);
  const skin = std('#E9B990', { roughness: 0.7 });
  const jacket = std('#3E6FB0', { roughness: 0.75 });
  const shirt = std(C.cream, { roughness: 0.8 });
  const pants = std('#2B3346', { roughness: 0.85 });
  const shoe = std('#F5F5F5', { roughness: 0.6 });
  const hair = std('#17161C', { roughness: 0.65 });

  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 8, 20), m);
  // Proportions of a ~1.70 m adult (about 7.3 heads tall): hip 0.90, knee 0.48, shoulder 1.39, chin 1.49
  // legs (hip pivots)
  const legs = [];
  for (const s of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(s * 0.095, 0.9, 0);
    const thigh = cap(0.082, 0.3, pants); thigh.position.y = -0.2; hip.add(thigh);
    const knee = new THREE.Group(); knee.position.y = -0.42; hip.add(knee);
    const kneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), pants); knee.add(kneeBall);
    const shin = cap(0.064, 0.3, pants); shin.position.y = -0.2; knee.add(shin);
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.075, 0.25, 3, 0.03), shoe); foot.position.set(0, -0.44, 0.045); knee.add(foot);
    body.add(hip); legs.push({ hip, knee });
  }
  const pelvis = new THREE.Mesh(new RoundedBoxGeometry(0.29, 0.15, 0.16, 4, 0.07), pants); pelvis.position.y = 0.9; body.add(pelvis);
  // torso: tapered lathe (waist narrower than shoulders), slightly flattened front-to-back
  const prof = [[0.0, 0.84], [0.165, 0.845], [0.17, 0.9], [0.158, 0.97], [0.15, 1.06], [0.162, 1.18], [0.185, 1.3], [0.19, 1.35], [0.165, 1.405], [0.1, 1.435], [0.0, 1.44]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const torso = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), jacket); torso.scale.z = 0.66; body.add(torso);
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.163, 0.018, 10, 40), std('#2F5A94')); hem.rotation.x = Math.PI / 2; hem.scale.y = 0.66; hem.position.y = 0.85; body.add(hem);
  const tee = new THREE.Mesh(new RoundedBoxGeometry(0.11, 0.34, 0.02, 3, 0.008), shirt); tee.position.set(0, 1.21, 0.103); tee.rotation.x = -0.05; body.add(tee);
  const zipL = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.42, 0.012), std('#2F5A94')); zipL.position.set(-0.062, 1.17, 0.104); body.add(zipL);
  const zipR = zipL.clone(); zipR.position.x = 0.062; body.add(zipR);
  // neck + collar
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.12, 24), skin); neck.position.y = 1.47; body.add(neck);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.064, 0.015, 12, 32), jacket); collar.rotation.x = Math.PI / 2 + 0.15; collar.position.set(0, 1.425, -0.005); collar.scale.set(1.05, 1, 0.9); body.add(collar);
  // head
  const headG = new THREE.Group(); headG.position.y = 1.585; body.add(headG);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 48, 32), skin); head.scale.set(0.93, 1.12, 1); headG.add(head);
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 20), skin); jaw.scale.set(1, 0.8, 1); jaw.position.set(0, -0.055, 0.02); headG.add(jaw);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.112, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.52), hair);
  hairCap.position.set(0, 0.016, -0.008); hairCap.rotation.x = -0.25; hairCap.scale.set(0.96, 1.12, 1.04); headG.add(hairCap);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), hair); fringe.scale.set(1.6, 0.5, 0.8); fringe.position.set(0.02, 0.085, 0.07); fringe.rotation.z = 0.2; headG.add(fringe);
  const eyeM = std('#1a1a1a', { roughness: 0.3 });
  const eyes = [], brows = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 12), eyeM); e.position.set(s * 0.036, 0.012, 0.097); e.scale.y = 1.25; headG.add(e); eyes.push(e);
    const b = new THREE.Mesh(new RoundedBoxGeometry(0.036, 0.008, 0.01, 2, 0.004), hair); b.position.set(s * 0.038, 0.045, 0.097); headG.add(b); brows.push(b);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 12), skin); ear.position.set(s * 0.1, 0.0, 0); ear.scale.set(0.5, 1, 0.8); headG.add(ear);
  }
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 10), skin); nose.position.set(0, -0.012, 0.106); headG.add(nose);
  const mouthGeo = (k) => new THREE.TorusGeometry(0.022, 0.004, 8, 24, Math.PI * 0.7);
  const mouth = new THREE.Mesh(mouthGeo(), std('#7A3B2E')); mouth.position.set(0, -0.045, 0.093); headG.add(mouth);
  // arms (shoulder pivots); upper arm 0.29, forearm 0.25 -> hand at mid-thigh
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.2, 1.37, 0);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.062, 20, 14), jacket); ball.position.x = -s * 0.012; sh.add(ball);
    const elb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), jacket); elb.position.y = -0.29; sh.add(elb);
    const up = cap(0.054, 0.2, jacket); up.position.y = -0.14; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.29; sh.add(el);
    const fo = cap(0.046, 0.17, jacket); fo.position.y = -0.11; el.add(fo);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.03, 16), std('#2F5A94')); cuff.position.y = -0.21; el.add(cuff);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), skin); hand.scale.set(0.85, 1.25, 0.65); hand.position.y = -0.26; el.add(hand);
    sh.rotation.z = s * 0.07;
    body.add(sh); arms.push({ sh, el, hand });
  }
  // shopping tote in left hand (s=-1 -> index 0)
  const bag = new THREE.Group();
  const bagBody = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.3, 0.1, 3, 0.02), std('#EFE3C8', { roughness: 0.9 }));
  bagBody.position.y = -0.2; bag.add(bagBody);
  const bagLeaf = new THREE.Mesh(new THREE.CircleGeometry(0.05, 24), std(C.green)); bagLeaf.position.set(0, -0.2, 0.0505); bagLeaf.scale.y = 0.6; bag.add(bagLeaf);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 8, 24, Math.PI), std('#C9B48A')); handle.position.y = -0.05; bag.add(handle);
  // groceries peeking out
  const baguette = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.2, 6, 12), std('#D9A35B')); baguette.position.set(0.06, -0.02, 0); baguette.rotation.z = -0.3; bag.add(baguette);
  const greens = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), std(C.green)); greens.position.set(-0.07, -0.05, 0); bag.add(greens);
  bag.position.y = -0.27; arms[0].el.add(bag);

  // phone (hidden by default) in right hand
  const phoneTex = canvasTex(256, 512, (g, w, h) => { g.fillStyle = C.cream; g.fillRect(0, 0, w, h); });
  const phone = new THREE.Group();
  const phoneBody = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.15, 0.009, 4, 0.008), std('#222634', { roughness: 0.3, metalness: 0.3 }));
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.066, 0.138), new THREE.MeshStandardMaterial({ map: phoneTex, emissive: 0xffffff, emissiveMap: phoneTex, emissiveIntensity: 0.7 }));
  phoneScreen.position.z = 0.0051; phone.add(phoneBody, phoneScreen);
  phone.visible = false;

  shadowAll(root);
  const api = { root, body, legs, arms, headG, eyes, brows, mouth, bag, phone, phoneTex };
  api.pose = (t, walk, opts = {}) => {
    // walk: 0 idle, 1 walking; t: time seconds
    const f = t * 1.9 * Math.PI * 2 / 2;
    const sw = Math.sin(f) * 0.5 * walk;
    legs[0].hip.rotation.x = sw; legs[1].hip.rotation.x = -sw;
    legs[0].knee.rotation.x = Math.max(0, -Math.sin(f)) * 0.7 * walk + 0.02;
    legs[1].knee.rotation.x = Math.max(0, Math.sin(f)) * 0.7 * walk + 0.02;
    body.position.y = Math.abs(Math.cos(f)) * 0.025 * walk + (1 - walk) * 0.004 * Math.sin(t * 2);
    arms[0].sh.rotation.x = -sw * 0.35; arms[1].sh.rotation.x = sw * 0.6;
    arms[0].el.rotation.x = -0.1; arms[1].el.rotation.x = -0.25 - 0.1 * walk;
    if (opts.reach !== undefined) { // right arm raises toward the post screen / pad
      arms[1].sh.rotation.x = -1.0 * opts.reach - 0.2 * (1 - opts.reach) * walk;
      arms[1].sh.rotation.z = 0.1 - 0.25 * opts.reach;
      arms[1].el.rotation.x = -0.6 * opts.reach - 0.25;
    }
    headG.rotation.y = opts.look || 0;
    headG.rotation.x = opts.nod || 0;
    // expression: -1 confused .. +1 happy
    const ex = opts.expr || 0;
    brows[0].rotation.z = -0.35 * Math.min(0, ex) * -1; brows[1].rotation.z = 0.35 * Math.min(0, ex) * -1;
    brows[0].rotation.z = ex < 0 ? -0.35 : 0.08 * ex; brows[1].rotation.z = ex < 0 ? 0.35 : -0.08 * ex;
    brows[0].position.y = brows[1].position.y = 0.05 + 0.01 * Math.max(0, ex);
    mouth.rotation.z = ex < 0 ? 0 : Math.PI; // frown vs smile
    mouth.position.y = ex < 0 ? -0.06 : -0.035;
    mouth.rotation.z = Math.PI + (ex < 0 ? Math.PI : 0);
    mouth.rotation.z = ex < 0 ? Math.PI * 0.15 : Math.PI * 1.15;
    const blink = opts.blink || 0;
    eyes.forEach((e) => (e.scale.y = 1.25 * (1 - blink * 0.9)));
    if (opts.talk) mouth.scale.set(1, 1 + 0.6 * Math.abs(Math.sin(t * 14)), 1); else mouth.scale.set(1, 1, 1);
  };
  return api;
}

export function buildDog() {
  const root = new THREE.Group(); root.name = 'dog';
  const fur = std('#E0A15A', { roughness: 0.85 });
  const white = std('#FFF8EE', { roughness: 0.85 });
  const dark = std('#2a1d16', { roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.22, 8, 20), fur); body.rotation.x = Math.PI / 2; body.position.y = 0.26; root.add(body);
  const belly = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.18, 8, 16), white); belly.rotation.x = Math.PI / 2; belly.position.set(0, 0.235, 0.01); root.add(belly);
  const headG = new THREE.Group(); headG.position.set(0, 0.42, 0.2); root.add(headG);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), fur); headG.add(head);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), white); muzzle.position.set(0, -0.03, 0.08); muzzle.scale.set(1, 0.8, 1); headG.add(muzzle);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 10), dark); nose.position.set(0, -0.01, 0.135); headG.add(nose);
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 10), dark); e.position.set(s * 0.04, 0.025, 0.088); headG.add(e);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 16), fur); ear.position.set(s * 0.055, 0.1, -0.01); ear.rotation.z = -s * 0.3; headG.add(ear);
  }
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 24), std(C.purple)); collar.position.set(0, 0.36, 0.15); collar.rotation.x = 1.1; root.add(collar);
  const tail = new THREE.Group(); tail.position.set(0, 0.32, -0.2); root.add(tail);
  const tailM = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.1, 6, 10), fur); tailM.position.y = 0.06; tail.add(tailM); tail.rotation.x = -0.6;
  const legs = [];
  for (const [x, z] of [[-0.06, 0.13], [0.06, 0.13], [-0.06, -0.13], [0.06, -0.13]]) {
    const hip = new THREE.Group(); hip.position.set(x, 0.22, z);
    const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 6, 10), fur); l.position.y = -0.11; hip.add(l);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), white); paw.position.y = -0.19; hip.add(paw);
    root.add(hip); legs.push(hip);
  }
  shadowAll(root);
  const api = { root, headG, tail, legs };
  api.pose = (t, walk) => {
    const f = t * 3.8 * Math.PI;
    legs.forEach((l, i) => (l.rotation.x = Math.sin(f + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.55 * walk));
    tail.rotation.z = Math.sin(t * 12) * 0.5;
    headG.rotation.y = Math.sin(t * 0.9) * 0.2 * (1 - walk);
    root.children[0].position.y = 0.26 + Math.abs(Math.sin(f)) * 0.015 * walk;
  };
  return api;
}

// ---------------------------------------------------------------- street
function signTex(text, bg, fg, w = 512, h = 128) {
  return canvasTex(w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.font = `800 ${h * 0.5}px "Baloo 2"`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, h * 0.56);
  });
}

export function buildStreet() {
  const street = new THREE.Group(); street.name = 'street';
  const paveTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#D9D2C7'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#C4BCB0'; g.lineWidth = 4;
    for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * w / 4, 0); g.lineTo(i * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, i * h / 4); g.lineTo(w, i * h / 4); g.stroke(); }
  }, { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping });
  paveTex.repeat.set(30, 3);
  const pave = new THREE.Mesh(new THREE.PlaneGeometry(60, 6), new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.9 }));
  pave.rotation.x = -Math.PI / 2; pave.position.set(0, 0, 0); pave.receiveShadow = true; street.add(pave);
  const kerb = new THREE.Mesh(new THREE.BoxGeometry(60, 0.12, 0.25), std('#B8B2A8', { roughness: 0.9 })); kerb.position.set(0, 0.02, 3.05); kerb.receiveShadow = true; street.add(kerb);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(60, 9), std('#4A4E57', { roughness: 0.95 }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, -0.04, 7.6); road.receiveShadow = true; street.add(road);
  for (const z of [5.8, 6.4, 8.2, 8.8]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(60, 0.02, 0.06), std('#9BA3AE', { metalness: 0.7, roughness: 0.3 })); rail.position.set(0, -0.025, z); street.add(rail); }
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), std('#7CB86A', { roughness: 1 }));
  grass.rotation.x = -Math.PI / 2; grass.position.set(18, -0.01, -18); grass.receiveShadow = true; street.add(grass);
  const grass2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), std('#8FC27A', { roughness: 1 }));
  grass2.rotation.x = -Math.PI / 2; grass2.position.set(0, -0.06, 30); grass2.receiveShadow = true; street.add(grass2);

  // shopfronts along z=-3.5, x in [-28, 2]
  const shops = [
    ['Fresh Grocer', '#4CAF50', '#E8D7C3'], ['Corner Café', '#F28C28', '#F3E0C9'], ['Bakery', '#7B4B94', '#E9D9EE'],
    ['Laundry', '#3E8EC9', '#DCE8F0'], ['Books & Co', '#C0504D', '#F2DFD5'], ['Pharmacy', '#2E9E4F', '#E3EFE3'],
  ];
  const windows = [];
  shops.forEach(([name, col, wall], i) => {
    const x = -26 + i * 4.6;
    const b = new THREE.Group(); b.position.set(x, 0, -4.6);
    const h = 4.5 + (i % 3) * 0.8;
    const bd = new THREE.Mesh(new THREE.BoxGeometry(4.5, h, 2), std(wall, { roughness: 0.85 })); bd.position.y = h / 2; b.add(bd);
    const glassMat = new THREE.MeshStandardMaterial({ color: '#9FC3D9', roughness: 0.15, metalness: 0.1, emissive: '#FFC27A', emissiveIntensity: 0 });
    // windows are recessed boxes inside a frame (no coplanar faces -> no z-fighting flicker)
    const frameMat = std('#3C4A5C', { roughness: 0.5 });
    const win = (w, hh, x, y) => {
      const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, hh + 0.12, 0.08), frameMat); fr.position.set(x, y, 1.0); b.add(fr);
      const gl = new THREE.Mesh(new THREE.BoxGeometry(w, hh, 0.03), glassMat); gl.position.set(x, y, 1.05); b.add(gl);
    };
    win(3.0, 1.7, -0.35, 1.25);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.1, 0.06), std('#5D4037')); door.position.set(1.6, 1.05, 1.03); b.add(door);
    win(1.0, 1.0, -1.1, h - 1.2); win(1.0, 1.0, 1.1, h - 1.2);
    // awning
    const aw = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.08, 1.1), std(col, { roughness: 0.7 })); aw.position.set(0, 2.75, 1.45); aw.rotation.x = 0.25; b.add(aw);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.55), new THREE.MeshStandardMaterial({ map: signTex(name, col, '#fff'), emissive: 0xffffff, emissiveIntensity: 0.15, emissiveMap: null }));
    sign.position.set(0, 3.25, 1.05); b.add(sign);
    shadowAll(b);
    street.add(b);
  });

  // park: fence + trees (x > 2)
  const treeMat = std('#5DAE4B', { roughness: 0.9 }), treeMat2 = std('#4C9A3E', { roughness: 0.9 }), trunk = std('#8D6E63');
  const tree = (x, z, s) => {
    const t = new THREE.Group(); t.position.set(x, 0, z);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 1.6 * s, 12), trunk); tr.position.y = 0.8 * s; t.add(tr);
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.0 * s, 24, 16), treeMat); c1.position.y = 2.2 * s; t.add(c1);
    const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.7 * s, 20, 14), treeMat2); c2.position.set(0.6 * s, 1.9 * s, 0.3 * s); t.add(c2);
    const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.65 * s, 20, 14), treeMat); c3.position.set(-0.55 * s, 2.0 * s, -0.2 * s); t.add(c3);
    shadowAll(t); street.add(t);
  };
  [[5, -5.5, 1.1], [8.5, -7, 1.3], [12, -5, 1.0], [15, -8, 1.4], [19, -5.5, 1.2], [23, -7.5, 1.3], [4, 1.8, 0.9], [-13, 2.2, 0.9], [-21, 2.2, 0.9], [10, 2.0, 0.95]].forEach(([x, z, s]) => tree(x, z, s));
  const fenceMat = std('#2F3B2F', { roughness: 0.6, metalness: 0.3 });
  for (let x = 3; x < 28; x += 0.35) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.9, 0.035), fenceMat); p.position.set(x, 0.45, -3.4); street.add(p); }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(25, 0.04, 0.04), fenceMat); rail.position.set(15.5, 0.8, -3.4); street.add(rail);
  const parkSign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshStandardMaterial({ map: signTex('Riverside Park', '#2E7D32', '#fff'), roughness: 0.6 }));
  parkSign.position.set(3.6, 1.1, -3.35); street.add(parkSign);
  const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.06), fenceMat); signPost.position.set(3.6, 0.55, -3.42); street.add(signPost);

  // tram stop shelter at x=-9
  const ts = new THREE.Group(); ts.position.set(-9, 0, 2.3);
  const glassM = new THREE.MeshStandardMaterial({ color: '#CFE6F2', transparent: true, opacity: 0.35, roughness: 0.05, depthWrite: false });
  const frameM = std('#3C4A5C', { metalness: 0.4, roughness: 0.4 });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 1.4), std('#2F7D63')); roof.position.y = 2.45; ts.add(roof);
  for (const x of [-1.5, 1.5]) for (const z of [-0.6, 0.6]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.45, 10), frameM); p.position.set(x, 1.22, z); ts.add(p); }
  const back = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), glassM); back.position.set(0, 1.2, -0.6); ts.add(back);
  const bench = new THREE.Mesh(new RoundedBoxGeometry(2, 0.08, 0.4, 2, 0.03), std('#C78B4A')); bench.position.set(0, 0.5, -0.35); ts.add(bench);
  const tsSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.35), new THREE.MeshStandardMaterial({ map: signTex('Tram Stop 14', '#2F7D63', '#fff'), roughness: 0.5 }));
  tsSign.position.set(0, 2.2, 0.71); ts.add(tsSign);
  shadowAll(ts); street.add(ts);

  // lamp posts
  const lamps = [];
  for (const x of [-16, -4, 7, 18]) {
    const l = new THREE.Group(); l.position.set(x, 0, 2.6);
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 4.2, 12), frameM); p.position.y = 2.1; l.add(p);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.7), frameM); arm.position.set(0, 4.15, -0.3); l.add(arm);
    const bulbM = new THREE.MeshStandardMaterial({ color: '#FFF3D6', emissive: '#FFD58A', emissiveIntensity: 0.2 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), bulbM); bulb.position.set(0, 4.05, -0.6); l.add(bulb);
    lamps.push(bulbM);
    shadowAll(l); street.add(l);
  }
  return { group: street, windows, lamps };
}

// soil mound + vine for the title
export function buildSoil() {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.55, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + 0.06 * Math.sin(v.x * 17) * Math.cos(v.z * 13) + 0.04 * Math.sin(v.x * 31 + v.z * 23); p.setXYZ(i, v.x * n, v.y * n, v.z * n); }
  geo.computeVertexNormals();
  const mound = new THREE.Mesh(geo, std('#8A5A3B', { roughness: 1 })); mound.scale.y = 0.35; g.add(mound);
  for (let i = 0; i < 14; i++) { const a = i * 2.39, rr = 0.3 + (i % 4) * 0.08; const c = new THREE.Mesh(new THREE.SphereGeometry(0.04 + (i % 3) * 0.015, 12, 8), std('#6E452C', { roughness: 1 })); c.position.set(Math.cos(a) * rr, 0.08 + (i % 3) * 0.02, Math.sin(a) * rr); g.add(c); }
  shadowAll(g);
  // vine curve
  const pts = [];
  for (let i = 0; i <= 60; i++) { const k = i / 60; pts.push(new THREE.Vector3(Math.cos(k * 7.5) * (0.36 - 0.06 * k), 0.05 + k * 1.15, Math.sin(k * 7.5) * (0.36 - 0.06 * k) + 0.0)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const vineGeo = new THREE.TubeGeometry(curve, 240, 0.012, 8, false);
  const vine = new THREE.Mesh(vineGeo, std('#3E9A44', { roughness: 0.6 }));
  vine.castShadow = true;
  const leaves = [];
  const leafS = new THREE.Shape(); leafS.moveTo(0, 0); leafS.bezierCurveTo(0.04, 0.02, 0.04, 0.07, 0, 0.1); leafS.bezierCurveTo(-0.04, 0.07, -0.04, 0.02, 0, 0);
  const leafG = new THREE.ShapeGeometry(leafS, 12);
  for (let i = 1; i < 10; i++) {
    const k = i / 10; const pt = curve.getPoint(k);
    const lf = new THREE.Mesh(leafG, new THREE.MeshStandardMaterial({ color: i % 2 ? C.green : '#66BB6A', side: THREE.DoubleSide, roughness: 0.5 }));
    lf.position.copy(pt); lf.rotation.set(0.4, k * 7.5 + (i % 2) * Math.PI, (i % 2 ? 1 : -1) * 0.9); lf.userData.k = k; lf.castShadow = true;
    leaves.push(lf); g.add(lf);
  }
  g.add(vine);
  return { group: g, mound, vine, vineGeo, leaves };
}
