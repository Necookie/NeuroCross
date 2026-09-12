import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Procedural Canvas Textures (Philippine Famous Trademarks & Signage)
// ---------------------------------------------------------------------------
function createJollibeeSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // Vibrant Jollibee Red
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 512, 160);

  // Yellow trim
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillRect(0, 150, 512, 10);

  // Iconic Chef Bee face silhouette / graphic
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(80, 80, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(80, 80, 42, 0, Math.PI * 2);
  ctx.fill();

  // White chef hat graphic
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(80, 56, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Smiling face
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(80, 88, 22, 0, Math.PI);
  ctx.fill();

  // "Jollibee" Script Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 74px "Arial Black", Arial, sans-serif';
  ctx.fillText('Jollibee', 145, 105);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText('BIDA ANG SAYA! • DRIVE-THRU', 150, 138);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createJollibeePylonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 256, 512);

  // Yellow borders
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#facc15';
  ctx.strokeRect(6, 6, 244, 500);

  // Bee emblem
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(128, 120, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(128, 120, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 70px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JB', 128, 144);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Arial Black", Arial, sans-serif';
  ctx.fillText('Jollibee', 128, 240);

  // Drive thru badge
  ctx.fillStyle = '#facc15';
  ctx.fillRect(20, 275, 216, 55);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillText('DRIVE-THRU', 128, 312);

  // 24 Hours badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('OPEN 24 HOURS', 128, 385);
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText('BIDA ANG SAYA', 128, 435);

  return new THREE.CanvasTexture(canvas);
}

function createMcDoSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // McDonald's Crimson Red
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, 512, 160);

  // Golden Arches "M"
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(65, 95, 34, Math.PI, 0, false);
  ctx.arc(125, 95, 34, Math.PI, 0, false);
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#facc15';
  ctx.stroke();

  // White "McDonald's"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px "Arial Black", Arial, sans-serif';
  ctx.fillText("McDonald's", 175, 102);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText("LOVE KO 'TO • DRIVE-THRU", 180, 136);

  return new THREE.CanvasTexture(canvas);
}

function createMcDoPylonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, 256, 512);

  // Yellow frame
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 502);

  // Massive Golden Arches
  ctx.lineWidth = 22;
  ctx.strokeStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(90, 150, 42, Math.PI, 0, false);
  ctx.arc(166, 150, 42, Math.PI, 0, false);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("McDo", 128, 260);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(20, 295, 216, 55);
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillText('DRIVE-THRU', 128, 332);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText("LOVE KO 'TO", 128, 400);
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText('OPEN 24 HOURS', 128, 445);

  return new THREE.CanvasTexture(canvas);
}

function create7ElevenSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 160);

  // Tricolor stripes (Green, Red, Orange)
  ctx.fillStyle = '#15803d'; // Green
  ctx.fillRect(0, 0, 512, 28);
  ctx.fillStyle = '#dc2626'; // Red
  ctx.fillRect(0, 28, 512, 28);
  ctx.fillStyle = '#ea580c'; // Orange
  ctx.fillRect(0, 56, 512, 28);

  // White box with green trapezoid emblem
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(30, 95);
  ctx.lineTo(130, 95);
  ctx.lineTo(120, 150);
  ctx.lineTo(40, 150);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 50px "Arial Black", Arial, sans-serif';
  ctx.fillText('7', 68, 142);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 52px "Arial Black", Arial, sans-serif';
  ctx.fillText('ELEVEN', 145, 142);

  return new THREE.CanvasTexture(canvas);
}

function createMercuryDrugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 160);

  // Retro Green Medical Cross
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(45, 45, 60, 22);
  ctx.fillRect(64, 26, 22, 60);

  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(75, 56, 42, 0, Math.PI * 2);
  ctx.stroke();

  // Red serif brand typography
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 50px "Times New Roman", Times, serif';
  ctx.fillText('mercury drug', 140, 78);

  ctx.fillStyle = '#15803d';
  ctx.font = 'italic bold 20px Arial, sans-serif';
  ctx.fillText('Nakasisiguro Gamot ay Laging Bago', 142, 115);
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillText('24 HOURS • DRIVE-THRU PHARMACY', 142, 142);

  return new THREE.CanvasTexture(canvas);
}

function createBdoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // BDO Corporate Royal Blue
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 512, 160);

  // Bold Yellow BDO
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 85px "Arial Black", Arial, sans-serif';
  ctx.fillText('BDO', 45, 105);

  // Tagline
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 30px Arial, sans-serif';
  ctx.fillText('We find ways', 260, 75);

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText('24/7 ATM • ONLINE BANKING', 260, 118);

  return new THREE.CanvasTexture(canvas);
}

function createPetronCanopyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 128);

  // Blue & Red Stripes
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(0, 0, 512, 45);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 45, 512, 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Arial Black", Arial, sans-serif';
  ctx.fillText('PETRON', 30, 36);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('BLAZE 100 • XCS • TURBO DIESEL', 30, 100);

  return new THREE.CanvasTexture(canvas);
}

function createMangInasalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#14532d'; // Deep grill green
  ctx.fillRect(0, 0, 512, 160);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 60px "Arial Black", Arial, sans-serif';
  ctx.fillText('MANG INASAL', 40, 85);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.fillText('2-IN-1 SA LAKI, NUOT-SARAP! • UNLI-RICE', 45, 130);

  return new THREE.CanvasTexture(canvas);
}

function createSariSariTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ea580c';
  ctx.fillRect(0, 0, 256, 64);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText("ALING NENA'S SARI-SARI", 12, 28);
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('LOAD NA DITO • COLD SOFTDRINKS', 12, 52);

  return new THREE.CanvasTexture(canvas);
}

function createSkyscraperTexture(baseColor = '#1e293b', litColor = '#fef08a', unlitColor = '#334155') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 512);

  const cols = 12;
  const rows = 36;
  const padX = 6;
  const padY = 5;
  const winW = (256 - padX * (cols + 1)) / cols;
  const winH = (512 - padY * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = (c * 7 + r * 13) % 5 === 0 || (c * 3 + r * 17) % 7 === 1;
      ctx.fillStyle = isLit ? litColor : unlitColor;
      const x = padX + c * (winW + padX);
      const y = padY + r * (winH + padY);
      ctx.fillRect(x, y, winW, winH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBillboardTexture(type = 'telco') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (type === 'telco') {
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(430, 128, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px Arial, sans-serif';
    ctx.fillText('5G ULTRA', 36, 90);
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('NATIONWIDE SPEED', 38, 140);
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Unlimited Data • Metro Manila', 38, 195);
  } else if (type === 'tourism') {
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0d9488');
    grad.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillText('LOVE THE', 40, 85);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PHILIPPINES', 40, 145);
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Experience Tropical Paradise', 40, 200);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#ea580c');
    grad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.fillText('TODA TRICYCLE', 36, 85);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('TERMINAL QUEUE', 36, 145);
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#fed7aa';
    ctx.fillText('Minimum Fare ₱15 • Special Trip ₱50', 38, 200);
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);

  return new THREE.CanvasTexture(canvas);
}

// ---------------------------------------------------------------------------
// Shared Reusable Materials
// ---------------------------------------------------------------------------
const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e2421,
  roughness: 0.88,
  metalness: 0.08,
});

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x64746b, // Vast Urban Concrete Ground
  roughness: 0.95,
  metalness: 0.05,
});

const sidewalkMaterial = new THREE.MeshStandardMaterial({
  color: 0x94a398, // Manila pavement concrete
  roughness: 0.82,
  metalness: 0.1,
});

const curbMaterial = new THREE.MeshStandardMaterial({
  color: 0xcfdcd3,
  roughness: 0.6,
  metalness: 0.15,
});

const yellowLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xf59e0b,
});

const whitePaintMaterial = new THREE.MeshBasicMaterial({
  color: 0xf8fafc,
});

const dashedLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xe2e8f0,
});

const metalPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x334155,
  roughness: 0.45,
  metalness: 0.75,
});

const mmdaBlueMaterial = new THREE.MeshStandardMaterial({
  color: 0x0284c7,
  roughness: 0.4,
  metalness: 0.5,
});

const mmdaRoofMaterial = new THREE.MeshStandardMaterial({
  color: 0x0369a1,
  roughness: 0.3,
  metalness: 0.4,
});

const utilityPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x57534e,
  roughness: 0.9,
});

const wireMaterial = new THREE.LineBasicMaterial({
  color: 0x0f172a,
  linewidth: 1,
});

const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x0284c7,
  roughness: 0.1,
  metalness: 0.8,
});

const marbleMaterial = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.35,
  metalness: 0.15,
});

const goldTrimMaterial = new THREE.MeshStandardMaterial({
  color: 0xfacc15,
  roughness: 0.25,
  metalness: 0.9,
});

const towerGlassTex1 = createSkyscraperTexture('#0f2438', '#bae6fd', '#1e3a5f');
const towerGlassTex2 = createSkyscraperTexture('#134e4a', '#a7f3d0', '#064e3b');
const towerGlassTex3 = createSkyscraperTexture('#1e1b4b', '#fed7aa', '#312e81');

const skyscraperMat1 = new THREE.MeshStandardMaterial({
  map: towerGlassTex1,
  roughness: 0.25,
  metalness: 0.75,
});

const skyscraperMat2 = new THREE.MeshStandardMaterial({
  map: towerGlassTex2,
  roughness: 0.3,
  metalness: 0.7,
});

const skyscraperMat3 = new THREE.MeshStandardMaterial({
  map: towerGlassTex3,
  roughness: 0.35,
  metalness: 0.65,
});

// Pedestrian Palette
const skinMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xf3cca3, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0xdfa074, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0xbe7d4e, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x8a5229, roughness: 0.8 }),
];

const shirtMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 }),
  new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 }),
];

const pantsMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }),
];

const darkHairMaterial = new THREE.MeshStandardMaterial({
  color: 0x09090b,
  roughness: 0.9,
});

// Shared Geometries for Pedestrians
const pedHeadGeo = new THREE.SphereGeometry(0.3, 8, 8);
const pedHairGeo = new THREE.SphereGeometry(0.32, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
const pedTorsoGeo = new THREE.BoxGeometry(0.68, 0.86, 0.4);
const pedBackpackGeo = new THREE.BoxGeometry(0.44, 0.56, 0.22);
const pedHatGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.12, 8);

const pedLegGeo = new THREE.BoxGeometry(0.24, 1.15, 0.25);
pedLegGeo.translate(0, -0.55, 0);

const pedArmGeo = new THREE.BoxGeometry(0.18, 0.82, 0.18);
pedArmGeo.translate(0, -0.38, 0);

export class ThreeEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.roadGroup = new THREE.Group();
    this.propsGroup = new THREE.Group();
    this.lightsGroup = new THREE.Group();
    this.pedestriansGroup = new THREE.Group();

    this.rainParticles = null;
    this.trafficLights = [];
    this.pedestrianSignals = [];
    this.pedestrians = [];
    this.latestLightState = null;
    this.dirLight = null;

    this.graphicsOptions = {
      preset: 'high',
      shadows: 'pcfsoft',
      pedestrians: 'normal',
      drawDistance: 1600,
    };

    this.scene.add(this.roadGroup);
    this.scene.add(this.propsGroup);
    this.scene.add(this.lightsGroup);
    this.scene.add(this.pedestriansGroup);

    this._buildInfiniteFloor();
  }

  _buildInfiniteFloor() {
    // Massive Philippine Metro Floor (2000 x 2000 units, NO GridHelper!)
    const floorGeo = new THREE.PlaneGeometry(2000, 2000);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, groundMaterial);
    floor.position.y = -0.08;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  setGraphicsOptions(options = {}) {
    this.graphicsOptions = { ...this.graphicsOptions, ...options };

    // 1. Shadows toggle & resolution
    if (this.dirLight) {
      if (this.graphicsOptions.shadows === 'off') {
        this.dirLight.castShadow = false;
      } else {
        this.dirLight.castShadow = true;
        const res = this.graphicsOptions.shadows === 'basic' ? 1024 : 2048;
        this.dirLight.shadow.mapSize.width = res;
        this.dirLight.shadow.mapSize.height = res;
      }
    }

    // 2. Pedestrian Density
    if (this.pedestriansGroup) {
      if (this.graphicsOptions.pedestrians === 'off') {
        this.pedestriansGroup.visible = false;
      } else {
        this.pedestriansGroup.visible = true;
        const limit = this.graphicsOptions.pedestrians === 'dense' ? 36 : 22;
        this.pedestrians.forEach((p, idx) => {
          p.group.visible = idx < limit;
        });
      }
    }
  }

  setupAtmosphere(weather = 'sunny') {
    while (this.lightsGroup.children.length > 0) {
      const obj = this.lightsGroup.children[0];
      this.lightsGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    let sunColor = 0xfffdf2;
    let sunIntensity = 1.42;
    let skyColor = 0xdbeafe;
    let groundColor = 0x475569;
    let hemiIntensity = 0.9;

    if (weather === 'rain') {
      sunColor = 0xb4c8bd;
      sunIntensity = 0.65;
      skyColor = 0x94a3b8;
      groundColor = 0x334155;
      hemiIntensity = 0.6;
      this._createRain();
    } else if (weather === 'night') {
      sunColor = 0x1e293b;
      sunIntensity = 0.3;
      skyColor = 0x0f172a;
      groundColor = 0x020617;
      hemiIntensity = 0.4;
      this._removeRain();
    } else {
      this._removeRain();
    }

    const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
    hemiLight.position.set(0, 180, 0);

    const dirLight = new THREE.DirectionalLight(sunColor, sunIntensity);
    dirLight.position.set(100, 160, 75);
    dirLight.castShadow = this.graphicsOptions.shadows !== 'off';

    const mapSize = this.graphicsOptions.shadows === 'basic' ? 1024 : 2048;
    dirLight.shadow.mapSize.width = mapSize;
    dirLight.shadow.mapSize.height = mapSize;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 450;
    dirLight.shadow.camera.left = -220;
    dirLight.shadow.camera.right = 220;
    dirLight.shadow.camera.top = 220;
    dirLight.shadow.camera.bottom = -220;
    dirLight.shadow.bias = -0.0005;

    this.dirLight = dirLight;
    this.lightsGroup.add(hemiLight, dirLight);
    this._addStreetlightPoles(weather === 'night' || weather === 'rain');
  }

  _createRain() {
    if (this.rainParticles) return;
    const count = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 1] = Math.random() * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 450;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.65,
      transparent: true,
      opacity: 0.55,
    });

    this.rainParticles = new THREE.Points(geometry, material);
    this.scene.add(this.rainParticles);
  }

  _removeRain() {
    if (this.rainParticles) {
      this.scene.remove(this.rainParticles);
      this.rainParticles.geometry.dispose();
      this.rainParticles.material.dispose();
      this.rainParticles = null;
    }
  }

  updateRain(dt) {
    if (!this.rainParticles) return;
    const pos = this.rainParticles.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] -= dt * 85;
      if (pos[i] < 0) {
        pos[i] = 120;
      }
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Rebuilds layout based on type ('cross', 'roundabout', 'tintersection')
   */
  buildLayout(type = 'cross') {
    while (this.roadGroup.children.length > 0) {
      const o = this.roadGroup.children[0];
      this.roadGroup.remove(o);
      if (o.geometry) o.geometry.dispose();
    }
    while (this.propsGroup.children.length > 0) {
      const o = this.propsGroup.children[0];
      this.propsGroup.remove(o);
      if (o.geometry) o.geometry.dispose();
    }
    while (this.pedestriansGroup.children.length > 0) {
      const o = this.pedestriansGroup.children[0];
      this.pedestriansGroup.remove(o);
    }

    this.trafficLights = [];
    this.pedestrianSignals = [];
    this.pedestrians = [];

    if (type === 'roundabout') {
      this._buildRoundabout();
    } else if (type === 'tintersection') {
      this._buildTIntersection();
    } else {
      this._buildCrossroads();
    }
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 1: 4-Way Filipino Metropolitan Intersection (Extended 600 units)
  // ---------------------------------------------------------------------------
  _buildCrossroads() {
    const roadWidth = 96;
    const roadLen = 600; // Expanded to 600 units!

    // Horizontal Highway (East-West)
    const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(roadLen, roadWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    hRoad.receiveShadow = true;
    this.roadGroup.add(hRoad);

    // Vertical Highway (North-South)
    const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, roadLen).rotateX(-Math.PI / 2), asphaltMaterial);
    vRoad.receiveShadow = true;
    this.roadGroup.add(vRoad);

    // Double Solid Yellow Center Line (Philippine Standard)
    this._addDoubleYellowLines(0, 0, roadLen, 0, false);
    this._addDoubleYellowLines(0, 0, roadLen, 0, true);

    // Dashed White Lane Dividers
    this._addDashedLine(0, -24, roadLen, 0.45, 0);
    this._addDashedLine(0, 24, roadLen, 0.45, 0);
    this._addDashedLine(-24, 0, 0.45, roadLen, 0);
    this._addDashedLine(24, 0, 0.45, roadLen, 0);

    // Stop Bars
    const stopOffset = 48;
    this._addStopBar(-stopOffset, 24, 1.0, 48);
    this._addStopBar(stopOffset, -24, 1.0, 48);
    this._addStopBar(-24, -stopOffset, 48, 1.0);
    this._addStopBar(24, stopOffset, 48, 1.0);

    // Zebra Crosswalks
    this._addZebraCrosswalk(-stopOffset - 6, 0, 6, 96, true);
    this._addZebraCrosswalk(stopOffset + 6, 0, 6, 96, true);
    this._addZebraCrosswalk(0, -stopOffset - 6, 96, 6, false);
    this._addZebraCrosswalk(0, stopOffset + 6, 96, 6, false);

    // Sidewalk Platforms
    this._addSidewalkPlaza(-175, -175, 250, 250);
    this._addSidewalkPlaza(175, -175, 250, 250);
    this._addSidewalkPlaza(-175, 175, 250, 250);
    this._addSidewalkPlaza(175, 175, 250, 250);

    // Traffic Signal Gantries
    this._addSignalGantry(-stopOffset - 4, -48, 'south');
    this._addSignalGantry(stopOffset + 4, 48, 'north');
    this._addSignalGantry(-48, stopOffset + 4, 'east');
    this._addSignalGantry(48, -stopOffset - 4, 'west');

    // Pedestrian Signal Heads
    this._addPedestrianSignalHead(-stopOffset - 2, -50, 'EW', 0);
    this._addPedestrianSignalHead(-stopOffset - 2, 50, 'EW', Math.PI);
    this._addPedestrianSignalHead(stopOffset + 2, -50, 'EW', 0);
    this._addPedestrianSignalHead(stopOffset + 2, 50, 'EW', Math.PI);

    this._addPedestrianSignalHead(-50, -stopOffset - 2, 'NS', -Math.PI / 2);
    this._addPedestrianSignalHead(50, -stopOffset - 2, 'NS', Math.PI / 2);
    this._addPedestrianSignalHead(-50, stopOffset + 2, 'NS', -Math.PI / 2);
    this._addPedestrianSignalHead(50, stopOffset + 2, 'NS', Math.PI / 2);

    // Famous Philippine Trademarks & Skyrise Establishments
    // NW: Jollibee 2-Story Drive-Thru & 7-Eleven
    this._createJollibeeBuilding(-82, -82, 0);
    this._create7ElevenBuilding(-125, -60, 0);

    // NE: BDO Banking Pavilion & Mercury Drug & Petron Gas Station
    this._createBdoBankBuilding(82, -82, Math.PI);
    this._createMercuryDrugBuilding(135, -75, 0);
    this._createPetronGasStation(85, -150, 0);

    // SW: McDonald's with Golden Arches Pylon & Sari-Sari Store
    this._createMcDoBuilding(-82, 82, 0);
    this._createSariSariStall(-125, 60, Math.PI);

    // SE: Mang Inasal & TODA Tricycle Terminal
    this._createMangInasalBuilding(82, 82, Math.PI);
    this._createTodaTerminal(130, 65, 0);

    // High-Rise Skyscraper Towers
    this._buildSkyscrapersForLayout('cross');
    this._buildMMDAFootbridge(0, -84);
    this._buildBillboards('cross');
    this._buildUtilityPoles();
    this._buildPedestrians('cross');
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 2: Grand Philippine Rotunda (Welcome Rotonda / Monumento Style)
  // ---------------------------------------------------------------------------
  _buildRoundabout() {
    const ringInner = 36;
    const ringOuter = 72;
    const armLen = 500;
    const armWidth = 48;

    // Outer circular road
    const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, asphaltMaterial);
    ring.receiveShadow = true;
    this.roadGroup.add(ring);

    // Dashed circular middle lane divider
    const laneRingGeo = new THREE.RingGeometry(53.5, 54.5, 64);
    laneRingGeo.rotateX(-Math.PI / 2);
    const laneRing = new THREE.Mesh(laneRingGeo, dashedLineMaterial);
    laneRing.position.y = 0.02;
    this.roadGroup.add(laneRing);

    // 4 Extended Entry/Exit Avenues (600 units span)
    const northArm = new THREE.Mesh(new THREE.PlaneGeometry(armWidth, armLen).rotateX(-Math.PI / 2), asphaltMaterial);
    northArm.position.set(0, 0, -armLen / 2 - ringOuter + 20);
    const southArm = new THREE.Mesh(new THREE.PlaneGeometry(armWidth, armLen).rotateX(-Math.PI / 2), asphaltMaterial);
    southArm.position.set(0, 0, armLen / 2 + ringOuter - 20);
    const eastArm = new THREE.Mesh(new THREE.PlaneGeometry(armLen, armWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    eastArm.position.set(armLen / 2 + ringOuter - 20, 0, 0);
    const westArm = new THREE.Mesh(new THREE.PlaneGeometry(armLen, armWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    westArm.position.set(-armLen / 2 - ringOuter + 20, 0, 0);

    northArm.receiveShadow = true;
    southArm.receiveShadow = true;
    eastArm.receiveShadow = true;
    westArm.receiveShadow = true;
    this.roadGroup.add(northArm, southArm, eastArm, westArm);

    // Avenue Double Yellow Lines
    this._addDoubleYellowLines(0, -armLen / 2 - ringOuter + 20, armLen, 0, true);
    this._addDoubleYellowLines(0, armLen / 2 + ringOuter - 20, armLen, 0, true);
    this._addDoubleYellowLines(armLen / 2 + ringOuter - 20, 0, armLen, 0, false);
    this._addDoubleYellowLines(-armLen / 2 - ringOuter + 20, 0, armLen, 0, false);

    // Crosswalks on approaching avenues
    this._addZebraCrosswalk(0, -ringOuter - 10, 48, 6, false);
    this._addZebraCrosswalk(0, ringOuter + 10, 48, 6, false);
    this._addZebraCrosswalk(-ringOuter - 10, 0, 6, 48, true);
    this._addZebraCrosswalk(ringOuter + 10, 0, 6, 48, true);

    // Pedestrian Signals on Rotonda entries
    this._addPedestrianSignalHead(-26, -ringOuter - 8, 'NS', -Math.PI / 2);
    this._addPedestrianSignalHead(26, -ringOuter - 8, 'NS', Math.PI / 2);
    this._addPedestrianSignalHead(-26, ringOuter + 8, 'NS', -Math.PI / 2);
    this._addPedestrianSignalHead(26, ringOuter + 8, 'NS', Math.PI / 2);

    this._addPedestrianSignalHead(-ringOuter - 8, -26, 'EW', 0);
    this._addPedestrianSignalHead(-ringOuter - 8, 26, 'EW', Math.PI);
    this._addPedestrianSignalHead(ringOuter + 8, -26, 'EW', 0);
    this._addPedestrianSignalHead(ringOuter + 8, 26, 'EW', Math.PI);

    // ==========================================
    // Central Monument: Welcome Rotonda / Monumento Obelisk
    // ==========================================
    const monumentGroup = new THREE.Group();

    // Multi-tier circular marble base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(ringInner, ringInner + 1.0, 1.2, 48), curbMaterial);
    base1.position.y = 0.6;
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(ringInner * 0.85, ringInner * 0.85, 1.2, 48), marbleMaterial);
    base2.position.y = 1.8;

    // Shimmering Turquoise Water Fountain Ring
    const fountainPool = new THREE.Mesh(new THREE.CylinderGeometry(ringInner * 0.72, ringInner * 0.72, 0.4, 36), waterMaterial);
    fountainPool.position.y = 2.45;

    // 4 Grand Art-Deco Marble Pylons
    [-4.5, 4.5].forEach((px) => {
      [-4.5, 4.5].forEach((pz) => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(2.4, 32, 2.4), marbleMaterial);
        pylon.position.set(px, 18.5, pz);
        pylon.castShadow = true;
        monumentGroup.add(pylon);
      });
    });

    // Central Spire with Golden Eagle / Laurel Finial
    const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 36, 12), marbleMaterial);
    centralPillar.position.y = 20.5;

    const goldPeak = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 8), goldTrimMaterial);
    goldPeak.position.y = 41.5;

    monumentGroup.add(base1, base2, fountainPool, centralPillar, goldPeak);
    this.propsGroup.add(monumentGroup);

    // Surrounding Establishments Facing the Rotonda
    this._createJollibeeBuilding(-115, -115, 0.75);
    this._createMcDoBuilding(115, -115, -0.75);
    this._createMercuryDrugBuilding(-115, 115, 2.35);
    this._create7ElevenBuilding(115, 115, -2.35);
    this._createBdoBankBuilding(-145, 0, 1.57);
    this._createPetronGasStation(145, 0, -1.57);

    // Signal Gantries
    this._addSignalGantry(24, -ringOuter - 6, 'south');
    this._addSignalGantry(-24, ringOuter + 6, 'north');
    this._addSignalGantry(ringOuter + 6, 24, 'west');
    this._addSignalGantry(-ringOuter - 6, -24, 'east');

    this._buildSkyscrapersForLayout('roundabout');
    this._buildPedestrians('roundabout');
    this._buildUtilityPoles();
  }

  // ---------------------------------------------------------------------------
  // LAYOUT 3: Dense Philippine T-Junction (EDSA / Buendia Style)
  // ---------------------------------------------------------------------------
  _buildTIntersection() {
    const mainWidth = 84;
    const mainLen = 600;
    const stemWidth = 64;
    const stemLen = 300;

    // East-West Main Through Highway
    const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(mainLen, mainWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    mainRoad.position.set(0, 0, -30);
    mainRoad.receiveShadow = true;
    this.roadGroup.add(mainRoad);

    // South Stem Highway
    const stemRoad = new THREE.Mesh(new THREE.PlaneGeometry(stemWidth, stemLen).rotateX(-Math.PI / 2), asphaltMaterial);
    stemRoad.position.set(0, 0, 140);
    stemRoad.receiveShadow = true;
    this.roadGroup.add(stemRoad);

    // Double Yellow Center Lines
    this._addDoubleYellowLines(0, -30, mainLen, 0, false);
    this._addDoubleYellowLines(0, 140, stemLen, 0, true);

    // Stop Bars
    this._addStopBar(-46, -30, 1.0, mainWidth);
    this._addStopBar(46, -30, 1.0, mainWidth);
    this._addStopBar(0, 12, stemWidth, 1.0);

    // Crosswalks across all 3 branches
    this._addZebraCrosswalk(-54, -30, 6, mainWidth, true);
    this._addZebraCrosswalk(54, -30, 6, mainWidth, true);
    this._addZebraCrosswalk(0, 20, stemWidth, 6, false);

    // Pedestrian Signals
    this._addPedestrianSignalHead(-52, -30 - mainWidth / 2 - 2, 'EW', 0);
    this._addPedestrianSignalHead(-52, -30 + mainWidth / 2 + 2, 'EW', Math.PI);
    this._addPedestrianSignalHead(52, -30 - mainWidth / 2 - 2, 'EW', 0);
    this._addPedestrianSignalHead(52, -30 + mainWidth / 2 + 2, 'EW', Math.PI);

    this._addPedestrianSignalHead(-stemWidth / 2 - 2, 22, 'NS', -Math.PI / 2);
    this._addPedestrianSignalHead(stemWidth / 2 + 2, 22, 'NS', Math.PI / 2);

    // Traffic Signals
    this._addSignalGantry(-50, -75, 'east');
    this._addSignalGantry(50, 15, 'west');
    this._addSignalGantry(36, 18, 'north');

    // Establishments for T-Junction:
    // SW Corner: Jollibee Drive-Thru
    this._createJollibeeBuilding(-75, 75, 0);
    // SE Corner: McDonald's with Golden Arches Pylon & 7-Eleven
    this._createMcDoBuilding(75, 75, 0);
    this._create7ElevenBuilding(115, 65, 0);
    // North Side: Mercury Drug, BDO Bank & Petron
    this._createMercuryDrugBuilding(-75, -100, 0);
    this._createBdoBankBuilding(0, -100, 0);
    this._createPetronGasStation(95, -100, 0);

    // Overhead Footbridge over main highway
    this._buildMMDAFootbridge(-110, -30);
    this._buildSkyscrapersForLayout('tintersection');
    this._buildBillboards('tintersection');
    this._buildUtilityPoles();
    this._buildPedestrians('tintersection');
  }

  // ---------------------------------------------------------------------------
  // 3D Establishment Architectural Builders
  // ---------------------------------------------------------------------------
  _createJollibeeBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // 2-Story Main Store (Red & Cream)
    const buildingGeo = new THREE.BoxGeometry(28, 14, 24);
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const bMesh = new THREE.Mesh(buildingGeo, buildingMat);
    bMesh.position.y = 7;
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;

    // Yellow Roof Fascia
    const fascia = new THREE.Mesh(
      new THREE.BoxGeometry(29, 1.6, 25),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
    );
    fascia.position.y = 14.8;

    // Large Front Glass Picture Window
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 9),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, metalness: 0.9 })
    );
    glass.position.set(0, 5.5, 12.1);

    // Jollibee Storefront Sign
    const signTex = createJollibeeSignTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5.5), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 11.5, 12.15);

    // Tall Freestanding Totem Pylon Sign
    const pylonPole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 26, 8), metalPoleMaterial);
    pylonPole.position.set(16, 13, 14);

    const pylonTex = createJollibeePylonTexture();
    const pylonSign = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 0.8), new THREE.MeshBasicMaterial({ map: pylonTex }));
    pylonSign.position.set(16, 20, 14);

    // Red Outdoor Umbrellas & Patio Seating
    [-8, 8].forEach((ux) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), metalPoleMaterial);
      pole.position.set(ux, 1.6, 16);
      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(2.4, 1.0, 8),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
      );
      umbrella.position.set(ux, 3.2, 16);
      group.add(pole, umbrella);
    });

    group.add(bMesh, fascia, glass, sign, pylonPole, pylonSign);
    this.propsGroup.add(group);
  }

  _createMcDoBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // Modern Dark Charcoal & Red Brick Store
    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(28, 14, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
    );
    bMesh.position.y = 7;
    bMesh.castShadow = true;

    // Red Accent Band
    const redBand = new THREE.Mesh(
      new THREE.BoxGeometry(28.5, 3.5, 24.5),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 })
    );
    redBand.position.y = 10;

    // McDo Front Sign
    const signTex = createMcDoSignTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5.5), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 10, 12.3);

    // Giant Golden Arches ("M") Pylon Sign
    const pylonPole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 26, 8), metalPoleMaterial);
    pylonPole.position.set(-16, 13, 14);

    const pylonTex = createMcDoPylonTexture();
    const pylonSign = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 0.8), new THREE.MeshBasicMaterial({ map: pylonTex }));
    pylonSign.position.set(-16, 20, 14);

    group.add(bMesh, redBand, sign, pylonPole, pylonSign);
    this.propsGroup.add(group);
  }

  _create7ElevenBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(22, 10, 18),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 })
    );
    bMesh.position.y = 5;
    bMesh.castShadow = true;

    const signTex = create7ElevenSignTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(16, 4.2), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 7.5, 9.1);

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.8, 3.5),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 })
    );
    canopy.position.set(0, 5.2, 10.7);

    group.add(bMesh, sign, canopy);
    this.propsGroup.add(group);
  }

  _createMercuryDrugBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(24, 11, 20),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 })
    );
    bMesh.position.y = 5.5;
    bMesh.castShadow = true;

    const signTex = createMercuryDrugTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.8), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 8.2, 10.1);

    group.add(bMesh, sign);
    this.propsGroup.add(group);
  }

  _createBdoBankBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(26, 12, 22),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 })
    );
    bMesh.position.y = 6;
    bMesh.castShadow = true;

    const signTex = createBdoTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5.5), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 8.5, 11.1);

    group.add(bMesh, sign);
    this.propsGroup.add(group);
  }

  _createPetronGasStation(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // Station Canopy
    const canopyTex = createPetronCanopyTexture();
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(32, 1.4, 22),
      new THREE.MeshStandardMaterial({ map: canopyTex, roughness: 0.3 })
    );
    canopy.position.y = 9.0;
    canopy.castShadow = true;

    // 4 Support Columns
    [-11, 11].forEach((cx) => {
      [-6, 6].forEach((cz) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 9, 8), metalPoleMaterial);
        col.position.set(cx, 4.5, cz);
        group.add(col);
      });
    });

    // 4 Fuel Pump Islands
    [-7, 7].forEach((px) => {
      const island = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.4, 10),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 })
      );
      island.position.set(px, 0.2, 0);

      const pump = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.2, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.4 })
      );
      pump.position.set(px, 2.0, 0);

      group.add(island, pump);
    });

    group.add(canopy);
    this.propsGroup.add(group);
  }

  _createMangInasalBuilding(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const bMesh = new THREE.Mesh(
      new THREE.BoxGeometry(24, 11, 20),
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.6 })
    );
    bMesh.position.y = 5.5;
    bMesh.castShadow = true;

    const signTex = createMangInasalTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(18, 4.8), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 8.2, 10.1);

    group.add(bMesh, sign);
    this.propsGroup.add(group);
  }

  _createSariSariStall(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const stall = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5.0, 6),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 })
    );
    stall.position.y = 2.5;

    const tinRoof = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 0.3, 7.5),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.7 })
    );
    tinRoof.position.set(0, 5.2, 0);
    tinRoof.rotation.x = 0.15;

    const signTex = createSariSariTexture();
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 2.0), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 4.4, 3.1);

    group.add(stall, tinRoof, sign);
    this.propsGroup.add(group);
  }

  _createTodaTerminal(x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const shed = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
    );
    shed.position.y = 4.5;

    [-7, 7].forEach((sx) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.5, 6), metalPoleMaterial);
      leg.position.set(sx, 2.25, 0);
      group.add(leg);
    });

    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.8, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    sign.position.set(0, 4.2, 4.1);

    group.add(shed, sign);
    this.propsGroup.add(group);
  }

  // ---------------------------------------------------------------------------
  // City Skyscraper Skyline Builders
  // ---------------------------------------------------------------------------
  _buildSkyscrapersForLayout() {
    const towers = [
      // Major High-Rise Commercial Hub
      { x: -140, z: -140, w: 52, h: 110, d: 46, mat: skyscraperMat1, spire: true, helipad: true },
      { x: -190, z: -90, w: 42, h: 78, d: 38, mat: skyscraperMat2, spire: false, helipad: false },
      { x: -90, z: -190, w: 40, h: 72, d: 42, mat: skyscraperMat3, spire: false, helipad: false },

      { x: 140, z: -140, w: 54, h: 125, d: 50, mat: skyscraperMat2, spire: true, helipad: true },
      { x: 195, z: -85, w: 44, h: 86, d: 38, mat: skyscraperMat1, spire: false, helipad: false },
      { x: 85, z: -195, w: 42, h: 76, d: 40, mat: skyscraperMat3, spire: false, helipad: false },

      { x: -140, z: 140, w: 50, h: 96, d: 46, mat: skyscraperMat3, spire: true, helipad: false },
      { x: -190, z: 85, w: 40, h: 74, d: 38, mat: skyscraperMat1, spire: false, helipad: false },
      { x: -85, z: 190, w: 44, h: 82, d: 40, mat: skyscraperMat2, spire: false, helipad: true },

      { x: 140, z: 140, w: 52, h: 115, d: 48, mat: skyscraperMat1, spire: true, helipad: false },
      { x: 195, z: 90, w: 42, h: 80, d: 38, mat: skyscraperMat2, spire: false, helipad: false },
      { x: 90, z: 195, w: 40, h: 72, d: 42, mat: skyscraperMat3, spire: false, helipad: false },

      // Distant Metropolitan Backdrop Blocks (Extended Horizon)
      { x: -280, z: -280, w: 65, h: 140, d: 60, mat: skyscraperMat2, spire: true },
      { x: 280, z: -280, w: 70, h: 155, d: 65, mat: skyscraperMat1, spire: true },
      { x: -280, z: 280, w: 60, h: 130, d: 55, mat: skyscraperMat3, spire: false },
      { x: 280, z: 280, w: 68, h: 145, d: 60, mat: skyscraperMat2, spire: true },
    ];

    towers.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);

      const towerGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const towerMesh = new THREE.Mesh(towerGeo, b.mat);
      towerMesh.position.y = b.h / 2;
      towerMesh.castShadow = true;
      towerMesh.receiveShadow = true;
      bGroup.add(towerMesh);

      // Rooftop HVAC & Antenna Spire
      if (b.spire) {
        const mastGeo = new THREE.CylinderGeometry(0.3, 0.8, 24, 8);
        const mast = new THREE.Mesh(mastGeo, metalPoleMaterial);
        mast.position.y = b.h + 12;

        const beaconGeo = new THREE.SphereGeometry(0.7, 8, 8);
        const beacon = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        beacon.position.y = b.h + 24;

        bGroup.add(mast, beacon);
      }

      if (b.helipad) {
        const padGeo = new THREE.CylinderGeometry(b.w * 0.28, b.w * 0.28, 0.4, 24);
        const padMesh = new THREE.Mesh(
          padGeo,
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
        );
        padMesh.position.y = b.h + 0.2;

        const ringGeo = new THREE.RingGeometry(b.w * 0.22, b.w * 0.25, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        ring.position.y = b.h + 0.42;

        bGroup.add(padMesh, ring);
      }

      this.propsGroup.add(bGroup);
    });
  }

  // ---------------------------------------------------------------------------
  // Overhead MMDA Pedestrian Footbridge & Billboards
  // ---------------------------------------------------------------------------
  _buildMMDAFootbridge(centerX = 0, centerZ = -84) {
    const bridge = new THREE.Group();
    const bridgeY = 9.2;
    bridge.position.set(centerX, 0, centerZ);

    [-52, 52].forEach((colX) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, bridgeY, 12), mmdaBlueMaterial);
      col.position.set(colX, bridgeY / 2, 0);
      col.castShadow = true;
      bridge.add(col);
    });

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(108, 0.6, 4.8),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    deck.position.set(0, bridgeY, 0);
    deck.receiveShadow = true;

    [-2.2, 2.2].forEach((railZ) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(108, 1.4, 0.2), mmdaBlueMaterial);
      rail.position.set(0, bridgeY + 0.8, railZ);
      bridge.add(rail);
    });

    const roofGeo = new THREE.CylinderGeometry(2.8, 2.8, 108, 16, 1, true, 0, Math.PI);
    roofGeo.rotateZ(Math.PI / 2);
    roofGeo.rotateX(Math.PI);
    const roof = new THREE.Mesh(roofGeo, mmdaRoofMaterial);
    roof.position.set(0, bridgeY + 2.8, 0);

    [-53, 53].forEach((stairX) => {
      const dir = stairX < 0 ? -1 : 1;
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 4.2), mmdaBlueMaterial);
      ramp.position.set(stairX + dir * 8, bridgeY / 2, 0);
      ramp.rotation.z = dir * 0.45;
      bridge.add(ramp);
    });

    bridge.add(deck, roof);
    this.propsGroup.add(bridge);
  }

  _buildBillboards() {
    const billboards = [
      { x: -68, z: -135, rotY: 0.35, type: 'telco' },
      { x: 68, z: 135, rotY: -2.75, type: 'tourism' },
      { x: -135, z: 68, rotY: 1.85, type: 'terminal' },
    ];

    billboards.forEach((b) => {
      const group = new THREE.Group();
      group.position.set(b.x, 0, b.z);
      group.rotation.y = b.rotY;

      const mast = new THREE.Mesh(new THREE.BoxGeometry(2.2, 26, 2.2), metalPoleMaterial);
      mast.position.y = 13;
      mast.castShadow = true;

      const frame = new THREE.Mesh(new THREE.BoxGeometry(26, 13, 1.2), metalPoleMaterial);
      frame.position.set(0, 26, 0);

      const posterTex = createBillboardTexture(b.type);
      const poster = new THREE.Mesh(
        new THREE.PlaneGeometry(25, 12),
        new THREE.MeshBasicMaterial({ map: posterTex })
      );
      poster.position.set(0, 26, 0.65);

      group.add(mast, frame, poster);
      this.propsGroup.add(group);
    });
  }

  _buildUtilityPoles() {
    const poleCoords = [
      [-52, -28], [-52, -110],
      [52, -28], [52, -110],
      [-52, 28], [-52, 110],
      [52, 28], [52, 110],
    ];

    poleCoords.forEach(([px, pz]) => {
      const pole = new THREE.Group();
      pole.position.set(px, 0, pz);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 16, 8), utilityPoleMaterial);
      shaft.position.y = 8;
      shaft.castShadow = true;

      const crossarm1 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.35), metalPoleMaterial);
      crossarm1.position.set(0, 14.8, 0);

      const crossarm2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.35), metalPoleMaterial);
      crossarm2.position.set(0, 13.6, 0);

      const trans = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 0.85, 2.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.5 })
      );
      trans.position.set(1.2, 12.0, 0);

      pole.add(shaft, crossarm1, crossarm2, trans);
      this.propsGroup.add(pole);
    });

    const cablePairs = [
      [[-52, 14.8, -28], [-52, 14.8, -110]],
      [[52, 14.8, -28], [52, 14.8, -110]],
      [[-52, 14.8, 28], [-52, 14.8, 110]],
      [[52, 14.8, 28], [52, 14.8, 110]],
      [[-52, 15.0, -28], [52, 15.0, -28]],
      [[-52, 15.0, 28], [52, 15.0, 28]],
    ];

    cablePairs.forEach(([p1, p2]) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - 1.8, (p1[2] + p2[2]) / 2),
        new THREE.Vector3(p2[0], p2[1], p2[2])
      );
      const points = curve.getPoints(16);
      const cableGeo = new THREE.BufferGeometry().setFromPoints(points);
      const cableLine = new THREE.Line(cableGeo, wireMaterial);
      this.propsGroup.add(cableLine);
    });
  }

  _addStreetlightPoles(turnOnLights = false) {
    const lampPositions = [
      [-160, -54], [-90, -54], [-30, -54], [30, -54], [90, -54], [160, -54],
      [-160, 54], [-90, 54], [-30, 54], [30, 54], [90, 54], [160, 54],
      [-54, -160], [-54, -90], [-54, -30], [-54, 30], [-54, 90], [-54, 160],
      [54, -160], [54, -90], [54, -30], [54, 30], [54, 90], [54, 160],
    ];

    lampPositions.forEach(([x, z]) => {
      const pole = new THREE.Group();
      pole.position.set(x, 0, z);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 14, 8), metalPoleMaterial);
      shaft.position.y = 7;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 0.25), metalPoleMaterial);
      arm.position.set(x > 0 ? -2.0 : 2.0, 13.8, 0);

      const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.25, 0.8),
        new THREE.MeshBasicMaterial({ color: turnOnLights ? 0xfef08a : 0xcfdcd3 })
      );
      head.position.set(x > 0 ? -3.8 : 3.8, 13.6, 0);

      pole.add(shaft, arm, head);
      this.propsGroup.add(pole);
    });
  }

  // ---------------------------------------------------------------------------
  // Pedestrians & Locomotion Animation
  // ---------------------------------------------------------------------------
  _createPedestrianMesh(clothingIdx, pantsIdx, skinIdx, hasBackpack, hasHat) {
    const group = new THREE.Group();

    const skinMat = skinMaterials[skinIdx % skinMaterials.length];
    const shirtMat = shirtMaterials[clothingIdx % shirtMaterials.length];
    const pantsMat = pantsMaterials[pantsIdx % pantsMaterials.length];

    const head = new THREE.Mesh(pedHeadGeo, skinMat);
    head.position.y = 2.45;
    head.castShadow = true;

    if (hasHat) {
      const hat = new THREE.Mesh(pedHatGeo, shirtMat);
      hat.position.y = 2.65;
      group.add(hat);
    } else {
      const hair = new THREE.Mesh(pedHairGeo, darkHairMaterial);
      hair.position.y = 2.52;
      group.add(hair);
    }

    const torso = new THREE.Mesh(pedTorsoGeo, shirtMat);
    torso.position.y = 1.62;
    torso.castShadow = true;

    if (hasBackpack) {
      const backpack = new THREE.Mesh(pedBackpackGeo, pantsMat);
      backpack.position.set(0, 1.62, -0.28);
      group.add(backpack);
    }

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.18, 1.15, 0);
    const leftLegMesh = new THREE.Mesh(pedLegGeo, pantsMat);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.18, 1.15, 0);
    const rightLegMesh = new THREE.Mesh(pedLegGeo, pantsMat);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.45, 1.95, 0);
    const leftArmMesh = new THREE.Mesh(pedArmGeo, skinMat);
    leftArm.add(leftArmMesh);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.45, 1.95, 0);
    const rightArmMesh = new THREE.Mesh(pedArmGeo, skinMat);
    rightArm.add(rightArmMesh);

    group.add(head, torso, leftLeg, rightLeg, leftArm, rightArm);
    return { group, leftLeg, rightLeg, leftArm, rightArm };
  }

  _buildPedestrians() {
    this.pedestrians = [];

    const pedSpecs = [
      // Zebra Crosswalk Walkers
      { type: 'crosswalk', axis: 'EW', start: [-54, -46], end: [-54, 46], speed: 9.5, phase: 0.0, c: 0, p: 0, s: 0, b: true, h: false },
      { type: 'crosswalk', axis: 'EW', start: [-54, 46], end: [-54, -46], speed: 8.8, phase: 1.5, c: 1, p: 1, s: 1, b: false, h: true },
      { type: 'crosswalk', axis: 'EW', start: [-55, -25], end: [-55, 46], speed: 10.2, phase: 2.8, c: 2, p: 2, s: 2, b: false, h: false },
      { type: 'crosswalk', axis: 'EW', start: [54, -46], end: [54, 46], speed: 9.2, phase: 0.8, c: 4, p: 1, s: 0, b: true, h: true },
      { type: 'crosswalk', axis: 'EW', start: [54, 46], end: [54, -46], speed: 10.0, phase: 2.2, c: 5, p: 2, s: 1, b: false, h: false },

      { type: 'crosswalk', axis: 'NS', start: [-46, -54], end: [46, -54], speed: 9.4, phase: 0.4, c: 1, p: 1, s: 0, b: true, h: false },
      { type: 'crosswalk', axis: 'NS', start: [46, -54], end: [-46, -54], speed: 8.9, phase: 1.9, c: 2, p: 2, s: 1, b: false, h: true },
      { type: 'crosswalk', axis: 'NS', start: [-46, 54], end: [46, 54], speed: 9.0, phase: 0.7, c: 4, p: 1, s: 3, b: false, h: false },
      { type: 'crosswalk', axis: 'NS', start: [46, 54], end: [-46, 54], speed: 10.1, phase: 2.5, c: 5, p: 2, s: 0, b: true, h: true },

      // Overhead Footbridge Walkers
      { type: 'bridge', axis: 'none', start: [-50, -84], end: [50, -84], y: 9.4, speed: 8.4, phase: 0.0, c: 0, p: 0, s: 0, b: true, h: false },
      { type: 'bridge', axis: 'none', start: [50, -84], end: [-50, -84], y: 9.4, speed: 9.0, phase: 1.8, c: 1, p: 1, s: 1, b: false, h: true },
      { type: 'bridge', axis: 'none', start: [-20, -84.5], end: [50, -84.5], y: 9.4, speed: 10.0, phase: 3.1, c: 2, p: 2, s: 2, b: false, h: false },

      // Sidewalk Walkers (Passing Jollibee, McDo, 7-Eleven, Mercury Drug)
      { type: 'sidewalk', axis: 'none', start: [-65, -60], end: [-65, -145], speed: 8.0, phase: 0.5, c: 4, p: 0, s: 0, b: false, h: false },
      { type: 'sidewalk', axis: 'none', start: [-65, 60], end: [-65, 145], speed: 8.2, phase: 2.0, c: 5, p: 1, s: 1, b: true, h: false },
      { type: 'sidewalk', axis: 'none', start: [65, -60], end: [65, -145], speed: 7.8, phase: 3.4, c: 6, p: 2, s: 2, b: false, h: true },
      { type: 'sidewalk', axis: 'none', start: [65, 60], end: [65, 145], speed: 8.5, phase: 4.8, c: 0, p: 3, s: 3, b: true, h: false },
      { type: 'sidewalk', axis: 'none', start: [-75, -58], end: [-155, -58], speed: 8.2, phase: 1.2, c: 1, p: 0, s: 0, b: false, h: false },
      { type: 'sidewalk', axis: 'none', start: [75, 58], end: [155, 58], speed: 8.0, phase: 2.7, c: 2, p: 1, s: 1, b: false, h: false },
    ];

    pedSpecs.forEach((spec) => {
      const { group, leftLeg, rightLeg, leftArm, rightArm } = this._createPedestrianMesh(
        spec.c, spec.p, spec.s, spec.b, spec.h
      );

      const baseY = spec.y !== undefined ? spec.y : 0.2;
      group.position.set(spec.start[0], baseY, spec.start[1]);
      this.pedestriansGroup.add(group);

      const dx = spec.end[0] - spec.start[0];
      const dz = spec.end[1] - spec.start[1];
      const totalDist = Math.hypot(dx, dz) || 1;

      this.pedestrians.push({
        group,
        leftLeg,
        rightLeg,
        leftArm,
        rightArm,
        type: spec.type,
        axis: spec.axis,
        startPos: new THREE.Vector2(spec.start[0], spec.start[1]),
        endPos: new THREE.Vector2(spec.end[0], spec.end[1]),
        currentPos: new THREE.Vector2(spec.start[0], spec.start[1]),
        baseY,
        speed: spec.speed,
        walkPhase: spec.phase,
        progress: (spec.phase % Math.PI) / Math.PI,
        forward: true,
        isWaiting: false,
        totalDist,
      });
    });
  }

  updatePedestrians(dt, elapsedTime, lightState = this.latestLightState) {
    if (!this.pedestrians || this.pedestrians.length === 0) return;

    let isNSVehiclesGreen = false;
    let isEWVehiclesGreen = false;

    if (lightState) {
      if (typeof lightState === 'object') {
        if (lightState.north === 'GREEN' || lightState.south === 'GREEN') isNSVehiclesGreen = true;
        if (lightState.east === 'GREEN' || lightState.west === 'GREEN') isEWVehiclesGreen = true;
      } else if (typeof lightState === 'string') {
        if (lightState.includes('GREEN')) {
          if (lightState.startsWith('N_') || lightState.startsWith('S_') || lightState.startsWith('NS_')) {
            isNSVehiclesGreen = true;
          }
          if (lightState.startsWith('E_') || lightState.startsWith('W_') || lightState.startsWith('EW_')) {
            isEWVehiclesGreen = true;
          }
        }
      }
    }

    const nsPedWalk = !isNSVehiclesGreen;
    const ewPedWalk = !isEWVehiclesGreen;

    this.pedestrianSignals.forEach((sig) => {
      const isWalk = sig.axis === 'NS' ? nsPedWalk : ewPedWalk;
      sig.redLens.material.color.setHex(isWalk ? 0x450a0a : 0xdc2626);
      sig.greenLens.material.color.setHex(isWalk ? 0x22c55e : 0x052e16);
    });

    this.pedestrians.forEach((ped) => {
      let allowWalk = true;

      if (ped.type === 'crosswalk') {
        const pedCanCross = ped.axis === 'NS' ? nsPedWalk : ewPedWalk;
        const atCurb = ped.progress < 0.08 || ped.progress > 0.92;
        if (atCurb && !pedCanCross) {
          allowWalk = false;
        }
      }

      if (allowWalk) {
        ped.isWaiting = false;

        const step = (ped.speed * dt) / ped.totalDist;
        if (ped.forward) {
          ped.progress += step;
          if (ped.progress >= 1.0) {
            ped.progress = 1.0;
            ped.forward = false;
          }
        } else {
          ped.progress -= step;
          if (ped.progress <= 0.0) {
            ped.progress = 0.0;
            ped.forward = true;
          }
        }

        ped.currentPos.lerpVectors(ped.startPos, ped.endPos, ped.progress);
        ped.group.position.x = ped.currentPos.x;
        ped.group.position.z = ped.currentPos.y;

        const dirX = ped.forward
          ? ped.endPos.x - ped.startPos.x
          : ped.startPos.x - ped.endPos.x;
        const dirZ = ped.forward
          ? ped.endPos.y - ped.startPos.y
          : ped.startPos.y - ped.endPos.y;
        ped.group.rotation.y = Math.atan2(dirX, dirZ);

        ped.walkPhase += dt * ped.speed * 0.92;
        const swing = Math.sin(ped.walkPhase) * 0.52;

        ped.leftLeg.rotation.x = swing;
        ped.rightLeg.rotation.x = -swing;
        ped.leftArm.rotation.x = -swing * 0.75;
        ped.rightArm.rotation.x = swing * 0.75;

        // Micro-hip sway & subtle torso bounce
        ped.group.rotation.z = Math.sin(ped.walkPhase) * 0.02;
        ped.group.position.y = ped.baseY + Math.abs(Math.sin(ped.walkPhase * 2)) * 0.06;
      } else {
        ped.isWaiting = true;
        ped.leftLeg.rotation.x *= 0.82;
        ped.rightLeg.rotation.x *= 0.82;
        ped.leftArm.rotation.x *= 0.82;
        ped.rightArm.rotation.x *= 0.82;
        ped.group.rotation.z *= 0.85;
        ped.group.position.y = ped.baseY;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Road Marking & Signal Helpers
  // ---------------------------------------------------------------------------
  _addSidewalkPlaza(x, z, w, d) {
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, d), sidewalkMaterial);
    sidewalk.position.set(x, 0.15, z);
    sidewalk.receiveShadow = true;
    this.roadGroup.add(sidewalk);
  }

  _addDoubleYellowLines(x, z, length, angle, isVertical) {
    const w1 = isVertical ? 0.35 : length;
    const d1 = isVertical ? length : 0.35;
    const offset = 0.5;

    const m1 = new THREE.Mesh(new THREE.PlaneGeometry(w1, d1).rotateX(-Math.PI / 2), yellowLineMaterial);
    const m2 = new THREE.Mesh(new THREE.PlaneGeometry(w1, d1).rotateX(-Math.PI / 2), yellowLineMaterial);

    if (isVertical) {
      m1.position.set(x - offset, 0.03, z);
      m2.position.set(x + offset, 0.03, z);
    } else {
      m1.position.set(x, 0.03, z - offset);
      m2.position.set(x, 0.03, z + offset);
    }
    this.roadGroup.add(m1, m2);
  }

  _addDashedLine(x, z, w, d, angle = 0) {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, dashedLineMaterial);
    mesh.position.set(x, 0.02, z);
    if (angle) mesh.rotation.y = angle;
    this.roadGroup.add(mesh);
  }

  _addStopBar(x, z, w, d) {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, whitePaintMaterial);
    mesh.position.set(x, 0.03, z);
    this.roadGroup.add(mesh);
  }

  _addZebraCrosswalk(x, z, w, d, isVertical) {
    const group = new THREE.Group();
    group.position.set(x, 0.03, z);

    const stripes = 9;
    for (let i = 0; i < stripes; i++) {
      const sw = isVertical ? w : (w / stripes) * 0.55;
      const sd = isVertical ? (d / stripes) * 0.55 : d;
      const stripeGeo = new THREE.PlaneGeometry(sw, sd);
      stripeGeo.rotateX(-Math.PI / 2);
      const stripe = new THREE.Mesh(stripeGeo, whitePaintMaterial);

      if (isVertical) {
        stripe.position.set(0, 0, (i - stripes / 2) * (d / stripes));
      } else {
        stripe.position.set((i - stripes / 2) * (w / stripes), 0, 0);
      }
      group.add(stripe);
    }
    this.roadGroup.add(group);
  }

  _addSignalGantry(x, z, directionCode) {
    const gantry = new THREE.Group();
    gantry.position.set(x, 0, z);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 12, 8), metalPoleMaterial);
    mast.position.y = 6;
    mast.castShadow = true;

    const arm = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 0.5), metalPoleMaterial);
    arm.position.set(5, 11.5, 0);

    const housing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.0, 1.4), metalPoleMaterial);
    housing.position.set(10, 9.5, 0);

    const lensGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 12);
    lensGeo.rotateX(Math.PI / 2);

    const redLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    redLens.position.set(10, 11.0, 0.75);

    const amberLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0x451a03 }));
    amberLens.position.set(10, 9.5, 0.75);

    const greenLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0x052e16 }));
    greenLens.position.set(10, 8.0, 0.75);

    gantry.add(mast, arm, housing, redLens, amberLens, greenLens);
    this.roadGroup.add(gantry);

    this.trafficLights.push({
      direction: directionCode,
      redLens,
      amberLens,
      greenLens,
    });
  }

  _addPedestrianSignalHead(x, z, axis, rotationY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotationY;

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.0, 8), metalPoleMaterial);
    post.position.y = 2.5;

    const callBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    callBox.position.set(0, 1.4, 0.2);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.65), metalPoleMaterial);
    box.position.set(0, 4.4, 0);

    const redLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    redLens.position.set(0, 4.85, 0.34);

    const greenLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.55),
      new THREE.MeshBasicMaterial({ color: 0x052e16 })
    );
    greenLens.position.set(0, 3.95, 0.34);

    group.add(post, callBox, box, redLens, greenLens);
    this.roadGroup.add(group);

    this.pedestrianSignals.push({
      axis,
      redLens,
      greenLens,
    });
  }

  updateSignalStates(lightState) {
    if (!lightState) return;
    this.latestLightState = lightState;

    this.trafficLights.forEach((light) => {
      let state = 'RED';

      if (typeof lightState === 'object') {
        state = lightState[light.direction] || 'RED';
      } else if (typeof lightState === 'string') {
        const sepIdx = lightState.indexOf('_');
        const activeDir = lightState.slice(0, sepIdx);
        const phase = lightState.slice(sepIdx + 1);

        const dirMap = { N: 'north', S: 'south', E: 'east', W: 'west' };
        if (dirMap[activeDir] === light.direction) {
          state = phase === 'YELLOW' ? 'YELLOW' : phase === 'GREEN' ? 'GREEN' : 'RED';
        } else {
          state = 'RED';
        }
      }

      light.redLens.material.color.setHex(state === 'RED' ? 0xdc2626 : 0x450a0a);
      light.amberLens.material.color.setHex(state === 'YELLOW' ? 0xf59e0b : 0x451a03);
      light.greenLens.material.color.setHex(state === 'GREEN' ? 0x22c55e : 0x052e16);
    });
  }
}
