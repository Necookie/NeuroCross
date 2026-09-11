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
    <div className="space-y-3.5">
      {/* Simulation Play / Pause & Reset */}
      <div className="flex gap-2">
        <button
          onClick={onToggleRunning}
          className={`flex-1 h-11 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
            running
              ? 'bg-[#181818] text-white border-white/50 hover:bg-[#222222] hover:border-white'
              : 'bg-white text-black border-white hover:bg-[#e6e6e6]'
          } ${running && !hasConnected ? 'opacity-80' : ''}`}
        >
          {running ? (
            hasConnected ? (
              <>
                <Pause size={14} /> PAUSE
              </>
            ) : (
              <>
                <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                STARTING...
              </>
            )
          ) : (
            <>
              <Play size={14} fill="currentColor" /> START
            </>
          )}
        </button>

        <button
          onClick={onReset}
          title="Reset Network"
          className="h-11 w-11 flex items-center justify-center bg-[#121212] text-[#888888] border border-[#2a2a2a] rounded-none hover:border-white hover:text-white transition-all duration-150"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Environment & Controls */}
      <div className="bg-[#121212] border border-[#2a2a2a] p-4 space-y-3.5">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ffffff] border-b border-[#222222] pb-2">
          Environment & Control
        </div>

        {/* Weather */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#777777]">
            Weather
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('weather', 'sunny')}
              className={`h-8 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.weather === 'sunny'
                  ? 'bg-[#222222] border-white text-white'
                  : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
              }`}
            >
              <Sun size={12} />
              Dry
            </button>
            <button
              onClick={() => updateParam('weather', 'rain')}
              className={`h-8 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.weather === 'rain'
                  ? 'bg-[#222222] border-white text-white'
                  : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
              }`}
            >
              <CloudRain size={12} />
              Rain
            </button>
          </div>
        </div>

        {/* Signal Timing Mode */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#777777]">
            Signal Timing
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('mode', 'smart')}
              className={`h-8 flex items-center justify-center text-[11px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.mode === 'smart'
                  ? 'bg-[#222222] border-white text-white'
                  : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
              }`}
            >
              Smart
            </button>
            <button
              onClick={() => updateParam('mode', 'fixed')}
              className={`h-8 flex items-center justify-center text-[11px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.mode === 'fixed'
                  ? 'bg-[#222222] border-white text-white'
                  : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
              }`}
            >
              Fixed
            </button>
          </div>
        </div>
      </div>

      {/* Intersection Layout */}
      <div className="bg-[#121212] border border-[#2a2a2a] p-4 space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ffffff] border-b border-[#222222] pb-2">
          Intersection Layout
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => updateParam('intersectionType', 'cross')}
            className={`h-9 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'cross'
                ? 'bg-[#222222] border-white text-white'
                : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
            }`}
          >
            4-Way
          </button>
          <button
            onClick={() => updateParam('intersectionType', 'roundabout')}
            className={`h-9 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'roundabout'
                ? 'bg-[#222222] border-white text-white'
                : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
            }`}
          >
            Roundabout
          </button>
          <button
            onClick={() => updateParam('intersectionType', 'tintersection')}
            className={`h-9 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              (params.intersectionType || 'cross') === 'tintersection'
                ? 'bg-[#222222] border-white text-white'
                : 'bg-[#181818] border-[#2a2a2a] text-[#888888] hover:border-[#555555]'
            }`}
          >
            T-Junction
          </button>
        </div>
      </div>

      {/* Flow Rates */}
      <div className="bg-[#121212] border border-[#2a2a2a] p-4 space-y-3.5">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ffffff] border-b border-[#222222] pb-2">
          Traffic Flow
        </div>

        <Slider
          label="North / South"
          value={params.arrival_rate_ns}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(e) => updateParam('arrival_rate_ns', parseFloat(e.target.value))}
        />
        <Slider
          label="East / West"
          value={params.arrival_rate_ew}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(e) => updateParam('arrival_rate_ew', parseFloat(e.target.value))}
        />
      </div>

      {/* Simulation Speed */}
      <div className="bg-[#121212] border border-[#2a2a2a] p-4 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ffffff] border-b border-[#222222] pb-2">
          Simulation Speed
        </div>

        <Slider
          label="Speed Multiplier"
          value={simSpeed}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
        />
      </div>

      {/* Metrics */}
      <div className="grid gap-2">
        <MetricCard label="Throughput" value={data.metrics.throughput} unit="veh" />
        <MetricCard label="Avg Speed" value={data.metrics.avg_speed} unit="km/h" />
        <MetricCard label="Incidents" value={data.metrics.accidents} unit="events" />
      </div>
    </div>
  );
};

export default memo(ControlsPanel);
