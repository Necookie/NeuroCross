import React, { memo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Sun,
  CloudRain,
  Moon,
  ShieldAlert,
  Gauge,
  Activity,
  Compass,
  X
} from 'lucide-react';

import Slider from '../../../components/ui/Slider';

const ControlsPanel = ({
  params,
  setParams,
  simSpeed,
  setSimSpeed,
  running,
  hasConnected,
  onToggleRunning,
  onReset,
  onStepOnce,
  onDispatchInterceptor,
  selectedVehicle,
  onDeselectVehicle,
}) => {
  const updateParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, [setParams]);

  return (
    <div className="space-y-4">
      {/* 1. Simulation Master Execution Hub */}
      <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-4 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-white flex items-center justify-between border-b border-[#262626] pb-2">
          <span>SIMULATION DYNAMICS</span>
          <span className="text-[9px] text-[#7e7e7e] font-light">CORE 60HZ</span>
        </div>

        {/* Primary Start / Pause & Step Controls */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button
            onClick={onToggleRunning}
            className={`h-11 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 ${
              running
                ? 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                : 'bg-white text-black border-white hover:bg-[#e6e6e6]'
            } ${running && !hasConnected ? 'opacity-80' : ''}`}
          >
            {running ? (
              hasConnected ? (
                <>
                  <Pause size={14} /> PAUSE TELEMETRY
                </>
              ) : (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                  INITIALIZING...
                </>
              )
            ) : (
              <>
                <Play size={14} fill="currentColor" /> RUN SIMULATION
              </>
            )}
          </button>

          {/* Single Step Tick */}
          <button
            onClick={onStepOnce}
            disabled={running}
            title="Single-Step Tick"
            className="h-11 w-11 flex items-center justify-center bg-[#1a1a1a] text-white border border-[#3c3c3c] rounded-none hover:border-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-150"
          >
            <StepForward size={15} />
          </button>

          {/* Reset Network */}
          <button
            onClick={onReset}
            title="Reset Simulation State"
            className="h-11 w-11 flex items-center justify-center bg-[#1a1a1a] text-[#bbbbbb] border border-[#3c3c3c] rounded-none hover:border-white hover:text-white transition-all duration-150"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#7e7e7e]">
            Execution Warp Multiplier
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.5, 1.0, 2.0, 3.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setSimSpeed(rate)}
                className={`h-7 text-[11px] font-bold uppercase tracking-[1px] rounded-none border transition-all duration-150 ${
                  simSpeed === rate
                    ? 'bg-white text-black border-white'
                    : 'bg-[#1a1a1a] text-[#bbbbbb] border-[#3c3c3c] hover:border-white'
                }`}
              >
                {rate.toFixed(1)}X
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Atmospheric & Environmental Telemetry */}
      <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-4 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-white border-b border-[#262626] pb-2">
          ENVIRONMENT & SURFACE FRICTION
        </div>

        {/* Weather Presets */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => updateParam('weather', 'sunny')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              params.weather === 'sunny'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:border-[#7e7e7e]'
            }`}
          >
            <Sun size={12} />
            <span>DRY (1.0μ)</span>
          </button>
          <button
            onClick={() => updateParam('weather', 'rain')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              params.weather === 'rain'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:border-[#7e7e7e]'
            }`}
          >
            <CloudRain size={12} />
            <span>WET (0.6μ)</span>
          </button>
          <button
            onClick={() => updateParam('weather', 'night')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
              params.weather === 'night'
                ? 'bg-[#262626] border-white text-white'
                : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:border-[#7e7e7e]'
            }`}
          >
            <Moon size={12} />
            <span>NIGHT</span>
          </button>
        </div>

        {/* Signal Optimization Strategy */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#7e7e7e]">
            Signal Phase Controller
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('mode', 'smart')}
              className={`h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.mode === 'smart'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:border-[#7e7e7e]'
              }`}
            >
              Adaptive Neural AI
            </button>
            <button
              onClick={() => updateParam('mode', 'fixed')}
              className={`h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 ${
                params.mode === 'fixed'
                  ? 'bg-[#262626] border-white text-white'
                  : 'bg-[#1a1a1a] border-[#3c3c3c] text-[#7e7e7e] hover:border-[#7e7e7e]'
              }`}
            >
              Fixed Timed Cycle
            </button>
          </div>
        </div>
      </div>

      {/* 3. Traffic Inflow Rates & Emergency Priority Dispatch */}
      <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-4 space-y-3.5">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-white border-b border-[#262626] pb-2">
          FLEET DENSITY & FLOW
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

        {/* Priority Emergency Interceptor Dispatch */}
        <div className="pt-2">
          <button
            onClick={onDispatchInterceptor}
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white border border-[#3c3c3c] text-[11px] font-bold uppercase tracking-[1.5px] hover:border-[#0066b1] hover:bg-[#262626] transition-all duration-150"
          >
            <ShieldAlert size={14} className="text-[#0066b1]" />
            DISPATCH M-INTERCEPTOR
          </button>
        </div>
      </div>

      {/* 4. Live Vehicle Inspector Card (Active Telemetry) */}
      <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-4 space-y-3 relative overflow-hidden">
        {selectedVehicle ? (
          <>
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1c69d4] animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-white">
                  VEHICLE #{selectedVehicle.id} TELEMETRY
                </span>
              </div>
              <button
                onClick={onDeselectVehicle}
                className="text-[#7e7e7e] hover:text-white transition-colors"
                title="Deselect"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#1a1a1a] p-2 border border-[#262626]">
                <div className="text-[9px] uppercase tracking-[1.2px] text-[#7e7e7e] flex items-center gap-1">
                  <Gauge size={10} /> VELOCITY
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  {selectedVehicle.speed || 0} <span className="text-[10px] font-normal text-[#7e7e7e]">KM/H</span>
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-2 border border-[#262626]">
                <div className="text-[9px] uppercase tracking-[1.2px] text-[#7e7e7e] flex items-center gap-1">
                  <Activity size={10} /> LATERAL G
                </div>
                <div className="text-xl font-black text-white mt-0.5">
                  {selectedVehicle.lateralG || '0.00'} <span className="text-[10px] font-normal text-[#7e7e7e]">G</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-[1.2px]">
              <div className="flex justify-between text-[#bbbbbb]">
                <span className="text-[#7e7e7e]">CHASSIS CLASS:</span>
                <span className="text-white">{selectedVehicle.type?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#bbbbbb]">
                <span className="text-[#7e7e7e]">STATUS / STATE:</span>
                <span className="text-[#0fa336]">{selectedVehicle.status?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#bbbbbb]">
                <span className="text-[#7e7e7e]">ROUTE TRAJECTORY:</span>
                <span className="text-white flex items-center gap-1">
                  <Compass size={11} /> {selectedVehicle.route?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Throttle and Brake Bars */}
            <div className="space-y-1 pt-1 border-t border-[#262626]">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-[1.2px] text-[#7e7e7e]">
                <span>THROTTLE ({Math.round((selectedVehicle.throttle || 0) * 100)}%)</span>
                <span>BRAKE ({Math.round((selectedVehicle.brakeIntensity || 0) * 100)}%)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-1.5 bg-[#1a1a1a]">
                <div
                  className="h-full bg-[#0066b1] transition-all duration-75"
                  style={{ width: `${Math.min(100, (selectedVehicle.throttle || 0) * 100)}%` }}
                />
                <div
                  className="h-full bg-[#e22718] transition-all duration-75"
                  style={{ width: `${Math.min(100, (selectedVehicle.brakeIntensity || 0) * 100)}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="py-5 text-center space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-white">
              LIVE VEHICLE INSPECTOR
            </div>
            <p className="text-[11px] text-[#7e7e7e] font-light leading-relaxed px-2 m-0">
              Click any vehicle on the track to lock sensor telemetry, velocity dynamics, and lateral G-force.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ControlsPanel);

