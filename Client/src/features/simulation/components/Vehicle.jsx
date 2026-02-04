import React from 'react';
import { motion } from 'framer-motion';
import { Car, Suv, Jeepney, Bus, Bike, Truck } from './VehicleTemplates';

const Vehicle = ({ data, direction, laneIndex }) => {
  const getStatusColor = () => {
    if (data.status === 'crashed') return '#1f2937'; 
    if (data.status === 'stopped') return '#ef4444'; 
    if (data.status === 'slowing') return '#f59e0b'; 
    return '#10b981'; 
  };

  const renderVehicle = () => {
    const props = { color: getStatusColor(), className: getDimensions() };
    switch (data.type) {
        case 'jeepney': return <Jeepney {...props} />;
        case 'bus':     return <Bus {...props} />;
        case 'bike':    return <Bike {...props} />;
        case 'suv':     return <Suv {...props} />;
        case 'truck':   return <Truck {...props} />;
        default:        return <Car {...props} />;
    }
  };

  const getDimensions = () => {
     if (data.type === 'bus') return 'w-24 h-8';     
     if (data.type === 'truck') return 'w-28 h-9';   
     if (data.type === 'jeepney') return 'w-16 h-7'; 
     if (data.type === 'suv') return 'w-14 h-7';     
     if (data.type === 'bike') return 'w-8 h-4';     
     return 'w-12 h-6';                              
  };

  const progress = (data.pos / 400) * 100;

  // --- FIXED LANE ALIGNMENT ---
  // Canvas = 800px. Road = 256px (w-64).
  // Inner Lane Center = 4% (32px)
  // Outer Lane Center = 12% (96px)
  // This leaves 16px buffer from the road edge.
  let laneOffset = laneIndex === 1 ? 4 : 12;

  const getPos = () => {
    const lo = `${laneOffset}%`;
    switch(direction) {
      case 'north': return { top: `${100 - progress}%`, left: `calc(50% + ${lo})`, rotate: -90 };
      case 'south': return { top: `${progress}%`, left: `calc(50% - ${lo})`, rotate: 90 };
      case 'east':  return { left: `${progress}%`, top: `calc(50% + ${lo})`, rotate: 0 };
      case 'west':  return { left: `${100 - progress}%`, top: `calc(50% - ${lo})`, rotate: 180 };
      default: return {};
    }
  };

  const style = getPos();

  return (
    <motion.div
      initial={style} 
      animate={style}
      transition={{ duration: 0.1, ease: 'linear' }}
      style={{ transform: 'translate(-50%, -50%)' }}
      className="absolute z-20 origin-center pointer-events-none"
    >
      {renderVehicle()}
    </motion.div>
  );
};
export default Vehicle;