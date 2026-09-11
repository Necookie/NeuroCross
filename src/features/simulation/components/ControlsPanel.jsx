import React, { memo, useCallback } from 'react';
import { CloudRain, Play, Pause, RotateCcw, Sun } from 'lucide-react';

import MetricCard from '../../../components/ui/MetricCard';
import Slider from '../../../components/ui/Slider';

const ControlsPanel = ({
  params,
  setParams,
  simSpeed,
  setSimSpeed,
  data,
  running,
  hasConnected,
  onToggleRunning,
  onReset
}) => {
  const updateParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, [setParams]);

  return (
    <div className="space-y-4">
      {/* Simulation Master Actions */}
      <div className="flex gap-2">
        <button
          onClick={onToggleRunning}
          className={`flex-1 h-12 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
            running
              ? 'bg-[#1a1a1a] text-white border-white hover:bg-[#262626]'
              : 'bg-white text-black border-white hover:bg-[#e6e6e6]'
          } ${running && !hasConnected ? 'opacity-80' : ''}`}
        >
          {running ? (
            hasConnected ? (
              <>
                <Pause size={15} /> PAUSE CORE
              </>
            ) : (
              <>
                <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                CONNECTING...
              </>
            )
          ) : (
            <>
              <Play size={15} fill="currentColor" /> ENGAGE SIMULATION
            </>
          )}
        </button>

        <button
          onClick={onReset}
          title="Reset Network"
          className="h-12 w-12 flex items-center justify-center bg-[#1a1a1a] text-[#bbbbbb] border border-[#3c3c3c] rounded-none hover:border-white hover:text-white transition-all duration-150"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Environment & Signal Parameters */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-none p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-[1.5px] text-white">
            ENVIRONMENT & TIMING
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            PARAMS
          </span>
        </div>

        {/* Weather Mode */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            ATMOSPHERIC FRICTION
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('weather', 'sunny')}
              className={`h-9 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
                params.weather === 'sunny'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
              }`}
            >
              <Sun size={13} />
              DRY (1.0μ)
            </button>
            <button
              onClick={() => updateParam('weather', 'rain')}
              className={`h-9 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
                params.weather === 'rain'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
              }`}
            >
              <CloudRain size={13} />
              RAIN (0.6μ)
            </button>
          </div>
        </div>

        {/* Signal Timing Mode */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            SIGNAL CONTROLLER
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('mode', 'smart')}
              className={`h-9 flex items-center justify-center text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
                params.mode === 'smart'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
              }`}
            >
              NEURAL SMART
            </button>
            <button
              onClick={() => updateParam('mode', 'fixed')}
              className={`h-9 flex items-center justify-center text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
                params.mode === 'fixed'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
              }`}
            >
              FIXED CYCLE
            </button>
          </div>
        </div>
      </div>

      {/* Network Geometry / Layout */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-none p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-[1.5px] text-white">
            CORRIDOR GEOMETRY
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            LAYOUT
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => updateParam('intersectionType', 'cross')}
            className={`h-10 text-[11px] font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'cross'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
            }`}
          >
            4-WAY
          </button>
          <button
            onClick={() => updateParam('intersectionType', 'roundabout')}
            className={`h-10 text-[11px] font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'roundabout'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
            }`}
          >
            ROUNDABOUT
          </button>
          <button
            onClick={() => updateParam('intersectionType', 'tintersection')}
            className={`h-10 text-[11px] font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'tintersection'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#0d0d0d] border-[#3c3c3c] text-[#bbbbbb] hover:border-[#7e7e7e]'
            }`}
          >
            T-JUNCTION
          </button>
        </div>
      </div>

      {/* Traffic Flow Injection */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-none p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-[1.5px] text-white">
            TRAFFIC DENSITY
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            RATE / S
          </span>
        </div>

        <Slider
          label="North / South Flow"
          value={params.arrival_rate_ns}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(e) => updateParam('arrival_rate_ns', parseFloat(e.target.value))}
        />
        <Slider
          label="East / West Flow"
          value={params.arrival_rate_ew}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(e) => updateParam('arrival_rate_ew', parseFloat(e.target.value))}
        />
      </div>

      {/* Simulation Clock Rate */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-none p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
          <span className="text-xs font-bold uppercase tracking-[1.5px] text-white">
            SIMULATION CLOCK
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e]">
            MULTIPLIER
          </span>
        </div>

        <Slider
          label="Time Compression"
          value={simSpeed}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
        />
      </div>

      {/* Spec Cells / Realtime Telemetry Metrics */}
      <div className="grid gap-2">
        <MetricCard label="CORRIDOR THROUGHPUT" value={data.metrics.throughput} unit="VEH" />
        <MetricCard label="VELOCITY TELEMETRY" value={data.metrics.avg_speed} unit="KM/H" />
        <MetricCard label="CONFLICT EVENTS" value={data.metrics.accidents} unit="INC" />
      </div>
    </div>
  );
};

export default memo(ControlsPanel);
