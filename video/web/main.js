import * as THREE from 'three';
import { RoomEnvironment } from '/node_modules/three/examples/jsm/environments/RoomEnvironment.js';
import * as WD from './world.js';
import { buildScenes, ZH_STRINGS } from './scenes.js';
import { clamp, easeOut } from './fx.js';

const TL = await (await fetch('./timeline.json?' + Date.now())).json();
window.TL = TL;

// ------------------------------------------------------------------ fonts
await document.fonts.load('900 40px "Baloo 2"');
await document.fonts.load('800 40px "Baloo 2"');
for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 40px Nunito`);
const zhAll = ZH_STRINGS.join('');
for (const w of [500, 700, 900]) await document.fonts.load(`${w} 40px "Noto Sans TC"`, zhAll);
document.getElementById('fontwarm').textContent = zhAll;
await document.fonts.ready;

// ------------------------------------------------------------------ renderer
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(1920, 1080, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
scene.environment = envTex;

const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 120);

function skyTex(top, mid, bottom) {
  const cv = document.createElement('canvas'); cv.width = 16; cv.height = 512;
  const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, top); gr.addColorStop(0.55, mid); gr.addColorStop(1, bottom);
  g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const SKY = {
  day: skyTex('#8EC5EA', '#CFE8F5', '#FFF4E0'),
  stage: skyTex('#E9DDF2', '#FFF0DD', '#FFE3C2'),
  dusk: skyTex('#3B2A5E', '#8E4D86', '#F59A4A'),
};

const hemi = new THREE.HemisphereLight('#FFFFFF', '#B9A88F', 1.1);
const sun = new THREE.DirectionalLight('#FFF1DC', 2.4);
sun.castShadow = true;
const SHQ = +(new URLSearchParams(location.search).get('shadow') || 2048);
sun.shadow.mapSize.set(SHQ, SHQ);
if (SHQ < 2048) renderer.shadowMap.type = THREE.PCFShadowMap;
sun.shadow.camera.left = -4; sun.shadow.camera.right = 4; sun.shadow.camera.top = 4; sun.shadow.camera.bottom = -4;
sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 30;
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
const fill = new THREE.DirectionalLight('#DCC9FF', 0.5);
scene.add(hemi, sun, sun.target, fill);

const post = WD.buildPost();
const jason = WD.buildJason();
const dog = WD.buildDog();
const street = WD.buildStreet();
const soil = WD.buildSoil();
scene.add(post.group, jason.root, dog.root, street.group, soil.group);
// title stage platform
const stage = new THREE.Group();
const plat = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.3, 0.2, 96), new THREE.MeshStandardMaterial({ color: '#FFE7C7', roughness: 0.8 }));
plat.position.y = -0.1; plat.receiveShadow = true; stage.add(plat);
const platRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.03, 12, 128), new THREE.MeshStandardMaterial({ color: '#F28C28' }));
platRing.rotation.x = Math.PI / 2; platRing.position.y = 0.0; stage.add(platRing);
scene.add(stage);

// warm glow around the post at dusk
const postGlow = new THREE.PointLight('#FFB066', 0, 3.5, 1.6);
postGlow.position.set(0.0, 1.0, 0.2); post.group.add(postGlow);

// leash
const leashMat = new THREE.MeshStandardMaterial({ color: '#7B4B94', roughness: 0.5 });
let leash = new THREE.Mesh(new THREE.BufferGeometry(), leashMat); scene.add(leash);
const _a = new THREE.Vector3(), _b = new THREE.Vector3();
function updateLeash() {
  if (!jason.root.visible || !dog.root.visible) { leash.visible = false; return; }
  leash.visible = true;
  jason.arms[1].hand.getWorldPosition(_a);
  dog.root.updateMatrixWorld(true);
  _b.set(0, 0.36, 0.17).applyMatrix4(dog.root.matrixWorld);
  const mid = _a.clone().lerp(_b, 0.5); mid.y -= 0.18;
  const curve = new THREE.QuadraticBezierCurve3(_a.clone(), mid, _b.clone());
  leash.geometry.dispose();
  leash.geometry = new THREE.TubeGeometry(curve, 24, 0.006, 6, false);
}

// phone in hand (for NFC tap)
const handPhone = new THREE.Group();
{
  const skinM = new THREE.MeshStandardMaterial({ color: '#E9B990', roughness: 0.7 });
  const jacketM = new THREE.MeshStandardMaterial({ color: '#3E6FB0', roughness: 0.75 });
  const ph = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.155, 0.009), new THREE.MeshStandardMaterial({ color: '#222634', roughness: 0.3, metalness: 0.3 }));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.066, 0.14), new THREE.MeshStandardMaterial({ map: jason.phoneTex, emissive: 0xffffff, emissiveMap: jason.phoneTex, emissiveIntensity: 0.8 }));
  scr.position.z = 0.0051; ph.add(body, scr);
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 14), skinM); palm.scale.set(1, 1.3, 0.55); palm.position.set(0, -0.03, -0.03);
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.04, 6, 10), skinM); thumb.position.set(0.04, -0.01, 0.0); thumb.rotation.z = 0.5;
  const fingers = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.05, 6, 10), skinM); fingers.position.set(-0.042, -0.0, -0.012); fingers.rotation.z = -0.2;
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.32, 8, 14), jacketM); arm.position.set(0.02, -0.25, -0.06); arm.rotation.x = 0.25;
  handPhone.add(ph, palm, thumb, fingers, arm);
  handPhone.traverse((m) => { if (m.isMesh) m.castShadow = true; });
}
scene.add(handPhone);
// NFC ripples
const ripples = [];
for (let i = 0; i < 3; i++) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.004, 8, 64), new THREE.MeshBasicMaterial({ color: '#F28C28', transparent: true, opacity: 0 }));
  scene.add(m); ripples.push(m);
}

// ------------------------------------------------------------------ snapshots for 2D UI (same 3D model = identical Spud everywhere)
const snapR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
snapR.setSize(512, 512, false); snapR.setPixelRatio(1);
snapR.toneMapping = THREE.ACESFilmicToneMapping; snapR.outputColorSpace = THREE.SRGBColorSpace;
const snapScene = new THREE.Scene();
snapScene.environment = new THREE.PMREMGenerator(snapR).fromScene(new RoomEnvironment(snapR), 0.04).texture;
snapScene.add(new THREE.HemisphereLight('#fff', '#B9A88F', 1.2));
const sl = new THREE.DirectionalLight('#FFF1DC', 2.2); sl.position.set(1.5, 2, 3); snapScene.add(sl);
const snapCam = new THREE.PerspectiveCamera(30, 1, 0.01, 10);
const snapSpud = WD.buildSpud(); snapScene.add(snapSpud.group);
const IMG = { spud: {}, jason: {} };
function snap(obj, camPos, look) {
  snapCam.position.copy(camPos); snapCam.lookAt(look);
  snapR.setClearColor(0x000000, 0); snapR.render(snapScene, snapCam);
  return snapR.domElement.toDataURL('image/png');
}
for (const mode of ['idle', 'happy', 'listen', 'think']) {
  snapSpud.setFace({ mode, blink: 0, pulse: 0.25, perk: mode === 'listen' ? 1 : 0.3 });
  IMG.spud[mode] = snap(snapSpud.group, new THREE.Vector3(0, 0.06, 0.95), new THREE.Vector3(0, 0.035, 0));
}
snapSpud.setFace({ mode: 'idle', blink: 1, perk: 0.3 });
IMG.spud.blink = snap(snapSpud.group, new THREE.Vector3(0, 0.06, 0.95), new THREE.Vector3(0, 0.035, 0));
snapScene.remove(snapSpud.group);
const snapJason = WD.buildJason(); snapScene.add(snapJason.root);
for (const [k, ex] of [['confused', -1], ['happy', 1]]) {
  snapJason.pose(0, 0, { expr: ex, look: ex < 0 ? 0.25 : -0.1, nod: ex < 0 ? 0.08 : -0.05 });
  IMG.jason[k] = snap(snapJason.root, new THREE.Vector3(0.12, 1.62, 0.85), new THREE.Vector3(0, 1.55, 0));
}
snapScene.remove(snapJason.root);

// ------------------------------------------------------------------ world API for scenes
const tmpV = new THREE.Vector3();
const W = {
  THREE, scene, camera, renderer, post, jason, dog, street, soil, stage, hemi, sun, fill, handPhone, ripples, IMG, WD,
  setSky(mode) {
    scene.background = SKY[mode];
    const envK = mode === 'dusk' ? 0.3 : 1.0;
    if (W._envK !== envK) {
      W._envK = envK;
      scene.traverse((o) => { if (o.isMesh && o.material && 'envMapIntensity' in o.material) o.material.envMapIntensity = envK; });
    }
    postGlow.intensity = mode === 'dusk' ? 2.2 : 0;
    if (mode === 'dusk') {
      scene.fog = new THREE.Fog('#C77A78', 14, 45);
      hemi.color.set('#B9A0E0'); hemi.groundColor.set('#6B4A5A'); hemi.intensity = 0.55;
      sun.color.set('#FF9E5E'); sun.intensity = 1.1; fill.intensity = 0.25;
      street.windows.forEach((m) => (m.emissiveIntensity = 0.9));
      street.lamps.forEach((m) => (m.emissiveIntensity = 3.0));
      renderer.toneMappingExposure = 1.05;
    } else {
      scene.fog = mode === 'day' ? new THREE.Fog('#E6EEF0', 22, 70) : null;
      hemi.color.set('#FFFFFF'); hemi.groundColor.set('#B9A88F'); hemi.intensity = 1.1;
      sun.color.set('#FFF1DC'); sun.intensity = 2.4; fill.intensity = 0.5;
      street.windows.forEach((m) => (m.emissiveIntensity = 0));
      street.lamps.forEach((m) => (m.emissiveIntensity = 0.2));
      renderer.toneMappingExposure = 1.0;
    }
  },
  sunAt(target, dir = [3, 6, 4]) {
    sun.target.position.copy(target);
    sun.position.set(target.x + dir[0], target.y + dir[1], target.z + dir[2]);
    fill.position.set(target.x - 4, target.y + 2, target.z + 3);
  },
  // shift (px): where the look-at point lands horizontally, relative to screen centre
  cam(pos, look, fov = 35, shift = 0) {
    camera.position.set(...pos); camera.fov = fov;
    if (shift) { const a = Math.abs(shift); camera.setViewOffset(1920 + 2 * a, 1080, shift < 0 ? 2 * a : 0, 0, 1920, 1080); }
    else camera.clearViewOffset();
    camera.updateProjectionMatrix(); camera.lookAt(...look);
  },
  // project a world point to screen px
  project(v) {
    camera.updateMatrixWorld();
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x * 0.5 + 0.5) * 1920, y: (-tmpV.y * 0.5 + 0.5) * 1080 };
  },
  spudWorld(off = [0, 0, 0]) {
    const v = new THREE.Vector3(...off);
    post.group.updateMatrixWorld(true);
    post.spud.group.localToWorld(v); return v;
  },
  updateLeash,
  ui: document.getElementById('ui'),
};

// ------------------------------------------------------------------ scenes
const SCN = buildScenes(W);
const sceneTL = TL.scenes;
const lt = document.getElementById('lt');
const subs = document.querySelector('#subs .bar');
const wipe = document.getElementById('wipe');

function makeS(sc) {
  const lines = Object.fromEntries(sc.lines.map((l) => [l.id, l]));
  return {
    dur: sc.dur,
    cue: (id) => lines[id].start - sc.start,
    end: (id) => lines[id].end - sc.start,
    line: (id) => lines[id],
    // approx local time of a word/phrase inside a line (proportional to characters)
    at: (id, phrase) => {
      const l = lines[id]; const i = l.sub.indexOf(phrase);
      const frac = i < 0 ? 0 : i / l.sub.length;
      return l.start - sc.start + l.dur * frac;
    },
  };
}
const SS = sceneTL.map(makeS);

const LT_ICONS = {
  default: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.4-.7z"/></svg>',
};
W.lowerThird = (tLocal, items) => {
  // items: [{text, a, b}] -> show the active one
  const it = items.find((x) => tLocal >= x.a && tLocal < x.b);
  if (!it) { lt.style.opacity = 0; return; }
  const p = easeOut(clamp((tLocal - it.a) / 0.4)), q = 1 - clamp((tLocal - (it.b - 0.35)) / 0.35);
  lt.style.opacity = Math.min(p, q);
  lt.style.transform = `translateX(${(1 - p) * -60}px)`;
  const v = lt.querySelector('.v'); if (v.textContent !== it.text) v.textContent = it.text;
  lt.querySelector('.k').textContent = it.k || 'Feature';
  lt.querySelector('.ic').innerHTML = it.icon || LT_ICONS.default;
};

let lastScene = -1;
window.renderAt = (t) => {
  let i = sceneTL.findIndex((s) => t >= s.start && t < s.end);
  if (i < 0) i = sceneTL.length - 1;
  const sc = sceneTL[i], S = SS[i], tl = t - sc.start;
  if (i !== lastScene) {
    SCN.forEach((s, k) => (s.root.style.display = k === i ? 'block' : 'none'));
    lastScene = i;
  }
  lt.style.opacity = 0;
  const res = SCN[i].update(tl, S, t) || {};
  canvas.style.visibility = res.gl ? 'visible' : 'hidden';
  if (res.gl) { updateLeash(); renderer.render(scene, camera); }

  // scene-boundary wipe (0.6 s, centred on the cut)
  let wp = -1;
  for (let k = 1; k < sceneTL.length; k++) {
    const b = sceneTL[k].start;
    if (Math.abs(t - b) < 0.3) wp = (t - b + 0.3) / 0.6;
  }
  if (wp >= 0) { wipe.style.transform = `translateX(${-130 + 260 * wp}%) skewX(-12deg)`; wipe.style.display = 'flex'; }
  else wipe.style.display = 'none';

  // subtitles
  const cue = TL.cues.find((c) => t >= c.start && t < c.end);
  if (cue) {
    const html = cue.lines.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('<br>');
    if (subs.innerHTML !== html) subs.innerHTML = html;
    subs.style.display = 'block';
  } else subs.style.display = 'none';
  return true;
};
window.READY = true;
