import React, { memo } from 'react';

/**
 * MetricCard - Spec-cell pattern defined in NeuroCross design.md (Nature-Forward Light):
 * Background #ffffff, rounded-none (0px), 1px hairline border #d1ded5.
 * Value in display typography (28-32px / 700) and label in uppercase (1.5px tracking).
 */
const MetricCard = ({ label, value, unit, subtitle, accent = '#16a34a' }) => {
  return (
    <div className="bg-[#ffffff] border border-[#d1ded5] rounded-none p-4 relative overflow-hidden transition-all duration-150 hover:border-[#0f3d28]/40 shadow-sm">
      {/* Top Spec Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#0f3d28] leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#5d7567]">
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1.5px] text-[#283e32]">
          {label}
        </span>
        {subtitle && (
          <span className="text-[9px] text-[#5d7567] font-light">
            {subtitle}
          </span>
        )}
      </div>

      {/* 2px Precision Nature Accent Indicator Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ebf2ec]">
        <div
          className="h-full transition-all duration-300"
          style={{ width: '100%', backgroundColor: accent }}
        />
      </div>
    </div>
  );
};

export default memo(MetricCard);
