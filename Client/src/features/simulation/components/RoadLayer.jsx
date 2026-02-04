import React from 'react';
import TrafficLight from './TrafficLight';
import Vehicle from './Vehicle';

const RoadLayer = ({ roads, lightState, weather }) => {
  return (
    <div className="relative w-[800px] h-[800px] bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {weather === 'rain' && <div className="absolute inset-0 z-50 pointer-events-none bg-blue-900/10 backdrop-blur-[1px]"></div>}

      {/* N-S ROAD */}
      <div className="absolute left-1/2 -translate-x-1/2 w-64 h-full bg-[#1e293b] border-x border-slate-600">
         <div className="absolute left-1/2 h-full border-l-2 border-yellow-500/50"></div>
         <div className="absolute left-1/4 h-full border-l border-dashed border-slate-500/30"></div>
         <div className="absolute right-1/4 h-full border-l border-dashed border-slate-500/30"></div>
         {/* STOP LINES */}
         <div className="absolute top-[32%] w-full h-4 bg-slate-500/50"></div>
         <div className="absolute bottom-[32%] w-full h-4 bg-slate-500/50"></div>
      </div>

      {/* E-W ROAD */}
      <div className="absolute top-1/2 -translate-y-1/2 h-64 w-full bg-[#1e293b] border-y border-slate-600">
         <div className="absolute top-1/2 w-full border-t-2 border-yellow-500/50"></div>
         <div className="absolute top-1/4 w-full border-t border-dashed border-slate-500/30"></div>
         <div className="absolute bottom-1/4 w-full border-t border-dashed border-slate-500/30"></div>
         {/* STOP LINES */}
         <div className="absolute left-[32%] h-full w-4 bg-slate-500/50"></div>
         <div className="absolute right-[32%] h-full w-4 bg-slate-500/50"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1e293b] z-0" />

      {/* LIGHTS */}
      <div className="absolute top-[30%] left-[30%] z-40"><TrafficLight state={lightState.includes('NS') ? "GREEN" : "RED"} /></div>
      <div className="absolute top-[30%] right-[30%] z-40"><TrafficLight state={lightState.includes('EW') ? "GREEN" : "RED"} /></div>

      {/* CARS */}
      <div className="absolute inset-0 z-10">
        {Object.entries(roads).map(([dir, lanes]) => 
          lanes.map((cars, laneIdx) => 
            cars.map(c => <Vehicle key={c.id} data={c} direction={dir} laneIndex={laneIdx} />)
          )
        )}
      </div>
    </div>
  );
};
export default RoadLayer;