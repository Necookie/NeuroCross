import React, { memo } from 'react';

/**
 * Slider - Industrial precision range slider:
 * 0px rounded corners, crisp hairline track (#3c3c3c), rectangular machined thumb,
 * uppercase tracking 1.5px label, bold readout.
 */
const Slider = ({ label, value, min, max, step, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
          {label}
        </span>
        <span className="font-black text-white text-sm tracking-tight">
          {value.toFixed(1)}
        </span>
      </div>

      <div className="relative flex items-center h-5">
        {/* Track background */}
        <div className="w-full h-1 bg-[#262626] border border-[#3c3c3c] relative">
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
          className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-white border border-[#3c3c3c] pointer-events-none shadow-sm transition-all duration-75"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
    </div>
  );
};

export default memo(Slider);
