import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, RotateCcw, CloudRain, Sun } from 'lucide-react';
import RoadLayer from './features/simulation/components/RoadLayer';

function App() {
  const [data, setData] = useState({ 
    roads: { north: [[],[]], south: [[],[]], east: [[],[]], west: [[],[]] }, 
    light_state: 'NS_GREEN', 
    metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
  });

  const [params, setParams] = useState({ 
    arrival_rate_ns: 0.8, 
    arrival_rate_ew: 0.4, 
    mode: 'smart',
    weather: 'sunny' 
  });
  
  const [running, setRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      const tickMs = Math.max(30, 100 / simSpeed);
      interval = setInterval(() => {
        axios.post('http://localhost:8000/step', params)
          .then(res => setData(res.data))
          .catch(err => console.error(err));
      }, tickMs);
    }
    return () => clearInterval(interval);
  }, [running, params, simSpeed]);

  // Example animation logic: drive a subtle UI shimmer off a lightweight RAF loop.
  useEffect(() => {
    if (!running) return;
    let raf;
    let last = 0;
    const loop = (time) => {
      if (time - last > 120) {
        setPhase((prev) => (prev + 0.04) % 1);
        last = time;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const reset = async () => {
    await axios.post('http://localhost:8000/reset');
    setData({ 
        roads: { north: [[],[]], south: [[],[]], east: [[],[]], west: [[],[]] }, 
        light_state: 'NS_GREEN', 
        metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
    });
  };

  const MetricCard = ({ label, value, unit }) => (
    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-lift">
      <div className="text-[11px] uppercase tracking-[0.22em] text-mono-300">{label}</div>
      <div className="text-2xl font-semibold text-mono-100">
        {value}
        {unit && <span className="text-sm text-mono-300 ml-1">{unit}</span>}
      </div>
      <div
        className="h-1.5 rounded-full bg-mono-800 overflow-hidden"
        style={{ backgroundPositionX: `${phase * 100}%` }}
      >
        <div
          className="h-full w-2/3 bg-gradient-to-r from-mono-600/60 via-mono-400/60 to-mono-600/60 transition-[width] duration-700 ease-soft-ease"
          style={{ width: `${40 + (Number(value) % 60)}%` }}
        />
      </div>
    </div>
  );

  const Slider = ({ label, value, min, max, step, onChange }) => {
    const pct = ((value - min) / (max - min)) * 100;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-mono-300">
          <span className="uppercase tracking-[0.18em]">{label}</span>
          <span className="text-mono-100 font-medium">{value.toFixed(1)}</span>
        </div>
        <div className="relative">
          <div className="h-2.5 rounded-full bg-mono-800 inset-shadow" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mono-500 to-mono-300 transition-[width] duration-500 ease-soft-ease"
            style={{ width: `${pct}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="absolute inset-0 w-full h-2.5 opacity-0 cursor-pointer"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-mono-100 border border-mono-500 shadow-lift transition-all duration-300 ease-soft-ease"
            style={{ left: `calc(${pct}% - 8px)` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mono-950 via-mono-900 to-mono-950 text-mono-100 font-sans px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
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
              Mode: {params.mode}
            </div>
            <div className={`glass-panel rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] ${running ? 'text-mono-100' : 'text-mono-400'}`}>
              {running ? 'Running' : 'Paused'}
            </div>
          </div>
        </div>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-mono-100">Environment</h3>
                <div className="text-[10px] uppercase tracking-[0.3em] text-mono-400">Controls</div>
              </div>
              <div className="flex bg-mono-950/70 p-1 rounded-full border border-mono-800/70">
                <button
                  onClick={() => setParams({ ...params, weather: 'sunny' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${
                    params.weather === 'sunny'
                      ? 'bg-mono-200 text-mono-900 shadow-lift'
                      : 'text-mono-400 hover:text-mono-200'
                  }`}
                >
                  <Sun size={14} />
                  Clear
                </button>
                <button
                  onClick={() => setParams({ ...params, weather: 'rain' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${
                    params.weather === 'rain'
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
                  onClick={() => setParams({ ...params, mode: 'smart' })}
                  className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${
                    params.mode === 'smart'
                      ? 'bg-mono-200 text-mono-900 shadow-lift'
                      : 'text-mono-400 hover:text-mono-200'
                  }`}
                >
                  Smart
                </button>
                <button
                  onClick={() => setParams({ ...params, mode: 'fixed' })}
                  className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-300 ease-soft-ease ${
                    params.mode === 'fixed'
                      ? 'bg-mono-200 text-mono-900 shadow-lift'
                      : 'text-mono-400 hover:text-mono-200'
                  }`}
                >
                  Fixed
                </button>
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
                onChange={(e) => setParams({ ...params, arrival_rate_ns: parseFloat(e.target.value) })}
              />
              <Slider
                label="East / West"
                value={params.arrival_rate_ew}
                min={0.1}
                max={3.0}
                step={0.1}
                onChange={(e) => setParams({ ...params, arrival_rate_ew: parseFloat(e.target.value) })}
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
                onClick={() => setRunning(!running)}
                className={`flex-1 py-3 rounded-2xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 ease-soft-ease shadow-lift ${
                  running
                    ? 'bg-mono-800 text-mono-200 border border-mono-600/50 hover:bg-mono-700'
                    : 'bg-mono-200 text-mono-950 hover:bg-mono-100'
                }`}
              >
                {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
              </button>
              <button
                onClick={reset}
                className="p-3 rounded-2xl bg-mono-900 text-mono-300 border border-mono-700/60 hover:bg-mono-800 hover:text-mono-100 transition-all duration-300 ease-soft-ease shadow-lift"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* ROAD */}
          <div className="flex items-center justify-center">
            <RoadLayer
              roads={data.roads}
              lightState={data.light_state}
              weather={params.weather}
              speedFactor={simSpeed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
