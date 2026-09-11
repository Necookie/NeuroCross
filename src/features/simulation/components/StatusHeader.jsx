import React, { memo } from 'react';
import MStripeDivider from '../../../components/ui/MStripeDivider';

const INTERSECTION_NAMES = {
  cross: '4-Way Intersection',
  roundabout: 'Roundabout',
  tintersection: 'T-Junction',
};

const StatusHeader = ({ mode, running, intersectionType = 'cross' }) => (
  <header className="space-y-4">
    {/* Signature 4px Tricolor Stripe */}
    <MStripeDivider />

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      {/* Brand & Identity */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white m-0">
            NEUROCROSS
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#7e7e7e] border border-[#2a2a2a]">
            SIM LAB
          </span>
        </div>
        <p className="text-xs text-[#888888] font-light m-0">
          Autonomous traffic flow sandbox with adaptive phase optimization.
        </p>
      </div>

      {/* Clean Status Indicators */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-[#121212] border border-[#2a2a2a] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.2px] text-[#cccccc]">
          <span className="text-[#666666] mr-1.5">LAYOUT:</span>
          {INTERSECTION_NAMES[intersectionType] || 'Custom'}
        </div>

        <div className="bg-[#121212] border border-[#2a2a2a] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.2px] text-[#cccccc]">
          <span className="text-[#666666] mr-1.5">TIMING:</span>
          {mode.toUpperCase()}
        </div>

        <div
          className={`border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.2px] flex items-center gap-2 ${
            running
              ? 'bg-[#121212] border-white/40 text-white'
              : 'bg-[#121212] border-[#2a2a2a] text-[#777777]'
          }`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              running ? 'bg-[#0fa336] shadow-[0_0_6px_#0fa336]' : 'bg-[#e22718]'
            }`}
          />
          {running ? 'RUNNING' : 'PAUSED'}
        </div>
      </div>
    </div>
  </header>
);

export default memo(StatusHeader);
