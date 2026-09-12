import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Procedural Canvas Textures (High Performance, Zero Network Requests)
// ---------------------------------------------------------------------------
function createSkyscraperTexture(baseColor = '#1e293b', litColor = '#fef08a', unlitColor = '#334155') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background facade
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 512);

  // Window Grid
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
    // 5G Network Telco Ad (Manila / Smart / Globe vibe)
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
  } else if (type === 'fastfood') {
    // Tropical Fried Chicken / Mango Quencher Ad
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#b91c1c');
    grad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 46px Arial, sans-serif';
    ctx.fillText('CHICKEN JOY &', 34, 88);
    ctx.fillStyle = '#fef08a';
    ctx.fillText('MANGO FLOAT', 34, 146);
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Langhap-Sarap Panlasang Pinoy', 36, 202);
  } else {
    // Tourism Campaign Ad
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
  }

  // Border frame
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);

  return new THREE.CanvasTexture(canvas);
}

function createConvenienceSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Striped canopy
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 64);
  const stripes = ['#15803d', '#dc2626', '#ea580c', '#ffffff'];
  stripes.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * 64, 0, 64, 20);
  });

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('24/7 MART & CAFE', 18, 48);

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

// ---------------------------------------------------------------------------
// Shared Materials
// ---------------------------------------------------------------------------
const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e2421, // Authentic weathered urban asphalt
  roughness: 0.88,
  metalness: 0.08,
});

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x64746b, // Broad urban concrete / base
  roughness: 0.95,
  metalness: 0.05,
});

const sidewalkMaterial = new THREE.MeshStandardMaterial({
  color: 0x94a398, // Manila pavement concrete
  roughness: 0.82,
  metalness: 0.1,
});

const curbMaterial = new THREE.MeshStandardMaterial({
  color: 0xcfdcd3, // Stone kerb
  roughness: 0.6,
  metalness: 0.15,
});

const yellowLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xf59e0b, // Philippine double yellow center line standard
});

const whitePaintMaterial = new THREE.MeshBasicMaterial({
  color: 0xf8fafc,
});

const dashedLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xe2e8f0,
});

const metalPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x334155, // Galvanized metal pole
  roughness: 0.45,
  metalness: 0.75,
});

const mmdaBlueMaterial = new THREE.MeshStandardMaterial({
  color: 0x0284c7, // MMDA Blue steel framework
  roughness: 0.4,
  metalness: 0.5,
});

const mmdaRoofMaterial = new THREE.MeshStandardMaterial({
  color: 0x0369a1,
  roughness: 0.3,
  metalness: 0.4,
});

const utilityPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x57534e, // Weathered concrete utility pole
  roughness: 0.9,
});

const wireMaterial = new THREE.LineBasicMaterial({
  color: 0x0f172a, // Black overhead telecom/power wire
  linewidth: 1,
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

const skyscraperConcreteMat = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0, // White precast concrete panels
  roughness: 0.75,
  metalness: 0.15,
});

// Pedestrian Palette
const skinMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xf3cca3, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0xdfa074, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0xbe7d4e, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x8a5229, roughness: 0.8 }),
];

const shirtMaterials = [
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), // White linen / barong
  new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 }), // Royal blue
  new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 }), // Crimson red
  new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 }), // Sunburst yellow
  new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }), // Emerald green
  new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.7 }), // Violet
  new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 }), // Tangerine
  new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 }), // Navy
];

const pantsMaterials = [
  new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }), // Black / dark pants
  new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }), // Blue jeans
  new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 }), // Khaki
  new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }), // Slate
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

// Pivot-aligned limb geometries
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

    this.scene.add(this.roadGroup);
    this.scene.add(this.propsGroup);
    this.scene.add(this.lightsGroup);
    this.scene.add(this.pedestriansGroup);

    this._buildInfiniteFloor();
  }

  _buildInfiniteFloor() {
    // Expansive Urban Base Tarmac / Concrete Ground (No GridHelper!)
    const floorGeo = new THREE.PlaneGeometry(1200, 1200);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, groundMaterial);
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  /**
   * Sets up lighting according to atmospheric weather
   * High performance: 1 Directional Sun + 1 Soft Hemisphere bounce
   */
  setupAtmosphere(weather = 'sunny') {
    while (this.lightsGroup.children.length > 0) {
      const obj = this.lightsGroup.children[0];
      this.lightsGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    let sunColor = 0xfffdf2;
    let sunIntensity = 1.38;
    let skyColor = 0xe0f2fe;
    let groundColor = 0x475569;
    let hemiIntensity = 0.88;

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
    hemiLight.position.set(0, 150, 0);

    const dirLight = new THREE.DirectionalLight(sunColor, sunIntensity);
    dirLight.position.set(80, 140, 60);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 380;
    dirLight.shadow.camera.left = -160;
    dirLight.shadow.camera.right = 160;
    dirLight.shadow.camera.top = 160;
    dirLight.shadow.camera.bottom = -160;
    dirLight.shadow.bias = -0.0006;

    this.lightsGroup.add(hemiLight, dirLight);
    this._addStreetlightPoles(weather === 'night' || weather === 'rain');
  }

  _createRain() {
    if (this.rainParticles) return;
    const count = 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 380;
      positions[i * 3 + 1] = Math.random() * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 380;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.6,
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
      pos[i] -= dt * 80;
      if (pos[i] < 0) {
        pos[i] = 110;
      }
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Rebuilds roads, Filipino skyscraper props, signals, and pedestrians
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

    this._buildFilipinoCitySkyline();
    this._buildMMDAFootbridge();
    this._buildBillboards();
    this._buildUtilityPoles();
    this._buildPedestrians();
  }

  // ---------------------------------------------------------------------------
  // 1. 4-Way Filipino Metropolitan Intersection Layout
  // ---------------------------------------------------------------------------
  _buildCrossroads() {
    const roadWidth = 96;
    const roadLen = 420;

    // Horizontal Highway (East-West)
    const hRoadGeo = new THREE.PlaneGeometry(roadLen, roadWidth);
    hRoadGeo.rotateX(-Math.PI / 2);
    const hRoad = new THREE.Mesh(hRoadGeo, asphaltMaterial);
    hRoad.receiveShadow = true;
    this.roadGroup.add(hRoad);

    // Vertical Highway (North-South)
    const vRoadGeo = new THREE.PlaneGeometry(roadWidth, roadLen);
    vRoadGeo.rotateX(-Math.PI / 2);
    const vRoad = new THREE.Mesh(vRoadGeo, asphaltMaterial);
    vRoad.receiveShadow = true;
    this.roadGroup.add(vRoad);

    // Philippine Standard: Double Solid Yellow Center Line
    this._addDoubleYellowLines(0, 0, 420, 0, false);
    this._addDoubleYellowLines(0, 0, 420, 0, true);

    // Dashed White Lane Dividers
    this._addDashedLine(0, -24, 420, 0.45, 0);
    this._addDashedLine(0, 24, 420, 0.45, 0);
    this._addDashedLine(-24, 0, 0.45, 420, 0);
    this._addDashedLine(24, 0, 0.45, 420, 0);

    // Stop Bars
    const stopOffset = 48;
    this._addStopBar(-stopOffset, 24, 1.0, 48);
    this._addStopBar(stopOffset, -24, 1.0, 48);
    this._addStopBar(-24, -stopOffset, 48, 1.0);
    this._addStopBar(24, stopOffset, 48, 1.0);

    // Zebra Crosswalks
    // West Crosswalk (x = -54, spanning z: -48 to +48)
    this._addZebraCrosswalk(-stopOffset - 6, 0, 6, 96, true);
    // East Crosswalk (x = +54, spanning z: -48 to +48)
    this._addZebraCrosswalk(stopOffset + 6, 0, 6, 96, true);
    // North Crosswalk (z = -54, spanning x: -48 to +48)
    this._addZebraCrosswalk(0, -stopOffset - 6, 96, 6, false);
    // South Crosswalk (z = +54, spanning x: -48 to +48)
    this._addZebraCrosswalk(0, stopOffset + 6, 96, 6, false);

    // Urban Concrete Sidewalk Corner Platforms
    this._addSidewalkPlaza(-140, -140, 180, 180);
    this._addSidewalkPlaza(140, -140, 180, 180);
    this._addSidewalkPlaza(-140, 140, 180, 180);
    this._addSidewalkPlaza(140, 140, 180, 180);

    // Traffic Signal Gantries
    this._addSignalGantry(-stopOffset - 4, -48, 'south');
    this._addSignalGantry(stopOffset + 4, 48, 'north');
    this._addSignalGantry(-48, stopOffset + 4, 'east');
    this._addSignalGantry(48, -stopOffset - 4, 'west');

    // Pedestrian Crossing Signals (Stop / Walk Box Heads with Visual Lenses)
    this._addPedestrianSignalHead(-stopOffset - 2, -50, 'EW', 0); // West crosswalk North side
    this._addPedestrianSignalHead(-stopOffset - 2, 50, 'EW', Math.PI); // West crosswalk South side
    this._addPedestrianSignalHead(stopOffset + 2, -50, 'EW', 0); // East crosswalk North side
    this._addPedestrianSignalHead(stopOffset + 2, 50, 'EW', Math.PI); // East crosswalk South side

    this._addPedestrianSignalHead(-50, -stopOffset - 2, 'NS', -Math.PI / 2); // North crosswalk West side
    this._addPedestrianSignalHead(50, -stopOffset - 2, 'NS', Math.PI / 2); // North crosswalk East side
    this._addPedestrianSignalHead(-50, stopOffset + 2, 'NS', -Math.PI / 2); // South crosswalk West side
    this._addPedestrianSignalHead(50, stopOffset + 2, 'NS', Math.PI / 2); // South crosswalk East side
  }

  _addSidewalkPlaza(x, z, w, d) {
    const sidewalkGeo = new THREE.BoxGeometry(w, 0.4, d);
    const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMaterial);
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

  // Roundabout & T-Intersection support
  _buildRoundabout() {
    const ringInner = 26;
    const ringOuter = 58;

    const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, asphaltMaterial);
    ring.receiveShadow = true;
    this.roadGroup.add(ring);

    const armLen = 140;
    const armWidth = 32;

    const northArm = new THREE.Mesh(new THREE.PlaneGeometry(armWidth, armLen).rotateX(-Math.PI / 2), asphaltMaterial);
    northArm.position.set(0, 0, -100);
    const southArm = new THREE.Mesh(new THREE.PlaneGeometry(armWidth, armLen).rotateX(-Math.PI / 2), asphaltMaterial);
    southArm.position.set(0, 0, 100);
    const eastArm = new THREE.Mesh(new THREE.PlaneGeometry(armLen, armWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    eastArm.position.set(100, 0, 0);
    const westArm = new THREE.Mesh(new THREE.PlaneGeometry(armLen, armWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    westArm.position.set(-100, 0, 0);

    this.roadGroup.add(northArm, southArm, eastArm, westArm);

    const island = new THREE.Mesh(new THREE.CylinderGeometry(ringInner, ringInner + 0.5, 1.2, 36), curbMaterial);
    island.position.y = 0.6;
    this.roadGroup.add(island);

    this._addSignalGantry(20, -ringOuter - 5, 'south');
    this._addSignalGantry(-20, ringOuter + 5, 'north');
    this._addSignalGantry(ringOuter + 5, 20, 'west');
    this._addSignalGantry(-ringOuter - 5, -20, 'east');
  }

  _buildTIntersection() {
    const roadWidth = 80;
    const roadLen = 400;

    const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(roadLen, roadWidth).rotateX(-Math.PI / 2), asphaltMaterial);
    mainRoad.position.set(0, 0, -20);
    const stemRoad = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, 140).rotateX(-Math.PI / 2), asphaltMaterial);
    stemRoad.position.set(0, 0, 70);

    this.roadGroup.add(mainRoad, stemRoad);
    this._addRoadLine(0, -20, 400, 0.6, 0, '#ffffff');
    this._addRoadLine(0, 70, 0.6, 140, 0, '#ffffff');

    this._addSignalGantry(-46, -60, 'east');
    this._addSignalGantry(46, 20, 'west');
    this._addSignalGantry(40, 24, 'north');
  }

  _addRoadLine(x, z, w, d, angle = 0, colorHex = '#ffffff') {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(
      geo,
      colorHex === '#ffffff' ? whitePaintMaterial : new THREE.MeshBasicMaterial({ color: colorHex })
    );
    mesh.position.set(x, 0.02, z);
    if (angle) mesh.rotation.y = angle;
    this.roadGroup.add(mesh);
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

  // ---------------------------------------------------------------------------
  // 2. Traffic Signal Gantries & Pedestrian Signals
  // ---------------------------------------------------------------------------
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

    // Metal pole with MMDA Yellow Push-Button Box
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.0, 8), metalPoleMaterial);
    post.position.y = 2.5;

    const callBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    callBox.position.set(0, 1.4, 0.2);

    // Signal housing
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.65), metalPoleMaterial);
    box.position.set(0, 4.4, 0);

    // Visors
    const topVisor = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.3, 8, 1, false, 0, Math.PI), metalPoleMaterial);
    topVisor.rotation.z = Math.PI / 2;
    topVisor.position.set(0, 5.0, 0.38);

    // Top Lens: Red Standing Figure (Don't Walk)
    const redLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.55),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    redLens.position.set(0, 4.85, 0.34);

    // Bottom Lens: Green Walking Figure (Walk)
    const greenLens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.55),
      new THREE.MeshBasicMaterial({ color: 0x052e16 })
    );
    greenLens.position.set(0, 3.95, 0.34);

    group.add(post, callBox, box, topVisor, redLens, greenLens);
    this.roadGroup.add(group);

    this.pedestrianSignals.push({
      axis, // 'EW' or 'NS'
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

  // ---------------------------------------------------------------------------
  // 3. Dense Filipino Metropolitan High-Rise Skyline (Makati/BGC/EDSA Style)
  // ---------------------------------------------------------------------------
  _buildFilipinoCitySkyline() {
    // 16 Tall Towers, Commercial Podiums, Storefronts
    const skyscrapers = [
      // NW Quadrant (Makati Ayala Style Corporate Towers)
      { x: -110, z: -110, w: 48, h: 98, d: 42, mat: skyscraperMat1, spire: true, helipad: false },
      { x: -155, z: -85, w: 36, h: 72, d: 34, mat: skyscraperMat2, spire: false, helipad: true },
      { x: -85, z: -155, w: 34, h: 64, d: 36, mat: skyscraperMat3, spire: false, helipad: false },
      { x: -75, z: -75, w: 32, h: 14, d: 32, mat: skyscraperConcreteMat, podium: 'convenience' },

      // NE Quadrant (BGC High Street Mega Towers)
      { x: 115, z: -115, w: 50, h: 115, d: 46, mat: skyscraperMat2, spire: true, helipad: true },
      { x: 160, z: -80, w: 38, h: 80, d: 34, mat: skyscraperMat1, spire: false, helipad: false },
      { x: 80, z: -160, w: 36, h: 70, d: 38, mat: skyscraperMat3, spire: false, helipad: false },
      { x: 75, z: -75, w: 32, h: 14, d: 32, mat: skyscraperConcreteMat, podium: 'fastfood' },

      // SW Quadrant (Ortigas Mixed-Use Commercial Skyline)
      { x: -115, z: 115, w: 46, h: 90, d: 44, mat: skyscraperMat3, spire: false, helipad: false },
      { x: -155, z: 80, w: 34, h: 68, d: 36, mat: skyscraperMat1, spire: true, helipad: false },
      { x: -80, z: 155, w: 38, h: 76, d: 34, mat: skyscraperMat2, spire: false, helipad: true },
      { x: -75, z: 75, w: 32, h: 14, d: 32, mat: skyscraperConcreteMat, podium: 'sarisari' },

      // SE Quadrant (Makati / Pasig High-Density IT Hub)
      { x: 115, z: 115, w: 48, h: 104, d: 42, mat: skyscraperMat1, spire: true, helipad: false },
      { x: 160, z: 85, w: 36, h: 74, d: 34, mat: skyscraperMat2, spire: false, helipad: false },
      { x: 85, z: 160, w: 34, h: 66, d: 36, mat: skyscraperMat3, spire: false, helipad: false },
      { x: 75, z: 75, w: 32, h: 14, d: 32, mat: skyscraperConcreteMat, podium: 'terminal' },
    ];

    skyscrapers.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);

      // Main Tower Box
      const towerGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const towerMesh = new THREE.Mesh(towerGeo, b.mat);
      towerMesh.position.y = b.h / 2;
      towerMesh.castShadow = true;
      towerMesh.receiveShadow = true;
      bGroup.add(towerMesh);

      // Rooftop Architectural Crown / HVAC Units
      const hvacGeo = new THREE.BoxGeometry(b.w * 0.55, 3.5, b.d * 0.55);
      const hvac = new THREE.Mesh(hvacGeo, metalPoleMaterial);
      hvac.position.y = b.h + 1.75;
      bGroup.add(hvac);

      // Telecommunications Spire / Mast with Red Warning Beacon
      if (b.spire) {
        const mastGeo = new THREE.CylinderGeometry(0.3, 0.8, 22, 8);
        const mast = new THREE.Mesh(mastGeo, metalPoleMaterial);
        mast.position.y = b.h + 11;

        const beaconGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const beacon = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        beacon.position.y = b.h + 22;

        bGroup.add(mast, beacon);
      }

      // Rooftop Helipad
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

      // Commercial Street-Level Podiums & Storefront Canopies
      if (b.podium === 'convenience') {
        // 7-Eleven Style Convenience Store
        const signTex = createConvenienceSignTexture();
        const signGeo = new THREE.PlaneGeometry(16, 4);
        const signMat = new THREE.MeshBasicMaterial({ map: signTex });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 7.5, b.d / 2 + 0.1);
        bGroup.add(sign);

        const canopyGeo = new THREE.BoxGeometry(18, 0.8, 3.5);
        const canopy = new THREE.Mesh(
          canopyGeo,
          new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
        );
        canopy.position.set(0, 5.2, b.d / 2 + 1.7);
        bGroup.add(canopy);
      } else if (b.podium === 'sarisari') {
        // Aling Nena's Sari-Sari Store with Corrugated Roof
        const sariTex = createSariSariTexture();
        const signGeo = new THREE.PlaneGeometry(14, 3.6);
        const signMat = new THREE.MeshBasicMaterial({ map: sariTex });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 7.0, -b.d / 2 - 0.1);
        sign.rotation.y = Math.PI;
        bGroup.add(sign);

        const tinRoofGeo = new THREE.BoxGeometry(16, 0.4, 4.0);
        const tinRoof = new THREE.Mesh(
          tinRoofGeo,
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.6 })
        );
        tinRoof.position.set(0, 5.0, -b.d / 2 - 2.0);
        tinRoof.rotation.x = 0.2;
        bGroup.add(tinRoof);
      } else if (b.podium === 'fastfood') {
        // Warm Fastfood Storefront (Jollibee vibe)
        const signGeo = new THREE.PlaneGeometry(16, 4.2);
        const signMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 7.5, b.d / 2 + 0.1);
        bGroup.add(sign);

        const awningGeo = new THREE.BoxGeometry(18, 0.8, 3.5);
        const awning = new THREE.Mesh(
          awningGeo,
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
        );
        awning.position.set(0, 5.2, b.d / 2 + 1.7);
        bGroup.add(awning);
      } else if (b.podium === 'terminal') {
        // Tricycle Terminal TODA Sign
        const signGeo = new THREE.BoxGeometry(12, 2.5, 0.4);
        const sign = new THREE.Mesh(
          signGeo,
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 })
        );
        sign.position.set(0, 4.5, -b.d / 2 - 1.5);
        bGroup.add(sign);
      }

      this.propsGroup.add(bGroup);
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Iconic MMDA Overhead Pedestrian Footbridge
  // ---------------------------------------------------------------------------
  _buildMMDAFootbridge() {
    const bridge = new THREE.Group();
    const bridgeZ = -82;
    const bridgeY = 9.0;
    bridge.position.set(0, 0, bridgeZ);

    // Support Columns on Sidewalks
    [-52, 52].forEach((colX) => {
      const colGeo = new THREE.CylinderGeometry(0.7, 0.8, bridgeY, 12);
      const col = new THREE.Mesh(colGeo, mmdaBlueMaterial);
      col.position.set(colX, bridgeY / 2, 0);
      col.castShadow = true;
      bridge.add(col);
    });

    // Elevated Pedestrian Deck (Spans 106 units across the avenue)
    const deckGeo = new THREE.BoxGeometry(106, 0.6, 4.5);
    const deck = new THREE.Mesh(
      deckGeo,
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
    );
    deck.position.set(0, bridgeY, 0);
    deck.receiveShadow = true;
    bridge.add(deck);

    // MMDA Blue Steel Truss Railings
    [-2.1, 2.1].forEach((railZ) => {
      const railGeo = new THREE.BoxGeometry(106, 1.4, 0.2);
      const rail = new THREE.Mesh(railGeo, mmdaBlueMaterial);
      rail.position.set(0, bridgeY + 0.8, railZ);
      bridge.add(rail);
    });

    // Arched Protective Weather Canopy (Protects commuters from tropical rain/sun)
    const roofGeo = new THREE.CylinderGeometry(2.8, 2.8, 106, 16, 1, true, 0, Math.PI);
    roofGeo.rotateZ(Math.PI / 2);
    roofGeo.rotateX(Math.PI);
    const roof = new THREE.Mesh(roofGeo, mmdaRoofMaterial);
    roof.position.set(0, bridgeY + 2.8, 0);
    bridge.add(roof);

    // Stairways Descending to Sidewalks
    [-53, 53].forEach((stairX) => {
      const dir = stairX < 0 ? -1 : 1;
      const rampGeo = new THREE.BoxGeometry(18, 0.5, 4.0);
      const ramp = new THREE.Mesh(rampGeo, mmdaBlueMaterial);
      ramp.position.set(stairX + dir * 8, bridgeY / 2, 0);
      ramp.rotation.z = dir * 0.45;
      bridge.add(ramp);
    });

    this.propsGroup.add(bridge);
  }

  // ---------------------------------------------------------------------------
  // 5. Massive EDSA-Style Highway Advertising Billboards
  // ---------------------------------------------------------------------------
  _buildBillboards() {
    const billboards = [
      { x: -68, z: -125, rotY: 0.4, type: 'telco' },
      { x: 68, z: 125, rotY: -2.7, type: 'fastfood' },
      { x: -125, z: 68, rotY: 1.9, type: 'tourism' },
    ];

    billboards.forEach((b) => {
      const group = new THREE.Group();
      group.position.set(b.x, 0, b.z);
      group.rotation.y = b.rotY;

      // Steel Lattice Tower Mast
      const mastGeo = new THREE.BoxGeometry(2.0, 24, 2.0);
      const mast = new THREE.Mesh(mastGeo, metalPoleMaterial);
      mast.position.y = 12;
      mast.castShadow = true;

      // Billboard Canvas Frame (24 x 12 units)
      const frameGeo = new THREE.BoxGeometry(25, 12.5, 1.2);
      const frame = new THREE.Mesh(frameGeo, metalPoleMaterial);
      frame.position.set(0, 24, 0);

      // Billboard Graphic Poster
      const posterTex = createBillboardTexture(b.type);
      const posterGeo = new THREE.PlaneGeometry(24, 11.5);
      const posterMat = new THREE.MeshBasicMaterial({ map: posterTex });
      const poster = new THREE.Mesh(posterGeo, posterMat);
      poster.position.set(0, 24, 0.65);

      // Overhead Spotlights
      const armGeo = new THREE.BoxGeometry(0.3, 0.3, 2.5);
      const spotArm1 = new THREE.Mesh(armGeo, metalPoleMaterial);
      spotArm1.position.set(-6, 30.5, 1.3);
      const spotArm2 = new THREE.Mesh(armGeo, metalPoleMaterial);
      spotArm2.position.set(6, 30.5, 1.3);

      const lampGeo = new THREE.BoxGeometry(1.4, 0.6, 0.8);
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const lamp1 = new THREE.Mesh(lampGeo, lampMat);
      lamp1.position.set(-6, 30.3, 2.4);
      const lamp2 = new THREE.Mesh(lampGeo, lampMat);
      lamp2.position.set(6, 30.3, 2.4);

      group.add(mast, frame, poster, spotArm1, spotArm2, lamp1, lamp2);
      this.propsGroup.add(group);
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Philippine Concrete Electric Utility Poles & Spaghetti Wires
  // ---------------------------------------------------------------------------
  _buildUtilityPoles() {
    const poleCoords = [
      [-52, -28], [-52, -100],
      [52, -28], [52, -100],
      [-52, 28], [-52, 100],
      [52, 28], [52, 100],
    ];

    poleCoords.forEach(([px, pz]) => {
      const pole = new THREE.Group();
      pole.position.set(px, 0, pz);

      // Concrete Pole
      const shaftGeo = new THREE.CylinderGeometry(0.4, 0.55, 16, 8);
      const shaft = new THREE.Mesh(shaftGeo, utilityPoleMaterial);
      shaft.position.y = 8;
      shaft.castShadow = true;

      // Wooden / Steel Crossarms
      const crossarmGeo = new THREE.BoxGeometry(5.2, 0.35, 0.35);
      const crossarm1 = new THREE.Mesh(crossarmGeo, metalPoleMaterial);
      crossarm1.position.set(0, 14.8, 0);

      const crossarm2 = new THREE.Mesh(crossarmGeo, metalPoleMaterial);
      crossarm2.position.set(0, 13.6, 0);

      // Heavy Distribution Transformer Cylinder (Classic Meralco style)
      const transGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.2, 12);
      const trans = new THREE.Mesh(
        transGeo,
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.5 })
      );
      trans.position.set(1.2, 12.0, 0);

      pole.add(shaft, crossarm1, crossarm2, trans);
      this.propsGroup.add(pole);
    });

    // Tangled Overhead Cables (Catenary Sag Lines connecting poles)
    const cablePairs = [
      [[-52, 14.8, -28], [-52, 14.8, -100]],
      [[52, 14.8, -28], [52, 14.8, -100]],
      [[-52, 14.8, 28], [-52, 14.8, 100]],
      [[52, 14.8, 28], [52, 14.8, 100]],
      // Cross-street cables
      [[-52, 15.0, -28], [52, 15.0, -28]],
      [[-52, 15.0, 28], [52, 15.0, 28]],
    ];

    cablePairs.forEach(([p1, p2]) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - 1.6, (p1[2] + p2[2]) / 2),
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
      [-120, -54], [-60, -54], [60, -54], [120, -54],
      [-120, 54], [-60, 54], [60, 54], [120, 54],
      [-54, -120], [-54, -60], [-54, 60], [-54, 120],
      [54, -120], [54, -60], [54, 60], [54, 120],
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
  // 7. Animated 3D Pedestrians with Humanoid Anatomy & Synchronized Walk Signals
  // ---------------------------------------------------------------------------
  _createPedestrianMesh(clothingIdx, pantsIdx, skinIdx, hasBackpack, hasHat) {
    const group = new THREE.Group();

    const skinMat = skinMaterials[skinIdx % skinMaterials.length];
    const shirtMat = shirtMaterials[clothingIdx % shirtMaterials.length];
    const pantsMat = pantsMaterials[pantsIdx % pantsMaterials.length];

    // Head
    const head = new THREE.Mesh(pedHeadGeo, skinMat);
    head.position.y = 2.45;
    head.castShadow = true;

    // Hair or Cap
    if (hasHat) {
      const hat = new THREE.Mesh(pedHatGeo, shirtMat);
      hat.position.y = 2.65;
      group.add(hat);
    } else {
      const hair = new THREE.Mesh(pedHairGeo, darkHairMaterial);
      hair.position.y = 2.52;
      group.add(hair);
    }

    // Torso / Shirt
    const torso = new THREE.Mesh(pedTorsoGeo, shirtMat);
    torso.position.y = 1.62;
    torso.castShadow = true;

    // Optional Backpack
    if (hasBackpack) {
      const backpack = new THREE.Mesh(pedBackpackGeo, pantsMat);
      backpack.position.set(0, 1.62, -0.28);
      group.add(backpack);
    }

    // Left Leg Group (Pivoted at Hip y = 1.15)
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.18, 1.15, 0);
    const leftLegMesh = new THREE.Mesh(pedLegGeo, pantsMat);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    // Right Leg Group (Pivoted at Hip y = 1.15)
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.18, 1.15, 0);
    const rightLegMesh = new THREE.Mesh(pedLegGeo, pantsMat);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    // Left Arm Group (Pivoted at Shoulder y = 1.95)
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.45, 1.95, 0);
    const leftArmMesh = new THREE.Mesh(pedArmGeo, skinMat);
    leftArm.add(leftArmMesh);

    // Right Arm Group (Pivoted at Shoulder y = 1.95)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.45, 1.95, 0);
    const rightArmMesh = new THREE.Mesh(pedArmGeo, skinMat);
    rightArm.add(rightArmMesh);

    group.add(head, torso, leftLeg, rightLeg, leftArm, rightArm);

    return { group, leftLeg, rightLeg, leftArm, rightArm };
  }

  _buildPedestrians() {
    this.pedestrians = [];

    // Define 24 Pedestrian Agents:
    // - 14 on Zebra Crosswalks (responsive to traffic signals)
    // - 4 on the Elevated MMDA Pedestrian Footbridge
    // - 6 on Sidewalks strolling past storefronts
    const pedSpecs = [
      // 1. West Crosswalk (Crossing East-West Highway at x = -54, z from -48 to +48)
      { type: 'crosswalk', axis: 'EW', start: [-54, -46], end: [-54, 46], speed: 9.5, phase: 0.0, c: 0, p: 0, s: 0, b: true, h: false },
      { type: 'crosswalk', axis: 'EW', start: [-54, 46], end: [-54, -46], speed: 8.8, phase: 1.5, c: 1, p: 1, s: 1, b: false, h: true },
      { type: 'crosswalk', axis: 'EW', start: [-55, -30], end: [-55, 46], speed: 10.2, phase: 2.8, c: 2, p: 2, s: 2, b: false, h: false },
      { type: 'crosswalk', axis: 'EW', start: [-53, 20], end: [-53, -46], speed: 9.0, phase: 4.1, c: 3, p: 0, s: 3, b: true, h: false },

      // 2. East Crosswalk (Crossing East-West Highway at x = +54, z from -48 to +48)
      { type: 'crosswalk', axis: 'EW', start: [54, -46], end: [54, 46], speed: 9.2, phase: 0.8, c: 4, p: 1, s: 0, b: true, h: true },
      { type: 'crosswalk', axis: 'EW', start: [54, 46], end: [54, -46], speed: 10.0, phase: 2.2, c: 5, p: 2, s: 1, b: false, h: false },
      { type: 'crosswalk', axis: 'EW', start: [55, -20], end: [55, 46], speed: 8.5, phase: 3.5, c: 6, p: 3, s: 2, b: false, h: false },
      { type: 'crosswalk', axis: 'EW', start: [53, 35], end: [53, -46], speed: 9.8, phase: 5.0, c: 0, p: 0, s: 3, b: true, h: false },

      // 3. North Crosswalk (Crossing North-South Highway at z = -54, x from -48 to +48)
      { type: 'crosswalk', axis: 'NS', start: [-46, -54], end: [46, -54], speed: 9.4, phase: 0.4, c: 1, p: 1, s: 0, b: true, h: false },
      { type: 'crosswalk', axis: 'NS', start: [46, -54], end: [-46, -54], speed: 8.9, phase: 1.9, c: 2, p: 2, s: 1, b: false, h: true },
      { type: 'crosswalk', axis: 'NS', start: [-25, -55], end: [46, -55], speed: 10.5, phase: 3.2, c: 3, p: 0, s: 2, b: true, h: false },

      // 4. South Crosswalk (Crossing North-South Highway at z = +54, x from -48 to +48)
      { type: 'crosswalk', axis: 'NS', start: [-46, 54], end: [46, 54], speed: 9.0, phase: 0.7, c: 4, p: 1, s: 3, b: false, h: false },
      { type: 'crosswalk', axis: 'NS', start: [46, 54], end: [-46, 54], speed: 10.1, phase: 2.5, c: 5, p: 2, s: 0, b: true, h: true },
      { type: 'crosswalk', axis: 'NS', start: [15, 55], end: [-46, 55], speed: 8.7, phase: 4.0, c: 6, p: 3, s: 1, b: false, h: false },

      // 5. Elevated MMDA Pedestrian Footbridge (z = -82, y = 9.3, x from -50 to 50)
      { type: 'bridge', axis: 'none', start: [-50, -82], end: [50, -82], y: 9.3, speed: 8.4, phase: 0.0, c: 0, p: 0, s: 0, b: true, h: false },
      { type: 'bridge', axis: 'none', start: [50, -82], end: [-50, -82], y: 9.3, speed: 9.0, phase: 1.8, c: 1, p: 1, s: 1, b: false, h: true },
      { type: 'bridge', axis: 'none', start: [-20, -82.5], end: [50, -82.5], y: 9.3, speed: 10.0, phase: 3.1, c: 2, p: 2, s: 2, b: false, h: false },
      { type: 'bridge', axis: 'none', start: [30, -81.5], end: [-50, -81.5], y: 9.3, speed: 8.6, phase: 4.5, c: 3, p: 3, s: 3, b: true, h: false },

      // 6. Urban Sidewalks (Strolling past Sari-sari stores & Convenience Marts)
      { type: 'sidewalk', axis: 'none', start: [-58, -60], end: [-58, -135], speed: 8.0, phase: 0.5, c: 4, p: 0, s: 0, b: false, h: false },
      { type: 'sidewalk', axis: 'none', start: [-58, 60], end: [-58, 135], speed: 8.2, phase: 2.0, c: 5, p: 1, s: 1, b: true, h: false },
      { type: 'sidewalk', axis: 'none', start: [58, -60], end: [58, -135], speed: 7.8, phase: 3.4, c: 6, p: 2, s: 2, b: false, h: true },
      { type: 'sidewalk', axis: 'none', start: [58, 60], end: [58, 135], speed: 8.5, phase: 4.8, c: 0, p: 3, s: 3, b: true, h: false },
      { type: 'sidewalk', axis: 'none', start: [-65, -58], end: [-140, -58], speed: 8.2, phase: 1.2, c: 1, p: 0, s: 0, b: false, h: false },
      { type: 'sidewalk', axis: 'none', start: [65, 58], end: [140, 58], speed: 8.0, phase: 2.7, c: 2, p: 1, s: 1, b: false, h: false },
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

    // 1. Determine vehicular traffic state to compute safe pedestrian crossing
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

    // 2. Synchronize Pedestrian Signals (Don't Walk Red vs Walk Green)
    // When NS vehicular traffic is moving -> NS Crosswalk is RED; EW Crosswalk is GREEN!
    // When EW vehicular traffic is moving -> EW Crosswalk is RED; NS Crosswalk is GREEN!
    const nsPedWalk = !isNSVehiclesGreen;
    const ewPedWalk = !isEWVehiclesGreen;

    this.pedestrianSignals.forEach((sig) => {
      const isWalk = sig.axis === 'NS' ? nsPedWalk : ewPedWalk;
      sig.redLens.material.color.setHex(isWalk ? 0x450a0a : 0xdc2626);
      sig.greenLens.material.color.setHex(isWalk ? 0x22c55e : 0x052e16);
    });

    // 3. Animate Pedestrian Locomotion & Curb Waiting
    this.pedestrians.forEach((ped) => {
      let allowWalk = true;

      if (ped.type === 'crosswalk') {
        const pedCanCross = ped.axis === 'NS' ? nsPedWalk : ewPedWalk;

        // Pedestrian is at the curb if progress is near 0 or 1
        const atCurb = ped.progress < 0.08 || ped.progress > 0.92;

        if (atCurb && !pedCanCross) {
          allowWalk = false;
        }
      }

      if (allowWalk) {
        ped.isWaiting = false;

        // Advance along path
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

        // Interpolate position
        ped.currentPos.lerpVectors(ped.startPos, ped.endPos, ped.progress);
        ped.group.position.x = ped.currentPos.x;
        ped.group.position.z = ped.currentPos.y;

        // Face walking direction
        const dirX = ped.forward
          ? ped.endPos.x - ped.startPos.x
          : ped.startPos.x - ped.endPos.x;
        const dirZ = ped.forward
          ? ped.endPos.y - ped.startPos.y
          : ped.startPos.y - ped.endPos.y;
        ped.group.rotation.y = Math.atan2(dirX, dirZ);

        // Walking gait animation (Leg & Arm swing with natural cadence)
        ped.walkPhase += dt * ped.speed * 0.9;
        const swing = Math.sin(ped.walkPhase) * 0.52;

        ped.leftLeg.rotation.x = swing;
        ped.rightLeg.rotation.x = -swing;
        ped.leftArm.rotation.x = -swing * 0.75;
        ped.rightArm.rotation.x = swing * 0.75;

        // Subtle torso bounce
        ped.group.position.y = ped.baseY + Math.abs(Math.sin(ped.walkPhase * 2)) * 0.06;
      } else {
        // Pedestrian is paused at curb waiting for green walk signal
        ped.isWaiting = true;
        ped.leftLeg.rotation.x *= 0.85;
        ped.rightLeg.rotation.x *= 0.85;
        ped.leftArm.rotation.x *= 0.85;
        ped.rightArm.rotation.x *= 0.85;
        ped.group.position.y = ped.baseY;
      }
    });
  }
}
