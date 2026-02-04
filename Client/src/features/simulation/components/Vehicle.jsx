import React from 'react';
import { motion } from 'framer-motion';
import { Sedan, Truck } from './VehicleTemplates';

const Vehicle = ({ data, direction }) => {
  const getColor = () => {
    if (data.status === 'stopped') return '#ef4444';
    if (data.status === 'slowing') return '#f59e0b';
    return '#10b981';
  };
  const posPercent = (data.pos / 200) * 100;
  const getStyle = () => {
    switch(direction) {
      case 'east':  return { left: `${posPercent}%`, top: '25%', transform: 'rotate(0deg)' };
      case 'west':  return { right: `${posPercent}%`, bottom: '25%', transform: 'rotate(180deg)' };
      case 'south': return { top: `${posPercent}%`, right: '25%', transform: 'rotate(90deg)' };
      case 'north': return { bottom: `${posPercent}%`, left: '25%', transform: 'rotate(-90deg)' };
    }
  };
  return (
    <motion.div animate={getStyle()} transition={{ duration: 0.1, ease: "linear" }} className="absolute z-10">
      {data.type === 'truck' ? 
        <Truck color={getColor()} className="w-20 h-8" /> : 
        <Sedan color={getColor()} className="w-12 h-6" />
      }
    </motion.div>
  );
};
export default Vehicle;