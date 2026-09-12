import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ThreeVehicleFactory } from '../three/ThreeVehicleFactory';
import { ThreeEnvironment } from '../three/ThreeEnvironment';

// Expanded Camera Presets
const CAMERA_PRESETS = {
  isometric: {
    position: new THREE.Vector3(0, 125, 145),
    target: new THREE.Vector3(0, 0, 0),
  },
  cinematic: {
    position: new THREE.Vector3(-95, 32, 85),
    target: new THREE.Vector3(0, 4, 0),
  },
  panorama: {
    position: new THREE.Vector3(0, 210, 240),
    target: new THREE.Vector3(0, 0, 0),
  },
  topdown: {
    position: new THREE.Vector3(0, 260, 0.01),
    target: new THREE.Vector3(0, 0, 0),
  },
};

// Configurable Graphic Quality Presets
const GRAPHICS_PRESETS = {
  low: {
    id: 'low',
    label: 'LOW',
    shadows: 'off',
    pixelRatio: 1.0,
    pedestrians: 'off',
    desc: 'Max 60 FPS for low-spec laptops & mobile',
  },
  medium: {
    id: 'medium',
    label: 'MED',
    shadows: 'basic',
    pixelRatio: 1.25,
    pedestrians: 'normal',
    desc: 'Balanced visual fidelity & smooth frame rate',
  },
  high: {
    id: 'high',
    label: 'HIGH',
    shadows: 'pcfsoft',
    pixelRatio: 1.5,
    pedestrians: 'normal',
    desc: 'Crisp PCF shadows & lively Manila city life',
  },
  ultra: {
    id: 'ultra',
    label: 'ULTRA',
    shadows: 'pcfsoft',
    pixelRatio: 2.0,
    pedestrians: 'dense',
    desc: 'Retina 2x resolution, 2K shadows & dense crowd',
  },
};

const ThreeRoadLayer = ({
  data,
  weather = 'sunny',
  speedFactor = 1,
  intersectionType = 'cross',
  selectedVehicleId = null,
  onSelectVehicle,
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const environmentRef = useRef(null);
  const vehiclesMapRef = useRef(new Map());
  const selectedMarkerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const latestLightStateRef = useRef(null);

  const [cameraMode, setCameraMode] = useState('isometric');
  const cameraModeRef = useRef('isometric');
  const selectedVehicleIdRef = useRef(selectedVehicleId);
  const speedFactorRef = useRef(speedFactor);
  const onSelectVehicleRef = useRef(onSelectVehicle);
  const weatherRef = useRef(weather);
  const intersectionTypeRef = useRef(intersectionType);

  // Graphics Options State
  const [graphicsPreset, setGraphicsPreset] = useState(() => {
    try {
      const saved = localStorage.getItem('neurocross_graphics_preset');
      if (saved && GRAPHICS_PRESETS[saved]) return saved;
    } catch {
      // ignore
    }
    return 'high';
  });
  const graphicsPresetRef = useRef(graphicsPreset);
  graphicsPresetRef.current = graphicsPreset;
  const [showGraphicsMenu, setShowGraphicsMenu] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    selectedVehicleIdRef.current = selectedVehicleId;
  }, [selectedVehicleId]);

  useEffect(() => {
    speedFactorRef.current = speedFactor;
  }, [speedFactor]);

  useEffect(() => {
    onSelectVehicleRef.current = onSelectVehicle;
  }, [onSelectVehicle]);

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    intersectionTypeRef.current = intersectionType;
  }, [intersectionType]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  const setCameraPreset = useCallback((presetKey) => {
    setCameraMode(presetKey);
    if (!controlsRef.current || !cameraRef.current) return;

    if (presetKey === 'follow') {
      return;
    }

    const preset = CAMERA_PRESETS[presetKey];
    if (preset) {
      const controls = controlsRef.current;
      const camera = cameraRef.current;

      camera.position.copy(preset.position);
      controls.target.copy(preset.target);
      controls.update();
    }
  }, []);

  // Apply Graphic Options Dynamically
  useEffect(() => {
    const config = GRAPHICS_PRESETS[graphicsPreset];
    if (!config) return;

    if (rendererRef.current) {
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.pixelRatio));
      rendererRef.current.shadowMap.enabled = config.shadows !== 'off';
      rendererRef.current.shadowMap.type =
        config.shadows === 'pcfsoft' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
      rendererRef.current.shadowMap.needsUpdate = true;
    }

    if (environmentRef.current) {
      environmentRef.current.setGraphicsOptions({
        preset: graphicsPreset,
        shadows: config.shadows,
        pedestrians: config.pedestrians,
      });
    }

    try {
      localStorage.setItem('neurocross_graphics_preset', graphicsPreset);
    } catch {
      // ignore
    }
  }, [graphicsPreset]);

  // Initialize Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const vehiclesMap = vehiclesMapRef.current;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    // 1. Scene with Light Daylight Nature Sky & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xebf4ed);
    scene.fog = new THREE.FogExp2(0xebf4ed, 0.0016);
    sceneRef.current = scene;

    // 2. Camera (Extended Far Plane for 2000-unit City)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1800);
    const initialPreset = CAMERA_PRESETS.isometric;
    camera.position.copy(initialPreset.position);
    cameraRef.current = camera;

    // 3. Renderer with Dynamic Graphics Configuration
    const currentConfig = GRAPHICS_PRESETS[graphicsPresetRef.current] || GRAPHICS_PRESETS.high;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, currentConfig.pixelRatio));
    renderer.shadowMap.enabled = currentConfig.shadows !== 'off';
    renderer.shadowMap.type =
      currentConfig.shadows === 'pcfsoft' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Expanded zoom max distance to 600)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 25;
    controls.maxDistance = 600;
    controls.target.copy(initialPreset.target);
    controlsRef.current = controls;

    // 5. Build Environment
    const environment = new ThreeEnvironment(scene);
    environmentRef.current = environment;
    environment.setGraphicsOptions(currentConfig);
    environment.setupAtmosphere(weatherRef.current);
    environment.buildLayout(intersectionTypeRef.current);

    // 6. Selection Highlight Reticle
    const markerGroup = new THREE.Group();
    markerGroup.visible = false;

    const ringGeo = new THREE.RingGeometry(3.6, 4.0, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x16a34a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.1;

    const innerRingGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x84cc16,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.position.y = 0.12;

    const pointerGeo = new THREE.ConeGeometry(0.6, 1.8, 4);
    pointerGeo.rotateX(Math.PI);
    const pointerMat = new THREE.MeshBasicMaterial({ color: 0x0f3d28 });
    const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
    pointerMesh.position.y = 5.2;

    markerGroup.add(ringMesh, innerRingMesh, pointerMesh);
    scene.add(markerGroup);
    selectedMarkerRef.current = markerGroup;

    // 7. Raycasting for Vehicle Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 5) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const targetGroups = [];
      vehiclesMap.forEach((veh) => {
        targetGroups.push({ group: veh.group, id: veh.data.id });
      });

      const meshesToCheck = [];
      targetGroups.forEach(({ group, id }) => {
        group.traverse((child) => {
          if (child.isMesh) {
            child.userData.vehicleId = id;
            meshesToCheck.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(meshesToCheck, false);
      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.vehicleId;
        if (hitId && onSelectVehicleRef.current) {
          onSelectVehicleRef.current(hitId);
        }
      } else {
        if (onSelectVehicleRef.current) {
          onSelectVehicleRef.current(null);
        }
      }
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const hitList = [];
      vehiclesMap.forEach((veh) => {
        veh.group.traverse((child) => {
          if (child.isMesh) hitList.push(child);
        });
      });

      const intersects = raycaster.intersectObjects(hitList, false);
      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);

    // 8. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Ultra-Smooth 60 FPS Render Loop with Dead-Reckoning Velocity Extrapolation
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsLastSample = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsedTime = clockRef.current.getElapsedTime();

      // FPS Calculation (Updated every 500ms)
      frameCount++;
      if (now - fpsLastSample >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - fpsLastSample)));
        frameCount = 0;
        fpsLastSample = now;
      }

      // Update rain & animated pedestrians
      if (environmentRef.current) {
        environmentRef.current.updateRain(dt);
        environmentRef.current.updatePedestrians(dt, elapsedTime, latestLightStateRef.current);
      }

      // Continuous dead-reckoning extrapolation for ultra-smooth 60 FPS vehicle motion
      const nowSec = now / 1000;
      const blendRate = 1.0 - Math.exp(-22 * dt * Math.max(0.6, speedFactorRef.current));
      let followedGroup = null;

      vehiclesMap.forEach((veh) => {
        const {
          group,
          targetPos,
          targetAngle,
          velX = 0,
          velZ = 0,
          lastUpdateTime = nowSec,
          data: carData,
        } = veh;

        // Dead-reckoning forward projection between server ticks
        const elapsedSincePacket = Math.min(nowSec - lastUpdateTime, 0.22);
        const anticipatedX = targetPos.x + velX * elapsedSincePacket;
        const anticipatedZ = targetPos.z + velZ * elapsedSincePacket;

        // Smooth position glide
        group.position.x += (anticipatedX - group.position.x) * blendRate;
        group.position.z += (anticipatedZ - group.position.z) * blendRate;
        group.position.y = 0;

        // Smooth shortest angular distance interpolation
        const angleDiff =
          THREE.MathUtils.euclideanModulo(targetAngle - group.rotation.y + Math.PI, Math.PI * 2) -
          Math.PI;
        group.rotation.y += angleDiff * blendRate;

        // Dynamics
        if (carData.pitch) {
          group.rotation.z = -carData.pitch * 0.035;
        } else {
          group.rotation.z *= 0.88;
        }

        ThreeVehicleFactory.updateVehiclePhysics(group, carData, elapsedTime);

        if (carData.id === selectedVehicleIdRef.current) {
          followedGroup = group;
        }
      });

      // Reticle update
      if (followedGroup && selectedMarkerRef.current) {
        selectedMarkerRef.current.visible = true;
        selectedMarkerRef.current.position.set(
          followedGroup.position.x,
          0.05,
          followedGroup.position.z
        );

        const scale = 1.0 + Math.sin(elapsedTime * 4) * 0.08;
        selectedMarkerRef.current.scale.set(scale, 1, scale);
        ringMesh.rotation.y = elapsedTime * 0.8;
        innerRingMesh.rotation.y = -elapsedTime * 1.2;
        pointerMesh.position.y = 5.2 + Math.sin(elapsedTime * 5) * 0.4;
      } else if (selectedMarkerRef.current) {
        selectedMarkerRef.current.visible = false;
      }

      // Smooth Follow Vehicle camera
      if (cameraModeRef.current === 'follow' && followedGroup) {
        const angle = followedGroup.rotation.y;
        const distBehind = 28;
        const heightAbove = 14;

        const forwardX = Math.cos(angle);
        const forwardZ = -Math.sin(angle);

        const targetCamX = followedGroup.position.x - forwardX * distBehind;
        const targetCamZ = followedGroup.position.z - forwardZ * distBehind;
        const targetCamY = heightAbove;

        const camBlend = 1.0 - Math.exp(-6 * dt);
        camera.position.x += (targetCamX - camera.position.x) * camBlend;
        camera.position.y += (targetCamY - camera.position.y) * camBlend;
        camera.position.z += (targetCamZ - camera.position.z) * camBlend;

        const lookAtX = followedGroup.position.x + forwardX * 10;
        const lookAtZ = followedGroup.position.z + forwardZ * 10;

        controls.target.x += (lookAtX - controls.target.x) * camBlend;
        controls.target.y += (2 - controls.target.y) * camBlend;
        controls.target.z += (lookAtZ - controls.target.z) * camBlend;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);

      vehiclesMap.forEach((veh) => {
        scene.remove(veh.group);
      });
      vehiclesMap.clear();

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update layout when intersectionType changes
  useEffect(() => {
    if (environmentRef.current) {
      environmentRef.current.buildLayout(intersectionType);
    }
  }, [intersectionType]);

  // Update atmosphere when weather changes
  useEffect(() => {
    if (environmentRef.current) {
      environmentRef.current.setupAtmosphere(weather);
    }
  }, [weather]);

  // Synchronize Simulation Data (Vehicles & Signals with Dead-Reckoning Tracking)
  useEffect(() => {
    if (!sceneRef.current || !data) return;

    const intersections = data?.intersections || [];
    const int0 = intersections[0] || { light_state: {} };

    // 1. Update Signals
    latestLightStateRef.current = int0.light_state;
    if (environmentRef.current && int0.light_state) {
      environmentRef.current.updateSignalStates(int0.light_state);
    }

    // 2. Reconcile Fleet Vehicles with Instantaneous Velocity Calculation
    const activeCarMap = new Map();
    intersections.forEach((ix) => {
      if (!ix.roads) return;
      Object.values(ix.roads).forEach((lanes) => {
        lanes.forEach((cars) => {
          cars.forEach((car) => {
            activeCarMap.set(car.id, car);
          });
        });
      });
    });

    const vehiclesMap = vehiclesMapRef.current;
    const scene = sceneRef.current;
    const nowSec = performance.now() / 1000;

    // Remove exited vehicles
    vehiclesMap.forEach((veh, id) => {
      if (!activeCarMap.has(id)) {
        scene.remove(veh.group);
        vehiclesMap.delete(id);
      }
    });

    // Add or update target positions
    activeCarMap.forEach((car, id) => {
      const targetX = (car.x - 800) * 0.25;
      const targetZ = (car.y - 400) * 0.25;
      const targetAngle = -(car.angle * Math.PI) / 180;

      if (!vehiclesMap.has(id)) {
        const group = ThreeVehicleFactory.createVehicle(car);
        group.position.set(targetX, 0, targetZ);
        group.rotation.y = targetAngle;
        scene.add(group);

        vehiclesMap.set(id, {
          group,
          targetPos: new THREE.Vector3(targetX, 0, targetZ),
          targetAngle,
          velX: 0,
          velZ: 0,
          lastUpdateTime: nowSec,
          data: car,
        });
      } else {
        const veh = vehiclesMap.get(id);
        const deltaT = Math.max(0.016, nowSec - veh.lastUpdateTime);

        // Compute forward velocity vector for dead-reckoning extrapolation
        veh.velX = (targetX - veh.targetPos.x) / deltaT;
        veh.velZ = (targetZ - veh.targetPos.z) / deltaT;
        veh.targetPos.set(targetX, 0, targetZ);
        veh.targetAngle = targetAngle;
        veh.lastUpdateTime = nowSec;
        veh.data = car;
      }
    });
  }, [data]);

  return (
    <div
      className="relative w-full bg-[#ebf4ed] rounded-none border border-[#d1ded5] overflow-hidden shadow-sm select-none"
      style={{ aspectRatio: '2 / 1', minHeight: '460px' }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: HUD Status Bar with Live FPS & Active Camera */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#ffffff]/90 backdrop-blur-md border border-[#d1ded5] px-3 py-1.5 text-[10px] uppercase font-bold tracking-[1.5px] text-[#283e32] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
        <span className="text-[#16a34a] font-mono">{fps} FPS</span>
        <span className="text-[#cfdcd3]">|</span>
        <span className="text-[#5d7567]">CAM:</span>
        <span className="text-[#0f3d28]">{cameraMode}</span>
        <span className="text-[#cfdcd3]">|</span>
        <span className="text-[#16a34a]">{graphicsPreset.toUpperCase()}</span>
        {selectedVehicleId && (
          <span className="ml-2 pl-2 border-l border-[#d1ded5] text-[#16a34a]">
            TARGET #{selectedVehicleId}
          </span>
        )}
      </div>

      {/* Top Right: Camera Presets & Graphic Options Menu Toggle */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#ffffff]/90 backdrop-blur-md border border-[#d1ded5] p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setCameraPreset('isometric')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'isometric'
              ? 'bg-[#0f3d28] text-white shadow-sm'
              : 'text-[#475e50] hover:text-[#0f3d28] hover:bg-[#ebf1ec]'
          }`}
          title="Isometric Global View"
        >
          ISO
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset('cinematic')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'cinematic'
              ? 'bg-[#0f3d28] text-white shadow-sm'
              : 'text-[#475e50] hover:text-[#0f3d28] hover:bg-[#ebf1ec]'
          }`}
          title="Low-Angle Cinematic Perspective"
        >
          CINE
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset('panorama')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'panorama'
              ? 'bg-[#0f3d28] text-white shadow-sm'
              : 'text-[#475e50] hover:text-[#0f3d28] hover:bg-[#ebf1ec]'
          }`}
          title="Wide Metropolitan Panorama"
        >
          PANO
        </button>

        <button
          type="button"
          onClick={() => setCameraPreset('topdown')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'topdown'
              ? 'bg-[#0f3d28] text-white shadow-sm'
              : 'text-[#475e50] hover:text-[#0f3d28] hover:bg-[#ebf1ec]'
          }`}
          title="Tactical Top-Down View"
        >
          TOP
        </button>

        <button
          type="button"
          disabled={!selectedVehicleId}
          onClick={() => setCameraPreset('follow')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'follow'
              ? 'bg-[#16a34a] text-white'
              : selectedVehicleId
              ? 'text-[#16a34a] hover:bg-[#16a34a]/15'
              : 'text-[#94a399] cursor-not-allowed opacity-50'
          }`}
          title={selectedVehicleId ? 'Follow Selected Vehicle' : 'Select a vehicle first to follow'}
        >
          CHASE
        </button>

        <div className="w-[1px] h-4 bg-[#d1ded5] mx-0.5" />

        {/* Graphics Options Toggle Button */}
        <button
          type="button"
          onClick={() => setShowGraphicsMenu((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            showGraphicsMenu
              ? 'bg-[#16a34a] text-white shadow-sm'
              : 'bg-[#ebf4ed] text-[#164e35] hover:bg-[#d9ebd9]'
          }`}
          title="Configure 3D Graphics & Performance"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <span>GRAPHICS</span>
        </button>
      </div>

      {/* Floating Graphics & Performance Modal */}
      {showGraphicsMenu && (
        <div className="absolute top-14 right-3 z-30 w-72 bg-[#ffffff]/95 backdrop-blur-lg border border-[#d1ded5] shadow-xl p-4 text-[#1e293b] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
              <h3 className="text-xs font-black uppercase tracking-[1.5px] text-[#0f3d28]">
                Display & Graphics
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowGraphicsMenu(false)}
              className="text-[#64748b] hover:text-[#0f3d28] text-sm font-bold px-1"
            >
              ✕
            </button>
          </div>

          {/* Quality Presets Grid */}
          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#64748b]">
              Quality Presets
            </label>
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {Object.values(GRAPHICS_PRESETS).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setGraphicsPreset(preset.id)}
                  className={`py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                    graphicsPreset === preset.id
                      ? 'bg-[#0f3d28] text-white shadow-sm'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#64748b] mt-1.5 italic">
              {GRAPHICS_PRESETS[graphicsPreset]?.desc}
            </p>
          </div>

          {/* Detailed Features Spec */}
          <div className="mt-3.5 pt-3 border-t border-[#e2e8f0] space-y-2 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] font-medium">PCF Shadows</span>
              <span className="font-bold text-[#0f3d28] uppercase">
                {GRAPHICS_PRESETS[graphicsPreset]?.shadows}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] font-medium">Resolution Scale</span>
              <span className="font-bold text-[#0f3d28]">
                {GRAPHICS_PRESETS[graphicsPreset]?.pixelRatio}x
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] font-medium">Pedestrians Crowd</span>
              <span className="font-bold text-[#0f3d28] uppercase">
                {GRAPHICS_PRESETS[graphicsPreset]?.pedestrians}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#64748b] font-medium">Live Frame Rate</span>
              <span className="font-bold text-[#16a34a] font-mono">{fps} FPS</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Left: Mouse Navigation Telemetry Watermark */}
      <div className="absolute bottom-2.5 left-3 pointer-events-none z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#4d6656]">
        <span>L-DRAG: ORBIT</span>
        <span>·</span>
        <span>R-DRAG: PAN</span>
        <span>·</span>
        <span>SCROLL: ZOOM</span>
        <span>·</span>
        <span>CLICK CAR: TELEMETRY</span>
      </div>

      {/* Bottom Right: Engine Identifier */}
      <div className="absolute bottom-2.5 right-3 pointer-events-none z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#4d6656]">
        <div className="flex w-3.5 h-1 overflow-hidden">
          <div className="flex-1 bg-[#0f3d28]" />
          <div className="flex-1 bg-[#16a34a]" />
          <div className="flex-1 bg-[#16a34a]" />
          <div className="flex-1 bg-[#84cc16]" />
        </div>
        <span>PHILIPPINES 3D ENGINE • {graphicsPreset.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default memo(ThreeRoadLayer);
