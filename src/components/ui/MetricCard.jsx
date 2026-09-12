import React, { memo } from 'react';

/**
 * MetricCard - Spec-cell pattern defined in NeuroCross design.md:
 * Background #0d0d0d (surface-soft), rounded-none (0px), 1px hairline border #3c3c3c.
 * Value in typography.display-sm (30px / 700) and label in typography.label-uppercase (1.5px tracking).
 */
const MetricCard = ({ label, value, unit, subtitle, accent = '#1c69d4' }) => {
  return (
    <div className="bg-[#0d0d0d] border border-[#3c3c3c] rounded-none p-4 relative overflow-hidden transition-all duration-150 hover:border-white/50">
      {/* Top Spec Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] text-[#bbbbbb]">
          {label}
        </span>
        {subtitle && (
          <span className="text-[9px] text-[#7e7e7e] font-light">
            {subtitle}
          </span>
        )}
      </div>

      {/* 2px Precision Accent Indicator Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]">
        <div
          className="h-full transition-all duration-300"
          style={{ width: '100%', backgroundColor: accent }}
        />
      </div>
    </div>
  );
};

export default memo(MetricCard);

