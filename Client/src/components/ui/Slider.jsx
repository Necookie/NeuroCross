import React, { memo } from 'react';

const Slider = ({ label, value, min, max, step, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-mono-300">
        <span className="uppercase tracking-[0.18em]">{label}</span>
        <span className="text-mono-100 font-medium">{value.toFixed(1)}</span>
      </div>
      <div className="relative">
        <div className="h-2.5 rounded-full bg-mono-800 inset-shadow" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mono-500 to-mono-300 transition-[width] duration-500 ease-soft-ease"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-2.5 opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-mono-100 border border-mono-500 shadow-lift transition-all duration-300 ease-soft-ease"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default memo(Slider);
