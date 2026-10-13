// Jason, his Shiba and background pedestrians built from rigged CC0 models.
// All motion is a pure function of time so frames render identically in parallel.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '/node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { loadGLB, makeRig, addRot, ccdIK } from './rigs.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _m = new THREE.Matrix4();

export const JASON_COLORS = { Purple: '#3E6FB0', Hair: '#1E1B1F', Eyebrows: '#1E1B1F', LightBlue: '#2B3346', Skin: '#E8C39E' };

export async function loadCharacterAssets() {
  const names = ['men/Casual_Hoodie', 'animals/ShibaInu', 'men/Casual_2', 'men/Worker', 'women/Casual', 'women/Formal', 'women/Suit'];
  const out = {};
  await Promise.all(names.map(async (n) => { out[n] = await loadGLB(n); }));
  return out;
}

// ---------------------------------------------------------------- Jason
export function buildJason(A) {
  const rig = makeRig(A['men/Casual_Hoodie'], { scale: 0.92, recolor: JASON_COLORS });
  const B = rig.bones;
  const root = rig.root;
  root.name = 'jason';

  // phone + letter are scene-level props placed at the hand each frame
  const phoneTex = (() => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512;
    const g = cv.getContext('2d'); g.fillStyle = '#FFF4E0'; g.fillRect(0, 0, 256, 512);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.userData = { cv, g }; return t;
  })();
  const phone = new THREE.Group();
  const pb = new THREE.Mesh(new RoundedBoxGeometry(0.078, 0.156, 0.014, 4, 0.01), new THREE.MeshStandardMaterial({ color: '#F28C28', roughness: 0.45 }));
  const ps = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.138), new THREE.MeshStandardMaterial({ map: phoneTex, emissive: 0xffffff, emissiveMap: phoneTex, emissiveIntensity: 0.75 }));
  ps.position.z = 0.0051; phone.add(pb, ps); pb.castShadow = true;
  phone.visible = false;

  const letterTex = (() => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 360;
    const g = cv.getContext('2d');
    g.fillStyle = '#FFFDF7'; g.fillRect(0, 0, 256, 360);
    g.fillStyle = '#2E7D32'; g.fillRect(0, 0, 256, 44);
    g.fillStyle = '#fff'; g.font = '800 22px Nunito'; g.fillText('CITY COUNCIL', 18, 30);
    g.fillStyle = '#1F2A44'; g.font = '800 20px Nunito'; g.fillText('Notice of amendment', 18, 80);
    for (let i = 0; i < 11; i++) { g.fillStyle = i === 3 || i === 7 ? '#E0544B' : '#C9C3B8'; g.fillRect(18, 104 + i * 21, 150 + ((i * 53) % 70), 8); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const letter = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.297), new THREE.MeshStandardMaterial({ map: letterTex, side: THREE.DoubleSide, roughness: 0.9 }));
  letter.castShadow = true; letter.visible = false;

  const api = { root, rig, bones: B, phone, phoneTex, letter };
  const tgt = new THREE.Vector3();

  // opts: walk 0..1, interact (clip time or null), wave (clip time or null), look:[yaw,pitch],
  // slump 0..1, talk bool, reachR: Vector3|null + reachW, phone bool, phonePose 'look'|'pad',
  // letter bool, scratch 0..1 (hand to head)
  api.pose = (t, o = {}) => {
    const walk = clamp(o.walk || 0);
    const layers = [];
    if (walk < 1) layers.push({ clip: o.slump > 0.5 ? 'Idle_Neutral' : 'Idle', t: t + 0.3, w: 1 - walk });
    if (walk > 0) layers.push({ clip: 'Walk', t: (o.walkT ?? t) * (o.walkRate || 1), w: walk });
    if (o.interact != null) { layers.length = 0; layers.push({ clip: 'Interact', t: o.interact, loop: false }); }
    if (o.wave != null) { layers.length = 0; layers.push({ clip: 'Wave', t: o.wave }); }
    rig.pose(layers);
    // procedural layers
    const sl = o.slump || 0;
    addRot(B.Chest, 0.18 * sl, 0, 0);
    addRot(B.Neck, 0.25 * sl, 0, 0);
    for (const s of ['L', 'R']) addRot(B['Shoulder' + s], 0, 0, (s === 'L' ? -1 : 1) * 0.12 * sl);
    const [yaw, pitch] = o.look || [0, 0];
    const nod = o.talk ? 0.05 * Math.sin(t * 9) + 0.03 * Math.sin(t * 5.3) : 0;
    addRot(B.Head, pitch + nod, yaw, o.tilt || 0);
    root.updateMatrixWorld(true);
    if (o.reachR && (o.reachW ?? 1) > 0) ccdIK(B.WristR, [B.LowerArmR, B.UpperArmR], o.reachR, 10, o.reachW ?? 1);
    if (o.reachL && (o.reachLW ?? 1) > 0) ccdIK(B.WristL, [B.LowerArmL, B.UpperArmL], o.reachL, 10, o.reachLW ?? 1);
    // phone held in the right hand
    phone.visible = !!o.phone;
    if (o.phone) {
      // the phone sits in the palm; its orientation is art-directed rather than taken from the
      // hand bone: upright facing Jason's eyes when reading, or lying on a surface (phoneFace = normal)
      B.Middle2R.getWorldPosition(_v); B.Index1R.getWorldPosition(_w);
      phone.position.copy(_v).lerp(_w, 0.5);
      const head = B.Head.getWorldPosition(new THREE.Vector3());
      const zA = o.phoneFace ? o.phoneFace.clone().normalize() : head.clone().sub(phone.position).normalize();
      const fwd = new THREE.Vector3(Math.sin(root.rotation.y), 0, Math.cos(root.rotation.y));
      const yA = (o.phoneFace ? fwd : new THREE.Vector3(0, 1, 0)).clone();
      yA.addScaledVector(zA, -yA.dot(zA)).normalize();
      const xA = new THREE.Vector3().crossVectors(yA, zA);
      phone.quaternion.setFromRotationMatrix(_m.makeBasis(xA, yA, zA));
      if (o.phoneFace) phone.position.addScaledVector(zA, 0.012);
    }
    letter.visible = !!o.letter;
    if (o.letter) {
      B.WristR.getWorldPosition(_v); B.WristL.getWorldPosition(_w);
      letter.position.copy(_v).lerp(_w, 0.5); letter.position.y += 0.1;
      B.Head.getWorldPosition(_w); letter.lookAt(_w); letter.rotateX(-0.25);
    }
  };
  // world-space point in front of Jason (for building IK targets): local x right, y up, z forward
  api.local = (x, y, z, out = tgt) => { root.updateMatrixWorld(true); return out.set(x, y, z).applyMatrix4(root.matrixWorld); };
  api.hand = (side = 'L', out = new THREE.Vector3()) => B['Wrist' + side].getWorldPosition(out);
  api.headPos = (out = new THREE.Vector3()) => B.Head.getWorldPosition(out);
  return api;
}

// ---------------------------------------------------------------- Shiba
export function buildDog(A) {
  const rig = makeRig(A['animals/ShibaInu'], { scale: 0.15 });
  const root = rig.root; root.name = 'dog';
  // collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 24), new THREE.MeshStandardMaterial({ color: '#7B4B94', roughness: 0.5 }));
  collar.castShadow = true;
  root.parent; // placed in scene by caller
  const api = { root, rig, collar };
  // mode: 'walk' | 'idle' | 'sniff' | 'sit'
  api.pose = (t, walk = 0, mode = 'idle') => {
    const idle = mode === 'sniff' ? 'Eating' : mode === 'look' ? 'Idle_2' : 'Idle';
    const layers = [];
    if (walk < 1) layers.push({ clip: idle, t: t + 1.1, w: 1 - walk });
    if (walk > 0) layers.push({ clip: 'Walk', t: t * 1.35, w: walk });
    rig.pose(layers);
    rig.bones.Neck2.getWorldPosition(_v);
    collar.position.copy(_v);
    rig.bones.Neck1.getWorldPosition(_w);
    collar.lookAt(_w);
  };
  api.neck = (out = new THREE.Vector3()) => rig.bones.Neck2.getWorldPosition(out);
  return api;
}

// ---------------------------------------------------------------- pedestrians
// Deterministic walkers looping along the shopfront footpath.
export function buildCrowd(A, specs) {
  const people = specs.map((s) => {
    const rig = makeRig(A[s.model], { scale: s.scale || 0.93, recolor: s.recolor || {}, hide: ['Gun', 'Pistol', 'Weapon'] });
    return { ...s, rig };
  });
  const group = new THREE.Group();
  people.forEach((p) => group.add(p.rig.root));
  const api = { group, people };
  // bounds: [xMin, xMax]
  api.update = (t, visible = true) => {
    group.visible = visible;
    if (!visible) return;
    for (const p of people) {
      const L = p.x1 - p.x0;
      const d = ((p.phase + t * p.speed) % L + L) % L;
      const x = p.dir > 0 ? p.x0 + d : p.x1 - d;
      p.rig.root.position.set(x, 0, p.z);
      p.rig.root.rotation.y = p.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (p.idle) { p.rig.root.position.x = p.x0; p.rig.root.rotation.y = p.ry || 0; p.rig.pose([{ clip: p.idle, t: t + p.phase }]); }
      else p.rig.pose([{ clip: 'Walk', t: (t + p.phase) * p.speed * 0.78 }]);
    }
  };
  return api;
}
