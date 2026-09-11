import React, { memo } from 'react';
import MStripeDivider from '../../../components/ui/MStripeDivider';

const INTERSECTION_LABELS = {
  cross: '4-WAY CORRIDOR',
  roundabout: 'ROUNDABOUT DUAL-RING',
  tintersection: 'T-JUNCTION CORRIDOR',
};

const StatusHeader = ({ mode, running, intersectionType = 'cross' }) => (
  <header className="space-y-4">
    {/* Top brand accent bar */}
    <MStripeDivider className="mb-4" />

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#262626]">
      {/* Brand & Editorial Title */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#7e7e7e]">
            SYSTEM PLATFORM // REALTIME SIMULATION
          </span>
          <span className="h-1 w-1 bg-[#e22718]" />
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0066b1]">
            AUTONOMOUS CORE v1.0
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white m-0">
          NEUROCROSS CONTROL DESK
        </h1>

        <p className="text-sm font-light text-[#bbbbbb] max-w-2xl pt-1">
          High-precision corridor dynamics sandbox. Real-time multi-agent flow telemetry, adaptive signal optimization, and stochastic friction modeling.
        </p>
      </div>

      {/* Industrial Precision Telemetry Badges (0px radius) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="bg-[#1a1a1a] border border-[#3c3c3c] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#e6e6e6]">
          <span className="text-[#7e7e7e] mr-1.5">LAYOUT:</span>
          {INTERSECTION_LABELS[intersectionType] || 'CUSTOM'}
        </div>

        <div className="bg-[#1a1a1a] border border-[#3c3c3c] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#e6e6e6]">
          <span className="text-[#7e7e7e] mr-1.5">MODE:</span>
          {mode.toUpperCase()}
        </div>

        <div
          className={`border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] flex items-center gap-2 ${
            running
              ? 'bg-[#0d0d0d] border-white text-white'
              : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e]'
          }`}
        >
          <span
            className={`inline-block w-2 h-2 ${
              running ? 'bg-[#0fa336]' : 'bg-[#e22718]'
            }`}
          />
          {running ? 'CORE ACTIVE' : 'SIM PAUSED'}
        </div>
      </div>
    </div>
  </header>
);

export default memo(StatusHeader);
