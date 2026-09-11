import React, { memo } from 'react';

const INTERSECTION_LABELS = {
  cross: '4-way Intersection',
  roundabout: 'Roundabout',
  tintersection: 'T-Intersection',
};

const StatusHeader = ({ mode, running, intersectionType = 'cross' }) => (
  <div className="flex flex-wrap items-center justify-between gap-6">
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.35em] text-mono-400">Realtime Traffic Simulation</div>
      <h1 className="text-3xl font-semibold text-mono-100">NeuroCross Control Desk</h1>
      <p className="text-sm text-mono-300 max-w-xl">
        Warm slate blues, soft glass panels, and subtle motion keep focus on flow and behavior.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div className="glass-panel rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] text-mono-300">
        Layout: {INTERSECTION_LABELS[intersectionType] || 'Custom'}
      </div>
      <div className="glass-panel rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] text-mono-300">
        Mode: {mode}
      </div>
      <div
        className={`glass-panel rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] ${
          running ? 'text-mono-100' : 'text-mono-400'
        }`}
      >
        {running ? 'Running' : 'Paused'}
      </div>
    </div>
  </div>
);

export default memo(StatusHeader);
