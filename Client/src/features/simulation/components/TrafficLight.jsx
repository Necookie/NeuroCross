import React from 'react';

const TrafficLight = ({ state }) => {
  // state is "GREEN", "YELLOW", or "RED"
  return (
    <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-2xl flex flex-col gap-2 w-fit z-50">
      {/* RED */}
      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'RED' ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-red-950/50'}`} />
      {/* YELLOW */}
      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'YELLOW' ? 'bg-amber-400 shadow-[0_0_15px_orange]' : 'bg-amber-950/50'}`} />
      {/* GREEN */}
      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_15px_lime]' : 'bg-emerald-950/50'}`} />
    </div>
  );
};
export default TrafficLight;