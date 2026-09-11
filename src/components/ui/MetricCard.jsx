import React, { memo } from 'react';

/**
 * MetricCard - Adheres to the 'spec-cell' pattern from design.md:
 * Background #0d0d0d (surface-soft), 1px hairline border #3c3c3c, rounded-none (0px).
 * Top value in bold display 700, label below in uppercase 1.5px tracking 700.
 */
const MetricCard = ({ label, value, unit }) => {
  const progress = Math.min(100, Math.max(10, (Number(value) || 0) % 100));

  return (
    <div className="spec-cell flex flex-col justify-between min-h-[96px] bg-[#0d0d0d] border border-[#3c3c3c] rounded-none p-5 relative overflow-hidden transition-all duration-150 hover:border-white">
      {/* Top Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-[#7e7e7e]">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom Label */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
          {label}
        </span>
      </div>

      {/* Subtle bottom precision track */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#262626]">
        <div 
          className="h-full bg-[#1c69d4] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default memo(MetricCard);
