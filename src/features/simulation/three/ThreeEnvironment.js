import * as THREE from 'three';

// Shared Materials for Environment & Props
const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x12151b,
  roughness: 0.85,
  metalness: 0.1,
});

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x06070a,
  roughness: 0.95,
  metalness: 0.05,
});

const curbMaterial = new THREE.MeshStandardMaterial({
  color: 0x22262e,
  roughness: 0.7,
  metalness: 0.2,
});

const whitePaintMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.4,
  emissive: 0xffffff,
  emissiveIntensity: 0.15,
});

const dashedLineMaterial = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  roughness: 0.4,
  emissive: 0xdddddd,
  emissiveIntensity: 0.15,
});

const metalPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x1f232b,
  roughness: 0.4,
  metalness: 0.85,
});

const barrierMaterial = new THREE.MeshStandardMaterial({
  color: 0x2b303c,
  roughness: 0.5,
  metalness: 0.7,
});

const buildingMaterial = new THREE.MeshStandardMaterial({
  color: 0x0d1017,
  roughness: 0.3,
  metalness: 0.8,
});

const buildingGlassMaterial = new THREE.MeshStandardMaterial({
  color: 0x082038,
  roughness: 0.1,
  metalness: 0.95,
  emissive: 0x041020,
  emissiveIntensity: 0.3,
});

const treeTrunkMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1510,
  roughness: 0.9,
});

const foliageMaterial = new THREE.MeshStandardMaterial({
  color: 0x153020,
  roughness: 0.8,
  metalness: 0.1,
});

export class ThreeEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.roadGroup = new THREE.Group();
    this.propsGroup = new THREE.Group();
    this.lightsGroup = new THREE.Group();
    this.rainParticles = null;
    this.trafficLights = [];

    this.scene.add(this.roadGroup);
    this.scene.add(this.propsGroup);
    this.scene.add(this.lightsGroup);

    this._buildInfiniteFloor();
  }

  _buildInfiniteFloor() {
    // Horizon Ground Plane
    const floorGeo = new THREE.PlaneGeometry(800, 800);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, groundMaterial);
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle Grid overlay around perimeter
    const grid = new THREE.GridHelper(600, 60, 0x1a202c, 0x0f141d);
    grid.position.y = 0.01;
    this.scene.add(grid);
  }

  /**
   * Sets up lighting according to atmospheric weather
   */
  setupAtmosphere(weather = 'sunny') {
    // Clear previous lights
    while (this.lightsGroup.children.length > 0) {
      const obj = this.lightsGroup.children[0];
      this.lightsGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    let ambientColor = 0xffffff;
    let ambientIntensity = 0.85;
    let dirColor = 0xffffff;
    let dirIntensity = 1.4;

    if (weather === 'rain') {
      ambientColor = 0x8898b8;
      ambientIntensity = 0.5;
      dirColor = 0xa0b0d0;
      dirIntensity = 0.7;
      this._createRain();
    } else if (weather === 'night') {
      ambientColor = 0x141a28;
      ambientIntensity = 0.25;
      dirColor = 0x203555;
      dirIntensity = 0.3;
      this._removeRain();
    } else {
      this._removeRain();
    }

    const ambient = new THREE.AmbientLight(ambientColor, ambientIntensity);
    const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
    dirLight.position.set(80, 140, 60);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    dirLight.shadow.camera.left = -160;
    dirLight.shadow.camera.right = 160;
    dirLight.shadow.camera.top = 160;
    dirLight.shadow.camera.bottom = -160;
    dirLight.shadow.bias = -0.0005;

    this.lightsGroup.add(ambient, dirLight);

    // Add night street lighting if night or rain
    if (weather === 'night' || weather === 'rain') {
      this._addStreetlightPoles(true);
    } else {
      this._addStreetlightPoles(false);
    }
  }

  _createRain() {
    if (this.rainParticles) return;
    const count = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x99bbdd,
      size: 0.7,
      transparent: true,
      opacity: 0.65,
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
      pos[i] -= dt * 90;
      if (pos[i] < 0) {
        pos[i] = 120;
      }
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Rebuilds roads and props for intersection type
   */
  buildLayout(type = 'cross') {
    // Clear road and props groups
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
    this.trafficLights = [];

    if (type === 'roundabout') {
      this._buildRoundabout();
    } else if (type === 'tintersection') {
      this._buildTIntersection();
    } else {
      this._buildCrossroads();
    }

    this._buildEnvironmentalProps();
  }

  // 1. 4-Way Cross Corridor Layout
  _buildCrossroads() {
    const roadWidth = 96; // 384 * 0.25
    const roadLen = 400;

    // Horizontal Road (East-West)
    const hRoadGeo = new THREE.PlaneGeometry(roadLen, roadWidth);
    hRoadGeo.rotateX(-Math.PI / 2);
    const hRoad = new THREE.Mesh(hRoadGeo, asphaltMaterial);
    hRoad.receiveShadow = true;
    this.roadGroup.add(hRoad);

    // Vertical Road (North-South)
    const vRoadGeo = new THREE.PlaneGeometry(roadWidth, roadLen);
    vRoadGeo.rotateX(-Math.PI / 2);
    const vRoad = new THREE.Mesh(vRoadGeo, asphaltMaterial);
    vRoad.receiveShadow = true;
    this.roadGroup.add(vRoad);

    // Lane Markings: Double Center White Lines
    this._addRoadLine(0, 0, 400, 0.6, 0, '#ffffff'); // Horizontal center
    this._addRoadLine(0, 0, 0.6, 400, 0, '#ffffff'); // Vertical center

    // Dashed lines for 2 lanes each direction
    this._addDashedLine(0, -24, 400, 0.4, 0);
    this._addDashedLine(0, 24, 400, 0.4, 0);
    this._addDashedLine(-24, 0, 0.4, 400, 0);
    this._addDashedLine(24, 0, 0.4, 400, 0);

    // Stop Bars
    const stopOffset = 48;
    this._addStopBar(-stopOffset, 24, 0.8, 48); // West approach stop bar
    this._addStopBar(stopOffset, -24, 0.8, 48);  // East approach stop bar
    this._addStopBar(-24, -stopOffset, 48, 0.8); // North approach stop bar
    this._addStopBar(24, stopOffset, 48, 0.8);  // South approach stop bar

    // Zebra Crosswalks
    this._addZebraCrosswalk(-stopOffset - 6, 0, 6, 96, true);
    this._addZebraCrosswalk(stopOffset + 6, 0, 6, 96, true);
    this._addZebraCrosswalk(0, -stopOffset - 6, 96, 6, false);
    this._addZebraCrosswalk(0, stopOffset + 6, 96, 6, false);

    // Curbs & Motorsport Rumble Strips at the 4 corner corners
    this._addMotorsportCurbs(-stopOffset, -stopOffset, 1, 1);
    this._addMotorsportCurbs(stopOffset, -stopOffset, -1, 1);
    this._addMotorsportCurbs(-stopOffset, stopOffset, 1, -1);
    this._addMotorsportCurbs(stopOffset, stopOffset, -1, -1);

    // 3D Traffic Signal Gantries
    this._addSignalGantry(-stopOffset - 4, -48, 'south'); // controls southbound traffic
    this._addSignalGantry(stopOffset + 4, 48, 'north');   // controls northbound traffic
    this._addSignalGantry(-48, stopOffset + 4, 'east');   // controls eastbound traffic
    this._addSignalGantry(48, -stopOffset - 4, 'west');   // controls westbound traffic
  }

  // 2. Roundabout Ring Layout
  _buildRoundabout() {
    const ringInner = 26;
    const ringOuter = 58;

    // Outer circular ring asphalt
    const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, asphaltMaterial);
    ring.receiveShadow = true;
    this.roadGroup.add(ring);

    // 4 Road Spokes
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

    northArm.receiveShadow = true;
    southArm.receiveShadow = true;
    eastArm.receiveShadow = true;
    westArm.receiveShadow = true;

    this.roadGroup.add(northArm, southArm, eastArm, westArm);

    // Central Island Bevel & Beacon
    const islandCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(ringInner, ringInner + 0.5, 1.2, 48),
      curbMaterial
    );
    islandCylinder.position.y = 0.6;
    islandCylinder.receiveShadow = true;
    this.roadGroup.add(islandCylinder);

    // Center Core with M-Tricolor Bands
    const coreCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(ringInner * 0.7, ringInner * 0.7, 1.6, 32),
      buildingMaterial
    );
    coreCylinder.position.y = 0.8;
    this.roadGroup.add(coreCylinder);

    // Tricolor Rings
    const stripeBlue = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0x0066b1, emissive: 0x0066b1, emissiveIntensity: 1.5 })
    );
    stripeBlue.rotation.x = Math.PI / 2;
    stripeBlue.position.y = 1.6;

    const stripeDarkBlue = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0x1c69d4, emissive: 0x1c69d4, emissiveIntensity: 1.5 })
    );
    stripeDarkBlue.rotation.x = Math.PI / 2;
    stripeDarkBlue.position.y = 1.2;

    const stripeRed = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xe22718, emissive: 0xe22718, emissiveIntensity: 1.5 })
    );
    stripeRed.rotation.x = Math.PI / 2;
    stripeRed.position.y = 0.8;

    this.roadGroup.add(stripeBlue, stripeDarkBlue, stripeRed);

    // Center Autonomous Tower
    const towerMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 14, 16), metalPoleMaterial);
    towerMesh.position.set(0, 7.5, 0);
    const towerHead = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1c69d4, emissive: 0x1c69d4, emissiveIntensity: 2.0 })
    );
    towerHead.position.set(0, 14.5, 0);
    this.roadGroup.add(towerMesh, towerHead);

    // Yield Signal Gantries on 4 legs
    this._addSignalGantry(20, -ringOuter - 5, 'south');
    this._addSignalGantry(-20, ringOuter + 5, 'north');
    this._addSignalGantry(ringOuter + 5, 20, 'west');
    this._addSignalGantry(-ringOuter - 5, -20, 'east');
  }

  // 3. T-Junction Layout
  _buildTIntersection() {
    const roadWidth = 80;
    const roadLen = 400;

    // Main Highway Corridor (East-West)
    const mainRoadGeo = new THREE.PlaneGeometry(roadLen, roadWidth);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, asphaltMaterial);
    mainRoad.position.set(0, 0, -20);
    mainRoad.receiveShadow = true;
    this.roadGroup.add(mainRoad);

    // Stem Road (South)
    const stemGeo = new THREE.PlaneGeometry(roadWidth, 140);
    stemGeo.rotateX(-Math.PI / 2);
    const stemRoad = new THREE.Mesh(stemGeo, asphaltMaterial);
    stemRoad.position.set(0, 0, 70);
    stemRoad.receiveShadow = true;
    this.roadGroup.add(stemRoad);

    // Markings
    this._addRoadLine(0, -20, 400, 0.6, 0, '#ffffff');
    this._addRoadLine(0, 70, 0.6, 140, 0, '#ffffff');

    // Stop Bars
    this._addStopBar(-42, -20, 0.8, roadWidth);
    this._addStopBar(42, -20, 0.8, roadWidth);
    this._addStopBar(0, 20, roadWidth, 0.8);

    // Signals
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
    mesh.rotation.y = angle;
    this.roadGroup.add(mesh);
  }

  _addDashedLine(x, z, w, d, angle = 0) {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, dashedLineMaterial);
    mesh.position.set(x, 0.02, z);
    mesh.rotation.y = angle;
    this.roadGroup.add(mesh);
  }

  _addStopBar(x, z, w, d) {
    const geo = new THREE.PlaneGeometry(w, d);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, whitePaintMaterial);
    mesh.position.set(x, 0.03, z);
    this.roadGroup.add(mesh);
  }

  _addZebraCrosswalk(x, z, w, d, isVertical = false) {
    const stripes = 8;
    const group = new THREE.Group();
    group.position.set(x, 0.025, z);

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

  _addMotorsportCurbs(x, z, dirX, dirZ) {
    const curbBox = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.5, 4),
      new THREE.MeshStandardMaterial({
        color: 0x0066b1,
        roughness: 0.6,
      })
    );
    curbBox.position.set(x + dirX * 9, 0.25, z + dirZ * 2);
    this.roadGroup.add(curbBox);
  }

  // 3D Traffic Signal Gantries
  _addSignalGantry(x, z, directionCode) {
    const gantry = new THREE.Group();
    gantry.position.set(x, 0, z);

    // Mast Pole
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 12, 12), metalPoleMaterial);
    mast.position.y = 6;
    mast.castShadow = true;

    // Cantilever arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 0.6), metalPoleMaterial);
    arm.position.set(5, 11.5, 0);

    // Signal Housing (Rectangular black enclosure)
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 5.2, 1.6), metalPoleMaterial);
    housing.position.set(10, 9.5, 0);

    // 3 Lenses: Red, Amber, Green
    const lensGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.25, 16);
    lensGeo.rotateX(Math.PI / 2);

    const redLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshStandardMaterial({ color: 0x220505, emissive: 0xe22718, emissiveIntensity: 2.5 })
    );
    redLens.position.set(10, 11.0, 0.8);

    const amberLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshStandardMaterial({ color: 0x221505, emissive: 0xf4b400, emissiveIntensity: 0.1 })
    );
    amberLens.position.set(10, 9.5, 0.8);

    const greenLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshStandardMaterial({ color: 0x052205, emissive: 0x0fa336, emissiveIntensity: 0.1 })
    );
    greenLens.position.set(10, 8.0, 0.8);

    gantry.add(mast, arm, housing, redLens, amberLens, greenLens);
    this.roadGroup.add(gantry);

    this.trafficLights.push({
      direction: directionCode,
      redLens,
      amberLens,
      greenLens,
    });
  }

  updateSignalStates(lightState) {
    if (!lightState) return;

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

      // Update emissive intensity
      light.redLens.material.emissiveIntensity = state === 'RED' ? 2.5 : 0.1;
      light.amberLens.material.emissiveIntensity = state === 'YELLOW' ? 2.8 : 0.1;
      light.greenLens.material.emissiveIntensity = state === 'GREEN' ? 2.5 : 0.1;
    });
  }

  _addStreetlightPoles(turnOnLights = false) {
    const lampPositions = [
      [-120, -56], [-60, -56], [60, -56], [120, -56],
      [-120, 56], [-60, 56], [60, 56], [120, 56],
      [-56, -120], [-56, -60], [-56, 60], [-56, 120],
      [56, -120], [56, -60], [56, 60], [56, 120],
    ];

    lampPositions.forEach(([x, z]) => {
      const pole = new THREE.Group();
      pole.position.set(x, 0, z);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 14, 8), metalPoleMaterial);
      shaft.position.y = 7;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 0.3), metalPoleMaterial);
      arm.position.set(x > 0 ? -2.0 : 2.0, 13.8, 0);

      const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.3, 1.0),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: turnOnLights ? 0xfff0dd : 0x222222,
          emissiveIntensity: turnOnLights ? 2.0 : 0.1,
        })
      );
      head.position.set(x > 0 ? -3.8 : 3.8, 13.6, 0);

      pole.add(shaft, arm, head);

      if (turnOnLights) {
        const spot = new THREE.SpotLight(0xffeedd, 1.2, 45, Math.PI / 4, 0.5, 2);
        spot.position.set(x > 0 ? -3.8 : 3.8, 13.5, 0);
        spot.target.position.set(x > 0 ? -3.8 : 3.8, 0, 0);
        pole.add(spot);
        pole.add(spot.target);
      }

      this.propsGroup.add(pole);
    });
  }

  // Peripheral Environmental Tech Architecture & Props
  _buildEnvironmentalProps() {
    // 1. Futuristic Tech Proving Ground Buildings in Periphery
    const buildings = [
      { x: -140, z: -110, w: 45, h: 28, d: 35 },
      { x: 140, z: -110, w: 55, h: 36, d: 40 },
      { x: -140, z: 110, w: 50, h: 32, d: 38 },
      { x: 140, z: 110, w: 42, h: 25, d: 32 },
    ];

    buildings.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);

      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), buildingMaterial);
      bMesh.position.y = b.h / 2;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;

      // Illuminated Ribbon Windows
      const glass = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.4, b.h * 0.4, b.d + 0.4), buildingGlassMaterial);
      glass.position.y = b.h * 0.6;

      bGroup.add(bMesh, glass);
      this.propsGroup.add(bGroup);
    });

    // 2. High-Tech Overhead Telemetry Gantry Sign
    const gantryBridge = new THREE.Group();
    gantryBridge.position.set(0, 0, -85);

    const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 18, 12), metalPoleMaterial);
    pLeft.position.set(-54, 9, 0);
    const pRight = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 18, 12), metalPoleMaterial);
    pRight.position.set(54, 9, 0);

    const span = new THREE.Mesh(new THREE.BoxGeometry(110, 1.4, 1.4), metalPoleMaterial);
    span.position.set(0, 17.5, 0);

    const ledSign = new THREE.Mesh(
      new THREE.BoxGeometry(45, 4.5, 0.6),
      new THREE.MeshStandardMaterial({
        color: 0x050a12,
        emissive: 0x0066b1,
        emissiveIntensity: 0.8,
      })
    );
    ledSign.position.set(0, 17.5, 0.8);

    gantryBridge.add(pLeft, pRight, span, ledSign);
    this.propsGroup.add(gantryBridge);

    // 3. Stylized Carbon/Greenery Foliage Trees
    const treeCoords = [
      [-95, -85], [-115, -75], [-75, -115],
      [95, -85], [115, -75], [75, -115],
      [-95, 85], [-115, 75], [-75, 115],
      [95, 85], [115, 75], [75, 115],
    ];

    treeCoords.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 3.5, 6), treeTrunkMaterial);
      trunk.position.y = 1.75;

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(3.0, 7.0, 7), foliageMaterial);
      foliage.position.y = 6.0;
      foliage.castShadow = true;

      tree.add(trunk, foliage);
      this.propsGroup.add(tree);
    });

    // 4. Guardrails Along Highway Shoulders
    const guardrailZ = 52;
    [-1, 1].forEach((side) => {
      const guardrail = new THREE.Mesh(
        new THREE.BoxGeometry(180, 1.2, 0.4),
        barrierMaterial
      );
      guardrail.position.set(side * 100, 0.6, -guardrailZ);
      this.propsGroup.add(guardrail);

      const guardrailBottom = new THREE.Mesh(
        new THREE.BoxGeometry(180, 1.2, 0.4),
        barrierMaterial
      );
      guardrailBottom.position.set(side * 100, 0.6, guardrailZ);
      this.propsGroup.add(guardrailBottom);
    });
  }
}
