import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import RoadLayer from './features/simulation/components/RoadLayer';
import ControlsPanel from './features/simulation/components/ControlsPanel';
import StatusHeader from './features/simulation/components/StatusHeader';
import LoadingScreen from './features/simulation/components/LoadingScreen';
import { useSimulation } from './features/simulation/hooks/useSimulation';

export default function App() {
  const [phase, setPhase] = useState('loading'); // quick initial splash

  const {
    data,
    params,
    setParams,
    running,
    setRunning,
    simSpeed,
    setSimSpeed,
    hasConnected,
    reset
  } = useSimulation();

  useEffect(() => {
    // Quick 600ms splash on first load for smooth mount
    const timer = setTimeout(() => {
      setPhase('ready');
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const toggleRunning = () => setRunning((prev) => !prev);

  return (
    <>
      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#000000] text-white font-sans px-4 sm:px-6 lg:px-8 py-5 selection:bg-white selection:text-black">
        <div className="max-w-[1440px] mx-auto space-y-5">
          {/* Header */}
          <StatusHeader 
            mode={params.mode} 
            running={running} 
            intersectionType={params.intersectionType} 
          />

          {/* Main Dashboard Grid */}
          <main className="grid gap-5 lg:grid-cols-[280px_1fr] items-start">
            {/* Left Controls Panel */}
            <ControlsPanel
              params={params}
              setParams={setParams}
              simSpeed={simSpeed}
              setSimSpeed={setSimSpeed}
              data={data}
              running={running}
              hasConnected={hasConnected}
              onToggleRunning={toggleRunning}
              onReset={reset}
            />

            {/* Right Simulation Viewport */}
            <section className="flex flex-col gap-3">
              <RoadLayer
                data={data}
                weather={params.weather}
                speedFactor={simSpeed}
                intersectionType={params.intersectionType}
              />

              {/* Minimal footer bar */}
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[1.2px] text-[#555555] px-1">
                <span>NEUROCROSS SIMULATION SANDBOX</span>
                <span>PHYSICS TICK: 60 HZ</span>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
