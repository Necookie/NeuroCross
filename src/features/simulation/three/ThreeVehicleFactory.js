import * as THREE from 'three';

// Vehicle color palettes according to NeuroCross Design System
const COLOR_PALETTE = [
  0xf5f5f5, // Alpine White
  0xe22718, // M Red
  0x0066b1, // M Blue Light
  0x1c69d4, // M Blue Dark
  0x2a2e33, // Carbon Gunmetal
  0xb88a2a, // Isle of Man Bronze
  0x1f3b2b, // Deep Forest Green
  0x59606d, // Brooklyn Gray
  0xd64515, // Sunset Orange
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

// Reusable shared materials
const tireMaterial = new THREE.MeshStandardMaterial({
  color: 0x111114,
  roughness: 0.85,
  metalness: 0.1,
});

const rimMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.3,
  metalness: 0.8,
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0f18,
  roughness: 0.1,
  metalness: 0.9,
});

const carbonMaterial = new THREE.MeshStandardMaterial({
  color: 0x18181c,
  roughness: 0.4,
  metalness: 0.7,
});

const headlightMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 2.0,
  roughness: 0.2,
});

const amberSignalMaterial = new THREE.MeshStandardMaterial({
  color: 0xf4b400,
  emissive: 0xf4b400,
  emissiveIntensity: 0.0,
  roughness: 0.3,
});

// Reusable shared geometries
const wheelGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16);
wheelGeometry.rotateX(Math.PI / 2);

export class ThreeVehicleFactory {
  /**
   * Builds a procedural 3D vehicle group based on vehicle type and specs.
   */
  static createVehicle(data) {
    const type = data.type || 'coupe';
    const isInterceptor = type === 'interceptor' || data.isInterceptor;

    const group = new THREE.Group();
    group.name = `vehicle-${data.id}`;
    group.userData = { id: data.id, type, data };

    // Select body color
    let bodyColor = isInterceptor ? 0x0d0f14 : COLOR_PALETTE[hashId(data.id) % COLOR_PALETTE.length];
    if (type === 'bus') bodyColor = 0x0066b1;
    if (type === 'prototype') bodyColor = 0x1c69d4;

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.25,
      metalness: 0.65,
    });

    // Each vehicle instance gets its own taillight material for blooming under braking
    const taillightMat = new THREE.MeshStandardMaterial({
      color: 0xe22718,
      emissive: 0xe22718,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });

    const leftSignalMat = amberSignalMaterial.clone();
    const rightSignalMat = amberSignalMaterial.clone();

    // Red brake point light
    const brakeLight = new THREE.PointLight(0xe22718, 0, 15, 2);
    brakeLight.castShadow = false;

    // Headlight spots (forward along +X)
    const headlightLeft = new THREE.SpotLight(0xffffff, 1.2, 35, Math.PI / 7, 0.4, 1.8);
    headlightLeft.target.position.set(30, 0, -1.2);
    headlightLeft.castShadow = false;

    const headlightRight = new THREE.SpotLight(0xffffff, 1.2, 35, Math.PI / 7, 0.4, 1.8);
    headlightRight.target.position.set(30, 0, 1.2);
    headlightRight.castShadow = false;

    group.add(headlightLeft.target);
    group.add(headlightRight.target);

    let wheels = [];
    let strobeBlue = null;
    let strobeRed = null;

    // Construct vehicle-specific 3D geometry
    switch (type) {
      case 'prototype': {
        // Le Mans GT Prototype
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.8, 3.8), bodyMaterial);
        chassis.position.y = 0.6;
        chassis.castShadow = true;
        group.add(chassis);

        // Cockpit canopy
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.0, 2.0), glassMaterial);
        canopy.position.set(0.2, 1.4, 0);
        canopy.castShadow = true;
        group.add(canopy);

        // Shark Fin
        const fin = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 0.15), carbonMaterial);
        fin.position.set(-1.2, 1.5, 0);
        group.add(fin);

        // Rear Wing
        const wing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 4.0), carbonMaterial);
        wing.position.set(-3.8, 2.0, 0);
        const wingPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.1), carbonMaterial);
        wingPillarL.position.set(-3.8, 1.5, -1.4);
        const wingPillarR = wingPillarL.clone();
        wingPillarR.position.set(-3.8, 1.5, 1.4);
        group.add(wing, wingPillarL, wingPillarR);

        wheels = this._createWheelSet(2.6, -2.6, 1.8, 0.7);
        break;
      }

      case 'truck': {
        // Heavy Hauler Truck (Cab + Trailer)
        const cab = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.6, 3.8), bodyMaterial);
        cab.position.set(4.5, 2.2, 0);
        cab.castShadow = true;

        const cabWindshield = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 3.6), glassMaterial);
        cabWindshield.position.set(5.5, 2.8, 0);

        const trailer = new THREE.Mesh(new THREE.BoxGeometry(10.0, 4.0, 3.8), carbonMaterial);
        trailer.position.set(-3.5, 2.6, 0);
        trailer.castShadow = true;

        group.add(cab, cabWindshield, trailer);
        wheels = this._createWheelSet(5.0, 5.0, 1.9, 0.9);
        const trailerWheels = this._createWheelSet(-4.0, -7.0, 1.9, 0.9);
        wheels.push(...trailerWheels);
        break;
      }

      case 'bus': {
        // Autonomous City Transit Bus
        const busBody = new THREE.Mesh(new THREE.BoxGeometry(13.0, 3.4, 3.8), bodyMaterial);
        busBody.position.y = 2.0;
        busBody.castShadow = true;

        const glassStrip = new THREE.Mesh(new THREE.BoxGeometry(11.5, 1.6, 3.9), glassMaterial);
        glassStrip.position.set(0.2, 2.2, 0);

        const acUnit = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 2.4), carbonMaterial);
        acUnit.position.set(-1.0, 3.9, 0);

        group.add(busBody, glassStrip, acUnit);
        wheels = this._createWheelSet(4.5, -4.5, 1.8, 0.85);
        break;
      }

      case 'van': {
        // Commercial Transporter Van
        const vanBody = new THREE.Mesh(new THREE.BoxGeometry(9.0, 2.8, 3.6), bodyMaterial);
        vanBody.position.y = 1.7;
        vanBody.castShadow = true;

        const vanGlass = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 3.65), glassMaterial);
        vanGlass.position.set(2.4, 2.1, 0);

        group.add(vanBody, vanGlass);
        wheels = this._createWheelSet(2.8, -2.8, 1.8, 0.75);
        break;
      }

      case 'suv': {
        // Muscular M-SAV / SUV
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.6, 3.8), bodyMaterial);
        lowerBody.position.y = 1.1;
        lowerBody.castShadow = true;

        const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 3.3), glassMaterial);
        greenhouse.position.set(-0.4, 2.2, 0);
        greenhouse.castShadow = true;

        const roofRails = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.15, 3.2), carbonMaterial);
        roofRails.position.set(-0.4, 2.95, 0);

        group.add(lowerBody, greenhouse, roofRails);
        wheels = this._createWheelSet(2.5, -2.5, 1.9, 0.8);
        break;
      }

      case 'sedan': {
        // Executive Gran Sedan
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 3.6), bodyMaterial);
        lowerBody.position.y = 0.9;
        lowerBody.castShadow = true;

        const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 3.1), glassMaterial);
        greenhouse.position.set(-0.3, 1.8, 0);
        greenhouse.castShadow = true;

        const carbonRoof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 3.0), carbonMaterial);
        carbonRoof.position.set(-0.3, 2.35, 0);

        group.add(lowerBody, greenhouse, carbonRoof);
        wheels = this._createWheelSet(2.6, -2.6, 1.8, 0.75);
        break;
      }

      case 'bike': {
        // Sportbike & Rider
        const frame = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.8, 0.9), bodyMaterial);
        frame.position.y = 0.9;
        const rider = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 1.1), carbonMaterial);
        rider.position.set(-0.2, 1.7, 0);
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), bodyMaterial);
        helmet.position.set(0.3, 2.3, 0);

        group.add(frame, rider, helmet);
        wheels = this._createWheelSet(1.5, -1.5, 0.45, 0.7);
        break;
      }

      case 'interceptor':
      case 'coupe':
      default: {
        // High-Performance M-Coupe / Interceptor
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.1, 3.5), bodyMaterial);
        lowerBody.position.y = 0.85;
        lowerBody.castShadow = true;

        const greenhouse = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 2.9), glassMaterial);
        greenhouse.position.set(-0.3, 1.65, 0);
        greenhouse.castShadow = true;

        const carbonRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 2.8), carbonMaterial);
        carbonRoof.position.set(-0.3, 2.15, 0);

        // Rear Lip Spoiler
        const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 3.3), carbonMaterial);
        spoiler.position.set(-3.7, 1.45, 0);

        group.add(lowerBody, greenhouse, carbonRoof, spoiler);

        // Interceptor Rooftop Emergency Strobe Lightbar
        if (isInterceptor) {
          const lightbarBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 2.4), carbonMaterial);
          lightbarBase.position.set(-0.3, 2.3, 0);

          const blueStrobeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.25, 1.0),
            new THREE.MeshStandardMaterial({ color: 0x0066b1, emissive: 0x0066b1, emissiveIntensity: 2.5 })
          );
          blueStrobeMesh.position.set(-0.3, 2.45, -0.6);

          const redStrobeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.25, 1.0),
            new THREE.MeshStandardMaterial({ color: 0xe22718, emissive: 0xe22718, emissiveIntensity: 2.5 })
          );
          redStrobeMesh.position.set(-0.3, 2.45, 0.6);

          strobeBlue = new THREE.PointLight(0x0066b1, 2.0, 12, 2);
          strobeBlue.position.set(-0.3, 2.6, -0.6);

          strobeRed = new THREE.PointLight(0xe22718, 2.0, 12, 2);
          strobeRed.position.set(-0.3, 2.6, 0.6);

          group.add(lightbarBase, blueStrobeMesh, redStrobeMesh, strobeBlue, strobeRed);
        }

        wheels = this._createWheelSet(2.3, -2.3, 1.75, 0.72);
        break;
      }
    }

    // Add wheels to group
    wheels.forEach((w) => group.add(w));

    // Headlight Meshes (Front +X)
    const headX = (type === 'truck' ? 7.0 : type === 'bus' ? 6.5 : 3.8);
    const headY = 1.0;
    const headZ = (type === 'bike' ? 0 : 1.4);

    const headMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.6), headlightMaterial);
    headMeshL.position.set(headX, headY, -headZ);
    const headMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.6), headlightMaterial);
    headMeshR.position.set(headX, headY, headZ);
    group.add(headMeshL, headMeshR);

    // Position Spotlights
    headlightLeft.position.set(headX + 0.5, headY, -headZ);
    headlightRight.position.set(headX + 0.5, headY, headZ);
    group.add(headlightLeft, headlightRight);

    // Taillight Meshes (Rear -X)
    const tailX = (type === 'truck' ? -8.5 : type === 'bus' ? -6.5 : -3.8);
    const tailY = 1.0;
    const tailZ = (type === 'bike' ? 0 : 1.35);

    const tailMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.6), taillightMat);
    tailMeshL.position.set(tailX, tailY, -tailZ);
    const tailMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.6), taillightMat);
    tailMeshR.position.set(tailX, tailY, tailZ);
    group.add(tailMeshL, tailMeshR);

    // Brake light point light
    brakeLight.position.set(tailX - 1.5, tailY + 0.2, 0);
    group.add(brakeLight);

    // Turn Signal Meshes
    const sigFrontL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), leftSignalMat);
    sigFrontL.position.set(headX - 0.2, headY, -headZ - 0.3);
    const sigRearL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), leftSignalMat);
    sigRearL.position.set(tailX + 0.2, tailY, -tailZ - 0.3);

    const sigFrontR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), rightSignalMat);
    sigFrontR.position.set(headX - 0.2, headY, headZ + 0.3);
    const sigRearR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), rightSignalMat);
    sigRearR.position.set(tailX + 0.2, tailY, tailZ + 0.3);

    group.add(sigFrontL, sigRearL, sigFrontR, sigRearR);

    // Attach reference handles for real-time per-frame physics updates
    group.userData.handles = {
      wheels,
      taillightMat,
      brakeLight,
      headlightLeft,
      headlightRight,
      leftSignalMat,
      rightSignalMat,
      strobeBlue,
      strobeRed,
      isInterceptor,
    };

    return group;
  }

  static _createWheelSet(frontX, rearX, zOffset, radius) {
    const wheels = [];
    const positions = [
      [frontX, radius * 0.95, -zOffset],
      [frontX, radius * 0.95, zOffset],
      [rearX, radius * 0.95, -zOffset],
      [rearX, radius * 0.95, zOffset],
    ];

    positions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      const tire = new THREE.Mesh(wheelGeometry, tireMaterial);
      tire.scale.set(radius / 0.7, 1.0, radius / 0.7);
      tire.castShadow = true;

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, 0.52, 8), rimMaterial);
      rim.rotateX(Math.PI / 2);

      wheelGroup.add(tire, rim);
      wheels.push(wheelGroup);
    });

    return wheels;
  }

  /**
   * Updates a 3D vehicle instance with live simulation physics state.
   */
  static updateVehiclePhysics(group, carData, timeSeconds = 0) {
    const h = group.userData.handles;
    if (!h) return;

    const speed = carData.speed || 0;
    const isBraking = (carData.brakeIntensity && carData.brakeIntensity > 0.2) || carData.status === 'slowing' || carData.status === 'stopped';

    // 1. Taillight / Brake glow modulation
    if (isBraking) {
      h.taillightMat.emissiveIntensity = 2.8;
      h.brakeLight.intensity = Math.min(3.5, 1.5 + (carData.brakeIntensity || 0.8) * 2.0);
    } else {
      h.taillightMat.emissiveIntensity = 0.6;
      h.brakeLight.intensity = 0;
    }

    // 2. Wheel rotation proportional to speed
    const wheelRotDelta = (speed * 0.04);
    h.wheels.forEach((w) => {
      w.rotation.z -= wheelRotDelta;
    });

    // 3. Turn Signals (amber blinking)
    const isSignaling = (carData.pathMode === 'cross' || carData.pathMode === 'tintersection') &&
      carData.route !== 'straight' && carData.pos > 30 && carData.pos < 310;
    const blinkState = Math.sin(timeSeconds * 8) > 0;

    if (isSignaling && carData.route === 'left') {
      h.leftSignalMat.emissiveIntensity = blinkState ? 2.5 : 0.0;
      h.rightSignalMat.emissiveIntensity = 0.0;
    } else if (isSignaling && carData.route === 'right') {
      h.rightSignalMat.emissiveIntensity = blinkState ? 2.5 : 0.0;
      h.leftSignalMat.emissiveIntensity = 0.0;
    } else {
      h.leftSignalMat.emissiveIntensity = 0.0;
      h.rightSignalMat.emissiveIntensity = 0.0;
    }

    // 4. Interceptor Strobe Alternation
    if (h.isInterceptor && h.strobeBlue && h.strobeRed) {
      const strobePhase = Math.sin(timeSeconds * 16) > 0;
      h.strobeBlue.intensity = strobePhase ? 3.0 : 0.1;
      h.strobeRed.intensity = strobePhase ? 0.1 : 3.0;
    }
  }
}
