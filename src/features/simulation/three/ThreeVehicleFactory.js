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
// PRE-ALLOCATED SHARED REUSABLE GEOMETRIES
// (Prevents GPU garbage collection spikes)
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
const beamGeo = new THREE.ConeGeometry(3.2, 22, 12, 1, true);
beamGeo.rotateZ(-Math.PI / 2);
beamGeo.translate(11, 0, 0);

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

// Lens Geometries
const headlightLensGeo = new THREE.BoxGeometry(0.15, 0.35, 0.7);
const taillightLensGeo = new THREE.BoxGeometry(0.15, 0.3, 0.8);
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

const headlightMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const beamMat = new THREE.MeshBasicMaterial({
  color: 0xe8f5ec,
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
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
   * Builds an ultra-high performance procedural 3D vehicle group.
   * Zero dynamic point/spot lights for consistent 60-120 FPS.
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

    // Each vehicle instance gets cloned taillight & signal materials for state updates
    const taillightMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
    });

    const leftSignalMat = new THREE.MeshBasicMaterial({
      color: 0x451a03,
    });

    const rightSignalMat = new THREE.MeshBasicMaterial({
      color: 0x451a03,
    });

    let wheels = [];
    let strobeMeshBlue = null;
    let strobeMeshRed = null;

    // Construct vehicle geometry using shared geometries
    switch (type) {
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

        // Pursuit Emergency Strobe Bar for Interceptor
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

    // Attach wheels to group
    wheels.forEach((w) => group.add(w));

    // Headlight Meshes & High-Efficiency Volumetric Beams
    const headlightL = new THREE.Mesh(headlightLensGeo, headlightMat);
    headlightL.position.set(4.05, 0.8, -1.2);

    const headlightR = new THREE.Mesh(headlightLensGeo, headlightMat);
    headlightR.position.set(4.05, 0.8, 1.2);

    const beamL = new THREE.Mesh(beamGeo, beamMat);
    beamL.position.set(4.1, 0.8, -1.2);

    const beamR = new THREE.Mesh(beamGeo, beamMat);
    beamR.position.set(4.1, 0.8, 1.2);

    // Taillight Meshes
    const taillightL = new THREE.Mesh(taillightLensGeo, taillightMat);
    taillightL.position.set(-4.05, 0.8, -1.2);

    const taillightR = new THREE.Mesh(taillightLensGeo, taillightMat);
    taillightR.position.set(-4.05, 0.8, 1.2);

    // Amber Turn Indicators
    const signalL = new THREE.Mesh(headlightLensGeo, leftSignalMat);
    signalL.position.set(4.05, 0.8, -1.55);

    const signalR = new THREE.Mesh(headlightLensGeo, rightSignalMat);
    signalR.position.set(4.05, 0.8, 1.55);

    group.add(headlightL, headlightR, beamL, beamR, taillightL, taillightR, signalL, signalR);

    // Save handles for zero-alloc update loop
    group.userData.handles = {
      taillightMat,
      leftSignalMat,
      rightSignalMat,
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
   * Super-fast 60 FPS physics and dynamic state updater.
   * Modulates colors and spins wheels with zero memory allocations.
   */
  static updateVehiclePhysics(group, carData, timeSeconds = 0) {
    const h = group.userData.handles;
    if (!h) return;

    const speed = carData.speed || 0;
    const isBraking = (carData.brakeIntensity && carData.brakeIntensity > 0.2) ||
      carData.status === 'slowing' || carData.status === 'stopped';

    // 1. Taillight / Brake glow modulation
    if (isBraking) {
      h.taillightMat.color.setHex(0xff0000);
    } else {
      h.taillightMat.color.setHex(0x7f1d1d);
    }

    // 2. Wheel rotation proportional to velocity
    const wheelRotDelta = speed * 0.04;
    h.wheels.forEach((w) => {
      w.rotation.z -= wheelRotDelta;
    });

    // 3. Turn Signals (amber blinker)
    const isSignaling = (carData.pathMode === 'cross' || carData.pathMode === 'tintersection') &&
      carData.route !== 'straight' && carData.pos > 30 && carData.pos < 310;
    const blinkState = Math.sin(timeSeconds * 8) > 0;

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

    // 4. Interceptor Strobe Alternation (Green & Amber)
    if (h.isInterceptor && h.strobeMeshBlue && h.strobeMeshRed) {
      const strobePhase = Math.sin(timeSeconds * 16) > 0;
      h.strobeMeshBlue.material.color.setHex(strobePhase ? 0x22c55e : 0x064e3b);
      h.strobeMeshRed.material.color.setHex(strobePhase ? 0x78350f : 0xf59e0b);
    }
  }
}
