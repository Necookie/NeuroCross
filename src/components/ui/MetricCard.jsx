import React, { memo } from 'react';

const MetricCard = ({ label, value, unit }) => {
  const progress = 40 + (Number(value) % 60);
  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-lift">
      <div className="text-[11px] uppercase tracking-[0.22em] text-mono-300">{label}</div>
      <div className="text-2xl font-semibold text-mono-100">
        {value}
        {unit && <span className="text-sm text-mono-300 ml-1">{unit}</span>}
      </div>
      <div className="metric-track h-1.5 rounded-full overflow-hidden">
        <div className="metric-fill h-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default memo(MetricCard);
