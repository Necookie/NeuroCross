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

      <div className="min-h-screen bg-[#f4f7f4] text-[#283e32] font-sans selection:bg-[#16a34a] selection:text-white flex flex-col">
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
          {/* Telemetry Spec-Cells Band */}
          <section aria-label="Network Telemetry Summary">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard
                label="THROUGHPUT"
                value={metrics.throughput}
                unit="VEH"
                subtitle="CLEARED"
                accent="#0f3d28"
              />
              <MetricCard
                label="MEAN VELOCITY"
                value={metrics.avg_speed}
                unit="KM/H"
                subtitle="NETWORK SPEED"
                accent="#16a34a"
              />
              <MetricCard
                label="FLOW STABILITY"
                value={metrics.efficiency}
                unit="%"
                subtitle="OPTIMAL CRUISE"
                accent="#22c55e"
              />
              <MetricCard
                label="ACTIVE FLEET"
                value={metrics.active_count}
                unit="CARS"
                subtitle="ON TRACK"
                accent="#0f3d28"
              />
              <MetricCard
                label="WAIT LATENCY"
                value={metrics.wait_time}
                unit="SEC"
                subtitle="AVG QUEUE"
                accent="#d97706"
              />
              <MetricCard
                label="SAFETY INTERV."
                value={metrics.accidents}
                unit="EVENTS"
                subtitle="NEAR-MISSES"
                accent={metrics.accidents > 0 ? '#dc2626' : '#d1ded5'}
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
              <div className="flex items-center justify-between pb-1 border-b border-[#d1ded5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#16a34a]" />
                  <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#0f3d28]">
                    {viewEngine === '3d' ? '3D ACCELERATED WEBGL ENVIRONMENT' : '2D TOPOGRAPHIC SCHEMATIC'}
                  </span>
                </div>

                <div className="flex items-center border border-[#d1ded5] bg-[#ffffff] p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewEngine('3d')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
                      viewEngine === '3d'
                        ? 'bg-[#0f3d28] text-white shadow-sm'
                        : 'text-[#5d7567] hover:text-[#0f3d28]'
                    }`}
                  >
                    3D WEBGL
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewEngine('2d')}
                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[1.5px] transition-all ${
                      viewEngine === '2d'
                        ? 'bg-[#0f3d28] text-white shadow-sm'
                        : 'text-[#5d7567] hover:text-[#0f3d28]'
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
              <div className="flex flex-wrap items-center justify-between text-[10px] font-bold uppercase tracking-[1.5px] text-[#5d7567] px-1 py-1 border-t border-[#d1ded5]">
                <div className="flex items-center gap-3">
                  <span>ECO-MOBILITY PROVING GROUND TELEMETRY</span>
                  <span className="hidden sm:inline text-[#d1ded5]">|</span>
                  <span className="hidden sm:inline">COEFFICIENT: {params.weather === 'rain' ? '0.58μ (WET)' : '1.00μ (DRY)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                  <span>TICK: 60 HZ INTEGRATION</span>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Editorial Footer */}
        <footer className="bg-[#ffffff] border-t border-[#d1ded5] mt-12">
          <MStripeDivider />
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#5d7567] text-xs font-light">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0f3d28] uppercase tracking-wider text-[11px]">NEUROCROSS</span>
              <span>· Nature-Forward Autonomous Eco-Mobility Proving Ground</span>
            </div>
            <div className="text-[11px] uppercase tracking-[1.2px] text-[#82998b]">
              SUSTAINABLE AUTONOMOUS SYSTEMS ENGINEERING
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
