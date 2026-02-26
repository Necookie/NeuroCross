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
    <div className="space-y-6">
    <div className="glass-panel rounded-3xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-mono-100">Environment</h3>
        <div className="text-[10px] uppercase tracking-[0.3em] text-mono-400">Controls</div>
      </div>
      <div className="flex bg-mono-950/70 p-1 rounded-full border border-mono-800/70">
        <button
          onClick={() => updateParam('weather', 'sunny')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${params.weather === 'sunny'
              ? 'bg-mono-200 text-mono-900 shadow-lift'
              : 'text-mono-400 hover:text-mono-200'
            }`}
        >
          <Sun size={14} />
          Clear
        </button>
        <button
          onClick={() => updateParam('weather', 'rain')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${params.weather === 'rain'
              ? 'bg-mono-200 text-mono-900 shadow-lift'
              : 'text-mono-400 hover:text-mono-200'
            }`}
        >
          <CloudRain size={14} />
          Rain
        </button>
      </div>
      <div className="flex bg-mono-950/70 p-1 rounded-full border border-mono-800/70">
        <button
          onClick={() => updateParam('mode', 'smart')}
          className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${params.mode === 'smart'
              ? 'bg-mono-200 text-mono-900 shadow-lift'
              : 'text-mono-400 hover:text-mono-200'
            }`}
        >
          Smart
        </button>
        <button
          onClick={() => updateParam('mode', 'fixed')}
          className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${params.mode === 'fixed'
              ? 'bg-mono-200 text-mono-900 shadow-lift'
              : 'text-mono-400 hover:text-mono-200'
            }`}
        >
          Fixed
        </button>
      </div>

      <div className="pt-2">
        <div className="mb-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-mono-400">Color Theme</div>
        <div className="grid grid-cols-2 gap-2">
          {['dark', 'light', 'coffee', 'candy'].map(t => (
            <button
              key={t}
              onClick={() => updateParam('theme', t)}
              className={`py-2 rounded-xl text-xs font-medium capitalize transition-all duration-300 ease-soft-ease ${(params.theme || 'dark') === t
                  ? 'bg-mono-200 text-mono-900 shadow-lift scale-105'
                  : 'bg-mono-950/50 text-mono-400 hover:text-mono-200 hover:bg-mono-900/50 border border-mono-800/50'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="glass-panel rounded-3xl p-6 space-y-6">
      <div className="text-[10px] uppercase tracking-[0.3em] text-mono-400">Flow Inputs</div>
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

    <div className="glass-panel rounded-3xl p-6 space-y-6">
      <div className="text-[10px] uppercase tracking-[0.3em] text-mono-400">Simulation</div>
      <Slider
        label="Speed"
        value={simSpeed}
        min={0.5}
        max={3.0}
        step={0.1}
        onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
      />
      <div className="text-xs text-mono-300">Running at {simSpeed.toFixed(1)}x</div>
    </div>

    <div className="grid gap-4">
      <MetricCard label="Throughput" value={data.metrics.throughput} />
      <MetricCard label="Avg Speed" value={data.metrics.avg_speed} unit="km/h" />
      <MetricCard label="Incidents" value={data.metrics.accidents} />
    </div>

    <div className="flex gap-3">
      <button
        onClick={onToggleRunning}
        className={`flex-1 py-3 rounded-2xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 ease-soft-ease shadow-lift ${running
            ? 'bg-mono-800 text-mono-200 border border-mono-600/50 hover:bg-mono-700'
            : 'bg-mono-200 text-mono-950 hover:bg-mono-100'
          } ${running && !hasConnected ? 'opacity-80' : ''}`}
      >
        {running ? (
          hasConnected ? (
            <>
              <Pause size={16} /> Pause
            </>
          ) : (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-mono-200 border-t-transparent rounded-full" />{' '}
              Waking Server...
            </>
          )
        ) : (
          <>
            <Play size={16} /> Start
          </>
        )}
      </button>
      <button
        onClick={onReset}
        className="p-3 rounded-2xl bg-mono-900 text-mono-300 border border-mono-700/60 hover:bg-mono-800 hover:text-mono-100 transition-all duration-300 ease-soft-ease shadow-lift"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default memo(ControlsPanel);
