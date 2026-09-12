import * as THREE from 'three';

// Shared Materials for Environment & Props
const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x252d27, // Dark mineral eco-asphalt
  roughness: 0.85,
  metalness: 0.1,
});

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a784e, // Lush Meadow Grass
  roughness: 0.95,
  metalness: 0.05,
});

const curbMaterial = new THREE.MeshStandardMaterial({
  color: 0xcfdcd3, // Clean stone kerb
  roughness: 0.6,
  metalness: 0.15,
});

const whitePaintMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

const dashedLineMaterial = new THREE.MeshBasicMaterial({
  color: 0xe2ece5,
});

const metalPoleMaterial = new THREE.MeshStandardMaterial({
  color: 0x37473e,
  roughness: 0.4,
  metalness: 0.8,
});

const barrierMaterial = new THREE.MeshStandardMaterial({
  color: 0x5a7063,
  roughness: 0.5,
  metalness: 0.6,
});

const buildingWoodMaterial = new THREE.MeshStandardMaterial({
  color: 0xc2a67e, // Light natural timber facade
  roughness: 0.7,
  metalness: 0.1,
});

const buildingWhiteMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0f5f1, // Eco white composite
  roughness: 0.3,
  metalness: 0.2,
});

const buildingGlassMaterial = new THREE.MeshStandardMaterial({
  color: 0x164e35, // Solar green photovoltaic glass
  roughness: 0.1,
  metalness: 0.9,
});

const treeTrunkMaterial = new THREE.MeshStandardMaterial({
  color: 0x3e2c1e, // Natural bark
  roughness: 0.9,
});

const foliageDarkMaterial = new THREE.MeshStandardMaterial({
  color: 0x1b4d2e, // Deep pine green
  roughness: 0.8,
});

const foliageLightMaterial = new THREE.MeshStandardMaterial({
  color: 0x2e7d32, // Vibrant leaf green
  roughness: 0.8,
});

const foliageSproutMaterial = new THREE.MeshStandardMaterial({
  color: 0x43a047, // Fresh meadow green
  roughness: 0.75,
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
    // Proving Ground Meadow Floor
    const floorGeo = new THREE.PlaneGeometry(800, 800);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, groundMaterial);
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle Eco Meadow Grid
    const grid = new THREE.GridHelper(600, 60, 0x5a8c5f, 0x416d45);
    grid.position.y = 0.01;
    this.scene.add(grid);
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
    let sunIntensity = 1.35;
    let skyColor = 0xdcf0e4;
    let groundColor = 0x3d6642;
    let hemiIntensity = 0.85;

    if (weather === 'rain') {
      sunColor = 0xb4c8bd;
      sunIntensity = 0.65;
      skyColor = 0xa4beaf;
      groundColor = 0x2a4731;
      hemiIntensity = 0.6;
      this._createRain();
    } else if (weather === 'night') {
      sunColor = 0x1b3528;
      sunIntensity = 0.3;
      skyColor = 0x0f241a;
      groundColor = 0x081710;
      hemiIntensity = 0.4;
      this._removeRain();
    } else {
      this._removeRain();
    }

    // Natural Sky & Ground Light Bounce
    const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
    hemiLight.position.set(0, 150, 0);

    // Optimized Directional Sunlight with 1024x1024 shadow map
    const dirLight = new THREE.DirectionalLight(sunColor, sunIntensity);
    dirLight.position.set(70, 130, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 350;
    dirLight.shadow.camera.left = -150;
    dirLight.shadow.camera.right = 150;
    dirLight.shadow.camera.top = 150;
    dirLight.shadow.camera.bottom = -150;
    dirLight.shadow.bias = -0.0006;

    this.lightsGroup.add(hemiLight, dirLight);

    // Add streetlight fixtures
    this._addStreetlightPoles(weather === 'night' || weather === 'rain');
  }

  _createRain() {
    if (this.rainParticles) return;
    const count = 1500; // Optimized count for 60fps
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = Math.random() * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x94bca4,
      size: 0.6,
      transparent: true,
      opacity: 0.5,
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
      pos[i] -= dt * 75;
      if (pos[i] < 0) {
        pos[i] = 100;
      }
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Rebuilds roads and props for intersection type
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
    const roadWidth = 96;
    const roadLen = 400;

    // Horizontal Road
    const hRoadGeo = new THREE.PlaneGeometry(roadLen, roadWidth);
    hRoadGeo.rotateX(-Math.PI / 2);
    const hRoad = new THREE.Mesh(hRoadGeo, asphaltMaterial);
    hRoad.receiveShadow = true;
    this.roadGroup.add(hRoad);

    // Vertical Road
    const vRoadGeo = new THREE.PlaneGeometry(roadWidth, roadLen);
    vRoadGeo.rotateX(-Math.PI / 2);
    const vRoad = new THREE.Mesh(vRoadGeo, asphaltMaterial);
    vRoad.receiveShadow = true;
    this.roadGroup.add(vRoad);

    // Double Center White Lines
    this._addRoadLine(0, 0, 400, 0.6, 0, '#ffffff');
    this._addRoadLine(0, 0, 0.6, 400, 0, '#ffffff');

    // Dashed lines
    this._addDashedLine(0, -24, 400, 0.4, 0);
    this._addDashedLine(0, 24, 400, 0.4, 0);
    this._addDashedLine(-24, 0, 0.4, 400, 0);
    this._addDashedLine(24, 0, 0.4, 400, 0);

    // Stop Bars
    const stopOffset = 48;
    this._addStopBar(-stopOffset, 24, 0.8, 48);
    this._addStopBar(stopOffset, -24, 0.8, 48);
    this._addStopBar(-24, -stopOffset, 48, 0.8);
    this._addStopBar(24, stopOffset, 48, 0.8);

    // Crosswalks
    this._addZebraCrosswalk(-stopOffset - 6, 0, 6, 96, true);
    this._addZebraCrosswalk(stopOffset + 6, 0, 6, 96, true);
    this._addZebraCrosswalk(0, -stopOffset - 6, 96, 6, false);
    this._addZebraCrosswalk(0, stopOffset + 6, 96, 6, false);

    // Eco Nature Rumble Curbs (Emerald Green & White)
    this._addNatureCurbs(-stopOffset, -stopOffset, 1, 1);
    this._addNatureCurbs(stopOffset, -stopOffset, -1, 1);
    this._addNatureCurbs(-stopOffset, stopOffset, 1, -1);
    this._addNatureCurbs(stopOffset, stopOffset, -1, -1);

    // Signal Gantries
    this._addSignalGantry(-stopOffset - 4, -48, 'south');
    this._addSignalGantry(stopOffset + 4, 48, 'north');
    this._addSignalGantry(-48, stopOffset + 4, 'east');
    this._addSignalGantry(48, -stopOffset - 4, 'west');
  }

  // 2. Roundabout Ring Layout with Botanical Island
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

    northArm.receiveShadow = true;
    southArm.receiveShadow = true;
    eastArm.receiveShadow = true;
    westArm.receiveShadow = true;

    this.roadGroup.add(northArm, southArm, eastArm, westArm);

    // Central Botanical Island
    const islandCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(ringInner, ringInner + 0.5, 1.2, 36),
      curbMaterial
    );
    islandCylinder.position.y = 0.6;
    islandCylinder.receiveShadow = true;
    this.roadGroup.add(islandCylinder);

    // Botanical Lawn Core
    const turfCore = new THREE.Mesh(
      new THREE.CylinderGeometry(ringInner * 0.95, ringInner * 0.95, 0.4, 32),
      groundMaterial
    );
    turfCore.position.y = 1.1;
    this.roadGroup.add(turfCore);

    // Eco Tricolor Rings (Pine -> Emerald -> Sprout)
    const stripePine = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0x0f3d28 })
    );
    stripePine.rotation.x = Math.PI / 2;
    stripePine.position.y = 1.4;

    const stripeEmerald = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0x16a34a })
    );
    stripeEmerald.rotation.x = Math.PI / 2;
    stripeEmerald.position.y = 1.1;

    const stripeSprout = new THREE.Mesh(
      new THREE.TorusGeometry(ringInner * 0.72, 0.25, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0x84cc16 })
    );
    stripeSprout.rotation.x = Math.PI / 2;
    stripeSprout.position.y = 0.8;

    this.roadGroup.add(stripePine, stripeEmerald, stripeSprout);

    // Solar Telemetry Beacon Tower
    const towerMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.0, 14, 12), metalPoleMaterial);
    towerMesh.position.set(0, 7.5, 0);
    const towerHead = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    towerHead.position.set(0, 14.5, 0);
    this.roadGroup.add(towerMesh, towerHead);

    // Yield Signal Gantries
    this._addSignalGantry(20, -ringOuter - 5, 'south');
    this._addSignalGantry(-20, ringOuter + 5, 'north');
    this._addSignalGantry(ringOuter + 5, 20, 'west');
    this._addSignalGantry(-ringOuter - 5, -20, 'east');
  }

  // 3. T-Junction Layout
  _buildTIntersection() {
    const roadWidth = 80;
    const roadLen = 400;

    const mainRoadGeo = new THREE.PlaneGeometry(roadLen, roadWidth);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, asphaltMaterial);
    mainRoad.position.set(0, 0, -20);
    mainRoad.receiveShadow = true;
    this.roadGroup.add(mainRoad);

    const stemGeo = new THREE.PlaneGeometry(roadWidth, 140);
    stemGeo.rotateX(-Math.PI / 2);
    const stemRoad = new THREE.Mesh(stemGeo, asphaltMaterial);
    stemRoad.position.set(0, 0, 70);
    stemRoad.receiveShadow = true;
    this.roadGroup.add(stemRoad);

    this._addRoadLine(0, -20, 400, 0.6, 0, '#ffffff');
    this._addRoadLine(0, 70, 0.6, 140, 0, '#ffffff');

    this._addStopBar(-42, -20, 0.8, roadWidth);
    this._addStopBar(42, -20, 0.8, roadWidth);
    this._addStopBar(0, 20, roadWidth, 0.8);

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

    const stripes = 8;
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

  _addNatureCurbs(x, z, dirX, dirZ) {
    const curbBox = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.5, 4),
      new THREE.MeshStandardMaterial({
        color: 0x16a34a, // Vibrant Eco Green
        roughness: 0.6,
      })
    );
    curbBox.position.set(x + dirX * 9, 0.25, z + dirZ * 2);
    this.roadGroup.add(curbBox);
  }

  // High-Efficiency Traffic Signal Gantries
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

    const redLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    redLens.position.set(10, 11.0, 0.75);

    const amberLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshBasicMaterial({ color: 0x451a03 })
    );
    amberLens.position.set(10, 9.5, 0.75);

    const greenLens = new THREE.Mesh(
      lensGeo,
      new THREE.MeshBasicMaterial({ color: 0x052e16 })
    );
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

      light.redLens.material.color.setHex(state === 'RED' ? 0xdc2626 : 0x450a0a);
      light.amberLens.material.color.setHex(state === 'YELLOW' ? 0xf59e0b : 0x451a03);
      light.greenLens.material.color.setHex(state === 'GREEN' ? 0x22c55e : 0x052e16);
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

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 14, 8), metalPoleMaterial);
      shaft.position.y = 7;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.25, 0.25), metalPoleMaterial);
      arm.position.set(x > 0 ? -2.0 : 2.0, 13.8, 0);

      const head = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.25, 0.8),
        new THREE.MeshBasicMaterial({
          color: turnOnLights ? 0xfef08a : 0xcfdcd3,
        })
      );
      head.position.set(x > 0 ? -3.8 : 3.8, 13.6, 0);

      pole.add(shaft, arm, head);
      this.propsGroup.add(pole);
    });
  }

  // Peripheral Environmental Eco-Pavilions, Canopies & Trees
  _buildEnvironmentalProps() {
    // 1. Scandinavian Eco-Pavilions with Timber & Solar Glass
    const buildings = [
      { x: -140, z: -110, w: 45, h: 26, d: 34 },
      { x: 140, z: -110, w: 55, h: 32, d: 38 },
      { x: -140, z: 110, w: 50, h: 28, d: 36 },
      { x: 140, z: 110, w: 42, h: 24, d: 30 },
    ];

    buildings.forEach((b) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);

      // Base Structure
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), buildingWhiteMaterial);
      bMesh.position.y = b.h / 2;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;

      // Timber Facade Ribbons
      const timber = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.3, b.h * 0.3, b.d + 0.3), buildingWoodMaterial);
      timber.position.y = b.h * 0.35;

      // Solar Photovoltaic Roof
      const solarRoof = new THREE.Mesh(new THREE.BoxGeometry(b.w + 1.0, 0.8, b.d + 1.0), buildingGlassMaterial);
      solarRoof.position.y = b.h + 0.4;

      bGroup.add(bMesh, timber, solarRoof);
      this.propsGroup.add(bGroup);
    });

    // 2. High-Tech Green Energy Telemetry Gantry
    const gantryBridge = new THREE.Group();
    gantryBridge.position.set(0, 0, -85);

    const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 18, 8), metalPoleMaterial);
    pLeft.position.set(-54, 9, 0);
    const pRight = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 18, 8), metalPoleMaterial);
    pRight.position.set(54, 9, 0);

    const span = new THREE.Mesh(new THREE.BoxGeometry(110, 1.2, 1.2), metalPoleMaterial);
    span.position.set(0, 17.5, 0);

    const ledSign = new THREE.Mesh(
      new THREE.BoxGeometry(45, 4.0, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x0f3d28 })
    );
    ledSign.position.set(0, 17.5, 0.8);

    gantryBridge.add(pLeft, pRight, span, ledSign);
    this.propsGroup.add(gantryBridge);

    // 3. Lush Proving Ground Tree Groves (Multi-Species & Tones)
    const treeCoords = [
      // Northwest Grove
      [-95, -85, 0], [-115, -75, 1], [-75, -115, 2], [-130, -95, 0], [-85, -130, 1],
      // Northeast Grove
      [95, -85, 1], [115, -75, 0], [75, -115, 2], [130, -95, 1], [85, -130, 0],
      // Southwest Grove
      [-95, 85, 2], [-115, 75, 0], [-75, 115, 1], [-130, 95, 2], [-85, 130, 0],
      // Southeast Grove
      [95, 85, 0], [115, 75, 2], [75, 115, 1], [130, 95, 0], [85, 130, 1],
    ];

    const foliageMats = [foliageDarkMaterial, foliageLightMaterial, foliageSproutMaterial];

    treeCoords.forEach(([tx, tz, matIdx]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3.5, 6), treeTrunkMaterial);
      trunk.position.y = 1.75;

      const fMat = foliageMats[matIdx % 3];
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(3.2, 7.5, 7), fMat);
      foliage.position.y = 6.2;
      foliage.castShadow = true;

      tree.add(trunk, foliage);
      this.propsGroup.add(tree);
    });

    // 4. Highway Eco Safety Barriers Along Roads
    const guardrailZ = 52;
    [-1, 1].forEach((side) => {
      const guardrail = new THREE.Mesh(
        new THREE.BoxGeometry(180, 1.0, 0.4),
        barrierMaterial
      );
      guardrail.position.set(side * 100, 0.5, -guardrailZ);
      this.propsGroup.add(guardrail);

      const guardrailBottom = new THREE.Mesh(
        new THREE.BoxGeometry(180, 1.0, 0.4),
        barrierMaterial
      );
      guardrailBottom.position.set(side * 100, 0.5, guardrailZ);
      this.propsGroup.add(guardrailBottom);
    });
  }
}
