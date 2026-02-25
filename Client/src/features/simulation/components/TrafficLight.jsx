import React from 'react';

const TrafficLight = ({ state }) => {
  // state is "GREEN", "YELLOW", or "RED"
  const glow =
    state === 'RED'
      ? 'hsl(var(--signal-red) / 0.55)'
      : state === 'YELLOW'
        ? 'hsl(var(--signal-amber) / 0.55)'
        : 'hsl(var(--signal-green) / 0.55)';
  return (
    <div className="bg-mono-900/80 p-2 rounded-2xl border border-mono-700/60 shadow-soft flex flex-col gap-2 w-fit z-50">
      {/* RED */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'RED' ? 'bg-signal-red' : 'bg-mono-800'}`}
        style={state === 'RED' ? { boxShadow: `0 0 14px ${glow}` } : undefined}
      />
      {/* YELLOW */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'YELLOW' ? 'bg-signal-amber' : 'bg-mono-800'}`}
        style={state === 'YELLOW' ? { boxShadow: `0 0 14px ${glow}` } : undefined}
      />
      {/* GREEN */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'GREEN' ? 'bg-signal-green' : 'bg-mono-800'}`}
        style={state === 'GREEN' ? { boxShadow: `0 0 14px ${glow}` } : undefined}
      />
    </div>
  );
};
export default TrafficLight;
