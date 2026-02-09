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

  // RESCALED DIMENSIONS
  const getDimensions = () => {
     if (data.type === 'bus') return 'w-14 h-5';      
     if (data.type === 'truck') return 'w-16 h-6';    
     if (data.type === 'jeepney') return 'w-10 h-4';  
     if (data.type === 'suv') return 'w-9 h-4';       
     if (data.type === 'bike') return 'w-5 h-3';      
     return 'w-8 h-4';                                
  };

  const progress = (data.pos / 400) * 100;

  // FIXED LANE OFFSETS (Inner: 5%, Outer: 15%)
  let laneOffset = laneIndex === 1 ? 5 : 15;

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
      initial={style} // PREVENTS FLYING BUG
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