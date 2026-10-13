// Rigged CC0 characters (Quaternius, via nikitapage10/models) driven deterministically:
// every frame the scene code says which clips play at which local time and weight,
// then optional procedural layers (look, slump, IK reach) are applied on top.
import * as THREE from 'three';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const cache = {};
export async function loadGLB(path) {
  if (!cache[path]) cache[path] = loader.loadAsync(`./assets/${path}.glb`);
  return cache[path];
}

const _q = new THREE.Quaternion(), _e = new THREE.Euler();
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _p = new THREE.Vector3();
const _qw = new THREE.Quaternion(), _qi = new THREE.Quaternion();

// Rotate `bone` by a local euler offset (radians) after the clip has posed it.
export function addRot(bone, x = 0, y = 0, z = 0) {
  if (!bone || (!x && !y && !z)) return;
  bone.quaternion.multiply(_q.setFromEuler(_e.set(x, y, z)));
}

// Cyclic-coordinate-descent IK on a bone chain towards a world-space target.
// links: from the joint nearest the effector up to the root of the chain.
export function ccdIK(effector, links, target, iters = 8, weight = 1) {
  if (weight <= 0) return;
  const saved = links.map((l) => l.quaternion.clone());
  for (let it = 0; it < iters; it++) {
    for (const link of links) {
      link.updateMatrixWorld(true);
      effector.getWorldPosition(_a);
      link.getWorldPosition(_p);
      _b.subVectors(_a, _p).normalize();
      _c.subVectors(target, _p).normalize();
      if (_b.lengthSq() < 1e-8 || _c.lengthSq() < 1e-8) continue;
      // world-space rotation taking effector dir onto target dir, converted into the link's parent space
      _qw.setFromUnitVectors(_b, _c);
      link.parent.getWorldQuaternion(_qi);
      const pInv = _qi.clone().invert();
      const local = pInv.clone().multiply(_qw).multiply(_qi);
      link.quaternion.premultiply(local);
    }
  }
  if (weight < 1) links.forEach((l, i) => l.quaternion.copy(saved[i]).slerp(l.quaternion.clone(), weight));
  links[links.length - 1].updateMatrixWorld(true);
}

export function makeRig(gltf, { scale = 1, recolor = {}, hide = [] } = {}) {
  const model = SkeletonUtils.clone(gltf.scene);
  const root = new THREE.Group();
  model.scale.setScalar(scale);
  root.add(model);
  const bones = {};
  const mats = {};
  model.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.isMesh) {
      o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false;
      if (hide.some((h) => o.name.includes(h) || o.material.name.includes(h))) { o.visible = false; return; }
      // per-instance materials so recolouring one rig never leaks into another
      const key = o.material.name;
      if (!mats[key]) {
        mats[key] = o.material.clone();
        mats[key].roughness = 0.75; mats[key].metalness = 0;
        if (recolor[key]) mats[key].color.set(recolor[key]);
      }
      o.material = mats[key];
    }
  });
  const mixer = new THREE.AnimationMixer(model);
  const acts = {};
  for (const clip of gltf.animations) {
    const a = mixer.clipAction(clip);
    a.play(); a.setEffectiveWeight(0);
    acts[clip.name] = a;
  }
  const rig = {
    root, model, bones, mats, acts, mixer,
    // layers: [{ clip, t, w=1, loop=true }]; weights are normalised to sum to 1
    pose(layers) {
      const sum = layers.reduce((s, l) => s + (l.w ?? 1), 0) || 1;
      for (const k in acts) acts[k].setEffectiveWeight(0);
      for (const l of layers) {
        const a = acts[l.clip]; if (!a) continue;
        const d = a.getClip().duration;
        a.time = l.loop === false ? Math.min(Math.max(l.t, 0), d - 1e-4) : ((l.t % d) + d) % d;
        a.setEffectiveWeight((l.w ?? 1) / sum);
      }
      mixer.update(0);
      root.updateMatrixWorld(true);
    },
    clipDur(name) { return acts[name] ? acts[name].getClip().duration : 1; },
    world(name, out = new THREE.Vector3()) { bones[name].getWorldPosition(out); return out; },
  };
  return rig;
}
