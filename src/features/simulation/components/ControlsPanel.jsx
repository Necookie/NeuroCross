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
      <div className="bg-[#ffffff] border border-[#d1ded5] p-4 space-y-3 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0f3d28] flex items-center justify-between border-b border-[#ebf2ec] pb-2">
          <span>SIMULATION DYNAMICS</span>
          <span className="text-[9px] text-[#5d7567] font-light">CORE 60HZ</span>
        </div>

        {/* Primary Start / Pause & Step Controls */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button
            onClick={onToggleRunning}
            className={`h-11 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] rounded-none border transition-all duration-150 shadow-sm ${
              running
                ? 'bg-transparent text-[#0f3d28] border-[#0f3d28] hover:bg-[#ebf2ec]'
                : 'bg-[#0f3d28] text-white border-[#0f3d28] hover:bg-[#16a34a] hover:border-[#16a34a]'
            } ${running && !hasConnected ? 'opacity-80' : ''}`}
          >
            {running ? (
              hasConnected ? (
                <>
                  <Pause size={14} /> PAUSE TELEMETRY
                </>
              ) : (
                <>
                  <div className="animate-spin w-3 h-3 border-2 border-[#0f3d28] border-t-transparent rounded-full" />
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
            className="h-11 w-11 flex items-center justify-center bg-[#ffffff] text-[#0f3d28] border border-[#d1ded5] rounded-none hover:border-[#0f3d28] disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 shadow-sm"
          >
            <StepForward size={15} />
          </button>

          {/* Reset Network */}
          <button
            onClick={onReset}
            title="Reset Simulation State"
            className="h-11 w-11 flex items-center justify-center bg-[#ffffff] text-[#5d7567] border border-[#d1ded5] rounded-none hover:border-[#0f3d28] hover:text-[#0f3d28] transition-all duration-150 shadow-sm"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Speed Multipliers */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#5d7567]">
            Execution Warp Multiplier
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0.5, 1.0, 2.0, 3.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setSimSpeed(rate)}
                className={`h-7 text-[11px] font-bold uppercase tracking-[1px] rounded-none border transition-all duration-150 shadow-sm ${
                  simSpeed === rate
                    ? 'bg-[#0f3d28] text-white border-[#0f3d28]'
                    : 'bg-[#ffffff] text-[#5d7567] border-[#d1ded5] hover:border-[#0f3d28] hover:text-[#0f3d28]'
                }`}
              >
                {rate.toFixed(1)}X
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Atmospheric & Environmental Telemetry */}
      <div className="bg-[#ffffff] border border-[#d1ded5] p-4 space-y-3 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0f3d28] border-b border-[#ebf2ec] pb-2">
          ENVIRONMENT & SURFACE FRICTION
        </div>

        {/* Weather Presets */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => updateParam('weather', 'sunny')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 shadow-sm ${
              params.weather === 'sunny'
                ? 'bg-[#0f3d28] border-[#0f3d28] text-white'
                : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567] hover:border-[#0f3d28] hover:text-[#0f3d28]'
            }`}
          >
            <Sun size={12} />
            <span>SUNNY (1.0μ)</span>
          </button>
          <button
            onClick={() => updateParam('weather', 'rain')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 shadow-sm ${
              params.weather === 'rain'
                ? 'bg-[#0f3d28] border-[#0f3d28] text-white'
                : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567] hover:border-[#0f3d28] hover:text-[#0f3d28]'
            }`}
          >
            <CloudRain size={12} />
            <span>WET (0.6μ)</span>
          </button>
          <button
            onClick={() => updateParam('weather', 'night')}
            className={`h-9 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 shadow-sm ${
              params.weather === 'night'
                ? 'bg-[#0f3d28] border-[#0f3d28] text-white'
                : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567] hover:border-[#0f3d28] hover:text-[#0f3d28]'
            }`}
          >
            <Moon size={12} />
            <span>NIGHT</span>
          </button>
        </div>

        {/* Signal Optimization Strategy */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#5d7567]">
            Signal Phase Controller
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateParam('mode', 'smart')}
              className={`h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 shadow-sm ${
                params.mode === 'smart'
                  ? 'bg-[#0f3d28] border-[#0f3d28] text-white'
                  : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567] hover:border-[#0f3d28] hover:text-[#0f3d28]'
              }`}
            >
              Adaptive Neural AI
            </button>
            <button
              onClick={() => updateParam('mode', 'fixed')}
              className={`h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-[1.2px] rounded-none border transition-all duration-150 shadow-sm ${
                params.mode === 'fixed'
                  ? 'bg-[#0f3d28] border-[#0f3d28] text-white'
                  : 'bg-[#ffffff] border-[#d1ded5] text-[#5d7567] hover:border-[#0f3d28] hover:text-[#0f3d28]'
              }`}
            >
              Fixed Timed Cycle
            </button>
          </div>
        </div>
      </div>

      {/* 3. Traffic Inflow Rates & Emergency Priority Dispatch */}
      <div className="bg-[#ffffff] border border-[#d1ded5] p-4 space-y-3.5 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0f3d28] border-b border-[#ebf2ec] pb-2">
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
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#ffffff] text-[#0f3d28] border border-[#d1ded5] text-[11px] font-bold uppercase tracking-[1.5px] hover:border-[#16a34a] hover:bg-[#ebf2ec] transition-all duration-150 shadow-sm"
          >
            <ShieldAlert size={14} className="text-[#16a34a]" />
            DISPATCH ECO-INTERCEPTOR
          </button>
        </div>
      </div>

      {/* 4. Live Vehicle Inspector Card (Active Telemetry) */}
      <div className="bg-[#ffffff] border border-[#d1ded5] p-4 space-y-3 relative overflow-hidden shadow-sm">
        {selectedVehicle ? (
          <>
            <div className="flex items-center justify-between border-b border-[#ebf2ec] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0f3d28]">
                  VEHICLE #{selectedVehicle.id} TELEMETRY
                </span>
              </div>
              <button
                onClick={onDeselectVehicle}
                className="text-[#5d7567] hover:text-[#0f3d28] transition-colors"
                title="Deselect"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#ebf2ec] p-2 border border-[#d1ded5]">
                <div className="text-[9px] uppercase tracking-[1.2px] text-[#5d7567] flex items-center gap-1">
                  <Gauge size={10} /> VELOCITY
                </div>
                <div className="text-xl font-black text-[#0f3d28] mt-0.5">
                  {selectedVehicle.speed || 0} <span className="text-[10px] font-normal text-[#5d7567]">KM/H</span>
                </div>
              </div>

              <div className="bg-[#ebf2ec] p-2 border border-[#d1ded5]">
                <div className="text-[9px] uppercase tracking-[1.2px] text-[#5d7567] flex items-center gap-1">
                  <Activity size={10} /> LATERAL G
                </div>
                <div className="text-xl font-black text-[#0f3d28] mt-0.5">
                  {selectedVehicle.lateralG || '0.00'} <span className="text-[10px] font-normal text-[#5d7567]">G</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-[1.2px]">
              <div className="flex justify-between text-[#283e32]">
                <span className="text-[#5d7567]">CHASSIS CLASS:</span>
                <span className="text-[#0f3d28]">{selectedVehicle.type?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#283e32]">
                <span className="text-[#5d7567]">STATUS / STATE:</span>
                <span className="text-[#16a34a]">{selectedVehicle.status?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#283e32]">
                <span className="text-[#5d7567]">ROUTE TRAJECTORY:</span>
                <span className="text-[#0f3d28] flex items-center gap-1">
                  <Compass size={11} /> {selectedVehicle.route?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Throttle and Brake Bars */}
            <div className="space-y-1 pt-1 border-t border-[#ebf2ec]">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-[1.2px] text-[#5d7567]">
                <span>THROTTLE ({Math.round((selectedVehicle.throttle || 0) * 100)}%)</span>
                <span>BRAKE ({Math.round((selectedVehicle.brakeIntensity || 0) * 100)}%)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-1.5 bg-[#ebf2ec]">
                <div
                  className="h-full bg-[#16a34a] transition-all duration-75"
                  style={{ width: `${Math.min(100, (selectedVehicle.throttle || 0) * 100)}%` }}
                />
                <div
                  className="h-full bg-[#dc2626] transition-all duration-75"
                  style={{ width: `${Math.min(100, (selectedVehicle.brakeIntensity || 0) * 100)}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="py-5 text-center space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#0f3d28]">
              LIVE VEHICLE INSPECTOR
            </div>
            <p className="text-[11px] text-[#5d7567] font-light leading-relaxed px-2 m-0">
              Click any vehicle on the track to lock sensor telemetry, velocity dynamics, and lateral G-force.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ControlsPanel);
