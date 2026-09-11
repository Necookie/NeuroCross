import React, { memo } from 'react';

/**
 * MetricCard - Spec-cell pattern with clean, authentic automotive telemetry aesthetic.
 */
const MetricCard = ({ label, value, unit }) => {
  const progress = Math.min(100, Math.max(10, (Number(value) || 0) % 100));

  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-none p-4 relative overflow-hidden transition-all duration-150 hover:border-[#444444]">
      {/* Top Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="mt-1">
        <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#888888]">
          {label}
        </span>
      </div>

      {/* Bottom accent track */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#222222]">
        <div 
          className="h-full bg-[#1c69d4] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default memo(MetricCard);
