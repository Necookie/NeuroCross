import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  const [cameraMode, setCameraMode] = useState('isometric'); // 'isometric' | 'cinematic' | 'topdown' | 'follow'
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

  // Handle switching camera preset
  const setCameraPreset = useCallback((presetKey) => {
    setCameraMode(presetKey);
    if (!controlsRef.current || !cameraRef.current) return;

    if (presetKey === 'follow') {
      return; // Handled dynamically in render loop
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

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const vehiclesMap = vehiclesMapRef.current;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040508);
    scene.fog = new THREE.FogExp2(0x040508, 0.0028);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    const initialPreset = CAMERA_PRESETS.isometric;
    camera.position.copy(initialPreset.position);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent dipping below ground level
    controls.minDistance = 25;
    controls.maxDistance = 350;
    controls.target.copy(initialPreset.target);
    controlsRef.current = controls;

    // 5. Build Environment
    const environment = new ThreeEnvironment(scene);
    environmentRef.current = environment;
    environment.setupAtmosphere(weatherRef.current);
    environment.buildLayout(intersectionTypeRef.current);

    // 6. Selection Highlight Reticle in 3D
    const markerGroup = new THREE.Group();
    markerGroup.visible = false;

    // Outer octagonal telemetry ring
    const ringGeo = new THREE.RingGeometry(3.6, 4.0, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0066b1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.1;

    // Inner pulsing bracket
    const innerRingGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x1c69d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.position.y = 0.12;

    // Vertical pointer needle
    const pointerGeo = new THREE.ConeGeometry(0.6, 1.8, 4);
    pointerGeo.rotateX(Math.PI);
    const pointerMat = new THREE.MeshBasicMaterial({ color: 0xe22718 });
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
      if (dist > 5) {
        isDragging = true;
      }
    };

    const onPointerUp = (e) => {
      if (isDragging) return; // User was rotating/panning, not clicking

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Collect all vehicle meshes
      const vehicleMeshes = [];
      vehiclesMapRef.current.forEach((veh) => {
        veh.group.traverse((child) => {
          if (child.isMesh) {
            vehicleMeshes.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(vehicleMeshes, false);
      if (intersects.length > 0) {
        // Traverse up to find vehicle group
        let curr = intersects[0].object;
        while (curr && !curr.userData?.id && curr.parent) {
          curr = curr.parent;
        }
        if (curr?.userData?.id) {
          onSelectVehicleRef.current?.(curr.userData.id);
          return;
        }
      }

      // If clicked asphalt/ground, deselect
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

    // 9. Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = clockRef.current.getElapsedTime();

      // Update rain if raining
      if (environmentRef.current) {
        environmentRef.current.updateRain(dt);
      }

      // Smooth vehicle physics and positioning interpolation
      const vehiclesMap = vehiclesMapRef.current;
      const lerpFactor = Math.min(1.0, dt * 18 * Math.max(0.5, speedFactorRef.current));

      let followedGroup = null;

      vehiclesMap.forEach((veh) => {
        const { group, targetPos, targetAngle, data: carData } = veh;

        // Position lerp
        group.position.x += (targetPos.x - group.position.x) * lerpFactor;
        group.position.z += (targetPos.z - group.position.z) * lerpFactor;
        group.position.y = 0;

        // Angle lerp (shortest angular distance)
        let angleDiff = THREE.MathUtils.euclideanModulo(targetAngle - group.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
        group.rotation.y += angleDiff * lerpFactor;

        // Pitch & Roll dynamics
        if (carData.pitch) {
          group.rotation.z = -carData.pitch * 0.04;
        } else {
          group.rotation.z *= 0.85;
        }

        // Live wheels, lights, indicators, strobes update
        ThreeVehicleFactory.updateVehiclePhysics(group, carData, elapsedTime);

        if (carData.id === selectedVehicleIdRef.current) {
          followedGroup = group;
        }
      });

      // Update selection marker position & pulse animation
      if (followedGroup && selectedMarkerRef.current) {
        selectedMarkerRef.current.visible = true;
        selectedMarkerRef.current.position.set(
          followedGroup.position.x,
          0.05,
          followedGroup.position.z
        );

        // Pulse scale & rotation
        const scale = 1.0 + Math.sin(elapsedTime * 4) * 0.08;
        selectedMarkerRef.current.scale.set(scale, 1, scale);
        ringMesh.rotation.y = elapsedTime * 0.8;
        innerRingMesh.rotation.y = -elapsedTime * 1.2;

        // Needle hover
        pointerMesh.position.y = 5.2 + Math.sin(elapsedTime * 5) * 0.4;
      } else if (selectedMarkerRef.current) {
        selectedMarkerRef.current.visible = false;
      }

      // Follow vehicle camera mode
      if (cameraModeRef.current === 'follow' && followedGroup) {
        // Calculate chase position behind the vehicle
        const angle = followedGroup.rotation.y;
        const distBehind = 28;
        const heightAbove = 14;

        // Vehicle forward is along +X in local space.
        // In world space with rotation.y:
        // Forward vector = (cos(angle), 0, -sin(angle))
        // Behind vector = (-cos(angle), 0, sin(angle))
        const forwardX = Math.cos(angle);
        const forwardZ = -Math.sin(angle);

        const targetCamX = followedGroup.position.x - forwardX * distBehind;
        const targetCamZ = followedGroup.position.z - forwardZ * distBehind;
        const targetCamY = heightAbove;

        // Smoothly interpolate camera position and target
        camera.position.x += (targetCamX - camera.position.x) * (dt * 5);
        camera.position.y += (targetCamY - camera.position.y) * (dt * 5);
        camera.position.z += (targetCamZ - camera.position.z) * (dt * 5);

        const lookAtX = followedGroup.position.x + forwardX * 10;
        const lookAtZ = followedGroup.position.z + forwardZ * 10;

        controls.target.x += (lookAtX - controls.target.x) * (dt * 6);
        controls.target.y += (2 - controls.target.y) * (dt * 6);
        controls.target.z += (lookAtZ - controls.target.z) * (dt * 6);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);

      // Clean up vehicles
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
  }, []); // Run once for setup

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

    // 1. Update Signal Lenses in 3D
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

    // Remove exited vehicles
    vehiclesMap.forEach((veh, id) => {
      if (!activeCarMap.has(id)) {
        scene.remove(veh.group);
        vehiclesMap.delete(id);
      }
    });

    // Add or update existing vehicles
    activeCarMap.forEach((car, id) => {
      // 2D to 3D coordinate conversion
      // 2D: (0..1600, 0..800) -> 3D: ((-200..200), (-100..100))
      const targetX = (car.x - 800) * 0.25;
      const targetZ = (car.y - 400) * 0.25;
      const targetAngle = -(car.angle * Math.PI) / 180;

      if (!vehiclesMap.has(id)) {
        // Create new 3D vehicle
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
        // Update target pose for interpolation
        const veh = vehiclesMap.get(id);
        veh.targetPos.set(targetX, 0, targetZ);
        veh.targetAngle = targetAngle;
        veh.data = car;
      }
    });
  }, [data]);

  return (
    <div
      className="relative w-full bg-[#040508] rounded-none border border-[#262626] overflow-hidden shadow-2xl select-none"
      style={{ aspectRatio: '2 / 1', minHeight: '440px' }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Active Camera HUD Pill */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#000000]/85 backdrop-blur-md border border-[#262626] px-2.5 py-1 text-[10px] uppercase font-bold tracking-[1.5px] text-[#cccccc]">
        <span className="w-2 h-2 rounded-full bg-[#0066b1] animate-pulse" />
        <span className="text-[#7e7e7e]">CAMERA:</span>
        <span className="text-white">{cameraMode}</span>
        {selectedVehicleId && (
          <span className="ml-2 pl-2 border-l border-[#333333] text-[#0066b1]">
            TARGET #{selectedVehicleId}
          </span>
        )}
      </div>

      {/* Top Right: Camera Presets & Follow Selector conforming to design.md */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#000000]/85 backdrop-blur-md border border-[#262626] p-1 shadow-lg">
        <button
          type="button"
          onClick={() => setCameraPreset('isometric')}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
            cameraMode === 'isometric'
              ? 'bg-white text-black shadow-sm'
              : 'text-[#888888] hover:text-white hover:bg-[#181818]'
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
              ? 'bg-white text-black shadow-sm'
              : 'text-[#888888] hover:text-white hover:bg-[#181818]'
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
              ? 'bg-white text-black shadow-sm'
              : 'text-[#888888] hover:text-white hover:bg-[#181818]'
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
              ? 'bg-[#0066b1] text-white'
              : selectedVehicleId
              ? 'text-[#0066b1] hover:bg-[#0066b1]/20'
              : 'text-[#444444] cursor-not-allowed opacity-50'
          }`}
          title={selectedVehicleId ? 'Follow Selected Vehicle' : 'Select a vehicle first to follow'}
        >
          CHASE
        </button>
      </div>

      {/* Bottom Left: Mouse Navigation Telemetry Watermark */}
      <div className="absolute bottom-2.5 left-3 pointer-events-none z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#555555]">
        <span>L-DRAG: ORBIT</span>
        <span>·</span>
        <span>R-DRAG: PAN</span>
        <span>·</span>
        <span>SCROLL: ZOOM</span>
        <span>·</span>
        <span>CLICK CAR: TELEMETRY</span>
      </div>

      {/* Bottom Right: Engine Identifier */}
      <div className="absolute bottom-2.5 right-3 pointer-events-none z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#666666]">
        <div className="flex w-3.5 h-1 overflow-hidden">
          <div className="flex-1 bg-[#0066b1]" />
          <div className="flex-1 bg-[#1c69d4]" />
          <div className="flex-1 bg-[#e22718]" />
        </div>
        <span>THREE.JS 3D ACCELERATED</span>
      </div>
    </div>
  );
};

export default ThreeRoadLayer;
