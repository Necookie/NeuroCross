import React, { memo } from 'react';

/**
 * Slider - Precision nature-forward range slider:
 * Clean 0px silhouette, light track, green active fill, crisp readout.
 */
const Slider = ({ label, value, min, max, step, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-[1.2px] text-[#5d7567] text-[10px]">
          {label}
        </span>
        <span className="font-black text-[#0f3d28] text-xs tracking-tight">
          {value.toFixed(1)}
        </span>
      </div>

      <div className="relative flex items-center h-4">
        {/* Track background */}
        <div className="w-full h-1.5 bg-[#ebf2ec] border border-[#d1ded5] relative">
          {/* Active fill */}
          <div
            className="h-full bg-[#16a34a] transition-all duration-75"
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

        {/* Precision rectangular thumb indicator */}
        <div
          className="absolute w-2.5 h-4 bg-[#0f3d28] border border-white pointer-events-none shadow-sm -translate-x-1/2 transition-all duration-75"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default memo(Slider);
