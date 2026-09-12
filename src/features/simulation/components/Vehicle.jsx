import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Coupe,
  Sedan,
  Suv,
  Prototype,
  Interceptor,
  Van,
  Truck,
  Bus,
  Bike,
  Car
} from './VehicleTemplates';

const colorCache = new Map();
const colorPool = [
  '#f5f5f5', // Alpine White
  '#e22718', // M Red
  '#0066b1', // M Blue
  '#1c69d4', // Dark Blue
  '#2a2e33', // Carbon Gunmetal
  '#b88a2a', // Isle of Man Bronze
  '#1f3b2b', // Deep Forest Green
  '#59606d', // Brooklyn Gray
  '#d64515', // Sunset Orange
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

const VEHICLE_DIMENSIONS = {
  coupe: 'w-8 h-3.5',
  sedan: 'w-9 h-3.5',
  suv: 'w-9 h-4',
  prototype: 'w-8.5 h-4',
  interceptor: 'w-8.5 h-3.5',
  van: 'w-10 h-4',
  truck: 'w-14 h-4',
  bus: 'w-13 h-4',
  bike: 'w-4.5 h-2.5',
  // Backwards-compatible
  car: 'w-8 h-3.5',
  jeepney: 'w-10 h-4',
  taxi: 'w-9 h-3.5',
  pickup: 'w-9 h-4',
  scooter: 'w-4.5 h-2.5',
};

const VEHICLE_COMPONENTS = {
  coupe: Coupe,
  sedan: Sedan,
  suv: Suv,
  prototype: Prototype,
  interceptor: Interceptor,
  van: Van,
  truck: Truck,
  bus: Bus,
  bike: Bike,
  // Backwards-compatible
  car: Car,
  jeepney: Van,
  taxi: Sedan,
  pickup: Suv,
  scooter: Bike,
};

const getVehicleColor = (id, type) => {
  if (type === 'interceptor') return '#0a0d12';
  if (!colorCache.has(id)) {
    const idx = hashId(id) % colorPool.length;
    colorCache.set(id, colorPool[idx]);
  }
  return colorCache.get(id);
};

const getDimensions = (type) => VEHICLE_DIMENSIONS[type] || 'w-8 h-3.5';

const MotionDiv = motion.div;

const Vehicle = ({ data, speedFactor, isSelected = false, onSelect }) => {
  const color = useMemo(() => getVehicleColor(data.id, data.type), [data.id, data.type]);
  const dimensions = useMemo(() => getDimensions(data.type), [data.type]);
  const Template = VEHICLE_COMPONENTS[data.type] || Coupe;

  // The physics engine operates on a 1600x800 coordinate system.
  const style = {
    top: `${(data.y / 800) * 100}%`,
    left: `${(data.x / 1600) * 100}%`,
    rotate: data.angle,
  };

  const speed = Math.max(0.5, Math.min(speedFactor ?? 1, 3));
  const isBraking = (data.brakeIntensity && data.brakeIntensity > 0.25) || data.status === 'slowing' || data.status === 'stopped';
  const isSignaling = (data.pathMode === 'cross' || data.pathMode === 'tintersection') && data.route !== 'straight' && data.pos > 30 && data.pos < 310;
  const turnSignal = isSignaling ? data.route : null;
  const isInterceptor = data.isInterceptor || data.type === 'interceptor';

  return (
    <MotionDiv
      initial={style}
      animate={style}
      transition={{ duration: 0.16 / speed, ease: [0.4, 0, 0.2, 1] }}
      style={{
        transform: `translate3d(-50%, -50%, 0) scaleX(${1 + (data.pitch ? data.pitch * 0.02 : 0)})`,
        willChange: 'transform',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(data.id);
      }}
      className={`absolute z-20 origin-center pointer-events-auto cursor-pointer flex items-center justify-center select-none ${dimensions}`}
    >
      {/* 1. Volumetric Headlight Beams projecting forward onto the road */}
      <div
        className="absolute left-[70%] top-1/2 -translate-y-1/2 w-16 h-12 pointer-events-none opacity-30 -z-10"
        style={{
          background: isInterceptor
            ? 'radial-gradient(ellipse at left, rgba(100,180,255,0.75) 0%, rgba(28,105,212,0.2) 60%, transparent 85%)'
            : 'radial-gradient(ellipse at left, rgba(255,255,255,0.8) 0%, rgba(220,235,255,0.2) 60%, transparent 85%)',
          clipPath: 'polygon(0% 35%, 100% 5%, 100% 95%, 0% 65%)',
        }}
      />

      {/* 2. Intense Rear Brake Light Glow under deceleration */}
      {isBraking && (
        <div
          className="absolute right-[75%] top-1/2 -translate-y-1/2 w-7 h-7 pointer-events-none bg-[#e22718]/60 blur-[3px] rounded-full -z-10 transition-opacity duration-150"
          style={{ opacity: Math.min(1.0, 0.5 + (data.brakeIntensity || 0.5)) }}
        />
      )}

      {/* 3. Interceptor Active Strobe Flashers */}
      {isInterceptor && (
        <>
          <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#0066b1] animate-ping opacity-75 blur-[1px] pointer-events-none" />
          <div className="absolute bottom-0 w-2.5 h-2.5 rounded-full bg-[#e22718] animate-ping opacity-75 blur-[1px] pointer-events-none" />
        </>
      )}

      {/* 4. The Vector Vehicle Graphic */}
      <Template
        color={color}
        brakeIntensity={data.brakeIntensity || (isBraking ? 0.8 : 0)}
        className="w-full h-full drop-shadow-md"
      />

      {/* 5. Precision Turn Signal Indicators */}
      {turnSignal === 'left' && (
        <>
          <motion.div
            className="absolute -top-1 right-1 w-1.5 h-1.5 bg-[#f4b400] rounded-full shadow-[0_0_5px_#f4b400]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -top-1 left-1 w-1.5 h-1.5 bg-[#f4b400] rounded-full shadow-[0_0_5px_#f4b400]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
      {turnSignal === 'right' && (
        <>
          <motion.div
            className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-[#f4b400] rounded-full shadow-[0_0_5px_#f4b400]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-[#f4b400] rounded-full shadow-[0_0_5px_#f4b400]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {/* 6. High-Performance Telemetry Reticle on Selected Vehicle */}
      {isSelected && (
        <div className="absolute -inset-2.5 border border-dashed border-[#1c69d4] pointer-events-none animate-pulse flex items-center justify-center">
          <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-white" />

          {/* Floating Speed Chip */}
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 border border-[#3c3c3c] text-[9px] font-bold uppercase tracking-[1px] text-white px-1.5 py-0.5 whitespace-nowrap shadow-lg flex items-center gap-1"
            style={{ transform: `translateX(-50%) rotate(${-data.angle}deg)` }}
          >
            <span className="w-1 h-1 rounded-full bg-[#1c69d4]" />
            #{data.id} {data.speed || 0} KM/H
          </div>
        </div>
      )}
    </MotionDiv>
  );
};

export default memo(Vehicle);

