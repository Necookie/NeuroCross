import React, { memo } from 'react';

/**
 * TrafficLight - Precision signal housing:
 * Rectangular housing with rounded-none (0px) corners, 1px border #3c3c3c,
 * clean circular apertures for signal lenses with authentic BMW M color coordinates.
 */
const TrafficLight = ({ state }) => {
  return (
    <div className="bg-[#0d0d0d] p-1.5 rounded-none border border-[#3c3c3c] flex flex-col gap-1.5 w-fit z-50 shadow-md">
      {/* RED */}
      <div
        className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
          state === 'RED' ? 'bg-[#e22718] shadow-[0_0_8px_#e22718]' : 'bg-[#1a1a1a] border border-[#262626]'
        }`}
      />
      {/* YELLOW */}
      <div
        className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
          state === 'YELLOW' ? 'bg-[#f4b400] shadow-[0_0_8px_#f4b400]' : 'bg-[#1a1a1a] border border-[#262626]'
        }`}
      />
      {/* GREEN */}
      <div
        className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
          state === 'GREEN' ? 'bg-[#0fa336] shadow-[0_0_8px_#0fa336]' : 'bg-[#1a1a1a] border border-[#262626]'
        }`}
      />
    </div>
  );
};

export default memo(TrafficLight);
