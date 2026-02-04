import React from 'react';
import { motion } from 'framer-motion';
import { Sedan, Truck } from './VehicleTemplates';

const Vehicle = ({ data, direction }) => {
  // 1. Status Colors
  const getColor = () => {
    if (data.status === 'stopped') return '#ef4444'; // Red-500
    if (data.status === 'slowing') return '#f59e0b'; // Amber-500
    return '#10b981'; // Emerald-500
  };

  // 2. Constants for Lane Physics
  // The map is 100% x 100%. The road center is at 50%.
  // A standard lane is roughly 8% away from the yellow center line.
  const LANE_OFFSET = '8%'; 
  
  // Map simulation units (0-200) to CSS percentage (0-100%)
  const progress = (data.pos / 200) * 100;

  // 3. The Positioning Algorithm
  const getPosition = () => {
    switch(direction) {
      case 'north':
        // Moving UP. 
        // X: Right side of vertical center (50% + offset)
        // Y: Starts at bottom (100%), moves to top (0%)
        return { 
          top: `${100 - progress}%`, 
          left: `calc(50% + ${LANE_OFFSET})`, 
          rotate: -90 
        };

      case 'south':
        // Moving DOWN.
        // X: Left side of vertical center (50% - offset)
        // Y: Starts at top (0%), moves to bottom (100%)
        return { 
          top: `${progress}%`, 
          left: `calc(50% - ${LANE_OFFSET})`, 
          rotate: 90 
        };

      case 'east':
        // Moving RIGHT.
        // X: Starts left (0%), moves right (100%)
        // Y: Bottom side of horizontal center (50% + offset)
        return { 
          left: `${progress}%`, 
          top: `calc(50% + ${LANE_OFFSET})`, 
          rotate: 0 
        };

      case 'west':
        // Moving LEFT.
        // X: Starts right (100%), moves left (0%)
        // Y: Top side of horizontal center (50% - offset)
        return { 
          left: `${100 - progress}%`, 
          top: `calc(50% - ${LANE_OFFSET})`, 
          rotate: 180 
        };

      default:
        return {};
    }
  };

  const style = getPosition();

  return (
    <motion.div
      initial={false} // Prevents flickering on spawn
      animate={{
        top: style.top,
        left: style.left,
        rotate: style.rotate
      }}
      // Use 'transform' to center the div perfectly on its coordinate
      style={{ transform: 'translate(-50%, -50%)' }} 
      transition={{ 
        duration: 0.1, 
        ease: "linear" // Linear movement prevents "rubber banding"
      }}
      className="absolute z-10 origin-center" // Ensure rotation spins around center
    >
      {data.type === 'truck' ? (
        <Truck color={getColor()} className="w-20 h-8" />
      ) : (
        <Sedan color={getColor()} className="w-12 h-6" />
      )}
    </motion.div>
  );
};

export default Vehicle;