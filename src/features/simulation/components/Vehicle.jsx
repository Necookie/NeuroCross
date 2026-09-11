import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, Suv, Jeepney, Bus, Bike, Truck, Van, Taxi, Pickup, Scooter } from './VehicleTemplates';

const colorCache = new Map();
const colorPool = [
  'hsl(222 22% 68%)',
  'hsl(208 24% 62%)',
  'hsl(194 26% 58%)',
  'hsl(30 26% 64%)',
  'hsl(12 22% 58%)',
  'hsl(320 18% 60%)',
  'hsl(150 18% 52%)',
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
  bus: 'w-12 h-4',
  truck: 'w-14 h-4',
  van: 'w-10 h-4',
  pickup: 'w-9 h-4',
  jeepney: 'w-9 h-4',
  suv: 'w-8 h-3.5',
  car: 'w-7 h-3',
  taxi: 'w-7 h-3',
  bike: 'w-4 h-2.5',
  scooter: 'w-4 h-2.5'
};

const VEHICLE_COMPONENTS = {
  jeepney: Jeepney,
  bus: Bus,
  bike: Bike,
  suv: Suv,
  van: Van,
  taxi: Taxi,
  pickup: Pickup,
  scooter: Scooter,
  truck: Truck,
  car: Car
};

const getVehicleColor = (id) => {
  if (!colorCache.has(id)) {
    const idx = hashId(id) % colorPool.length;
    colorCache.set(id, colorPool[idx]);
  }
  return colorCache.get(id);
};

const getDimensions = (type) => VEHICLE_DIMENSIONS[type] || 'w-7 h-3';

const MotionDiv = motion.div;

const Vehicle = ({ data, speedFactor }) => {
  const color = useMemo(() => getVehicleColor(data.id), [data.id]);
  const dimensions = useMemo(() => getDimensions(data.type), [data.type]);
  const Template = VEHICLE_COMPONENTS[data.type] || Car;

  // The physics engine operates on a 1600x800 coordinate system (dual intersection).
  const style = {
    top: `${(data.y / 800) * 100}%`,
    left: `${(data.x / 1600) * 100}%`,
    rotate: data.angle,
  };

  const speed = Math.max(0.5, Math.min(speedFactor ?? 1, 3));

  const isSignaling = (data.pathMode === 'cross' || data.pathMode === 'tintersection') && data.route !== 'straight' && data.pos > 30;
  const turnSignal = isSignaling ? data.route : null;

  return (
    <MotionDiv
      initial={style} // PREVENTS FLYING BUG
      animate={style}
      transition={{ duration: 0.18 / speed, ease: [0.4, 0, 0.2, 1] }}
      style={{ transform: 'translate3d(-50%, -50%, 0)', willChange: 'transform' }}
      className={`absolute z-20 origin-center pointer-events-none flex items-center justify-center ${dimensions}`}
    >
      <Template color={color} className="w-full h-full" />
      
      {turnSignal === 'left' && (
        <>
          <motion.div 
            className="absolute -top-0.5 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_4px_rgba(245,158,11,1)]" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} 
          />
          <motion.div 
            className="absolute -top-0.5 left-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_4px_rgba(245,158,11,1)]" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} 
          />
        </>
      )}
      {turnSignal === 'right' && (
        <>
          <motion.div 
            className="absolute -bottom-0.5 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_4px_rgba(245,158,11,1)]" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} 
          />
          <motion.div 
            className="absolute -bottom-0.5 left-1 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_4px_rgba(245,158,11,1)]" 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} 
          />
        </>
      )}
    </MotionDiv>
  );
};
export default memo(Vehicle);
