import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import RoadLayer from './features/simulation/components/RoadLayer';
import ThreeRoadLayer from './features/simulation/components/ThreeRoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import LoadingScreen from './features/simulation/components/LoadingScreen';
import MetricCard from './components/ui/MetricCard';
import MStripeDivider from './components/ui/MStripeDivider';
import { useSimulation } from './features/simulation/hooks/useSimulation';

export default function App() {
  const [phase, setPhase] = useState('loading');
  const [viewEngine, setViewEngine] = useState('3d');

  const {
    data,
    params,
    setParams,
    setIntersectionType,
    running,
    setRunning,
    simSpeed,
    setSimSpeed,
    hasConnected,
    reset,
    stepOnce,
    dispatchInterceptor,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedVehicle,
  } = useSimulation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('ready');
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const toggleRunning = () => setRunning((prev) => !prev);

  const metrics = data?.metrics || {
    throughput: 0,
    avg_speed: 0,
    accidents: 0,
    active_count: 0,
    efficiency: 100,
    wait_time: 0,
  };

  return (
    <>
      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black flex flex-col">
        {/* Pinned Top Navigation Bar */}
        <StatusHeader
          mode={params.mode}
          running={running}
          intersectionType={params.intersectionType}
          weather={params.weather}
          onSelectLayout={setIntersectionType}
          onReset={reset}
        />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
          {/* Telemetry Spec-Cells Band (design.md 6-up / 3-up grid) */}
          <section aria-label="Network Telemetry Summary">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard
                label="THROUGHPUT"
                value={metrics.throughput}
                unit="VEH"
                subtitle="CLEARED"
                accent="#0066b1"
              />
              <MetricCard
                label="MEAN VELOCITY"
                value={metrics.avg_speed}
                unit="KM/H"
                subtitle="NETWORK SPEED"
                accent="#1c69d4"
              />
              <MetricCard
                label="FLOW STABILITY"
                value={metrics.efficiency}
                unit="%"
                subtitle="OPTIMAL CRUISE"
                accent="#0fa336"
              />
              <MetricCard
                label="ACTIVE FLEET"
                value={metrics.active_count}
                unit="CARS"
                subtitle="ON TRACK"
                accent="#1c69d4"
              />
              <MetricCard
                label="WAIT LATENCY"
                value={metrics.wait_time}
                unit="SEC"
                subtitle="AVG QUEUE"
                accent="#f4b400"
              />
              <MetricCard
                label="SAFETY INTERV."
                value={metrics.accidents}
                unit="EVENTS"
                subtitle="NEAR-MISSES"
                accent={metrics.accidents > 0 ? '#e22718' : '#3c3c3c'}
              />
            </div>
          </section>

          {/* Main Simulation Workspace Grid */}
          <main className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
            {/* Left High-Precision Controls Panel */}
            <aside aria-label="Simulation Controls">
              <ControlsPanel
                params={params}
                setParams={setParams}
                simSpeed={simSpeed}
                setSimSpeed={setSimSpeed}
                running={running}
                hasConnected={hasConnected}
                onToggleRunning={toggleRunning}
                onReset={reset}
                onStepOnce={stepOnce}
                onDispatchInterceptor={dispatchInterceptor}
                selectedVehicle={selectedVehicle}
                onDeselectVehicle={() => setSelectedVehicleId(null)}
              />
            </aside>

            {/* Right Simulation Viewport */}
            <section className="flex flex-col gap-3">
              {/* Viewport Engine Switcher Header */}
              <div className="flex items-center justify-between pb-1 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0066b1]" />
                  <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-white">
                    {viewEngine === '3d' ? '3D ACCELERATED WEBGL ENVIRONMENT' : '2D TOPOGRAPHIC SCHEMATIC'}
                  </span>
                </div>

                <div className="flex items-center border border-[#262626] bg-[#0c0d12] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewEngine('3d')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
                      viewEngine === '3d'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    3D WEBGL
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewEngine('2d')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
                      viewEngine === '2d'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    2D SCHEMATIC
                  </button>
                </div>
              </div>

              {viewEngine === '3d' ? (
                <ThreeRoadLayer
                  data={data}
                  weather={params.weather}
                  speedFactor={simSpeed}
                  intersectionType={params.intersectionType}
                  selectedVehicleId={selectedVehicleId}
                  onSelectVehicle={(id) => setSelectedVehicleId(id)}
                />
              ) : (
                <RoadLayer
                  data={data}
                  weather={params.weather}
                  speedFactor={simSpeed}
                  intersectionType={params.intersectionType}
                  selectedVehicleId={selectedVehicleId}
                  onSelectVehicle={(id) => setSelectedVehicleId(id)}
                />
              )}

              {/* Viewport Meta Ticker Bar */}
              <div className="flex flex-wrap items-center justify-between text-[10px] font-bold uppercase tracking-[1.5px] text-[#7e7e7e] px-1 py-1 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <span>HIGH-PERFORMANCE CORRIDOR TELEMETRY</span>
                  <span className="hidden sm:inline text-[#3c3c3c]">|</span>
                  <span className="hidden sm:inline">COEFFICIENT: {params.weather === 'rain' ? '0.58μ (WET)' : '1.00μ (DRY)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066b1]" />
                  <span>TICK: 60 HZ INTEGRATION</span>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Editorial Footer conforming to design.md */}
        <footer className="bg-[#000000] border-t border-[#262626] mt-12">
          <MStripeDivider />
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#7e7e7e] text-xs font-light">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">NEUROCROSS</span>
              <span>· High-Performance Autonomous Simulation Environment</span>
            </div>
            <div className="text-[11px] uppercase tracking-[1.2px] text-[#555555]">
              ENGINEERING SPECIFICATION M-SERIES DYNAMICS
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

