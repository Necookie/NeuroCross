import React from 'react';
import { motion } from 'framer-motion';
import { Sedan, Truck } from './VehicleTemplates';

const Vehicle = ({ data, direction }) => {
  const getColor = () => {
    if (data.status === 'stopped') return '#ef4444';
    if (data.status === 'slowing') return '#f59e0b';
    return '#10b981';
  };

  // --- CONFIGURATION ---
  // The map is now 300 units long in Backend.
  // CSS Map is 0-100%.
  const progress = (data.pos / 300) * 100;
  
  // HIGHWAY OFFSET: Pushes car to the correct lane
  // Since road is wider, we need a larger offset from center.
  const OFFSET = '6%'; 

  const getPosition = () => {
    switch(direction) {
      case 'north': return { top: `${100 - progress}%`, left: `calc(50% + ${OFFSET})`, rotate: -90 };
      case 'south': return { top: `${progress}%`, left: `calc(50% - ${OFFSET})`, rotate: 90 };
      case 'east':  return { left: `${progress}%`, top: `calc(50% + ${OFFSET})`, rotate: 0 };
      case 'west':  return { left: `${100 - progress}%`, top: `calc(50% - ${OFFSET})`, rotate: 180 };
    }
  };

  const style = getPosition();

  return (
    <motion.div
      initial={false}
      animate={{ top: style.top, left: style.left, rotate: style.rotate }}
      style={{ transform: 'translate(-50%, -50%)' }}
      transition={{ duration: 0.1, ease: "linear" }}
      className="absolute z-10 origin-center"
    >
      {data.type === 'truck' ? (
        <Truck color={getColor()} className="w-24 h-10 drop-shadow-lg" />
      ) : (
        <Sedan color={getColor()} className="w-14 h-7 drop-shadow-md" />
      )}
    </motion.div>
  );
};
export default Vehicle;