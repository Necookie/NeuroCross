import React from 'react';
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

const Vehicle = ({ data, direction, laneIndex, orderIndex, speedFactor }) => {
  const getVehicleColor = () => {
    if (!colorCache.has(data.id)) {
      const idx = hashId(data.id) % colorPool.length;
      colorCache.set(data.id, colorPool[idx]);
    }
    return colorCache.get(data.id);
  };

  const renderVehicle = () => {
    const props = { color: getVehicleColor(), className: getDimensions() };
    switch (data.type) {
      case 'jeepney': return <Jeepney {...props} />;
      case 'bus': return <Bus {...props} />;
      case 'bike': return <Bike {...props} />;
      case 'suv': return <Suv {...props} />;
      case 'van': return <Van {...props} />;
      case 'taxi': return <Taxi {...props} />;
      case 'pickup': return <Pickup {...props} />;
      case 'scooter': return <Scooter {...props} />;
      case 'truck': return <Truck {...props} />;
      default: return <Car {...props} />;
    }
  };

  // RESCALED DIMENSIONS
  const getDimensions = () => {
    if (data.type === 'bus') return 'w-14 h-5';
    if (data.type === 'truck') return 'w-16 h-5';
    if (data.type === 'van') return 'w-12 h-5';
    if (data.type === 'pickup') return 'w-11 h-4';
    if (data.type === 'jeepney') return 'w-10 h-4';
    if (data.type === 'suv') return 'w-9 h-4';
    if (data.type === 'taxi') return 'w-9 h-4';
    if (data.type === 'bike') return 'w-5 h-3';
    if (data.type === 'scooter') return 'w-5 h-3';
    return 'w-8 h-4';
  };

  const progress = (data.pos / 400) * 100;

  // LANE OFFSETS - calculated from road geometry:
  // Road is 320px on 800px canvas. Each direction has 2x 80px lanes.
  // Inner lane center = 40px from middle = 5% of 800px
  // Outer lane center = 120px from middle = 15% of 800px
  const laneOffset = laneIndex === 1 ? 5 : 15;

  const getPos = () => {
    const lo = `${laneOffset}%`;
    const gapPx = Math.min(orderIndex * 6, 24);
    const gap = { x: 0, y: 0 };
    switch (direction) {
      case 'north':
        gap.y = gapPx;
        return { top: `${100 - progress}%`, left: `calc(50% + ${lo})`, rotate: -90, ...gap };
      case 'south':
        gap.y = -gapPx;
        return { top: `${progress}%`, left: `calc(50% - ${lo})`, rotate: 90, ...gap };
      case 'east':
        gap.x = -gapPx;
        return { left: `${progress}%`, top: `calc(50% + ${lo})`, rotate: 0, ...gap };
      case 'west':
        gap.x = gapPx;
        return { left: `${100 - progress}%`, top: `calc(50% - ${lo})`, rotate: 180, ...gap };
      default: return {};
    }
  };

  const style = getPos();

  const speed = Math.max(0.5, Math.min(speedFactor ?? 1, 3));

  return (
    <motion.div
      initial={style} // PREVENTS FLYING BUG
      animate={style}
      transition={{ duration: 0.18 / speed, ease: [0.4, 0, 0.2, 1] }}
      style={{ transform: 'translate(-50%, -50%)' }}
      className="absolute z-20 origin-center pointer-events-none"
    >
      {renderVehicle()}
    </motion.div>
  );
};
export default Vehicle;
