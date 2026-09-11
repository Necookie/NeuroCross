import React, { memo } from 'react';

/**
 * Slider - Precision industrial range slider:
 * Clean 0px silhouette, dark track, white active fill, crisp readout.
 */
const Slider = ({ label, value, min, max, step, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-[1.2px] text-[#888888] text-[10px]">
          {label}
        </span>
        <span className="font-black text-white text-xs tracking-tight">
          {value.toFixed(1)}
        </span>
      </div>

      <div className="relative flex items-center h-4">
        {/* Track background */}
        <div className="w-full h-1 bg-[#222222] border border-[#2f2f2f] relative">
          {/* Active fill */}
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Hidden input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Machined rectangular thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-4 bg-white border border-[#222222] pointer-events-none shadow-sm transition-all duration-75"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
    </div>
  );
};

export default memo(Slider);
