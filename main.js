import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ==========================================================================
   PRODUCT DATA — sourced from sambabrand.com's real catalog / categories
   ========================================================================== */
const PRODUCTS = [
  {
    id: 'five-of-a-kind',
    name: 'Five Of A Kind',
    tag: 'Prerolls · King Size',
    shape: 'preroll',
    color: 0x9d4edd,
    description:
      'Our signature five-strain variety pack of king-size pre-rolls — Purple, Red, Orange, Blue & Green Euphoria — hand-selected for a full spectrum of flavor and effect in every pack.',
    url: 'https://sambabrand.com/product-category/samba-brand/five-of-a-kind/',
  },
  {
    id: 'samba-mit-strawberry-blast',
    name: 'Samba MIT — Strawberry Blast',
    tag: 'MIT Tablets · 1,500mg / 5ct',
    shape: 'tablet',
    color: 0xc77dff,
    description:
      'Fast-dissolving MIT tablets infused with a bold strawberry blast flavor. Precisely dosed at 1,500mg across 5 tablets for a clean, consistent experience on the go.',
    url: 'https://sambabrand.com/product/samba-mit-tablets-strawberry-blast/',
  },
  {
    id: 'samba7-mamba7',
    name: 'Samba7 / Mamba7',
    tag: 'Hydroxy Tabs · 200mg',
    shape: 'bottle',
    color: 0xe0aaff,
    description:
      'The flagship hydroxy tablet line from Samba & Mamba — 200mg of premium potency in every bottle, crafted for those who want the strongest expression of the brand.',
    url: 'https://sambabrand.com/product-category/samba-brand/hydroxy/',
  },
  {
    id: 'double-stack-hummy',
    name: 'Double Stack Hummy',
    tag: 'Edibles · Gummies',
    shape: 'pouch',
    color: 0x9d4edd,
    description:
      'Double-stacked gummies layered with two flavors in every piece — think Candy Apple & Strawberry Shortcake, or Sour Blue Raspberry & Sour Watermelon. Sweet, sour, and always in twos.',
    url: 'https://sambabrand.com/product-category/samba-brand/double-stack-hummy/',
  },
  {
    id: 'thc-disposables',
    name: 'THC Disposables',
    tag: 'Vape · Disposable',
    shape: 'vape',
    color: 0xc77dff,
    description:
      'Sleek, ready-to-use disposable vapes in flavor pairs like Watermelon-Grape and Gelato-Melon. No charging, no refilling — just smooth, portable vapor whenever you need it.',
    url: 'https://sambabrand.com/product-category/samba-brand/thc-disposable/',
  },
  {
    id: 'four-of-a-kind',
    name: 'Four Of A Kind',
    tag: 'Prerolls · King Size',
    shape: 'preroll',
    color: 0xe0aaff,
    description:
      'A tightly curated four-strain pack of king-size pre-rolls featuring house favorites like Jealousy, Sky Walker OG, Runtz & Blue Dream — built for a well-rounded rotation.',
    url: 'https://sambabrand.com/product-category/mamba-brand/four-of-a-kind-mamba-brand/',
  },
];

/* ==========================================================================
   AGE GATE
   ========================================================================== */
const ageGate = document.getElementById('age-gate');
const denied = document.getElementById('denied');
const app = document.getElementById('app');

function enterSite() {
  ageGate.classList.add('hidden');
  app.classList.remove('hidden');
  try { sessionStorage.setItem('sm_age_verified', '1'); } catch (e) {}
  initExperience();
}

document.getElementById('age-yes').addEventListener('click', enterSite);
document.getElementById('age-no').addEventListener('click', () => {
  ageGate.classList.add('hidden');
  denied.classList.remove('hidden');
});

// Skip the gate if verified earlier this session
try {
  if (sessionStorage.getItem('sm_age_verified') === '1') {
    enterSite();
  }
} catch (e) {
  // sessionStorage unavailable — always show the gate
}

/* ==========================================================================
   3D EXPERIENCE (only initialized after age verification)
   ========================================================================== */
let experienceStarted = false;

function initExperience() {
  if (experienceStarted) return;
  experienceStarted = true;

  const canvas = document.getElementById('scene');
  const hero = document.getElementById('hero');
  const bottomHint = document.getElementById('bottom-hint') || document.querySelector('.bottom-hint');
  const loadingEl = document.getElementById('loading');

  /* ---------------- Renderer ---------------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ---------------- Scene & fog ---------------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05030a);
  scene.fog = new THREE.FogExp2(0x0a0614, 0.018);

  /* ---------------- Camera ---------------- */
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 1.4, 13);

  /* ---------------- Controls ---------------- */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 22;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.72;
  controls.target.set(0, 0.6, 0);

  /* ---------------- Lighting ---------------- */
  const ambient = new THREE.AmbientLight(0x3a1f5c, 0.6);
  scene.add(ambient);

  const purpleLight = new THREE.PointLight(0x9d4edd, 60, 30, 2);
  purpleLight.position.set(-6, 5, 4);
  scene.add(purpleLight);

  const pinkLight = new THREE.PointLight(0xe0aaff, 55, 30, 2);
  pinkLight.position.set(7, 3, -4);
  scene.add(pinkLight);

  const keyLight = new THREE.SpotLight(0xffffff, 25, 40, Math.PI / 5, 0.5, 1.5);
  keyLight.position.set(0, 12, 6);
  keyLight.target.position.set(0, 0, 0);
  scene.add(keyLight, keyLight.target);

  const rimLight = new THREE.PointLight(0xc77dff, 30, 25, 2);
  rimLight.position.set(0, -4, -6);
  scene.add(rimLight);

  /* ---------------- Ground glow disc ---------------- */
  const glowDiscGeo = new THREE.CircleGeometry(9, 64);
  const glowDiscMat = new THREE.MeshBasicMaterial({
    color: 0x9d4edd,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const glowDisc = new THREE.Mesh(glowDiscGeo, glowDiscMat);
  glowDisc.rotation.x = -Math.PI / 2;
  glowDisc.position.y = -3.4;
  scene.add(glowDisc);

  /* ---------------- Background particles ---------------- */
  const particles = createParticleField();
  scene.add(particles);

  /* ---------------- Product ring ---------------- */
  const productGroup = new THREE.Group();
  scene.add(productGroup);

  const productMeshes = [];
  const RADIUS = 5.6;
  const COUNT = PRODUCTS.length;

  PRODUCTS.forEach((product, i) => {
    const angle = (i / COUNT) * Math.PI * 2;
    const mesh = buildProductMesh(product);

    mesh.position.set(
      Math.cos(angle) * RADIUS,
      0,
      Math.sin(angle) * RADIUS
    );
    mesh.lookAt(0, mesh.position.y, 0);
    mesh.rotateY(Math.PI / 2);

    mesh.userData.product = product;
    mesh.userData.baseY = mesh.position.y;
    mesh.userData.floatOffset = Math.random() * Math.PI * 2;
    mesh.userData.floatSpeed = 0.6 + Math.random() * 0.3;
    mesh.userData.spinSpeed = 0.25 + Math.random() * 0.2;
    mesh.userData.targetScale = 1;
    mesh.userData.baseScale = mesh.scale.x;

    // soft glow light attached to each product
    const glow = new THREE.PointLight(product.color, 4, 6, 2);
    glow.position.set(0, 0, 0);
    mesh.add(glow);

    productGroup.add(mesh);
    productMeshes.push(mesh);
  });

  /* ---------------- Raycasting / interaction ---------------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selectedMesh = null;
  let hoveredMesh = null;

  function getIntersectableList() {
    return productMeshes;
  }

  function onPointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(getIntersectableList(), true);
    const hitMesh = hits.length ? findProductRoot(hits[0].object) : null;

    if (hitMesh !== hoveredMesh) {
      hoveredMesh = hitMesh;
      renderer.domElement.style.cursor = hoveredMesh ? 'pointer' : 'grab';
    }
  }

  function onPointerDown(event) {
    // ignore drags — only treat as click if released near same spot
    downPos.x = event.clientX;
    downPos.y = event.clientY;
  }

  const downPos = { x: 0, y: 0 };

  function onPointerUp(event) {
    const dx = event.clientX - downPos.x;
    const dy = event.clientY - downPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 6) return; // was a drag, not a click

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(getIntersectableList(), true);

    if (hits.length) {
      const root = findProductRoot(hits[0].object);
      if (root) selectProduct(root);
    } else {
      deselectProduct();
    }
  }

  function findProductRoot(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.product) return o;
      o = o.parent;
    }
    return null;
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  /* ---------------- Info panel ---------------- */
  const infoPanel = document.getElementById('info-panel');
  const infoTag = document.getElementById('info-tag');
  const infoTitle = document.getElementById('info-title');
  const infoDesc = document.getElementById('info-desc');
  const infoCta = document.getElementById('info-cta');
  const infoClose = document.getElementById('info-close');
  const heroEl = hero;
  const hintEl = document.querySelector('.bottom-hint');

  function selectProduct(mesh) {
    if (selectedMesh) selectedMesh.userData.targetScale = selectedMesh.userData.baseScale;
    selectedMesh = mesh;
    mesh.userData.targetScale = mesh.userData.baseScale * 1.28;

    const p = mesh.userData.product;
    infoTag.textContent = p.tag;
    infoTitle.textContent = p.name;
    infoDesc.textContent = p.description;
    infoCta.href = p.url || 'https://sambabrand.com';

    infoPanel.classList.remove('hidden');
    heroEl.style.opacity = '0';
    heroEl.style.pointerEvents = 'none';
    if (hintEl) hintEl.style.opacity = '0';

    controls.autoRotate = false;
  }

  function deselectProduct() {
    if (selectedMesh) selectedMesh.userData.targetScale = selectedMesh.userData.baseScale;
    selectedMesh = null;
    infoPanel.classList.add('hidden');
    heroEl.style.opacity = '1';
    heroEl.style.pointerEvents = 'none'; // hero text is decorative, never blocks clicks
    if (hintEl) hintEl.style.opacity = '0.75';
    controls.autoRotate = true;
  }

  infoClose.addEventListener('click', deselectProduct);

  /* ---------------- Post-processing (bloom for glow) ---------------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.85, // strength
    0.6,  // radius
    0.15  // threshold
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  /* ---------------- Resize ---------------- */
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloomPass.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ---------------- Animate loop ---------------- */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // float + spin each product
    productMeshes.forEach((mesh) => {
      const d = mesh.userData;
      mesh.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 0.35;
      mesh.rotation.y += d.spinSpeed * 0.01;

      const s = THREE.MathUtils.lerp(mesh.scale.x, d.targetScale, 0.12);
      mesh.scale.set(s, s, s);
    });

    // slow ring rotation for cinematic feel
    productGroup.rotation.y = t * 0.03;

    // drift particles
    particles.rotation.y = t * 0.015;

    // gentle light movement
    purpleLight.position.x = Math.sin(t * 0.25) * 7;
    purpleLight.position.z = Math.cos(t * 0.25) * 5;
    pinkLight.position.x = Math.cos(t * 0.2) * -7;
    pinkLight.position.z = Math.sin(t * 0.2) * -5;

    controls.update();
    composer.render();
  }

  // fade out loading screen once the first frame is ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loadingEl.classList.add('done');
    });
  });

  animate();
}

/* ==========================================================================
   HELPERS — geometry / textures
   ========================================================================== */

function buildProductMesh(product) {
  const group = new THREE.Group();
  const color = new THREE.Color(product.color);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x1a1024,
    metalness: 0.35,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    emissive: color,
    emissiveIntensity: 0.22,
  });

  const accentMaterial = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.5,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.5,
  });

  let bodyScale = 1;

  switch (product.shape) {
    case 'preroll': {
      // slim package box standing upright, with a cap accent
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.5, 0.32), material);
      box.material.map = makeLabelTexture(product);
      box.material.needsUpdate = true;
      group.add(box);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.14, 0.34), accentMaterial);
      cap.position.y = 0.82;
      group.add(cap);
      bodyScale = 1;
      break;
    }
    case 'tablet': {
      // blister-pack style flattened rounded box
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 0.22), material);
      box.material.map = makeLabelTexture(product);
      box.material.needsUpdate = true;
      group.add(box);
      const strip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.14, 0.24), accentMaterial);
      strip.position.y = -0.35;
      group.add(strip);
      bodyScale = 1;
      break;
    }
    case 'bottle': {
      // supplement-style bottle with cap
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.2, 32), material);
      body.material.map = makeLabelTexture(product);
      body.material.needsUpdate = true;
      group.add(body);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.22, 32), accentMaterial);
      neck.position.y = 0.71;
      group.add(neck);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.26, 32), accentMaterial);
      cap.position.y = 0.95;
      group.add(cap);
      bodyScale = 1;
      break;
    }
    case 'pouch': {
      // edibles pouch — flattened rounded box, slightly puffed
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, 0.28), material);
      box.material.map = makeLabelTexture(product);
      box.material.needsUpdate = true;
      group.add(box);
      const seal = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 0.3), accentMaterial);
      seal.position.y = 0.75;
      group.add(seal);
      bodyScale = 1;
      break;
    }
    case 'vape': {
      // disposable vape pen
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.35, 24), material);
      body.material.map = makeLabelTexture(product);
      body.material.needsUpdate = true;
      group.add(body);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.22, 24), accentMaterial);
      tip.position.y = 0.78;
      group.add(tip);
      const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.16, 24), accentMaterial);
      mouth.position.y = 0.96;
      group.add(mouth);
      bodyScale = 1;
      break;
    }
    default: {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1.3, 0.3), material);
      box.material.map = makeLabelTexture(product);
      group.add(box);
    }
  }

  group.userData.baseScaleFactor = bodyScale;
  group.scale.setScalar(1);
  return group;
}

// Generates a canvas texture used as the "front label" for each product
function makeLabelTexture(product) {
  const w = 512;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#150c22');
  grad.addColorStop(1, '#241333');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // border glow
  ctx.strokeStyle = '#e0aaff';
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, w - 24, h - 24);
  ctx.globalAlpha = 1;

  // brand wordmark
  ctx.fillStyle = '#e0aaff';
  ctx.font = '700 34px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SAMBA & MAMBA', w / 2, 90);

  // divider
  ctx.fillStyle = 'rgba(224,170,255,0.4)';
  ctx.fillRect(w / 2 - 60, 115, 120, 3);

  // product name (wrapped)
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 46px Arial';
  wrapText(ctx, product.name.toUpperCase(), w / 2, h / 2 - 20, w - 90, 52);

  // tag
  ctx.fillStyle = '#c77dff';
  ctx.font = '600 26px Arial';
  ctx.fillText(product.tag, w / 2, h - 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

// Soft circular sprite used for glowing particles
function makeParticleSprite() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(224,170,255,0.7)');
  grad.addColorStop(1, 'rgba(157,78,221,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createParticleField() {
  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const palette = [
    new THREE.Color(0x9d4edd),
    new THREE.Color(0xc77dff),
    new THREE.Color(0xe0aaff),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < COUNT; i++) {
    const radius = 6 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.11,
    map: makeParticleSprite(),
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.85,
  });

  return new THREE.Points(geometry, material);
}
