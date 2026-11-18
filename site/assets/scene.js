/* CrateSort — scène 3D du haut de page : un bac de vinyles, un disque qui en sort et tourne. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js';

const stage = document.querySelector('.stage');
const canvas = document.getElementById('scene');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LIME = 0xc6f04b;

function fail() { stage && stage.classList.add('no3d'); }

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.6, 12.5); camera.lookAt(0, 0.45, 0);

  /* Lumières : douce + clé + liseré citron */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x101114, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(4, 6, 6); scene.add(key);
  const rim = new THREE.PointLight(LIME, 40, 18); rim.position.set(-3.5, 2.5, -2.5); scene.add(rim);
  const fill = new THREE.PointLight(0x7c9cff, 14, 16); fill.position.set(4, -2, 3); scene.add(fill);

  /* Texture de vinyle : sillons + étiquette */
  function vinylTexture(label) {
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const g = c.getContext('2d'), m = 256;
    g.fillStyle = '#0c0c0e'; g.beginPath(); g.arc(m, m, 256, 0, Math.PI * 2); g.fill();
    for (let r = 250; r > 96; r -= 2.2) { g.strokeStyle = `rgba(255,255,255,${0.025 + Math.random() * 0.035})`; g.lineWidth = 1; g.beginPath(); g.arc(m, m, r, 0, Math.PI * 2); g.stroke(); }
    const sh = g.createLinearGradient(0, 0, 512, 512);
    sh.addColorStop(0.35, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,.10)'); sh.addColorStop(0.65, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.beginPath(); g.arc(m, m, 250, 0, Math.PI * 2); g.fill();
    g.fillStyle = label; g.beginPath(); g.arc(m, m, 92, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#131a03'; g.font = '700 34px Inter, Arial, sans-serif'; g.textAlign = 'center'; g.fillText('CrateSort', m, m - 18);
    g.font = '500 20px Inter, Arial, sans-serif'; g.fillText('pour DJ', m, m + 22);
    g.fillStyle = '#0c0c0e'; g.beginPath(); g.arc(m, m, 9, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  const edge = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.35, metalness: 0.2 });
  function vinyl(label) {
    const face = new THREE.MeshStandardMaterial({ map: vinylTexture(label), roughness: 0.32, metalness: 0.25 });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.04, 96, 1), [edge, face, face]);
    m.rotation.x = Math.PI / 2; // face vers la caméra
    const g = new THREE.Group(); g.add(m); return g;
  }

  /* Le bac */
  const crate = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: LIME, roughness: 0.55, metalness: 0.05 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x9fc435, roughness: 0.6 });
  const W = 4.2, H = 1.9, D = 2.6, T = 0.14;
  const box = (w, h, d, mat, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); b.position.set(x, y, z); crate.add(b); return b; };
  box(W, T, D, dark, 0, -H / 2, 0);               // fond
  box(W, H * 0.62, T, wood, 0, -H * 0.19, D / 2);  // face avant (basse, on voit les disques)
  box(W, H, T, dark, 0, 0, -D / 2);               // dos
  box(T, H, D, wood, -W / 2, 0, 0);               // côtés
  box(T, H, D, wood, W / 2, 0, 0);
  // poignée creusée sur la face avant
  const slot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.22, 0.05), new THREE.MeshStandardMaterial({ color: 0x131a03, roughness: 0.8 }));
  slot.position.set(0, -H * 0.2, D / 2 + T / 2 + 0.005); crate.add(slot);

  /* Disques rangés dans le bac */
  const labels = ['#c6f04b', '#ff7a59', '#38d6f5', '#9b7bff', '#ffb547', '#3ee6a8', '#ff6bd0'];
  const stack = [];
  for (let i = 0; i < 7; i++) {
    const v = vinyl(labels[i]); const z = -D / 2 + 0.38 + i * 0.3;
    v.position.set(0, 0.48, z); v.rotation.x = -0.12 + i * 0.015; v.scale.setScalar(0.98);
    crate.add(v); stack.push(v);
  }
  /* Le disque qui sort du bac */
  const hero = vinyl('#c6f04b');
  hero.position.set(0.25, 2.15, 0.35);
  crate.add(hero);

  const world = new THREE.Group(); world.add(crate); scene.add(world);
  world.rotation.set(0.18, -0.55, 0);
  crate.position.y = -0.15;

  /* Ombre au sol */
  const sc2 = document.createElement('canvas'); sc2.width = sc2.height = 256;
  const sg = sc2.getContext('2d'), rg = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = rg; sg.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc2), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.12; scene.add(shadow);

  /* Taille */
  function size() {
    const r = stage.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  }
  addEventListener('resize', size); size();

  /* Souris et défilement */
  let mx = 0, my = 0, tx = 0, ty = 0, sc = 0;
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  addEventListener('scroll', () => { sc = Math.min(1, scrollY / innerHeight); }, { passive: true });

  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);

  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    world.rotation.y = -0.55 + tx * 0.6 + sc * 0.9;
    world.rotation.x = 0.18 + ty * 0.25;
    hero.position.y = 2.15 + Math.sin(t * 1.4) * 0.12 + sc * 0.5;
    hero.children[0].rotation.y = t * 1.6;        // le disque tourne sur lui-même
    hero.rotation.z = Math.sin(t * 0.7) * 0.06;
    stack.forEach((v, i) => { v.rotation.x = -0.12 + i * 0.015 + Math.sin(t * 1.2 + i * 0.6) * 0.012; });
    renderer.render(scene, camera);
  }
  if (still) frame();
  else renderer.setAnimationLoop(() => { if (visible) frame(); });
} catch (e) {
  console.warn('3D indisponible', e); fail();
}
