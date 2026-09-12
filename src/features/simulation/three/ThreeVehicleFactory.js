import * as THREE from 'three';

// Nature-Forward Eco-Mobility Vehicle Color Palette
const COLOR_PALETTE = [
  0xffffff, // Pure Alpine White
  0x14532d, // Deep Forest Pine
  0x16a34a, // Vivid Emerald Leaf
  0x2e3832, // Mineral Slate
  0xd97706, // Solar Warmth Amber
  0x2563eb, // Clean Stream Blue
  0x65a30d, // Sprout Olive
  0x475569, // Mist Gray
  0x854d0e, // Raw Earth Bronze
];

const hashId = (value) => {
  const str = String(value ?? '');
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash);
};

// ==========================================
// PROCEDURAL PHOTOREALISTIC LIGHT TEXTURES
// ==========================================
let headlightPoolTexture = null;
const getHeadlightPoolTexture = () => {
  if (headlightPoolTexture) return headlightPoolTexture;
  if (typeof document === 'undefined') return new THREE.Texture();

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 256);

  // Left beam projection fan (centered at y = 88)
  const gradL = ctx.createRadialGradient(40, 88, 6, 260, 88, 240);
  gradL.addColorStop(0, 'rgba(240, 250, 255, 0.95)');
  gradL.addColorStop(0.15, 'rgba(215, 240, 255, 0.65)');
  gradL.addColorStop(0.45, 'rgba(180, 225, 250, 0.28)');
  gradL.addColorStop(0.8, 'rgba(150, 210, 245, 0.08)');
  gradL.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradL;
  ctx.beginPath();
  ctx.ellipse(260, 88, 240, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Right beam projection fan (centered at y = 168)
  const gradR = ctx.createRadialGradient(40, 168, 6, 260, 168, 240);
  gradR.addColorStop(0, 'rgba(240, 250, 255, 0.95)');
  gradR.addColorStop(0.15, 'rgba(215, 240, 255, 0.65)');
  gradR.addColorStop(0.45, 'rgba(180, 225, 250, 0.28)');
  gradR.addColorStop(0.8, 'rgba(150, 210, 245, 0.08)');
  gradR.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradR;
  ctx.beginPath();
  ctx.ellipse(260, 168, 240, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Central overlap hot-spot fanning forward
  const gradC = ctx.createRadialGradient(60, 128, 8, 280, 128, 220);
  gradC.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  gradC.addColorStop(0.2, 'rgba(230, 248, 255, 0.5)');
  gradC.addColorStop(0.55, 'rgba(190, 230, 255, 0.18)');
  gradC.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradC;
  ctx.beginPath();
  ctx.ellipse(280, 128, 220, 85, 0, 0, Math.PI * 2);
  ctx.fill();

  headlightPoolTexture = new THREE.CanvasTexture(canvas);
  return headlightPoolTexture;
};

let beamVolumetricTexture = null;
const getBeamVolumetricTexture = () => {
  if (beamVolumetricTexture) return beamVolumetricTexture;
  if (typeof document === 'undefined') return new THREE.Texture();

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Gradient from bright narrow apex (top) to soft feathered base (bottom)
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.12, 'rgba(235, 248, 255, 0.55)');
  grad.addColorStop(0.45, 'rgba(200, 235, 255, 0.22)');
  grad.addColorStop(0.8, 'rgba(175, 220, 250, 0.06)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);

  beamVolumetricTexture = new THREE.CanvasTexture(canvas);
  return beamVolumetricTexture;
};

let brakeGlowTexture = null;
const getBrakeGlowTexture = () => {
  if (brakeGlowTexture) return brakeGlowTexture;
  if (typeof document === 'undefined') return new THREE.Texture();

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  grad.addColorStop(0, 'rgba(255, 40, 40, 0.95)');
  grad.addColorStop(0.3, 'rgba(225, 29, 72, 0.55)');
  grad.addColorStop(0.65, 'rgba(180, 20, 50, 0.18)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 62, 0, Math.PI * 2);
  ctx.fill();

  brakeGlowTexture = new THREE.CanvasTexture(canvas);
  return brakeGlowTexture;
};

// ==========================================
// PRE-ALLOCATED SHARED REUSABLE GEOMETRIES
// ==========================================
const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 12);
wheelGeo.rotateX(Math.PI / 2);

const rimGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.52, 8);
rimGeo.rotateX(Math.PI / 2);

const largeWheelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.55, 12);
largeWheelGeo.rotateX(Math.PI / 2);

const largeRimGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.57, 8);
largeRimGeo.rotateX(Math.PI / 2);

// Volumetric Headlight Cone Geometry
// Narrow apex at origin (X=0), fanning forward to base at X=24
const singleBeamGeo = new THREE.ConeGeometry(2.0, 24, 12, 1, true);
singleBeamGeo.rotateZ(Math.PI / 2);
singleBeamGeo.translate(12, 0, 0);

// Road Surface Headlight Projection Quad (X=28 long, Z=14 wide)
const roadPoolGeo = new THREE.PlaneGeometry(28, 14);
roadPoolGeo.rotateX(-Math.PI / 2);
roadPoolGeo.translate(14, 0, 0);

// Road Surface Rear Brake Glow Quad
const roadBrakeGeo = new THREE.PlaneGeometry(12, 8);
roadBrakeGeo.rotateX(-Math.PI / 2);
roadBrakeGeo.translate(-6, 0, 0);

// Chassis Geometries
const coupeBodyGeo = new THREE.BoxGeometry(8.0, 1.0, 3.4);
const coupeRoofGeo = new THREE.BoxGeometry(3.6, 0.9, 2.6);
const sedanBodyGeo = new THREE.BoxGeometry(9.0, 1.1, 3.5);
const sedanRoofGeo = new THREE.BoxGeometry(4.4, 0.9, 2.7);
const suvBodyGeo = new THREE.BoxGeometry(9.0, 1.6, 3.8);
const suvRoofGeo = new THREE.BoxGeometry(4.8, 1.1, 3.0);
const protoBodyGeo = new THREE.BoxGeometry(8.5, 0.8, 3.8);
const protoCanopyGeo = new THREE.BoxGeometry(3.5, 1.0, 2.0);
const protoFinGeo = new THREE.BoxGeometry(3.2, 1.1, 0.15);
const protoWingGeo = new THREE.BoxGeometry(1.2, 0.2, 4.0);
const protoWingPillarGeo = new THREE.BoxGeometry(0.2, 1.0, 0.1);
const truckCabGeo = new THREE.BoxGeometry(5.0, 3.6, 3.8);
const truckWindshieldGeo = new THREE.BoxGeometry(2.0, 1.6, 3.6);
const truckTrailerGeo = new THREE.BoxGeometry(10.0, 4.0, 3.8);
const vanBodyGeo = new THREE.BoxGeometry(9.5, 2.4, 3.6);
const vanWindshieldGeo = new THREE.BoxGeometry(2.2, 1.4, 3.4);
const busBodyGeo = new THREE.BoxGeometry(13.0, 3.0, 3.6);
const busGlassBandGeo = new THREE.BoxGeometry(12.4, 1.2, 3.65);
const bikeFrameGeo = new THREE.BoxGeometry(3.5, 0.9, 0.5);
const bikeRiderGeo = new THREE.BoxGeometry(1.0, 1.5, 0.8);
const quadExhaustGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.4, 8);
quadExhaustGeo.rotateZ(Math.PI / 2);

// Philippine Jeepney Geometries
const jeepneyHoodGeo = new THREE.BoxGeometry(4.2, 1.25, 3.2);
const jeepneyRoofGeo = new THREE.BoxGeometry(8.8, 0.22, 3.6);
const jeepneyVisorGeo = new THREE.BoxGeometry(1.6, 0.25, 3.4);
const jeepneyCabinGeo = new THREE.BoxGeometry(6.6, 0.85, 3.2);
const jeepneyRackGeo = new THREE.BoxGeometry(5.5, 0.35, 3.1);
const jeepneyHorseGeo = new THREE.ConeGeometry(0.16, 0.45, 4);
const jeepneyPillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6);
const jeepneyStepGeo = new THREE.BoxGeometry(0.8, 0.15, 1.6);
const jeepneyBenchGeo = new THREE.BoxGeometry(6.2, 0.2, 0.7);

// Philippine Tricycle Geometries
const trikeCabinGeo = new THREE.BoxGeometry(3.6, 1.7, 1.8);
const trikeRoofGeo = new THREE.BoxGeometry(3.8, 0.15, 2.0);
const trikeFrameGeo = new THREE.BoxGeometry(3.2, 0.9, 0.6);
const trikeRiderGeo = new THREE.BoxGeometry(0.9, 1.4, 0.7);

// Lens and Light Cluster Geometries
const projectorSphereGeo = new THREE.SphereGeometry(0.18, 8, 8);
const drlBrowGeo = new THREE.BoxGeometry(0.15, 0.08, 0.65);
const turnSignalGeo = new THREE.BoxGeometry(0.15, 0.25, 0.25);
const taillightBarGeo = new THREE.BoxGeometry(0.18, 0.15, 3.0);
const taillightClampGeo = new THREE.BoxGeometry(0.2, 0.35, 0.7);
const chmslGeo = new THREE.BoxGeometry(0.12, 0.08, 1.0);
const strobeGeo = new THREE.SphereGeometry(0.35, 8, 8);

// ==========================================
// PRE-ALLOCATED SHARED REUSABLE MATERIALS
// ==========================================
const tireMat = new THREE.MeshStandardMaterial({
  color: 0x181e1a,
  roughness: 0.9,
  metalness: 0.1,
});

const rimMat = new THREE.MeshStandardMaterial({
  color: 0xd1dcd5,
  roughness: 0.25,
  metalness: 0.85,
});

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.15,
  metalness: 0.95,
});

const stainlessMat = new THREE.MeshStandardMaterial({
  color: 0xcfd8dc,
  roughness: 0.35,
  metalness: 0.85,
});

const glassMat = new THREE.MeshStandardMaterial({
  color: 0x0f2419,
  roughness: 0.1,
  metalness: 0.9,
});

const carbonMat = new THREE.MeshStandardMaterial({
  color: 0x1a241e,
  roughness: 0.5,
  metalness: 0.6,
});

// Crystalline LED Projector Material (Ice White / Xenon)
const projectorMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

// LED DRL Accent Brow Material
const drlMat = new THREE.MeshBasicMaterial({
  color: 0xf0f9ff,
});

const goldMarkerMat = new THREE.MeshBasicMaterial({
  color: 0xf59e0b,
});
const greenMarkerMat = new THREE.MeshBasicMaterial({
  color: 0x10b981,
});

// Cache for vehicle body materials by hex color to prevent recreating
const bodyMaterialCache = new Map();
const getBodyMaterial = (colorHex) => {
  if (!bodyMaterialCache.has(colorHex)) {
    bodyMaterialCache.set(
      colorHex,
      new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.55,
      })
    );
  }
  return bodyMaterialCache.get(colorHex);
};

export class ThreeVehicleFactory {
  /**
   * Builds an ultra-realistic procedural 3D vehicle with modern LED clusters,
   * dual volumetric forward beams, asphalt ground projection pools,
   * continuous OLED rear lightbars, and dynamic braking bloom.
   */
  static createVehicle(data) {
    const type = data.type || 'coupe';
    const isInterceptor = type === 'interceptor' || data.isInterceptor;

    const group = new THREE.Group();
    group.name = `vehicle-${data.id}`;
    group.userData = { id: data.id, type, data };

    // Select body color
    let bodyColor = isInterceptor ? 0x0f291e : COLOR_PALETTE[hashId(data.id) % COLOR_PALETTE.length];
    if (type === 'bus') bodyColor = 0x16a34a; // Emerald Eco Transit
    if (type === 'prototype') bodyColor = 0x0f3d28; // British Racing Forest Pine

    const bodyMaterial = getBodyMaterial(bodyColor);

    // Dynamic materials for taillight, brake, turn signals
    const taillightMat = new THREE.MeshBasicMaterial({
      color: 0x991b1b, // Deep cherry red during cruise
    });

    const chmslMat = new THREE.MeshBasicMaterial({
      color: 0x7f1d1d,
    });

    const leftSignalMat = new THREE.MeshBasicMaterial({
      color: 0x451a03, // Amber dark idle
    });

    const rightSignalMat = new THREE.MeshBasicMaterial({
      color: 0x451a03,
    });

    // Volumetric Headlight Beam Material (textured additive gradient)
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      map: getBeamVolumetricTexture(),
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    // Road Surface Headlight Projection Pool Material
    const roadPoolMat = new THREE.MeshBasicMaterial({
      color: 0xe8f5ff,
      map: getHeadlightPoolTexture(),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Road Surface Rear Brake Reflection Pool Material
    const roadBrakeMat = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      map: getBrakeGlowTexture(),
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    let wheels = [];
    let strobeMeshBlue = null;
    let strobeMeshRed = null;

    // Construct vehicle-specific 3D geometry
    switch (type) {
      case 'jeepney': {
        // 1. Stainless steel lower body & open passenger cabin
        const chassis = new THREE.Mesh(jeepneyCabinGeo, stainlessMat);
        chassis.position.set(-1.0, 0.8, 0);
        chassis.castShadow = true;

        // 2. Vibrant painted front hood
        const hood = new THREE.Mesh(jeepneyHoodGeo, bodyMaterial);
        hood.position.set(3.4, 1.0, 0);
        hood.castShadow = true;

        // 3. Classic chrome grille on front
        const grille = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 2.8), chromeMat);
        grille.position.set(5.5, 0.95, 0);

        // 4. Chrome hood ornaments (iconic silver horses)
        const horse1 = new THREE.Mesh(jeepneyHorseGeo, chromeMat);
        horse1.position.set(4.8, 1.85, -0.6);
        horse1.rotation.z = -Math.PI / 4;
        const horse2 = new THREE.Mesh(jeepneyHorseGeo, chromeMat);
        horse2.position.set(4.8, 1.85, 0.6);
        horse2.rotation.z = -Math.PI / 4;

        // 5. Sun Visor with Route Destination Header
        const visor = new THREE.Mesh(jeepneyVisorGeo, bodyMaterial);
        visor.position.set(1.4, 2.15, 0);
        visor.rotation.z = -0.15;

        // 6. Long flat stainless steel roof canopy
        const roof = new THREE.Mesh(jeepneyRoofGeo, stainlessMat);
        roof.position.set(-1.0, 2.3, 0);
        roof.castShadow = true;

        // 7. Roof luggage rack + spare tire
        const rack = new THREE.Mesh(jeepneyRackGeo, chromeMat);
        rack.position.set(-1.0, 2.5, 0);
        const spareTire = new THREE.Mesh(wheelGeo, tireMat);
        spareTire.rotation.x = Math.PI / 2;
        spareTire.position.set(-0.5, 2.65, 0);

        // 8. Chrome roof support pillars (open air cabin)
        const pillars = [];
        [-4.0, -1.8, 0.4].forEach(px => {
          [-1.65, 1.65].forEach(pz => {
            const p = new THREE.Mesh(jeepneyPillarGeo, chromeMat);
            p.position.set(px, 1.6, pz);
            pillars.push(p);
          });
        });

        // 9. Rear passenger entrance step
        const rearStep = new THREE.Mesh(jeepneyStepGeo, chromeMat);
        rearStep.position.set(-4.6, 0.35, 0);

        // 10. Passenger benches inside
        const benchL = new THREE.Mesh(jeepneyBenchGeo, carbonMat);
        benchL.position.set(-1.0, 0.9, -1.1);
        const benchR = new THREE.Mesh(jeepneyBenchGeo, carbonMat);
        benchR.position.set(-1.0, 0.9, 1.1);

        // 11. Roof clearance marker lights (green & amber)
        const marker1 = new THREE.Mesh(strobeGeo, greenMarkerMat);
        marker1.scale.set(0.5, 0.5, 0.5);
        marker1.position.set(1.8, 2.35, -1.4);
        const marker2 = new THREE.Mesh(strobeGeo, goldMarkerMat);
        marker2.scale.set(0.5, 0.5, 0.5);
        marker2.position.set(1.8, 2.35, 1.4);

        group.add(
          chassis, hood, grille, horse1, horse2, visor, roof, rack, spareTire,
          ...pillars, rearStep, benchL, benchR, marker1, marker2
        );

        wheels = this._createWheelSet(3.4, -2.8, 1.8, 0.75);
        break;
      }

      case 'tricycle': {
        // Motorbike side (Left, z = -0.7)
        const frame = new THREE.Mesh(trikeFrameGeo, bodyMaterial);
        frame.position.set(0, 0.9, -0.7);

        const rider = new THREE.Mesh(trikeRiderGeo, carbonMat);
        rider.position.set(-0.2, 1.8, -0.7);

        // Covered Sidecar Cabin (Right, z = 0.9)
        const cabin = new THREE.Mesh(trikeCabinGeo, bodyMaterial);
        cabin.position.set(0, 1.1, 0.9);
        cabin.castShadow = true;

        const sidecarRoof = new THREE.Mesh(trikeRoofGeo, stainlessMat);
        sidecarRoof.position.set(0, 2.0, 0.9);

        const passengerWindow = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.1), glassMat);
        passengerWindow.position.set(0, 1.4, 1.85);

        group.add(frame, rider, cabin, sidecarRoof, passengerWindow);

        // 3 Wheels (2 on bike, 1 on sidecar)
        const wheelFront = new THREE.Group();
        wheelFront.position.set(1.4, 0.65, -0.7);
        const tireF = new THREE.Mesh(wheelGeo, tireMat);
        tireF.scale.set(0.6, 0.6, 0.6);
        const rimF = new THREE.Mesh(rimGeo, rimMat);
        rimF.scale.set(0.6, 0.6, 0.6);
        wheelFront.add(tireF, rimF);

        const wheelRear = new THREE.Group();
        wheelRear.position.set(-1.4, 0.65, -0.7);
        const tireR = new THREE.Mesh(wheelGeo, tireMat);
        tireR.scale.set(0.6, 0.6, 0.6);
        const rimR = new THREE.Mesh(rimGeo, rimMat);
        rimR.scale.set(0.6, 0.6, 0.6);
        wheelRear.add(tireR, rimR);

        const wheelSidecar = new THREE.Group();
        wheelSidecar.position.set(0, 0.65, 1.85);
        const tireS = new THREE.Mesh(wheelGeo, tireMat);
        tireS.scale.set(0.6, 0.6, 0.6);
        const rimS = new THREE.Mesh(rimGeo, rimMat);
        rimS.scale.set(0.6, 0.6, 0.6);
        wheelSidecar.add(tireS, rimS);

        wheels = [wheelFront, wheelRear, wheelSidecar];
        break;
      }

      case 'prototype': {
        const chassis = new THREE.Mesh(protoBodyGeo, bodyMaterial);
        chassis.position.y = 0.6;
        chassis.castShadow = true;

        const canopy = new THREE.Mesh(protoCanopyGeo, glassMat);
        canopy.position.set(0.2, 1.4, 0);

        const fin = new THREE.Mesh(protoFinGeo, carbonMat);
        fin.position.set(-1.2, 1.5, 0);

        const wing = new THREE.Mesh(protoWingGeo, carbonMat);
        wing.position.set(-3.8, 2.0, 0);
        const wingPillarL = new THREE.Mesh(protoWingPillarGeo, carbonMat);
        wingPillarL.position.set(-3.8, 1.5, -1.4);
        const wingPillarR = new THREE.Mesh(protoWingPillarGeo, carbonMat);
        wingPillarR.position.set(-3.8, 1.5, 1.4);

        group.add(chassis, canopy, fin, wing, wingPillarL, wingPillarR);
        wheels = this._createWheelSet(2.6, -2.6, 1.8, 0.7);
        break;
      }

      case 'truck': {
        const cab = new THREE.Mesh(truckCabGeo, bodyMaterial);
        cab.position.set(4.5, 2.2, 0);
        cab.castShadow = true;

        const cabWindshield = new THREE.Mesh(truckWindshieldGeo, glassMat);
        cabWindshield.position.set(5.5, 2.8, 0);

        const trailer = new THREE.Mesh(truckTrailerGeo, carbonMat);
        trailer.position.set(-3.5, 2.6, 0);
        trailer.castShadow = true;

        group.add(cab, cabWindshield, trailer);
        wheels = this._createWheelSet(5.0, 5.0, 1.9, 0.9, true);
        const trailerWheels = this._createWheelSet(-4.0, -7.0, 1.9, 0.9, true);
        wheels.push(...trailerWheels);
        break;
      }

      case 'bus': {
        const bus = new THREE.Mesh(busBodyGeo, bodyMaterial);
        bus.position.set(0, 2.0, 0);
        bus.castShadow = true;

        const glassStrip = new THREE.Mesh(busGlassBandGeo, glassMat);
        glassStrip.position.set(0, 2.4, 0);

        group.add(bus, glassStrip);
        wheels = this._createWheelSet(4.2, -4.2, 1.85, 0.85, true);
        break;
      }

      case 'van': {
        const van = new THREE.Mesh(vanBodyGeo, bodyMaterial);
        van.position.set(0, 1.6, 0);
        van.castShadow = true;

        const windshield = new THREE.Mesh(vanWindshieldGeo, glassMat);
        windshield.position.set(3.4, 2.1, 0);

        group.add(van, windshield);
        wheels = this._createWheelSet(2.8, -2.8, 1.8, 0.75);
        break;
      }

      case 'suv': {
        const body = new THREE.Mesh(suvBodyGeo, bodyMaterial);
        body.position.y = 1.3;
        body.castShadow = true;

        const cabin = new THREE.Mesh(suvRoofGeo, glassMat);
        cabin.position.set(-0.5, 2.3, 0);

        group.add(body, cabin);
        wheels = this._createWheelSet(2.7, -2.7, 1.85, 0.8);
        break;
      }

      case 'sedan': {
        const body = new THREE.Mesh(sedanBodyGeo, bodyMaterial);
        body.position.y = 0.9;
        body.castShadow = true;

        const cabin = new THREE.Mesh(sedanRoofGeo, glassMat);
        cabin.position.set(-0.4, 1.7, 0);

        group.add(body, cabin);
        wheels = this._createWheelSet(2.7, -2.7, 1.75, 0.7);
        break;
      }

      case 'bike': {
        const frame = new THREE.Mesh(bikeFrameGeo, bodyMaterial);
        frame.position.y = 0.9;

        const rider = new THREE.Mesh(bikeRiderGeo, carbonMat);
        rider.position.set(-0.2, 1.8, 0);

        group.add(frame, rider);
        wheels = this._createSingleWheelSet(1.4, -1.4, 0.65);
        break;
      }

      case 'coupe':
      case 'interceptor':
      default: {
        const body = new THREE.Mesh(coupeBodyGeo, bodyMaterial);
        body.position.y = 0.8;
        body.castShadow = true;

        const cabin = new THREE.Mesh(coupeRoofGeo, glassMat);
        cabin.position.set(-0.4, 1.55, 0);

        const exhaust1 = new THREE.Mesh(quadExhaustGeo, carbonMat);
        exhaust1.position.set(-4.0, 0.4, -0.9);
        const exhaust2 = exhaust1.clone();
        exhaust2.position.set(-4.0, 0.4, 0.9);

        group.add(body, cabin, exhaust1, exhaust2);

        // Emergency Pursuit Lightbar
        if (isInterceptor) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 2.2), carbonMat);
          bar.position.set(-0.3, 2.15, 0);

          strobeMeshBlue = new THREE.Mesh(strobeGeo, new THREE.MeshBasicMaterial({ color: 0x16a34a }));
          strobeMeshBlue.position.set(-0.3, 2.35, -0.65);

          strobeMeshRed = new THREE.Mesh(strobeGeo, new THREE.MeshBasicMaterial({ color: 0xd97706 }));
          strobeMeshRed.position.set(-0.3, 2.35, 0.65);

          group.add(bar, strobeMeshBlue, strobeMeshRed);
        }

        wheels = this._createWheelSet(2.4, -2.4, 1.7, 0.7);
        break;
      }
    }

    wheels.forEach((w) => group.add(w));

    // ==========================================
    // REALISTIC LIGHTING SYSTEM
    // ==========================================

    // 1. Dual Crystalline LED Projector Headlights
    // Left Cluster
    const projLeftInner = new THREE.Mesh(projectorSphereGeo, projectorMat);
    projLeftInner.position.set(4.08, 0.8, -1.1);
    const projLeftOuter = new THREE.Mesh(projectorSphereGeo, projectorMat);
    projLeftOuter.position.set(4.06, 0.8, -1.35);
    const drlLeft = new THREE.Mesh(drlBrowGeo, drlMat);
    drlLeft.position.set(4.06, 0.95, -1.2);
    const signalL = new THREE.Mesh(turnSignalGeo, leftSignalMat);
    signalL.position.set(4.04, 0.8, -1.6);

    // Right Cluster
    const projRightInner = new THREE.Mesh(projectorSphereGeo, projectorMat);
    projRightInner.position.set(4.08, 0.8, 1.1);
    const projRightOuter = new THREE.Mesh(projectorSphereGeo, projectorMat);
    projRightOuter.position.set(4.06, 0.8, 1.35);
    const drlRight = new THREE.Mesh(drlBrowGeo, drlMat);
    drlRight.position.set(4.06, 0.95, 1.2);
    const signalR = new THREE.Mesh(turnSignalGeo, rightSignalMat);
    signalR.position.set(4.04, 0.8, 1.6);

    group.add(
      projLeftInner, projLeftOuter, drlLeft, signalL,
      projRightInner, projRightOuter, drlRight, signalR
    );

    // 2. Dual Volumetric Forward Headlight Beams (Originate at lenses, fan forward)
    const beamL = new THREE.Mesh(singleBeamGeo, beamMaterial);
    beamL.position.set(4.1, 0.8, -1.22);

    const beamR = new THREE.Mesh(singleBeamGeo, beamMaterial);
    beamR.position.set(4.1, 0.8, 1.22);

    group.add(beamL, beamR);

    // 3. Road Surface Headlight Ground Projection Pool (Illuminates asphalt ahead)
    const roadHeadlightPool = new THREE.Mesh(roadPoolGeo, roadPoolMat);
    roadHeadlightPool.position.set(4.0, 0.035, 0);
    group.add(roadHeadlightPool);

    // 4. OLED Rear Taillight Strip & C-Clamp Clusters
    const taillightBar = new THREE.Mesh(taillightBarGeo, taillightMat);
    taillightBar.position.set(-4.06, 0.82, 0);

    const taillightClampL = new THREE.Mesh(taillightClampGeo, taillightMat);
    taillightClampL.position.set(-4.04, 0.85, -1.25);

    const taillightClampR = new THREE.Mesh(taillightClampGeo, taillightMat);
    taillightClampR.position.set(-4.04, 0.85, 1.25);

    // Central High-Mount Stop Light (CHMSL)
    const chmslMesh = new THREE.Mesh(chmslGeo, chmslMat);
    chmslMesh.position.set(-2.6, 1.85, 0);

    group.add(taillightBar, taillightClampL, taillightClampR, chmslMesh);

    // 5. Road Surface Rear Brake Reflection Pool (Blooms on deceleration)
    const roadBrakePool = new THREE.Mesh(roadBrakeGeo, roadBrakeMat);
    roadBrakePool.position.set(-4.0, 0.035, 0);
    group.add(roadBrakePool);

    // Save handles for real-time dynamic modulation
    group.userData.handles = {
      taillightMat,
      chmslMat,
      leftSignalMat,
      rightSignalMat,
      roadBrakeMat,
      roadHeadlightPool,
      wheels,
      strobeMeshBlue,
      strobeMeshRed,
      isInterceptor,
    };

    return group;
  }

  static _createWheelSet(frontX, backX, halfWidth, radius, isLarge = false) {
    const wheels = [];
    const positions = [
      [frontX, radius, -halfWidth],
      [frontX, radius, halfWidth],
      [backX, radius, -halfWidth],
      [backX, radius, halfWidth],
    ];

    const currentWheelGeo = isLarge ? largeWheelGeo : wheelGeo;
    const currentRimGeo = isLarge ? largeRimGeo : rimGeo;

    positions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(currentWheelGeo, tireMat);
      tire.castShadow = true;

      const rim = new THREE.Mesh(currentRimGeo, rimMat);

      wheelGroup.add(tire, rim);
      wheels.push(wheelGroup);
    });

    return wheels;
  }

  static _createSingleWheelSet(frontX, backX, radius) {
    const wheels = [];
    [frontX, backX].forEach((x) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, radius, 0);

      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.scale.set(0.6, 0.6, 0.6);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.scale.set(0.6, 0.6, 0.6);

      wheelGroup.add(tire, rim);
      wheels.push(wheelGroup);
    });
    return wheels;
  }

  /**
   * High-Precision Physics & Dynamic Lighting Updater
   * Modulates brake bloom, road light pools, wheel rotation, and turn signals.
   */
  static updateVehiclePhysics(group, carData, timeSeconds = 0) {
    const h = group.userData.handles;
    if (!h) return;

    const speed = carData.speed || 0;
    const isBraking = (carData.brakeIntensity && carData.brakeIntensity > 0.2) ||
      carData.status === 'slowing' || carData.status === 'stopped';

    // 1. Realistic Dynamic Taillight & Brake Bloom
    if (isBraking) {
      // Intense incandescent red bloom
      h.taillightMat.color.setHex(0xff0022);
      h.chmslMat.color.setHex(0xff0000);
      h.roadBrakeMat.opacity = Math.min(0.85, 0.45 + (carData.brakeIntensity || 0.4) * 0.4);
    } else {
      // Standard cruise OLED running red
      h.taillightMat.color.setHex(0x991b1b);
      h.chmslMat.color.setHex(0x3f0a0a);
      h.roadBrakeMat.opacity = 0.12;
    }

    // 2. Continuous Wheel Rotation
    const wheelRotDelta = speed * 0.04;
    h.wheels.forEach((w) => {
      w.rotation.z -= wheelRotDelta;
    });

    // 3. Realistic Pulsing Amber Turn Signals
    const isSignaling = (carData.pathMode === 'cross' || carData.pathMode === 'tintersection') &&
      carData.route !== 'straight' && carData.pos > 30 && carData.pos < 310;
    const blinkState = Math.sin(timeSeconds * 9) > 0;

    if (isSignaling && carData.route === 'left') {
      h.leftSignalMat.color.setHex(blinkState ? 0xf59e0b : 0x451a03);
      h.rightSignalMat.color.setHex(0x451a03);
    } else if (isSignaling && carData.route === 'right') {
      h.rightSignalMat.color.setHex(blinkState ? 0xf59e0b : 0x451a03);
      h.leftSignalMat.color.setHex(0x451a03);
    } else {
      h.leftSignalMat.color.setHex(0x451a03);
      h.rightSignalMat.color.setHex(0x451a03);
    }

    // 4. Emergency Interceptor Strobe Double-Pulse
    if (h.isInterceptor && h.strobeMeshBlue && h.strobeMeshRed) {
      const fastCycle = Math.sin(timeSeconds * 18);
      const isPulse = fastCycle > 0.2;
      const isAlternate = Math.sin(timeSeconds * 6) > 0;

      if (isAlternate) {
        h.strobeMeshBlue.material.color.setHex(isPulse ? 0x22c55e : 0x064e3b);
        h.strobeMeshRed.material.color.setHex(0x451a03);
      } else {
        h.strobeMeshBlue.material.color.setHex(0x064e3b);
        h.strobeMeshRed.material.color.setHex(isPulse ? 0xf59e0b : 0x451a03);
      }
    }
  }
}
