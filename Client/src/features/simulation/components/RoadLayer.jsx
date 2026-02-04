import React from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

const RoadLayer = ({ lanes, lightState }) => {
  // Helper to parse backend state (e.g. "NS_YELLOW") to "YELLOW"
  const getLightColor = (direction) => {
    // direction is 'NS' or 'EW'
    if (lightState.startsWith(direction)) {
      if (lightState.includes("GREEN")) return "GREEN";
      if (lightState.includes("YELLOW")) return "YELLOW";
    }
    return "RED";
  };

  const LaneMarkings = ({ vertical }) => (
    <div className={`absolute border-dashed border-slate-500/30 ${vertical ? 'h-full border-l-2 left-1/2' : 'w-full border-t-2 top-1/2'}`} />
  );

  return (
    <div className="relative w-[800px] h-[600px] bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:32px_32px]"></div>

      {/* --- HIGHWAY NORTH-SOUTH (WIDER) --- */}
      <div className="absolute left-1/2 -translate-x-1/2 w-48 h-full bg-[#1e293b] shadow-2xl border-x border-slate-700">
        <LaneMarkings vertical />
        {/* Stop Lines */}
        <div className="absolute top-[42%] w-full h-3 bg-slate-500/50"></div>
        <div className="absolute bottom-[42%] w-full h-3 bg-slate-500/50"></div>
      </div>

      {/* --- HIGHWAY EAST-WEST (WIDER) --- */}
      <div className="absolute top-1/2 -translate-y-1/2 h-48 w-full bg-[#1e293b] shadow-2xl border-y border-slate-700">
        <LaneMarkings />
        {/* Stop Lines */}
        <div className="absolute left-[42%] h-full w-3 bg-slate-500/50"></div>
        <div className="absolute right-[42%] h-full w-3 bg-slate-500/50"></div>
      </div>

      {/* --- INTERSECTION BOX --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#1e293b] z-0" />

      {/* --- LIGHTS --- */}
      <div className="absolute top-[38%] left-[38%] -translate-x-full -translate-y-full z-30">
         <TrafficLight state={getLightColor('NS')} />
      </div>
      <div className="absolute top-[38%] right-[38%] translate-x-full -translate-y-full z-30">
         <TrafficLight state={getLightColor('EW')} />
      </div>
      <div className="absolute bottom-[38%] right-[38%] translate-x-full translate-y-full z-30">
         <TrafficLight state={getLightColor('NS')} />
      </div>
      <div className="absolute bottom-[38%] left-[38%] -translate-x-full translate-y-full z-30">
         <TrafficLight state={getLightColor('EW')} />
      </div>

      {/* --- CARS --- */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Object.entries(lanes).map(([dir, cars]) => 
          cars.map(c => <Vehicle key={c.id} data={c} direction={dir} />)
        )}
      </div>
    </div>
  );
};
export default RoadLayer;