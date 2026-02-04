import React from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

const RoadLayer = ({ lanes, lightState }) => {
  const isNSGreen = lightState === 'NS_GREEN';
  return (
    <div className="relative w-[600px] h-[600px] bg-road-grass rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Roads */}
      <div className="absolute left-1/3 w-1/3 h-full bg-road-surface border-x border-road-line flex justify-center"><div className="h-full border-l-2 border-dashed border-road-line opacity-50"/></div>
      <div className="absolute top-1/3 h-1/3 w-full bg-road-surface border-y border-road-line flex flex-col justify-center"><div className="w-full border-t-2 border-dashed border-road-line opacity-50"/></div>
      
      {/* Lights */}
      <div className="absolute top-[32%] left-[32%] -translate-x-full -translate-y-full"><TrafficLight active={isNSGreen} /></div>
      <div className="absolute top-[32%] right-[32%] translate-x-full -translate-y-full"><TrafficLight active={!isNSGreen} /></div>
      <div className="absolute bottom-[32%] right-[32%] translate-x-full translate-y-full"><TrafficLight active={isNSGreen} /></div>
      <div className="absolute bottom-[32%] left-[32%] -translate-x-full translate-y-full"><TrafficLight active={!isNSGreen} /></div>

      {/* Cars */}
      {Object.entries(lanes).map(([dir, cars]) => cars.map(c => <Vehicle key={c.id} data={c} direction={dir} />))}
    </div>
  );
};
export default RoadLayer;