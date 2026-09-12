import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ThreeVehicleFactory } from '../three/ThreeVehicleFactory';
import { ThreeEnvironment } from '../three/ThreeEnvironment';

// Camera Presets
const CAMERA_PRESETS = {
  isometric: {
    position: new THREE.Vector3(0, 115, 135),
    target: new THREE.Vector3(0, 0, 0),
  },
  cinematic: {
    position: new THREE.Vector3(-95, 32, 85),
    target: new THREE.Vector3(0, 4, 0),
  },
  topdown: {
    position: new THREE.Vector3(0, 190, 0.01),
    target: new THREE.Vector3(0, 0, 0),
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

  const [cameraMode, setCameraMode] = useState('isometric');
  const cameraModeRef = useRef('isometric');
  const selectedVehicleIdRef = useRef(selectedVehicleId);
  const speedFactorRef = useRef(speedFactor);
  const onSelectVehicleRef = useRef(onSelectVehicle);
  const weatherRef = useRef(weather);
  const intersectionTypeRef = useRef(intersectionType);

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
    scene.fog = new THREE.FogExp2(0xebf4ed, 0.0022);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    const initialPreset = CAMERA_PRESETS.isometric;
    camera.position.copy(initialPreset.position);
    cameraRef.current = camera;

    // 3. Renderer (Capped at 1.5x pixel ratio for maximum frame rate)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 25;
    controls.maxDistance = 350;
    controls.target.copy(initialPreset.target);
    controlsRef.current = controls;

    // 5. Build Environment
    const environment = new ThreeEnvironment(scene);
    environmentRef.current = environment;
    environment.setupAtmosphere(weatherRef.current);
    environment.buildLayout(intersectionTypeRef.current);

    // 6. Nature Eco Selection Highlight Reticle
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

    // 7. Raycaster for clicking vehicles
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      isDragging = false;
    };

    const onPointerMove = (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 5) isDragging = true;
    };

    const onPointerUp = (e) => {
      if (isDragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const targetGroups = [];
      vehiclesMap.forEach((veh) => {
        targetGroups.push(veh.group);
      });

      const intersects = raycaster.intersectObjects(targetGroups, true);
      if (intersects.length > 0) {
        let curr = intersects[0].object;
        while (curr && !curr.userData?.id && curr.parent) {
          curr = curr.parent;
        }
        if (curr?.userData?.id) {
          onSelectVehicleRef.current?.(curr.userData.id);
          return;
        }
      }

      onSelectVehicleRef.current?.(null);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);

    // 8. Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || 800;
      const h = containerRef.current.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Ultra-Smooth 60 FPS Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsedTime = clockRef.current.getElapsedTime();

      // Update rain if raining
      if (environmentRef.current) {
        environmentRef.current.updateRain(dt);
      }

      // Continuous critically-damped spring interpolation (Zero Stutter)
      const blendRate = 1.0 - Math.exp(-16 * dt * Math.max(0.6, speedFactorRef.current));
      let followedGroup = null;

      vehiclesMap.forEach((veh) => {
        const { group, targetPos, targetAngle, data: carData } = veh;

        // Smooth position glide
        group.position.x += (targetPos.x - group.position.x) * blendRate;
        group.position.z += (targetPos.z - group.position.z) * blendRate;
        group.position.y = 0;

        // Smooth shortest angular distance interpolation
        const angleDiff = THREE.MathUtils.euclideanModulo(targetAngle - group.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
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

  // Synchronize Simulation Data (Vehicles & Signals)
  useEffect(() => {
    if (!sceneRef.current || !data) return;

    const intersections = data?.intersections || [];
    const int0 = intersections[0] || { light_state: {} };

    // 1. Update Signals
    if (environmentRef.current && int0.light_state) {
      environmentRef.current.updateSignalStates(int0.light_state);
    }

    // 2. Reconcile Fleet Vehicles
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

    // Remove exited
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
          data: car,
        });
      } else {
        const veh = vehiclesMap.get(id);
        veh.targetPos.set(targetX, 0, targetZ);
        veh.targetAngle = targetAngle;
        veh.data = car;
      }
    });
  }, [data]);

  return (
    <div
      className="relative w-full bg-[#ebf4ed] rounded-none border border-[#d1ded5] overflow-hidden shadow-sm select-none"
      style={{ aspectRatio: '2 / 1', minHeight: '440px' }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Active Camera HUD Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#ffffff]/90 backdrop-blur-md border border-[#d1ded5] px-3 py-1.5 text-[10px] uppercase font-bold tracking-[1.5px] text-[#283e32] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
        <span className="text-[#5d7567]">CAMERA:</span>
        <span className="text-[#0f3d28]">{cameraMode}</span>
        {selectedVehicleId && (
          <span className="ml-2 pl-2 border-l border-[#d1ded5] text-[#16a34a]">
            TARGET #{selectedVehicleId}
          </span>
        )}
      </div>

      {/* Top Right: Camera Presets & Follow Selector */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#ffffff]/90 backdrop-blur-md border border-[#d1ded5] p-1 shadow-sm">
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
      </div>

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
          <div className="flex-1 bg-[#84cc16]" />
        </div>
        <span>ECO 3D ACCELERATED</span>
      </div>
    </div>
  );
};

export default memo(ThreeRoadLayer);
