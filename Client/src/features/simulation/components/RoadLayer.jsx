import React from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

const RoadLayer = ({ lanes, lightState }) => {
  const isNSGreen = lightState === 'NS_GREEN';

  // Helper for the dashed lane markers
  const LaneDivider = ({ vertical }) => (
    <div className={`absolute border-dashed border-slate-600/40 ${vertical ? 'h-full border-l-2 left-1/2 -ml-[1px]' : 'w-full border-t-2 top-1/2 -mt-[1px]'}`} />
  );

  // Helper for the thick white stop bars
  const StopLine = ({ className }) => (
    <div className={`absolute bg-slate-400/50 ${className}`} />
  );

  return (
    <div className="relative w-[600px] h-[600px] bg-[#0B1120] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Background Texture (Subtle grid) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* --- NORTH-SOUTH ROAD --- */}
      <div className="absolute left-1/2 -translate-x-1/2 w-48 h-full bg-[#1e293b] shadow-inner">
        <LaneDivider vertical />
        {/* Stop Lines */}
        <StopLine className="w-full h-2 top-[34%]" /> {/* North Stop */}
        <StopLine className="w-full h-2 bottom-[34%]" /> {/* South Stop */}
      </div>

      {/* --- EAST-WEST ROAD --- */}
      <div className="absolute top-1/2 -translate-y-1/2 h-48 w-full bg-[#1e293b] shadow-inner">
        <LaneDivider />
        {/* Stop Lines */}
        <StopLine className="h-full w-2 left-[34%]" /> {/* West Stop */}
        <StopLine className="h-full w-2 right-[34%]" /> {/* East Stop */}
      </div>

      {/* --- INTERSECTION SHADOW --- */}
      {/* Darkens the intersection center slightly for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-black/10 pointer-events-none" />

      {/* --- TRAFFIC LIGHTS --- */}
      {/* Positioned at corners with a distinct 'arm' or housing look */}
      <div className="absolute top-[32%] left-[32%] -translate-x-full -translate-y-full z-20">
         <TrafficLight active={isNSGreen} label="S" />
      </div>
      <div className="absolute top-[32%] right-[32%] translate-x-full -translate-y-full z-20">
         <TrafficLight active={!isNSGreen} label="W" />
      </div>
      <div className="absolute bottom-[32%] right-[32%] translate-x-full translate-y-full z-20">
         <TrafficLight active={isNSGreen} label="N" />
      </div>
      <div className="absolute bottom-[32%] left-[32%] -translate-x-full translate-y-full z-20">
         <TrafficLight active={!isNSGreen} label="E" />
      </div>

      {/* --- VEHICLES LAYER --- */}
      <div className="absolute inset-0 z-10">
        {Object.entries(lanes).map(([dir, cars]) => 
          cars.map(c => <Vehicle key={c.id} data={c} direction={dir} />)
        )}
      </div>

    </div>
  );
};
export default RoadLayer;