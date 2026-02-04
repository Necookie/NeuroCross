import React from 'react';
const TrafficLight = ({ active }) => (
  <div className="bg-slate-900 p-1 rounded border border-slate-700 shadow-xl flex flex-col gap-1">
    <div className={`w-3 h-3 rounded-full ${!active ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-900'}`} />
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_10px_lime]' : 'bg-emerald-900'}`} />
  </div>
);
export default TrafficLight;